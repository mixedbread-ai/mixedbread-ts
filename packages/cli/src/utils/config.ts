import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import chalk from 'chalk';
import { z } from 'zod';

export const UploadDefaultsSchema = z.object({
  strategy: z.enum(['fast', 'high_quality'], { message: 'Must be "fast" or "high_quality"' }).optional(),
  contextualization: z
    .preprocess(
      (val) => {
        if (val === 'true' || val === true) return true;
        if (val === 'false' || val === false) return false;
        throw new Error('Must be "true" or "false"');
      },
      z.boolean({ message: 'Must be "true" or "false"' }),
    )
    .optional(),
  parallel: z.coerce
    .number({ message: 'Must be a number' })
    .int({ message: 'Must be an integer' })
    .positive({ message: 'Must be a positive number' })
    .optional(),
});

export const SearchDefaultsSchema = z.object({
  top_k: z.coerce
    .number({ message: 'Must be a number' })
    .int({ message: 'Must be an integer' })
    .positive({ message: 'Must be a positive number' })
    .optional(),
  rerank: z
    .preprocess(
      (val) => {
        if (val === 'true' || val === true) return true;
        if (val === 'false' || val === false) return false;
        throw new Error('Must be "true" or "false"');
      },
      z.boolean({ message: 'Must be "true" or "false"' }),
    )
    .optional(),
});

export const DefaultsSchema = z.object({
  upload: UploadDefaultsSchema.optional(),
  search: SearchDefaultsSchema.optional(),
});

export const CliConfigSchema = z.object({
  version: z.string(),
  api_key: z.string().startsWith('mxb_', 'API key must start with "mxb_"').optional(),
  base_url: z.string().url('Base URL must be a valid URL').optional(),
  defaults: DefaultsSchema.optional(),
  aliases: z.record(z.string(), z.string()).optional(),
});

export type CliConfig = z.infer<typeof CliConfigSchema>;

const CONFIG_DIR = process.env.MXBAI_CONFIG_PATH || join(homedir(), '.config', 'mixedbread');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: CliConfig = {
  version: '1.0',
  defaults: {
    upload: {
      strategy: 'fast',
      contextualization: false,
      parallel: 5,
    },
    search: {
      top_k: 10,
      rerank: true,
    },
  },
  aliases: {},
};

export function loadConfig(): CliConfig {
  if (!existsSync(CONFIG_FILE)) {
    return DEFAULT_CONFIG;
  }

  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8');
    const rawConfig = JSON.parse(content);

    // Validate with Zod
    const parseResult = CliConfigSchema.safeParse(rawConfig);
    if (parseResult.success) {
      return { ...DEFAULT_CONFIG, ...parseResult.data };
    } else {
      console.warn(chalk.yellow('Warning:'), 'Invalid config file format, using defaults.');
      console.warn(
        chalk.gray('Validation errors:'),
        parseResult.error.issues.map((i) => i.message).join(', '),
      );
      return DEFAULT_CONFIG;
    }
  } catch (error) {
    console.warn(chalk.yellow('Warning:'), 'Failed to load config file, using defaults');
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: CliConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getApiKey(options?: { apiKey?: string }): string {
  // Priority: 1. Command line flag, 2. Environment variable, 3. Config file
  const apiKey = options?.apiKey || process.env.MXBAI_API_KEY || loadConfig().api_key;

  if (!apiKey) {
    console.error(chalk.red('Error:'), 'No API key found.\n');
    console.error('Please provide your API key using one of these methods:');
    console.error('  1. Command flag: --api-key mxb_xxxxx');
    console.error('  2. Environment variable: export MXBAI_API_KEY=mxb_xxxxx');
    console.error('  3. Config file: mxbai config set api_key mxb_xxxxx\n');
    console.error('Get your API key at: https://www.platform.mixedbread.com/platform?next=api-keys');
    process.exit(1);
  }

  return apiKey;
}

export function getBaseURL(options?: { baseURL?: string }): string {
  return options?.baseURL || process.env.MXBAI_BASE_URL || loadConfig().base_url;
}

export function resolveVectorStoreName(nameOrAlias: string): string {
  const config = loadConfig();
  return config.aliases?.[nameOrAlias] || nameOrAlias;
}

// Helper to resolve nested schema paths
function resolveSchemaPath(schema: z.ZodSchema, path: string[]): z.ZodSchema | null {
  if (path.length === 0) return schema;

  const [head, ...tail] = path;

  // Handle ZodObject
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    if (head in shape) {
      return resolveSchemaPath(shape[head], tail);
    }
  }

  // Handle ZodRecord (for dynamic keys like aliases)
  if (schema instanceof z.ZodRecord) {
    return resolveSchemaPath(schema._def.valueType, tail);
  }

  // Handle ZodOptional
  if (schema instanceof z.ZodOptional) {
    return resolveSchemaPath(schema._def.innerType, path);
  }

  return null;
}

export function parseConfigValue(key: string, value: string) {
  const pathSegments = key.split('.');

  // Try to resolve the schema for this key path
  const targetSchema = resolveSchemaPath(CliConfigSchema, pathSegments);

  if (!targetSchema) {
    console.error(
      chalk.red('Error:'),
      `Unknown config key: ${key}. Use 'mxbai config --help' to see available options.`,
    );
    process.exit(1);
    return; // This won't be reached in normal execution, but helps with testing
  }

  const parsed = targetSchema.safeParse(value);

  if (!parsed.success) {
    console.error(
      chalk.red('Error:'),
      `Invalid value for ${key}:`,
      parsed.error.issues.map((i) => i.message).join(', '),
    );
    process.exit(1);
    return; // This won't be reached in normal execution, but helps with testing
  }

  return parsed.data;
}
