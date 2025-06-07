import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import chalk from 'chalk';

export interface CliConfig {
  version: string;
  api_key?: string;
  defaults?: {
    upload?: {
      strategy?: 'fast' | 'high_quality';
      contextualization?: boolean;
      parallel?: number;
    };
    search?: {
      top_k?: number;
      rerank?: boolean;
    };
  };
  aliases?: Record<string, string>;
}

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
    const config = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...config };
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

export function resolveVectorStoreName(nameOrAlias: string): string {
  const config = loadConfig();
  return config.aliases?.[nameOrAlias] || nameOrAlias;
}