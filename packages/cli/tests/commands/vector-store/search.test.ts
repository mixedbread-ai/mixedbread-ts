import { Command } from 'commander';
import { createSearchCommand } from '../../../src/commands/vector-store/search';
import * as clientUtils from '../../../src/utils/client';
import * as vectorStoreUtils from '../../../src/utils/vector-store';
import * as outputUtils from '../../../src/utils/output';
import * as configUtils from '../../../src/utils/config';

// Mock dependencies
jest.mock('../../../src/utils/client');
jest.mock('../../../src/utils/vector-store');
jest.mock('../../../src/utils/output', () => ({
  ...jest.requireActual('../../../src/utils/output'),
  formatOutput: jest.fn(),
}));
jest.mock('../../../src/utils/config');

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

describe('Vector Store Search Command', () => {
  let command: Command;
  let mockClient: any;

  beforeEach(() => {
    command = createSearchCommand();

    // Setup mock client
    mockClient = {
      vectorStores: {
        files: {
          search: jest.fn(),
        },
        search: jest.fn(),
      },
    };

    (clientUtils.createClient as jest.Mock).mockReturnValue(mockClient);
    (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440080',
      name: 'test-store',
    });
    (configUtils.loadConfig as jest.Mock).mockReturnValue({
      defaults: {
        search: {
          top_k: 5,
          rerank: false,
        },
      },
    });
    (outputUtils.formatOutput as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic file search', () => {
    const mockSearchResults = {
      data: [
        {
          filename: 'document1.pdf',
          score: 0.95,
          vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          metadata: { author: 'John Doe' },
        },
        {
          filename: 'document2.txt',
          score: 0.87,
          vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          metadata: { category: 'manual' },
        },
      ],
    };

    it('should search files in vector store with default options', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockSearchResults);

      await command.parseAsync(['node', 'search', 'test-store', 'machine learning']);

      expect(vectorStoreUtils.resolveVectorStore).toHaveBeenCalledWith(mockClient, 'test-store');
      expect(mockClient.vectorStores.files.search).toHaveBeenCalledWith({
        query: 'machine learning',
        vector_store_ids: ['550e8400-e29b-41d4-a716-446655440080'],
        top_k: 5,
        search_options: {
          return_metadata: undefined,
          score_threshold: undefined,
          rerank: false,
        },
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.any(String), // checkmark symbol
        expect.stringContaining('Found 2 results'), // Found 2 results message
      );

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            filename: 'document1.pdf',
            score: '0.95',
            vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          }),
          expect.objectContaining({
            filename: 'document2.txt',
            score: '0.87',
            vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          }),
        ]),
        undefined,
      );
    });

    it('should search with custom top-k', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockSearchResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--top-k', '20']);

      expect(mockClient.vectorStores.files.search).toHaveBeenCalledWith(
        expect.objectContaining({
          top_k: 20,
        }),
      );
    });

    it('should search with threshold', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockSearchResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--threshold', '0.8']);

      expect(mockClient.vectorStores.files.search).toHaveBeenCalledWith(
        expect.objectContaining({
          search_options: expect.objectContaining({
            score_threshold: 0.8,
          }),
        }),
      );
    });

    it('should search with return metadata enabled', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockSearchResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--return-metadata']);

      expect(mockClient.vectorStores.files.search).toHaveBeenCalledWith(
        expect.objectContaining({
          search_options: expect.objectContaining({
            return_metadata: true,
          }),
        }),
      );

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData[0]).toHaveProperty('metadata');
    });

    it('should search with reranking enabled', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockSearchResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--rerank']);

      expect(mockClient.vectorStores.files.search).toHaveBeenCalledWith(
        expect.objectContaining({
          search_options: expect.objectContaining({
            rerank: true,
          }),
        }),
      );
    });

    it('should handle empty search results', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'search', 'test-store', 'nonexistent query']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No results found.'));
      expect(outputUtils.formatOutput).not.toHaveBeenCalled();
    });
  });

  describe('Chunk search', () => {
    const mockChunkResults = {
      data: [
        {
          filename: 'document1.pdf',
          score: 0.95,
          vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          chunk_index: 0,
          metadata: { page: 1 },
        },
        {
          filename: 'document1.pdf',
          score: 0.88,
          vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          chunk_index: 3,
          metadata: { page: 2 },
        },
      ],
    };

    it('should search chunks when show-chunks flag is enabled', async () => {
      mockClient.vectorStores.search.mockResolvedValue(mockChunkResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--show-chunks']);

      expect(mockClient.vectorStores.search).toHaveBeenCalledWith({
        query: 'query',
        vector_store_ids: ['550e8400-e29b-41d4-a716-446655440080'],
        top_k: 5,
        search_options: {
          return_metadata: undefined,
          score_threshold: undefined,
          rerank: false,
        },
      });

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData[0]).toHaveProperty('chunk_index', 0);
      expect(formattedData[1]).toHaveProperty('chunk_index', 3);
    });

    it('should search chunks with all options', async () => {
      mockClient.vectorStores.search.mockResolvedValue(mockChunkResults);

      await command.parseAsync([
        'node',
        'search',
        'test-store',
        'query',
        '--show-chunks',
        '--top-k',
        '15',
        '--threshold',
        '0.7',
        '--return-metadata',
        '--rerank',
      ]);

      expect(mockClient.vectorStores.search).toHaveBeenCalledWith({
        query: 'query',
        vector_store_ids: ['550e8400-e29b-41d4-a716-446655440080'],
        top_k: 15,
        search_options: {
          return_metadata: true,
          score_threshold: 0.7,
          rerank: true,
        },
      });
    });
  });

  describe('Output formatting', () => {
    const mockResults = {
      data: [
        {
          filename: 'test.pdf',
          score: 0.9,
          vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          metadata: { key: 'value' },
        },
      ],
    };

    it('should format as table by default', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), undefined);
    });

    it('should format as JSON when specified', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--format', 'json']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), 'json');
    });

    it('should format as CSV when specified', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--format', 'csv']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), 'csv');
    });

    it('should format metadata correctly for table output', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--return-metadata']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(typeof formattedData[0].metadata).toBe('object');
      expect(formattedData[0].metadata).toEqual({ key: 'value' });
    });

    it('should format metadata as object for non-table output', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockResults);

      await command.parseAsync([
        'node',
        'search',
        'test-store',
        'query',
        '--return-metadata',
        '--format',
        'json',
      ]);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(typeof formattedData[0].metadata).toBe('object');
      expect(formattedData[0].metadata).toEqual({ key: 'value' });
    });
  });

  describe('Validation', () => {
    it('should validate required name-or-id argument', async () => {
      await command.parseAsync(['node', 'search', '', 'query']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"name-or-id" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate required query argument', async () => {
      await command.parseAsync(['node', 'search', 'test-store', '']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"query" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate top-k is positive', async () => {
      await command.parseAsync(['node', 'search', 'test-store', 'query', '--top-k', '-5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"top-k" must be positive'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate top-k is an integer', async () => {
      await command.parseAsync(['node', 'search', 'test-store', 'query', '--top-k', '5.5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"top-k" must be an integer'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate top-k maximum value', async () => {
      await command.parseAsync(['node', 'search', 'test-store', 'query', '--top-k', '150']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"top-k" must be less than or equal to 100'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate threshold minimum value', async () => {
      await command.parseAsync(['node', 'search', 'test-store', 'query', '--threshold', '-0.1']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"threshold" must be greater than or equal to 0'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate threshold maximum value', async () => {
      await command.parseAsync(['node', 'search', 'test-store', 'query', '--threshold', '1.5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"threshold" must be less than or equal to 1'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Error handling', () => {
    it('should handle search API errors', async () => {
      const error = new Error('API Error: Rate limit exceeded');
      mockClient.vectorStores.files.search.mockRejectedValue(error);

      await command.parseAsync(['node', 'search', 'test-store', 'query']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'API Error: Rate limit exceeded');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle vector store resolution errors', async () => {
      const error = new Error('Vector store not found');
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockRejectedValue(error);

      await command.parseAsync(['node', 'search', 'nonexistent-store', 'query']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Vector store not found');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error rejections', async () => {
      mockClient.vectorStores.files.search.mockRejectedValue('Unknown error');

      await command.parseAsync(['node', 'search', 'test-store', 'query']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Failed to search vector store');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Global options', () => {
    const mockResults = {
      data: [
        {
          filename: 'test.pdf',
          score: 0.9,
          vector_store_id: '550e8400-e29b-41d4-a716-446655440080',
          metadata: {},
        },
      ],
    };

    it('should support API key option', async () => {
      mockClient.vectorStores.files.search.mockResolvedValue(mockResults);

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--api-key', 'mxb_test123']);

      expect(clientUtils.createClient).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'mxb_test123',
        }),
      );
    });
  });

  describe('Config defaults', () => {
    it('should use config defaults when options not provided', async () => {
      (configUtils.loadConfig as jest.Mock).mockReturnValue({
        defaults: {
          search: {
            top_k: 15,
            rerank: true,
          },
        },
      });

      mockClient.vectorStores.files.search.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'search', 'test-store', 'query']);

      expect(mockClient.vectorStores.files.search).toHaveBeenCalledWith(
        expect.objectContaining({
          top_k: 15,
          search_options: expect.objectContaining({
            rerank: true,
          }),
        }),
      );
    });

    it('should override config defaults with command options', async () => {
      (configUtils.loadConfig as jest.Mock).mockReturnValue({
        defaults: {
          search: {
            top_k: 15,
            rerank: true,
          },
        },
      });

      mockClient.vectorStores.files.search.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'search', 'test-store', 'query', '--top-k', '25']);

      expect(mockClient.vectorStores.files.search).toHaveBeenCalledWith(
        expect.objectContaining({
          top_k: 25,
          search_options: expect.objectContaining({
            rerank: true,
          }),
        }),
      );
    });
  });
});
