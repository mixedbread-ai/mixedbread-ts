import { Command } from 'commander';
import mockFs from 'mock-fs';
import { homedir } from 'os';
import { join } from 'path';
import { createGetCommand } from '../../../src/commands/config/get';

describe('Config Get Command', () => {
  const configDir = join(homedir(), '.config', 'mixedbread');
  const configFile = join(configDir, 'config.json');
  let command: Command;

  beforeEach(() => {
    command = createGetCommand();
  });

  afterEach(() => {
    mockFs.restore();
    jest.clearAllMocks();
  });

  describe('Getting all config', () => {
    it('should display all config when no key provided', () => {
      const testConfig = {
        version: '1.0',
        api_key: 'mxb_test123',
        defaults: {
          upload: {
            strategy: 'fast',
            parallel: 5,
          },
        },
        aliases: {
          docs: 'vs_abc123',
        },
      };

      mockFs({
        [configFile]: JSON.stringify(testConfig),
      });

      command.parse(['node', 'get']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Current configuration:'));

      // Check that the JSON output contains all expected properties (order-independent)
      const secondCall = (console.log as jest.Mock).mock.calls[1][0];
      const parsedOutput = JSON.parse(secondCall);
      expect(parsedOutput).toEqual(testConfig);
    });

    it('should display default config when no config file exists', () => {
      mockFs({});

      command.parse(['node', 'get']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Current configuration:'));
      const output = (console.log as jest.Mock).mock.calls[1][0];
      const config = JSON.parse(output);
      expect(config.version).toBe('1.0');
      expect(config.defaults.upload.strategy).toBe('fast');
    });
  });

  describe('Getting specific values', () => {
    beforeEach(() => {
      mockFs({
        [configFile]: JSON.stringify({
          version: '1.0',
          api_key: 'mxb_test123',
          defaults: {
            upload: {
              strategy: 'high_quality',
              contextualization: true,
              parallel: 10,
            },
            search: {
              top_k: 20,
              rerank: false,
            },
          },
          aliases: {
            docs: 'vs_abc123',
            images: 'vs_xyz789',
          },
        }),
      });
    });

    it('should get top-level values', () => {
      command.parse(['node', 'get', 'api_key']);

      expect(console.log).toHaveBeenCalledWith('api_key:', '"mxb_test123"');
    });

    it('should get nested values', () => {
      command.parse(['node', 'get', 'defaults.upload.strategy']);

      expect(console.log).toHaveBeenCalledWith('defaults.upload.strategy:', '"high_quality"');
    });

    it('should get boolean values', () => {
      command.parse(['node', 'get', 'defaults.upload.contextualization']);

      expect(console.log).toHaveBeenCalledWith('defaults.upload.contextualization:', 'true');
    });

    it('should get number values', () => {
      command.parse(['node', 'get', 'defaults.upload.parallel']);

      expect(console.log).toHaveBeenCalledWith('defaults.upload.parallel:', '10');
    });

    it('should get object values as JSON', () => {
      command.parse(['node', 'get', 'defaults.upload']);

      expect(console.log).toHaveBeenCalledWith(
        'defaults.upload:',
        JSON.stringify(
          {
            strategy: 'high_quality',
            contextualization: true,
            parallel: 10,
          },
          null,
          2,
        ),
      );
    });

    it('should get aliases', () => {
      command.parse(['node', 'get', 'aliases.docs']);

      expect(console.log).toHaveBeenCalledWith('aliases.docs:', '"vs_abc123"');
    });

    it('should get all aliases', () => {
      command.parse(['node', 'get', 'aliases']);

      expect(console.log).toHaveBeenCalledWith(
        'aliases:',
        JSON.stringify(
          {
            docs: 'vs_abc123',
            images: 'vs_xyz789',
          },
          null,
          2,
        ),
      );
    });
  });

  describe('Error handling', () => {
    it('should error on non-existent keys', () => {
      mockFs({
        [configFile]: JSON.stringify({ version: '1.0' }),
      });

      command.parse(['node', 'get', 'nonexistent']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Configuration key nonexistent not found'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should error on nested non-existent keys', () => {
      mockFs({
        [configFile]: JSON.stringify({
          version: '1.0',
          defaults: {},
        }),
      });

      command.parse(['node', 'get', 'defaults.upload.strategy']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Configuration key defaults.upload.strategy not found'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle corrupt config files', () => {
      mockFs({
        [configFile]: 'invalid json',
      });

      command.parse(['node', 'get']);

      // Should fallback to default config
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Current configuration:'));
      const output = (console.log as jest.Mock).mock.calls[1][0];
      const config = JSON.parse(output);
      expect(config.version).toBe('1.0');
    });

    it('should handle file system errors', () => {
      // Mock fs to throw an error
      mockFs({
        [configFile]: mockFs.file({
          content: JSON.stringify({ version: '1.0' }),
          mode: 0o000, // No permissions
        }),
      });

      command.parse(['node', 'get']);

      // Should fallback to default config
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Current configuration:'));
    });
  });
});
