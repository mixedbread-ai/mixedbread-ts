import { Command } from 'commander';
import mockFs from 'mock-fs';
import { createUploadCommand } from '../../../src/commands/vector-store/upload';
import * as clientUtils from '../../../src/utils/client';
import * as vectorStoreUtils from '../../../src/utils/vector-store';
import * as configUtils from '../../../src/utils/config';
import { glob } from 'glob';

// Mock dependencies
jest.mock('../../../src/utils/client');
jest.mock('../../../src/utils/vector-store');
jest.mock('../../../src/utils/config');
jest.mock('glob');
// ora is mocked globally in jest.config.ts

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

describe('Vector Store Upload Command', () => {
  let command: Command;
  let mockClient: any;

  beforeEach(() => {
    command = createUploadCommand();

    // Setup mock client
    mockClient = {
      vectorStores: {
        files: {
          upload: jest.fn(),
          list: jest.fn(),
          delete: jest.fn(),
        },
      },
    };

    (clientUtils.createClient as jest.Mock).mockReturnValue(mockClient);
    (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440030',
      name: 'test-store',
    });
    (configUtils.loadConfig as jest.Mock).mockReturnValue({
      version: '1.0',
      defaults: {
        upload: {
          strategy: 'fast',
          contextualization: false,
          parallel: 5,
        },
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
    jest.clearAllMocks();
  });

  describe('File discovery', () => {
    it('should find files matching patterns', async () => {
      mockFs({
        'docs/file1.md': 'content1',
        'docs/file2.md': 'content2',
        'docs/subdir/file3.md': 'content3',
        'other.txt': 'other',
      });

      (glob as unknown as jest.Mock).mockImplementation(async (pattern) => {
        if (pattern === 'docs/**/*.md') {
          return ['docs/file1.md', 'docs/file2.md', 'docs/subdir/file3.md'];
        }
        return [];
      });

      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });

      await command.parseAsync(['node', 'upload', 'test-store', 'docs/**/*.md']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Found 3 files matching the pattern'));
    });

    it('should handle multiple patterns', async () => {
      mockFs({
        'docs/file1.md': 'content1',
        'images/pic1.png': Buffer.from('image'),
        'data/info.json': '{}',
      });

      (glob as unknown as jest.Mock).mockImplementation(async (pattern) => {
        const patterns: Record<string, string[]> = {
          '*.md': ['docs/file1.md'],
          '*.png': ['images/pic1.png'],
          '*.json': ['data/info.json'],
        };
        return patterns[pattern] || [];
      });

      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });

      await command.parseAsync(['node', 'upload', 'test-store', '*.md', '*.png', '*.json']);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Found 3 files matching the patterns'),
      );
    });

    it('should handle no files found', async () => {
      mockFs({});
      (glob as unknown as jest.Mock).mockResolvedValue([]);

      await command.parseAsync(['node', 'upload', 'test-store', '*.nonexistent']);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('No files found matching the patterns'),
      );
    });

    it('should error when no patterns provided', async () => {
      await command.parseAsync(['node', 'upload', 'test-store']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        'No file patterns provided. Use --manifest for manifest-based uploads.',
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Upload options', () => {
    beforeEach(() => {
      mockFs({
        'test.md': 'test content',
      });
      (glob as unknown as jest.Mock).mockResolvedValue(['test.md']);
      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });
    });

    it('should use custom strategy', async () => {
      await command.parseAsync(['node', 'upload', 'test-store', 'test.md', '--strategy', 'high_quality']);

      expect(mockClient.vectorStores.files.upload).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440030',
        expect.any(File),
        expect.objectContaining({
          experimental: expect.objectContaining({
            parsing_strategy: 'high_quality',
          }),
        }),
      );
    });

    it('should enable contextualization', async () => {
      await command.parseAsync(['node', 'upload', 'test-store', 'test.md', '--contextualization']);

      expect(mockClient.vectorStores.files.upload).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440030',
        expect.any(File),
        expect.objectContaining({
          experimental: expect.objectContaining({
            contextualization: true,
          }),
        }),
      );
    });

    it('should add custom metadata', async () => {
      await command.parseAsync([
        'node',
        'upload',
        'test-store',
        'test.md',
        '--metadata',
        '{"author":"john","version":"1.0"}',
      ]);

      expect(mockClient.vectorStores.files.upload).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440030',
        expect.any(File),
        expect.objectContaining({
          metadata: expect.objectContaining({
            author: 'john',
            version: '1.0',
          }),
        }),
      );
    });

    it('should validate metadata JSON', async () => {
      await command.parseAsync(['node', 'upload', 'test-store', 'test.md', '--metadata', 'invalid-json']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Invalid JSON in metadata option');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should validate parallel option', async () => {
      await command.parseAsync(['node', 'upload', 'test-store', 'test.md', '--parallel', '25']);

      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"parallel" must be less than or equal to 20'),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('Dry run', () => {
    it('should preview files without uploading', async () => {
      mockFs({
        'file1.md': 'content 1',
        'file2.md': 'content 2',
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['file1.md', 'file2.md']);

      await command.parseAsync(['node', 'upload', 'test-store', '*.md', '--dry-run']);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Dry run - files that would be uploaded:'),
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('file1.md'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('file2.md'));
      expect(mockClient.vectorStores.files.upload).not.toHaveBeenCalled();
    });
  });

  describe('Unique flag', () => {
    it('should check for existing files when --unique', async () => {
      mockFs({
        'test.md': 'test content',
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['test.md']);

      mockClient.vectorStores.files.list.mockResolvedValue({
        data: [
          {
            id: 'existing_file_id',
            metadata: { file_path: 'test.md' },
          },
        ],
      });

      mockClient.vectorStores.files.delete.mockResolvedValue({});
      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });

      await command.parseAsync(['node', 'upload', 'test-store', 'test.md', '--unique']);

      expect(mockClient.vectorStores.files.list).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440030',
        { limit: 1000 },
      );
      expect(mockClient.vectorStores.files.delete).toHaveBeenCalledWith('existing_file_id', {
        vector_store_identifier: '550e8400-e29b-41d4-a716-446655440030',
      });
    });

    it('should handle list errors with --unique', async () => {
      mockFs({
        'test.md': 'test content',
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['test.md']);
      mockClient.vectorStores.files.list.mockRejectedValue(new Error('List failed'));

      await command.parseAsync(['node', 'upload', 'test-store', 'test.md', '--unique']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'List failed');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('File upload', () => {
    it('should set correct MIME types', async () => {
      mockFs({
        'image.webp': Buffer.from('webp image'),
        'doc.pdf': Buffer.from('pdf content'),
        'script.js': 'console.log("test");',
      });

      (glob as unknown as jest.Mock)
        .mockResolvedValueOnce(['image.webp'])
        .mockResolvedValueOnce(['doc.pdf'])
        .mockResolvedValueOnce(['script.js']);

      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });

      // Test webp
      await command.parseAsync(['node', 'upload', 'test-store', 'image.webp']);
      let uploadCall = mockClient.vectorStores.files.upload.mock.calls[0];
      expect(uploadCall[1].type).toBe('image/webp');

      // Test pdf
      jest.clearAllMocks();
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440030',
        name: 'test-store',
      });
      await command.parseAsync(['node', 'upload', 'test-store', 'doc.pdf']);
      uploadCall = mockClient.vectorStores.files.upload.mock.calls[0];
      expect(uploadCall[1].type).toBe('application/pdf');

      // Test js
      jest.clearAllMocks();
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440030',
        name: 'test-store',
      });
      await command.parseAsync(['node', 'upload', 'test-store', 'script.js']);
      uploadCall = mockClient.vectorStores.files.upload.mock.calls[0];
      expect(uploadCall[1].type).toBe('text/javascript');
    });

    it('should include file metadata', async () => {
      mockFs({
        'test.md': 'test content',
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['test.md']);
      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });

      await command.parseAsync(['node', 'upload', 'test-store', 'test.md']);

      expect(mockClient.vectorStores.files.upload).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440030',
        expect.any(File),
        expect.objectContaining({
          metadata: expect.objectContaining({
            file_path: 'test.md',
            uploaded_at: expect.any(String),
          }),
        }),
      );
    });
  });

  describe('Error handling', () => {
    it('should handle upload failures', async () => {
      mockFs({
        'test.md': 'test content',
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['test.md']);
      mockClient.vectorStores.files.upload.mockRejectedValue(new Error('Upload failed'));

      await command.parseAsync(['node', 'upload', 'test-store', 'test.md']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Upload Summary:'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✗ 1 file failed'));
    });

    it('should handle vector store resolution errors', async () => {
      (vectorStoreUtils.resolveVectorStore as jest.Mock).mockRejectedValue(
        new Error('Vector store not found'),
      );

      await command.parseAsync(['node', 'upload', 'invalid-store', '*.md']);

      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Vector store not found');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle file read errors gracefully', async () => {
      mockFs({
        'readable.md': 'content',
        'unreadable.md': mockFs.file({
          content: 'content',
          mode: 0o000, // No read permissions
        }),
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['readable.md', 'unreadable.md']);
      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });

      await command.parseAsync(['node', 'upload', 'test-store', '*.md']);

      // Should show summary with failures
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Upload Summary:'));
    });
  });

  describe('Upload summary', () => {
    it('should show correct summary for successful uploads', async () => {
      mockFs({
        'file1.md': 'content1',
        'file2.md': 'content2',
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['file1.md', 'file2.md']);
      mockClient.vectorStores.files.upload.mockResolvedValue({ id: 'file_123' });

      await command.parseAsync(['node', 'upload', 'test-store', '*.md']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✓ 2 files uploaded successfully'));
    });

    it.skip('should show correct summary for mixed results', async () => {
      mockFs({
        'file1.md': 'content1',
        'file2.md': 'content2',
        'file3.md': 'content3',
      });

      (glob as unknown as jest.Mock).mockResolvedValue(['file1.md', 'file2.md', 'file3.md']);

      // Make the second upload fail
      mockClient.vectorStores.files.upload
        .mockResolvedValueOnce({ id: 'file_1' })
        .mockRejectedValueOnce(new Error('Upload failed'))
        .mockResolvedValueOnce({ id: 'file_3' });

      await command.parseAsync(['node', 'upload', 'test-store', '*.md']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✓ 2 files uploaded successfully'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✗ 1 file failed'));
    });
  });
});
