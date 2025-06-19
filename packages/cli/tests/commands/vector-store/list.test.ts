import { Command } from 'commander';
import { createListCommand } from '../../../src/commands/vector-store/list';
import * as clientUtils from '../../../src/utils/client';
import * as outputUtils from '../../../src/utils/output';

// Mock dependencies
jest.mock('../../../src/utils/client');
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

describe('Vector Store List Command', () => {
  let command: Command;
  let mockClient: any;

  beforeEach(() => {
    command = createListCommand();

    // Setup mock client
    mockClient = {
      vectorStores: {
        list: jest.fn(),
      },
    };

    (clientUtils.createClient as jest.Mock).mockReturnValue(mockClient);
    (outputUtils.formatOutput as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic listing', () => {
    it('should list vector stores with default options', async () => {
      const mockData = [
        {
          id: '550e8400-e29b-41d4-a716-446655440021',
          name: 'store1',
          created_at: '2024-01-01T00:00:00Z',
          file_counts: { total: 10 },
          usage_bytes: 1048576,
          expires_at: null,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440022',
          name: 'store2',
          created_at: '2024-01-02T00:00:00Z',
          file_counts: { total: 5 },
          usage_bytes: 524288,
          expires_at: null,
        },
      ];

      mockClient.vectorStores.list.mockResolvedValue({ data: mockData });

      await command.parseAsync(['node', 'list']);

      expect(mockClient.vectorStores.list).toHaveBeenCalledWith({
        limit: 10,
      });

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            id: expect.any(String),
            status: expect.any(String),
            files: expect.any(Number),
            usage: expect.any(String),
            created: expect.any(String),
          }),
        ]),
        undefined,
      );
    });

    it('should format byte sizes correctly', async () => {
      const mockData = [
        {
          id: '550e8400-e29b-41d4-a716-446655440021',
          name: 'small',
          created_at: '2024-01-01T00:00:00Z',
          file_counts: { total: 1 },
          usage_bytes: 1024, // 1 KB
          expires_at: null,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440022',
          name: 'medium',
          created_at: '2024-01-01T00:00:00Z',
          file_counts: { total: 1 },
          usage_bytes: 1048576, // 1 MB
          expires_at: null,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440023',
          name: 'large',
          created_at: '2024-01-01T00:00:00Z',
          file_counts: { total: 1 },
          usage_bytes: 1073741824, // 1 GB
          expires_at: null,
        },
      ];

      mockClient.vectorStores.list.mockResolvedValue({ data: mockData });

      await command.parseAsync(['node', 'list']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];

      expect(formattedData[0].usage).toBe('1 KB');
      expect(formattedData[1].usage).toBe('1 MB');
      expect(formattedData[2].usage).toBe('1 GB');
    });

    it('should handle empty results', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'list']);

      expect(console.log).toHaveBeenCalledWith('No vector stores found.');
      expect(outputUtils.formatOutput).not.toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should handle custom limit', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'list', '--limit', '50']);

      expect(mockClient.vectorStores.list).toHaveBeenCalledWith({
        limit: 50,
      });
    });

    it('should validate limit is positive', async () => {
      await command.parseAsync(['node', 'list', '--limit', '-5']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"limit" must be positive'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Output formatting', () => {
    const mockData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        name: 'store1',
        created_at: '2024-01-01T00:00:00Z',
        file_counts: { total: 10 },
        usage_bytes: 1048576,
        expires_at: null,
      },
    ];

    it('should format as table by default', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: mockData });

      await command.parseAsync(['node', 'list']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), undefined);
    });

    it('should format as JSON when specified', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: mockData });

      await command.parseAsync(['node', 'list', '--format', 'json']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), 'json');
    });

    it('should format as CSV when specified', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: mockData });

      await command.parseAsync(['node', 'list', '--format', 'csv']);

      expect(outputUtils.formatOutput).toHaveBeenCalledWith(expect.any(Array), 'csv');
    });
  });

  describe('Error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error: Rate limit exceeded');
      mockClient.vectorStores.list.mockRejectedValue(error);

      await command.parseAsync(['node', 'list']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'API Error: Rate limit exceeded');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle network errors', async () => {
      const error = new Error('ECONNREFUSED');
      mockClient.vectorStores.list.mockRejectedValue(error);

      await command.parseAsync(['node', 'list']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'ECONNREFUSED');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error rejections', async () => {
      mockClient.vectorStores.list.mockRejectedValue('Unknown error');

      await command.parseAsync(['node', 'list']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Failed to list vector stores');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('API key handling', () => {
    it('should use API key from command line', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'list', '--api-key', 'mxb_test123']);

      expect(clientUtils.createClient).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'mxb_test123',
        }),
      );
    });

    it('should work without explicit API key (uses env/config)', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await command.parseAsync(['node', 'list']);

      expect(clientUtils.createClient).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle vector stores with missing fields', async () => {
      const mockData = [
        {
          id: '550e8400-e29b-41d4-a716-446655440021',
          name: 'store1',
          created_at: '2024-01-01T00:00:00Z',
          expires_at: null,
          // Missing file_counts and usage_bytes
        },
      ];

      mockClient.vectorStores.list.mockResolvedValue({ data: mockData });

      await command.parseAsync(['node', 'list']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];

      expect(formattedData[0]).toMatchObject({
        id: '550e8400-e29b-41d4-a716-446655440021',
        name: 'store1',
        status: 'active',
        files: undefined,
        usage: '0 B',
        created: '1/1/2024',
      });
    });

    it('should handle very large file counts', async () => {
      const mockData = [
        {
          id: '550e8400-e29b-41d4-a716-446655440021',
          name: 'huge-store',
          created_at: '2024-01-01T00:00:00Z',
          file_counts: { total: 1000000 },
          usage_bytes: 1099511627776, // 1 TB
          expires_at: null,
        },
      ];

      mockClient.vectorStores.list.mockResolvedValue({ data: mockData });

      await command.parseAsync(['node', 'list']);

      const formattedData = (outputUtils.formatOutput as jest.Mock).mock.calls[0][0];

      expect(formattedData[0].files).toBe(1000000);
      expect(formattedData[0].usage).toMatch(/TB$/);
    });
  });
});
