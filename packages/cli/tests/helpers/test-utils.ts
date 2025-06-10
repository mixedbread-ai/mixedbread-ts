import { Command } from 'commander';

/**
 * Helper to parse command arguments and capture errors
 */
export async function parseCommand(
  command: Command,
  args: string[],
): Promise<{
  error?: Error;
  exitCode?: number;
}> {
  const originalExit = process.exit;
  let error: Error | undefined;
  let exitCode: number | undefined;

  process.exit = ((code: number) => {
    exitCode = code;
    throw new Error(`Process exited with code ${code}`);
  }) as any;

  try {
    await command.parseAsync(['node', 'test', ...args]);
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('Process exited')) {
      // Expected exit, not an error
    } else {
      error = e as Error;
    }
  } finally {
    process.exit = originalExit;
  }

  return { error, exitCode };
}

/**
 * Mock console methods and capture output
 */
export function mockConsole() {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const logs: string[] = [];
  const errors: string[] = [];
  const warns: string[] = [];

  console.log = jest.fn((...args) => {
    logs.push(args.map(String).join(' '));
  });

  console.error = jest.fn((...args) => {
    errors.push(args.map(String).join(' '));
  });

  console.warn = jest.fn((...args) => {
    warns.push(args.map(String).join(' '));
  });

  return {
    logs,
    errors,
    warns,
    restore() {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    },
  };
}

/**
 * Create a mock SDK client with common methods
 */
export function createMockClient() {
  return {
    vectorStores: {
      create: jest.fn(),
      retrieve: jest.fn(),
      update: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
      questionAnswering: jest.fn(),
      files: {
        create: jest.fn(),
        retrieve: jest.fn(),
        list: jest.fn(),
        delete: jest.fn(),
        upload: jest.fn(),
        uploadAndPoll: jest.fn(),
      },
    },
    files: {
      create: jest.fn(),
      retrieve: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
    },
    embeddings: {
      create: jest.fn(),
    },
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };
}

/**
 * Create a mock file system structure
 */
export function createMockFiles(files: Record<string, string | Buffer>) {
  const mockFiles: Record<string, any> = {};

  for (const [path, content] of Object.entries(files)) {
    const dirs = path.split('/').slice(0, -1);
    let current = mockFiles;

    for (const dir of dirs) {
      if (!current[dir]) {
        current[dir] = {};
      }
      current = current[dir];
    }

    const filename = path.split('/').pop()!;
    current[filename] = content;
  }

  return mockFiles;
}

/**
 * Assert that process.exit was called with specific code
 */
export function expectExit(code: number) {
  expect(process.exit).toHaveBeenCalledWith(code);
}

/**
 * Assert console output contains specific text
 */
export function expectOutput(
  mockConsoleOutput: ReturnType<typeof mockConsole>,
  type: 'log' | 'error' | 'warn',
  text: string,
) {
  const output = mockConsoleOutput[`${type}s`];
  const found = output.some((line) => line.includes(text));

  if (!found) {
    throw new Error(`Expected ${type} output to contain "${text}" but got:\n${output.join('\n')}`);
  }
}

/**
 * Create a test configuration
 */
export function createTestConfig(overrides: any = {}) {
  return {
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
    ...overrides,
  };
}
