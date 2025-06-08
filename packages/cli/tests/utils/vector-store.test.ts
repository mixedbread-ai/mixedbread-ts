import { resolveVectorStore } from '../../src/utils/vector-store';
import * as configUtils from '../../src/utils/config';

// Mock config utils
jest.mock('../../src/utils/config');

// Mock console methods
const originalConsoleError = console.error;
const originalProcessExit = process.exit;

beforeAll(() => {
  console.error = jest.fn();
  process.exit = jest.fn() as any;
});

afterAll(() => {
  console.error = originalConsoleError;
  process.exit = originalProcessExit;
});

describe('Vector Store Utils', () => {
  describe('resolveVectorStore', () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        vectorStores: {
          list: jest.fn(),
          retrieve: jest.fn(),
        },
      };

      (configUtils.resolveVectorStoreName as jest.Mock).mockImplementation(
        (name) => name
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should resolve vector store ID directly', async () => {
      const mockVectorStore = {
        id: 'vs_abc123',
        name: 'test-store',
      };

      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      const result = await resolveVectorStore(mockClient, 'vs_abc123');

      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('vs_abc123');
      expect(mockClient.vectorStores.list).not.toHaveBeenCalled();
    });

    it('should resolve vector store by name', async () => {
      const mockVectorStore = {
        id: 'vs_found123',
        name: 'my-store',
      };

      mockClient.vectorStores.list.mockResolvedValue({
        data: [
          { id: 'vs_other', name: 'other-store' },
          mockVectorStore,
          { id: 'vs_another', name: 'another-store' },
        ],
      });

      const result = await resolveVectorStore(mockClient, 'my-store');

      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.list).toHaveBeenCalled();
      expect(mockClient.vectorStores.retrieve).not.toHaveBeenCalled();
    });

    it('should resolve using alias', async () => {
      const mockVectorStore = {
        id: 'vs_aliased123',
        name: 'aliased-store',
      };

      (configUtils.resolveVectorStoreName as jest.Mock).mockReturnValue('vs_aliased123');
      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      const result = await resolveVectorStore(mockClient, 'myalias');

      expect(configUtils.resolveVectorStoreName).toHaveBeenCalledWith('myalias');
      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('vs_aliased123');
    });

    it('should handle vector store not found by ID', async () => {
      mockClient.vectorStores.retrieve.mockRejectedValue(
        new Error('Vector store not found')
      );
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await resolveVectorStore(mockClient, 'vs_nonexistent');

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Vector store "vs_nonexistent" not found')
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle vector store not found by name', async () => {
      mockClient.vectorStores.list.mockResolvedValue({
        data: [
          { id: 'vs_other', name: 'other-store' },
          { id: 'vs_another', name: 'another-store' },
        ],
      });

      await resolveVectorStore(mockClient, 'nonexistent-store');

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Vector store "nonexistent-store" not found')
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle empty vector store list', async () => {
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await resolveVectorStore(mockClient, 'any-store');

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Vector store "any-store" not found')
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle API errors when listing', async () => {
      mockClient.vectorStores.list.mockRejectedValue(
        new Error('API Error: Unauthorized')
      );

      await expect(resolveVectorStore(mockClient, 'some-store')).rejects.toThrow('API Error: Unauthorized');
    });

    it('should handle case-sensitive name matching', async () => {
      mockClient.vectorStores.list.mockResolvedValue({
        data: [
          { id: 'vs_1', name: 'MyStore' },
          { id: 'vs_2', name: 'mystore' },
        ],
      });

      const result = await resolveVectorStore(mockClient, 'mystore');

      expect(result).toEqual({ id: 'vs_2', name: 'mystore' });
    });

    it('should handle special characters in names', async () => {
      const mockVectorStore = {
        id: 'vs_special',
        name: 'my-store_v2.0',
      };

      mockClient.vectorStores.list.mockResolvedValue({
        data: [mockVectorStore],
      });

      const result = await resolveVectorStore(mockClient, 'my-store_v2.0');

      expect(result).toEqual(mockVectorStore);
    });

    it('should check if input looks like ID before searching by name', async () => {
      // Input that starts with vs_ should try retrieve first, then fall through to name search
      mockClient.vectorStores.retrieve.mockRejectedValue(new Error('Not found'));
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await resolveVectorStore(mockClient, 'vs_test');

      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('vs_test');
      expect(mockClient.vectorStores.list).toHaveBeenCalled();
    });

    it('should search by name for non-ID inputs', async () => {
      mockClient.vectorStores.list.mockResolvedValue({
        data: [{ id: 'vs_123', name: 'test' }],
      });

      await resolveVectorStore(mockClient, 'test');

      expect(mockClient.vectorStores.retrieve).not.toHaveBeenCalled();
      expect(mockClient.vectorStores.list).toHaveBeenCalled();
    });
  });
});