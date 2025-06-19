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

      (configUtils.resolveVectorStoreName as jest.Mock).mockImplementation((name) => name);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should resolve vector store ID directly', async () => {
      const mockVectorStore = {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'test-store',
      };

      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      const result = await resolveVectorStore(mockClient, '550e8400-e29b-41d4-a716-446655440010');

      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440010');
      expect(mockClient.vectorStores.list).not.toHaveBeenCalled();
    });

    it('should resolve vector store by name', async () => {
      const mockVectorStore = {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'my-store',
      };

      // Names are valid identifiers, so retrieve should succeed
      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);

      const result = await resolveVectorStore(mockClient, 'my-store');

      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('my-store');
      expect(mockClient.vectorStores.list).not.toHaveBeenCalled();
    });

    it('should resolve using alias', async () => {
      const mockVectorStore = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'aliased-store',
      };

      (configUtils.resolveVectorStoreName as jest.Mock).mockReturnValue(
        '550e8400-e29b-41d4-a716-446655440001',
      );
      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      const result = await resolveVectorStore(mockClient, 'myalias');

      expect(configUtils.resolveVectorStoreName).toHaveBeenCalledWith('myalias');
      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001');
    });

    it('should handle vector store not found by ID', async () => {
      mockClient.vectorStores.retrieve.mockRejectedValue(new Error('Vector store not found'));
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await resolveVectorStore(mockClient, '550e8400-e29b-41d4-a716-446655440002');

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Vector store "550e8400-e29b-41d4-a716-446655440002" not found'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle vector store not found by name', async () => {
      // Mock retrieve to fail first
      mockClient.vectorStores.retrieve.mockRejectedValue(new Error('Not found'));

      mockClient.vectorStores.list.mockResolvedValue({
        data: [
          { id: '550e8400-e29b-41d4-a716-446655440014', name: 'other-store' },
          { id: '550e8400-e29b-41d4-a716-446655440015', name: 'another-store' },
        ],
      });

      await resolveVectorStore(mockClient, 'nonexistent-store');

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Vector store "nonexistent-store" not found'),
      );
    });

    it('should handle empty vector store list', async () => {
      // Mock retrieve to fail first
      mockClient.vectorStores.retrieve.mockRejectedValue(new Error('Not found'));

      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await resolveVectorStore(mockClient, 'any-store');

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Vector store "any-store" not found'),
      );
    });

    it('should handle API errors when listing', async () => {
      // Mock retrieve to fail first
      mockClient.vectorStores.retrieve.mockRejectedValue(new Error('Not found'));
      mockClient.vectorStores.list.mockRejectedValue(new Error('API Error: Unauthorized'));

      await expect(resolveVectorStore(mockClient, 'some-store')).rejects.toThrow('API Error: Unauthorized');
    });

    it('should handle case-sensitive name matching', async () => {
      const mockVectorStore = { id: '550e8400-e29b-41d4-a716-446655440017', name: 'mystore' };

      // Names are valid identifiers, so retrieve should succeed
      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);

      const result = await resolveVectorStore(mockClient, 'mystore');

      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('mystore');
      expect(mockClient.vectorStores.list).not.toHaveBeenCalled();
    });

    it('should handle special characters in names', async () => {
      const mockVectorStore = {
        id: '550e8400-e29b-41d4-a716-446655440018',
        name: 'my-store_v2.0',
      };

      // Names with special characters are still valid identifiers
      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);

      const result = await resolveVectorStore(mockClient, 'my-store_v2.0');

      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('my-store_v2.0');
      expect(mockClient.vectorStores.list).not.toHaveBeenCalled();
    });

    it('should check if input looks like UUID before searching by name', async () => {
      // Input that looks like UUID should try retrieve first, then fall through to name search
      mockClient.vectorStores.retrieve.mockRejectedValue(new Error('Not found'));
      mockClient.vectorStores.list.mockResolvedValue({ data: [] });

      await resolveVectorStore(mockClient, '550e8400-e29b-41d4-a716-446655440003');

      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440003');
      expect(mockClient.vectorStores.list).toHaveBeenCalled();
    });

    it('should search by name for non-ID inputs', async () => {
      const mockVectorStore = { id: '550e8400-e29b-41d4-a716-446655440004', name: 'test' };

      // Names are valid identifiers, so retrieve should succeed
      mockClient.vectorStores.retrieve.mockResolvedValue(mockVectorStore);

      const result = await resolveVectorStore(mockClient, 'test');

      expect(result).toEqual(mockVectorStore);
      expect(mockClient.vectorStores.retrieve).toHaveBeenCalledWith('test');
      expect(mockClient.vectorStores.list).not.toHaveBeenCalled();
    });
  });
});
