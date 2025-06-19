import { Command } from 'commander';
import { createFilesCommand } from '../../../src/commands/vector-store/files';
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

describe('Vector Store Files Command', () => {
  let command: Command;
  let mockClient: any;

  beforeEach(() => {
    command = createFilesCommand();

    // Setup mock client
    mockClient = {
      vectorStores: {
        files: {
          list: jest.fn(),
          retrieve: jest.fn(),
          delete: jest.fn(),
        },
      },
    };

    (clientUtils.createClient as jest.Mock).mockReturnValue(mockClient);
    (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440070',
      name: 'test-store',
    });
    (outputUtils.formatOutput as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('List files subcommand', () => {
    const mockFiles = [
      {
        id: 'file_1',
        filename: 'document1.pdf',
        status: 'completed',
        usage_bytes: 1048576,
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'file_2',
        filename: 'document2.txt',
        status: 'in_progress',
        usage_bytes: 2048,
        created_at: '2024-01-02T00:00:00Z',
      },
    ];

    it('should list all files by default', async () => {
      mockClient.vectorStores.files.list.mockResolvedValue({ data: mockFiles });

      await command.parseAsync(['node', 'files', 'list', 'test-store']);

      expect(vectorStoreUtils.resolveVectorStore).toHaveBeenCalledWith(mockClient, 'test-store');
      expect(mockClient.vectorStores.files.list).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440070',
        { limit: 10 },
      );
      expect(outputUtils.formatOutput).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'file_1',
            name: 'document1.pdf',
            status: 'completed',
            size: '1 MB',
            created: '1/1/2024',
          }),
          expect.objectContaining({
            id: 'file_2',
            name: 'document2.txt',
            status: 'in_progress',
            size: '2 KB',
            created: '1/2/2024',
          }),
        ]),
        undefined,
      );
    });

    it('should filter files by status', async () => {
      mockClient.vectorStores.files.list.mockResolvedValue({ data: mockFiles });

      await command.parseAsync(['node', 'files', 'list', 'test-store', '--status', 'completed']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData).toHaveLength(1);
      expect(formattedData[0]).toMatchObject({
        id: 'file_1',
        status: 'completed',
      });
    });

    it('should handle custom limit', async () => {
      mockClient.vectorStores.files.list.mockResolvedValue({ data: mockFiles });

      await command.parseAsync(['node', 'files', 'list', 'test-store', '--limit', '50']);

      expect(mockClient.vectorStores.files.list).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440070',
        { limit: 50 },
      );
    });

    it('should handle empty results', async () => {
      mockClient.vectorStores.files.list.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'files', 'list', 'test-store']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No files found.'));
      expect(outputUtils.formatOutput).not.toHaveBeenCalled();
    });

    it('should support output formatting', async () => {
      mockClient.vectorStores.files.list.mockResolvedValue({ data: mockFiles });

      await command.parseAsync(['node', 'files', 'list', 'test-store', '--format', 'json']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), 'json');
    });

    it('should validate limit is positive', async () => {
      await command.parseAsync(['node', 'files', 'list', 'test-store', '--limit', '-5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"limit" must be positive'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate status enum', async () => {
      await command.parseAsync(['node', 'files', 'list', 'test-store', '--status', 'invalid']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"status" must be one of: all, completed, in_progress, failed'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Get file subcommand', () => {
    const mockFile = {
      id: 'file_123',
      filename: 'important-doc.pdf',
      status: 'completed',
      usage_bytes: 2097152,
      created_at: '2024-01-01T12:00:00Z',
      metadata: { author: 'John Doe', version: '1.0' },
    };

    it('should get file details', async () => {
      mockClient.vectorStores.files.retrieve.mockResolvedValue(mockFile);

      await command.parseAsync(['node', 'files', 'get', 'test-store', 'file_123']);

      expect(vectorStoreUtils.resolveVectorStore).toHaveBeenCalledWith(mockClient, 'test-store');
      expect(mockClient.vectorStores.files.retrieve).toHaveBeenCalledWith('file_123', {
        vector_store_identifier: '550e8400-e29b-41d4-a716-446655440070',
      });
      expect(outputUtils.formatOutput).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'file_123',
          name: 'important-doc.pdf',
          status: 'completed',
          size: '2 MB',
          'created at': expect.any(String),
          metadata: { author: 'John Doe', version: '1.0' },
        }),
        undefined,
      );
    });

    it('should handle file without metadata', async () => {
      const fileWithoutMetadata = { ...mockFile, metadata: {} };
      mockClient.vectorStores.files.retrieve.mockResolvedValue(fileWithoutMetadata);

      await command.parseAsync(['node', 'files', 'get', 'test-store', 'file_123']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData.metadata).toEqual({});
    });

    it('should support output formatting', async () => {
      mockClient.vectorStores.files.retrieve.mockResolvedValue(mockFile);

      await command.parseAsync(['node', 'files', 'get', 'test-store', 'file_123', '--format', 'json']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Object), 'json');
    });

    it('should handle API errors', async () => {
      const error = new Error('File not found');
      mockClient.vectorStores.files.retrieve.mockRejectedValue(error);

      await command.parseAsync(['node', 'files', 'get', 'test-store', 'file_123']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'File not found');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Delete file subcommand', () => {
    it('should delete file with force flag', async () => {
      mockClient.vectorStores.files.delete.mockResolvedValue({});

      await command.parseAsync(['node', 'files', 'delete', 'test-store', 'file_123', '--force']);

      expect(vectorStoreUtils.resolveVectorStore).toHaveBeenCalledWith(mockClient, 'test-store');
      expect(mockClient.vectorStores.files.delete).toHaveBeenCalledWith('file_123', {
        vector_store_identifier: '550e8400-e29b-41d4-a716-446655440070',
      });
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('File file_123 deleted successfully'),
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error: Unauthorized');
      mockClient.vectorStores.files.delete.mockRejectedValue(error);

      await command.parseAsync(['node', 'files', 'delete', 'test-store', 'file_123', '--force']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'API Error: Unauthorized');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error rejections', async () => {
      mockClient.vectorStores.files.delete.mockRejectedValue('Unknown error');

      await command.parseAsync(['node', 'files', 'delete', 'test-store', 'file_123', '--force']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Failed to delete file');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Command validation', () => {
    it('should validate required name-or-id argument for list', async () => {
      await command.parseAsync(['node', 'files', 'list', '']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"name-or-id" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate required file-id argument for get', async () => {
      await command.parseAsync(['node', 'files', 'get', 'test-store', '']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"file-id" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate required file-id argument for delete', async () => {
      await command.parseAsync(['node', 'files', 'delete', 'test-store', '', '--force']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"file-id" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Global options', () => {
    const mockFiles = [
      {
        id: 'file_1',
        filename: 'test.pdf',
        status: 'completed',
        usage_bytes: 1024,
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    it('should support API key option', async () => {
      mockClient.vectorStores.files.list.mockResolvedValue({ data: mockFiles });

      await command.parseAsync(['node', 'files', 'list', 'test-store', '--api-key', 'mxb_test123']);

      expect(clientUtils.createClient).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'mxb_test123',
        }),
      );
    });
  });

  describe('Error handling', () => {
    it('should handle vector store resolution errors', async () => {
      const error = new Error('Vector store not found');
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockRejectedValue(error);

      await command.parseAsync(['node', 'files', 'list', 'nonexistent-store']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Vector store not found');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
