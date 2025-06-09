import Table from 'cli-table3';
import { formatOutput, formatBytes } from '../../src/utils/output';

// Mock cli-table3
jest.mock('cli-table3');

// Mock console methods
const originalConsoleLog = console.log;

beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Output Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(100)).toBe('100 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1572864)).toBe('1.5 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
      expect(formatBytes(1610612736)).toBe('1.5 GB');
    });

    it('should handle negative numbers', () => {
      expect(formatBytes(-1024)).toBe('-1 KB');
      expect(formatBytes(-1048576)).toBe('-1 MB');
    });

    it('should round to two decimal places', () => {
      expect(formatBytes(1126)).toBe('1.1 KB');
      expect(formatBytes(1229)).toBe('1.2 KB');
      expect(formatBytes(1996)).toBe('1.95 KB');
    });
  });

  describe('formatOutput', () => {
    describe('table format', () => {
      it('should format object as table', () => {
        const mockTableInstance = {
          push: jest.fn(),
          toString: jest.fn().mockReturnValue('table output'),
        };
        (Table as unknown as jest.Mock).mockReturnValue(mockTableInstance);

        const data = {
          id: 'vs_123',
          name: 'test-store',
          description: 'A test store',
        };

        formatOutput(data, 'table');

        expect(Table).toHaveBeenCalledWith({
          style: { head: [], border: [] },
        });

        expect(mockTableInstance.push).toHaveBeenCalledWith({ id: 'vs_123' });
        expect(mockTableInstance.push).toHaveBeenCalledWith({ name: 'test-store' });
        expect(mockTableInstance.push).toHaveBeenCalledWith({ description: 'A test store' });
        expect(console.log).toHaveBeenCalledWith('table output');
      });

      it('should handle null and undefined values', () => {
        const mockTableInstance = {
          push: jest.fn(),
          toString: jest.fn().mockReturnValue('table output'),
        };
        (Table as unknown as jest.Mock).mockReturnValue(mockTableInstance);

        const data = {
          id: 'vs_123',
          description: null,
          metadata: undefined,
        };

        formatOutput(data, 'table');

        expect(mockTableInstance.push).toHaveBeenCalledWith({ id: 'vs_123' });
        expect(mockTableInstance.push).toHaveBeenCalledWith({ description: '' });
        expect(mockTableInstance.push).toHaveBeenCalledWith({ metadata: '' });
      });

      it('should stringify complex values', () => {
        const mockTableInstance = {
          push: jest.fn(),
          toString: jest.fn().mockReturnValue('table output'),
        };
        (Table as unknown as jest.Mock).mockReturnValue(mockTableInstance);

        const data = {
          id: 'vs_123',
          metadata: { key: 'value', nested: { deep: true } },
          tags: ['tag1', 'tag2'],
        };

        formatOutput(data, 'table');

        expect(mockTableInstance.push).toHaveBeenCalledWith({ id: 'vs_123' });
        expect(mockTableInstance.push).toHaveBeenCalledWith({
          metadata: JSON.stringify({ key: 'value', nested: { deep: true } }),
        });
        expect(mockTableInstance.push).toHaveBeenCalledWith({
          tags: JSON.stringify(['tag1', 'tag2']),
        });
      });

      it('should format array of objects as table', () => {
        const mockTableInstance = {
          push: jest.fn(),
          toString: jest.fn().mockReturnValue('table output'),
        };
        (Table as unknown as jest.Mock).mockReturnValue(mockTableInstance);

        const data = [
          { id: 'vs_1', name: 'store1', size: 100 },
          { id: 'vs_2', name: 'store2', size: 200 },
        ];

        formatOutput(data, 'table');

        expect(Table).toHaveBeenCalledWith({
          head: expect.any(Array),
          style: { head: [], border: [] },
        });

        expect(mockTableInstance.push).toHaveBeenCalledWith(['vs_1', 'store1', '100']);
        expect(mockTableInstance.push).toHaveBeenCalledWith(['vs_2', 'store2', '200']);
      });

      it('should handle empty array', () => {
        formatOutput([], 'table');

        expect(console.log).toHaveBeenCalledWith('No results found.');
      });

      it('should handle array with inconsistent objects', () => {
        const mockTableInstance = {
          push: jest.fn(),
          toString: jest.fn().mockReturnValue('table output'),
        };
        (Table as unknown as jest.Mock).mockReturnValue(mockTableInstance);

        const data = [
          { id: 'vs_1', name: 'store1' },
          { id: 'vs_2', description: 'desc2' },
          { name: 'store3', size: 300 },
        ];

        formatOutput(data, 'table');

        expect(Table).toHaveBeenCalledWith({
          head: expect.any(Array),
          style: { head: [], border: [] },
        });

        // The implementation uses headers from the first object
        expect(mockTableInstance.push).toHaveBeenCalledWith(['vs_1', 'store1']);
        expect(mockTableInstance.push).toHaveBeenCalledWith(['vs_2', '']);
        expect(mockTableInstance.push).toHaveBeenCalledWith(['', 'store3']);
      });
    });

    describe('json format', () => {
      it('should format as JSON', () => {
        const data = {
          id: 'vs_123',
          name: 'test-store',
          metadata: { key: 'value' },
        };

        formatOutput(data, 'json');

        expect(console.log).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
      });

      it('should handle arrays', () => {
        const data = [
          { id: 'vs_1', name: 'store1' },
          { id: 'vs_2', name: 'store2' },
        ];

        formatOutput(data, 'json');

        expect(console.log).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
      });
    });

    describe('csv format', () => {
      it('should format object as CSV', () => {
        const data = {
          id: 'vs_123',
          name: 'test-store',
          size: 1024,
        };

        formatOutput(data, 'csv');

        expect(console.log).toHaveBeenCalledWith('key,value');
        expect(console.log).toHaveBeenCalledWith('id,vs_123');
        expect(console.log).toHaveBeenCalledWith('name,test-store');
        expect(console.log).toHaveBeenCalledWith('size,1024');
      });

      it('should escape CSV values with commas', () => {
        const data = {
          id: 'vs_123',
          name: 'test, store',
          description: 'A "quoted" value',
        };

        formatOutput(data, 'csv');

        expect(console.log).toHaveBeenCalledWith('key,value');
        expect(console.log).toHaveBeenCalledWith('id,vs_123');
        expect(console.log).toHaveBeenCalledWith('name,"test, store"');
        expect(console.log).toHaveBeenCalledWith('description,"A ""quoted"" value"');
      });

      it('should format array as CSV', () => {
        const data = [
          { id: 'vs_1', name: 'store1', size: 100 },
          { id: 'vs_2', name: 'store2', size: 200 },
        ];

        formatOutput(data, 'csv');

        expect(console.log).toHaveBeenCalledWith('id,name,size');
        expect(console.log).toHaveBeenCalledWith('vs_1,store1,100');
        expect(console.log).toHaveBeenCalledWith('vs_2,store2,200');
      });

      it('should handle null and undefined in CSV', () => {
        const data = {
          id: 'vs_123',
          name: null,
          description: undefined,
        };

        formatOutput(data, 'csv');

        expect(console.log).toHaveBeenCalledWith('key,value');
        expect(console.log).toHaveBeenCalledWith('id,vs_123');
        expect(console.log).toHaveBeenCalledWith('name,');
        expect(console.log).toHaveBeenCalledWith('description,');
      });

      it('should stringify complex values in CSV', () => {
        const data = {
          id: 'vs_123',
          metadata: { key: 'value' },
        };

        formatOutput(data, 'csv');

        expect(console.log).toHaveBeenCalledWith('key,value');
        expect(console.log).toHaveBeenCalledWith('id,vs_123');
        expect(console.log).toHaveBeenCalledWith('metadata,"{""key"":""value""}"');
      });
    });

    describe('default format', () => {
      it('should default to table format', () => {
        const mockTableInstance = {
          push: jest.fn(),
          toString: jest.fn().mockReturnValue('table output'),
        };
        (Table as unknown as jest.Mock).mockReturnValue(mockTableInstance);

        const data = { id: 'vs_123' };

        formatOutput(data);

        expect(Table).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('table output');
      });
    });
  });
});
