import { Command } from 'commander';
import { createDeleteCommand } from '../../../src/commands/vector-store/delete';
import * as clientUtils from '../../../src/utils/client';
import * as vectorStoreUtils from '../../../src/utils/vector-store';

// Mock dependencies
jest.mock('../../../src/utils/client');
jest.mock('../../../src/utils/vector-store');

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalProcessExit = process.exit;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  process.exit = jest.fn() as any;
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  process.exit = originalProcessExit;
});

describe('Vector Store Delete Command', () => {
  let command: Command;
  let mockClient: any;

  beforeEach(() => {
    command = createDeleteCommand();

    // Setup mock client
    mockClient = {
      vectorStores: {
        delete: jest.fn(),
      },
    };

    (clientUtils.createClient as jest.Mock).mockReturnValue(mockClient);
    (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440040',
      name: 'test-store',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic deletion', () => {
    it('should delete vector store with force flag', async () => {
      mockClient.vectorStores.delete.mockResolvedValue({});

      await command.parseAsync(['node', 'delete', 'test-store', '--force']);

      expect(vectorStoreUtils.resolveVectorStore).toHaveBeenCalledWith(mockClient, 'test-store');
      expect(mockClient.vectorStores.delete).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440040');
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Vector store "test-store" deleted successfully'),
      );
    });

    it('should skip confirmation when force flag is used', async () => {
      mockClient.vectorStores.delete.mockResolvedValue({});

      await command.parseAsync(['node', 'delete', 'test-store', '--force']);

      expect(mockClient.vectorStores.delete).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440040');
    });
  });

  describe('Error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error: Unauthorized');
      mockClient.vectorStores.delete.mockRejectedValue(error);

      await command.parseAsync(['node', 'delete', 'test-store', '--force']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'API Error: Unauthorized');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle vector store resolution errors', async () => {
      const error = new Error('Vector store not found');
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockRejectedValue(error);

      await command.parseAsync(['node', 'delete', 'nonexistent-store', '--force']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Vector store not found');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error rejections', async () => {
      mockClient.vectorStores.delete.mockRejectedValue('Unknown error');

      await command.parseAsync(['node', 'delete', 'test-store', '--force']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Failed to delete vector store');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Global options', () => {
    it('should support API key option', async () => {
      mockClient.vectorStores.delete.mockResolvedValue({});

      await command.parseAsync(['node', 'delete', 'test-store', '--force', '--api-key', 'mxb_test123']);

      expect(clientUtils.createClient).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'mxb_test123',
        }),
      );
    });
  });

  describe('Command validation', () => {
    it('should validate required name-or-id argument', async () => {
      await command.parseAsync(['node', 'delete', '', '--force']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"name-or-id" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
