import { Command } from 'commander';
import { createGetCommand } from '../../../src/commands/vector-store/get';
import * as clientUtils from '../../../src/utils/client';
import * as vectorStoreUtils from '../../../src/utils/vector-store';
import * as outputUtils from '../../../src/utils/output';

// Mock dependencies
jest.mock('../../../src/utils/client');
jest.mock('../../../src/utils/vector-store');
jest.mock('../../../src/utils/output', () => ({
  ...jest.requireActual('../../../src/utils/output'),
  formatOutput: jest.fn(),
}));

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

describe('Vector Store Get Command', () => {
  let command: Command;
  let mockClient: any;

  beforeEach(() => {
    command = createGetCommand();

    // Setup mock client
    mockClient = {
      vectorStores: {
        retrieve: jest.fn(),
      },
    };

    (clientUtils.createClient as jest.Mock).mockReturnValue(mockClient);
    (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440050',
      name: 'test-store',
    });
    (outputUtils.formatOutput as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic retrieval', () => {
    it('should get vector store details', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440050',
        name: 'test-store',
        description: 'A test vector store',
        created_at: '2024-01-01T00:00:00Z',
        file_counts: { total: 5 },
        usage_bytes: 1048576,
        expires_at: null,
        metadata: { key: 'value' },
      });

      await command.parseAsync(['node', 'get', 'test-store']);

      expect(vectorStoreUtils.resolveVectorStore).toHaveBeenCalledWith(mockClient, 'test-store');
      expect(outputUtils.formatOutput).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '550e8400-e29b-41d4-a716-446655440050',
          name: 'test-store',
          description: 'A test vector store',
          status: 'active',
          'total files': 5,
          'completed files': 0,
          'processing files': 0,
          'failed files': 0,
          usage: '1 MB',
          'created at': expect.any(String),
          metadata: { key: 'value' },
        }),
        undefined,
      );
    });

    it('should handle expired vector stores', async () => {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1); // Yesterday

      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440050',
        name: 'test-store',
        description: 'An expired vector store',
        created_at: '2024-01-01T00:00:00Z',
        file_counts: { total: 5 },
        usage_bytes: 1048576,
        expires_at: expiredDate.toISOString(),
        metadata: {},
      });

      await command.parseAsync(['node', 'get', 'test-store']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData.status).toBe('expired');
    });

    it('should handle missing optional fields', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440050',
        name: 'test-store',
        created_at: '2024-01-01T00:00:00Z',
        // Missing description, file_counts, usage_bytes, expires_at, metadata
      });

      await command.parseAsync(['node', 'get', 'test-store']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData).toMatchObject({
        id: '550e8400-e29b-41d4-a716-446655440050',
        name: 'test-store',
        description: 'N/A',
        status: 'active',
        'total files': 0,
        'completed files': 0,
        'processing files': 0,
        'failed files': 0,
        usage: '0 B',
        'created at': expect.any(String),
      });
    });
  });

  describe('Output formatting', () => {
    const mockVectorStore = {
      id: '550e8400-e29b-41d4-a716-446655440050',
      name: 'test-store',
      description: 'A test vector store',
      created_at: '2024-01-01T00:00:00Z',
      file_counts: { total: 5 },
      usage_bytes: 1048576,
      expires_at: null,
      metadata: { key: 'value' },
    };

    it('should format as table by default', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue(mockVectorStore);

      await command.parseAsync(['node', 'get', 'test-store']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Object), undefined);
    });

    it('should format as JSON when specified', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue(mockVectorStore);

      await command.parseAsync(['node', 'get', 'test-store', '--format', 'json']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Object), 'json');
    });

    it('should format as CSV when specified', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue(mockVectorStore);

      await command.parseAsync(['node', 'get', 'test-store', '--format', 'csv']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Object), 'csv');
    });
  });

  describe('Error handling', () => {
    it('should handle vector store resolution errors', async () => {
      const error = new Error('Vector store not found');
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockRejectedValue(error);

      await command.parseAsync(['node', 'get', 'nonexistent-store']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Vector store not found');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error rejections', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockRejectedValue('Unknown error');

      await command.parseAsync(['node', 'get', 'test-store']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Failed to get vector store details');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Global options', () => {
    const mockVectorStore = {
      id: '550e8400-e29b-41d4-a716-446655440050',
      name: 'test-store',
      description: 'A test vector store',
      created_at: '2024-01-01T00:00:00Z',
      file_counts: { total: 5 },
      usage_bytes: 1048576,
      expires_at: null,
      metadata: {},
    };

    it('should support API key option', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue(mockVectorStore);

      await command.parseAsync(['node', 'get', 'test-store', '--api-key', 'mxb_test123']);

      expect(clientUtils.createClient).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'mxb_test123',
        }),
      );
    });
  });

  describe('Command validation', () => {
    it('should validate required name-or-id argument', async () => {
      await command.parseAsync(['node', 'get', '']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"name-or-id" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
