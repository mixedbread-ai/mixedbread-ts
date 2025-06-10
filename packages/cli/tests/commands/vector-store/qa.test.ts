import { Command } from 'commander';
import { createQACommand } from '../../../src/commands/vector-store/qa';
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

describe('Vector Store QA Command', () => {
  let command: Command;
  let mockClient: any;

  beforeEach(() => {
    command = createQACommand();

    // Setup mock client
    mockClient = {
      vectorStores: {
        questionAnswering: jest.fn(),
      },
    };

    (clientUtils.createClient as jest.Mock).mockReturnValue(mockClient);
    (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440090',
      name: 'test-store',
    });
    (configUtils.loadConfig as jest.Mock).mockReturnValue({
      defaults: {
        search: {
          top_k: 5,
        },
      },
    });
    (outputUtils.formatOutput as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic question answering', () => {
    const mockQAResponse = {
      answer:
        'Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data.',
      sources: [
        {
          filename: 'ml-guide.pdf',
          score: 0.95,
          chunk_index: 2,
          metadata: { chapter: 'Introduction' },
        },
        {
          filename: 'ai-overview.txt',
          score: 0.87,
          chunk_index: 0,
          metadata: { section: 'Definitions' },
        },
      ],
    };

    it('should ask question with default options', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockQAResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'What is machine learning?']);

      expect(vectorStoreUtils.resolveVectorStore).toHaveBeenCalledWith(mockClient, 'test-store');
      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith({
        query: 'What is machine learning?',
        vector_store_ids: ['550e8400-e29b-41d4-a716-446655440090'],
        top_k: 5,
        search_options: {
          score_threshold: undefined,
          return_metadata: undefined,
        },
      });

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Answer:'));
      expect(console.log).toHaveBeenCalledWith(mockQAResponse.answer);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Sources:'));

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            filename: 'ml-guide.pdf',
            score: '0.95',
            chunk_index: 2,
          }),
          expect.objectContaining({
            filename: 'ai-overview.txt',
            score: '0.87',
            chunk_index: 0,
          }),
        ]),
        undefined,
      );
    });

    it('should ask question with custom top-k', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockQAResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'What is AI?', '--top-k', '15']);

      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith(
        expect.objectContaining({
          top_k: 15,
        }),
      );
    });

    it('should ask question with threshold', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockQAResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'What is AI?', '--threshold', '0.8']);

      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith(
        expect.objectContaining({
          search_options: expect.objectContaining({
            score_threshold: 0.8,
          }),
        }),
      );
    });

    it('should ask question with return metadata enabled', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockQAResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'What is AI?', '--return-metadata']);

      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith(
        expect.objectContaining({
          search_options: expect.objectContaining({
            return_metadata: true,
          }),
        }),
      );

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData[0]).toHaveProperty('metadata');
    });

    it('should handle response without sources', async () => {
      const responseWithoutSources = {
        answer: 'I could not find specific information to answer your question.',
        sources: [],
      };

      mockClient.vectorStores.questionAnswering.mockResolvedValue(responseWithoutSources);

      await command.parseAsync(['node', 'qa', 'test-store', 'What is quantum computing?']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Answer:'));
      expect(console.log).toHaveBeenCalledWith(responseWithoutSources.answer);
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Sources:'));
      expect(outputUtils.formatOutput).not.toHaveBeenCalled();
    });

    it('should handle response with undefined sources', async () => {
      const responseWithUndefinedSources = {
        answer: 'The answer to your question.',
      };

      mockClient.vectorStores.questionAnswering.mockResolvedValue(responseWithUndefinedSources);

      await command.parseAsync(['node', 'qa', 'test-store', 'What is the answer?']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Answer:'));
      expect(console.log).toHaveBeenCalledWith(responseWithUndefinedSources.answer);
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Sources:'));
      expect(outputUtils.formatOutput).not.toHaveBeenCalled();
    });
  });

  describe('Output formatting', () => {
    const mockResponse = {
      answer: 'Test answer',
      sources: [
        {
          filename: 'test.pdf',
          score: 0.9,
          chunk_index: 1,
          metadata: { key: 'value' },
        },
      ],
    };

    it('should format sources as table by default', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), undefined);
    });

    it('should format sources as JSON when specified', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--format', 'json']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), 'json');
    });

    it('should format sources as CSV when specified', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--format', 'csv']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), 'csv');
    });

    it('should format metadata correctly for table output', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--return-metadata']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(typeof formattedData[0].metadata).toBe('object');
      expect(formattedData[0].metadata).toEqual({ key: 'value' });
    });

    it('should format metadata as object for non-table output', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync([
        'node',
        'qa',
        'test-store',
        'question',
        '--return-metadata',
        '--format',
        'json',
      ]);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(typeof formattedData[0].metadata).toBe('object');
      expect(formattedData[0].metadata).toEqual({ key: 'value' });
    });

    it('should not include metadata in output when not requested', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];
      expect(formattedData[0]).not.toHaveProperty('metadata');
    });
  });

  describe('Validation', () => {
    it('should validate required name-or-id argument', async () => {
      await command.parseAsync(['node', 'qa', '', 'question']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"name-or-id" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate required question argument', async () => {
      await command.parseAsync(['node', 'qa', 'test-store', '']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"question" is required'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate top-k is positive', async () => {
      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--top-k', '-5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"top-k" must be positive'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate top-k is an integer', async () => {
      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--top-k', '5.5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"top-k" must be an integer'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate top-k maximum value', async () => {
      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--top-k', '150']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"top-k" must be less than or equal to 100'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate threshold minimum value', async () => {
      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--threshold', '-0.1']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"threshold" must be greater than or equal to 0'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate threshold maximum value', async () => {
      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--threshold', '1.5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"threshold" must be less than or equal to 1'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Error handling', () => {
    it('should handle QA API errors', async () => {
      const error = new Error('API Error: Service unavailable');
      mockClient.vectorStores.questionAnswering.mockRejectedValue(error);

      await command.parseAsync(['node', 'qa', 'test-store', 'question']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'API Error: Service unavailable');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle vector store resolution errors', async () => {
      const error = new Error('Vector store not found');
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockRejectedValue(error);

      await command.parseAsync(['node', 'qa', 'nonexistent-store', 'question']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Vector store not found');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error rejections', async () => {
      mockClient.vectorStores.questionAnswering.mockRejectedValue('Unknown error');

      await command.parseAsync(['node', 'qa', 'test-store', 'question']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Failed to process question');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Global options', () => {
    const mockResponse = {
      answer: 'Test answer',
      sources: [
        {
          filename: 'test.pdf',
          score: 0.9,
          chunk_index: 1,
          metadata: {},
        },
      ],
    };

    it('should support API key option', async () => {
      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--api-key', 'mxb_test123']);

      expect(clientUtils.createClient).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'mxb_test123',
        }),
      );
    });
  });

  describe('Config defaults', () => {
    const mockResponse = {
      answer: 'Test answer',
      sources: [],
    };

    it('should use config defaults when options not provided', async () => {
      (configUtils.loadConfig as jest.Mock).mockReturnValue({
        defaults: {
          search: {
            top_k: 12,
          },
        },
      });

      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question']);

      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith(
        expect.objectContaining({
          top_k: 12,
        }),
      );
    });

    it('should override config defaults with command options', async () => {
      (configUtils.loadConfig as jest.Mock).mockReturnValue({
        defaults: {
          search: {
            top_k: 12,
          },
        },
      });

      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question', '--top-k', '25']);

      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith(
        expect.objectContaining({
          top_k: 25,
        }),
      );
    });

    it('should use fallback defaults when config is empty', async () => {
      (configUtils.loadConfig as jest.Mock).mockReturnValue({});

      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync(['node', 'qa', 'test-store', 'question']);

      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith(
        expect.objectContaining({
          top_k: 10, // Fallback default
        }),
      );
    });
  });

  describe('Complex scenarios', () => {
    it('should handle all options together', async () => {
      const mockResponse = {
        answer: 'Complex answer with all options',
        sources: [
          {
            filename: 'complex.pdf',
            score: 0.95,
            chunk_index: 5,
            metadata: { complexity: 'high', topic: 'advanced' },
          },
        ],
      };

      mockClient.vectorStores.questionAnswering.mockResolvedValue(mockResponse);

      await command.parseAsync([
        'node',
        'qa',
        'test-store',
        'Complex question?',
        '--top-k',
        '20',
        '--threshold',
        '0.75',
        '--return-metadata',
        '--format',
        'json',
      ]);

      expect(mockClient.vectorStores.questionAnswering).toHaveBeenCalledWith({
        query: 'Complex question?',
        vector_store_ids: ['550e8400-e29b-41d4-a716-446655440090'],
        top_k: 20,
        search_options: {
          score_threshold: 0.75,
          return_metadata: true,
        },
      });

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            filename: 'complex.pdf',
            score: '0.95',
            chunk_index: 5,
            metadata: mockResponse.sources[0].metadata,
          }),
        ]),
        'json',
      );
    });
  });
});
