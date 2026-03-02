import { handleFileCreate, MultipartUploadError, type PartUploadEvent } from '../../src/lib/upload-file';

// Helper to create a File of a given size
function createFile(sizeBytes: number, name = 'test.bin'): File {
  const data = new Uint8Array(sizeBytes);
  return new File([data], name, { type: 'application/octet-stream' });
}

// Helper to build a mock client with spies
function createMockClient(overrides?: {
  postResult?: any;
  uploadsCreateResult?: any;
  uploadsCompleteResult?: any;
  uploadsAbortResult?: any;
  fetchResponses?: Array<{ ok: boolean; status: number; headers: Map<string, string> }>;
}) {
  const fetchResponses = overrides?.fetchResponses ?? [];
  let fetchCallIndex = 0;

  // Mock the global fetch for presigned URL uploads
  const originalFetch = globalThis.fetch;
  const mockFetch = jest.fn(async () => {
    const resp = fetchResponses[fetchCallIndex++];
    if (!resp) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ ETag: `"etag-${fetchCallIndex}"` }),
      } as unknown as Response;
    }
    return {
      ok: resp.ok,
      status: resp.status,
      headers: new Headers(Object.fromEntries(resp.headers)),
    } as unknown as Response;
  });

  // Store original and replace
  globalThis.fetch = mockFetch as any;

  const uploadsCreate = jest.fn(async () => overrides?.uploadsCreateResult);
  const uploadsComplete = jest.fn(async () => overrides?.uploadsCompleteResult);
  const uploadsAbort = jest.fn(
    async () => overrides?.uploadsAbortResult ?? { id: 'upload-1', deleted: true },
  );

  const client = {
    post: jest.fn(async () => overrides?.postResult ?? { id: 'file-1', filename: 'test.bin' }),
    files: {
      uploads: {
        create: uploadsCreate,
        complete: uploadsComplete,
        abort: uploadsAbort,
      },
    },
    // Needed by multipartFormRequestOptions
    fetch: mockFetch,
  } as any;

  function restore() {
    globalThis.fetch = originalFetch;
  }

  return { client, mockFetch, uploadsCreate, uploadsComplete, uploadsAbort, restore };
}

describe('handleFileCreate', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('small file delegates to standard POST /v1/files', async () => {
    const expectedResult = { id: 'file-small', filename: 'small.txt', bytes: 100, mime_type: 'text/plain' };
    const { client, restore } = createMockClient({ postResult: expectedResult });

    try {
      const file = createFile(1024, 'small.txt'); // 1KB
      const result = await handleFileCreate(client, { file });

      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.post).toHaveBeenCalledWith('/v1/files', expect.any(Object));
      expect(result).toEqual(expectedResult);
      // Should NOT touch uploads API
      expect(client.files.uploads.create).not.toHaveBeenCalled();
    } finally {
      restore();
    }
  });

  test('large file uses multipart upload flow', async () => {
    const fileSize = 250 * 1024 * 1024; // 250MB → 3 parts
    const expectedFile = { id: 'file-large', filename: 'large.bin', bytes: fileSize };

    const { client, uploadsCreate, uploadsComplete, restore, mockFetch } = createMockClient({
      uploadsCreateResult: {
        id: 'upload-1',
        part_urls: [
          { part_number: 1, url: 'https://storage.example.com/part1' },
          { part_number: 2, url: 'https://storage.example.com/part2' },
          { part_number: 3, url: 'https://storage.example.com/part3' },
        ],
      },
      uploadsCompleteResult: expectedFile,
    });

    try {
      const file = createFile(fileSize, 'large.bin');
      const result = await handleFileCreate(client, { file });

      // Should NOT use standard post
      expect(client.post).not.toHaveBeenCalled();

      // Should call uploads.create with correct params
      expect(uploadsCreate).toHaveBeenCalledWith({
        filename: 'large.bin',
        file_size: fileSize,
        mime_type: 'application/octet-stream',
        part_count: 3,
      });

      // Should upload 3 parts via fetch
      expect(mockFetch).toHaveBeenCalledTimes(3);
      for (let i = 0; i < 3; i++) {
        expect(mockFetch).toHaveBeenCalledWith(
          `https://storage.example.com/part${i + 1}`,
          expect.objectContaining({ method: 'PUT' }),
        );
      }

      // Should call uploads.complete with sorted parts
      expect(uploadsComplete).toHaveBeenCalledWith('upload-1', {
        parts: [
          { part_number: 1, etag: expect.any(String) },
          { part_number: 2, etag: expect.any(String) },
          { part_number: 3, etag: expect.any(String) },
        ],
      });

      expect(result).toEqual(expectedFile);
    } finally {
      restore();
    }
  });

  test('concurrency limits workers', async () => {
    const fileSize = 250 * 1024 * 1024; // 3 parts
    let maxConcurrent = 0;
    let currentConcurrent = 0;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = jest.fn(async () => {
      currentConcurrent++;
      maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
      // Simulate async work
      await new Promise((r) => setTimeout(r, 10));
      currentConcurrent--;
      return {
        ok: true,
        status: 200,
        headers: new Headers({ ETag: '"test-etag"' }),
      } as unknown as Response;
    }) as any;

    const client = {
      post: jest.fn(),
      files: {
        uploads: {
          create: jest.fn(async () => ({
            id: 'upload-1',
            part_urls: [
              { part_number: 1, url: 'https://s3.example.com/1' },
              { part_number: 2, url: 'https://s3.example.com/2' },
              { part_number: 3, url: 'https://s3.example.com/3' },
            ],
          })),
          complete: jest.fn(async () => ({ id: 'file-1' })),
          abort: jest.fn(),
        },
      },
    } as any;

    try {
      const file = createFile(fileSize);
      // Set concurrency to 2
      await handleFileCreate(client, { file, multipartUpload: { concurrency: 2 } });

      expect(maxConcurrent).toBeLessThanOrEqual(2);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('part upload failure triggers abort and throws MultipartUploadError', async () => {
    const fileSize = 200 * 1024 * 1024; // 2 parts

    const { client, restore } = createMockClient({
      uploadsCreateResult: {
        id: 'upload-fail',
        part_urls: [
          { part_number: 1, url: 'https://s3.example.com/1' },
          { part_number: 2, url: 'https://s3.example.com/2' },
        ],
      },
      fetchResponses: [
        { ok: true, status: 200, headers: new Map([['ETag', '"etag-1"']]) },
        { ok: false, status: 500, headers: new Map() },
      ],
    });

    try {
      const file = createFile(fileSize);
      await expect(handleFileCreate(client, { file })).rejects.toThrow(MultipartUploadError);

      // Verify abort was called
      expect(client.files.uploads.abort).toHaveBeenCalledWith('upload-fail');
    } finally {
      restore();
    }
  });

  test('MultipartUploadError includes upload ID', async () => {
    const fileSize = 200 * 1024 * 1024;

    const { client, restore } = createMockClient({
      uploadsCreateResult: {
        id: 'upload-err-id',
        part_urls: [{ part_number: 1, url: 'https://s3.example.com/1' }],
      },
      fetchResponses: [{ ok: false, status: 403, headers: new Map() }],
    });

    try {
      const file = createFile(fileSize);
      try {
        await handleFileCreate(client, { file });
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(MultipartUploadError);
        expect((err as MultipartUploadError).uploadId).toBe('upload-err-id');
      }
    } finally {
      restore();
    }
  });

  test('AbortSignal cancellation', async () => {
    const fileSize = 300 * 1024 * 1024; // 3 parts

    const controller = new AbortController();

    const originalFetch = globalThis.fetch;
    let callCount = 0;
    globalThis.fetch = jest.fn(async (_url: any, init: any) => {
      callCount++;
      if (callCount === 2) {
        // Abort mid-upload
        controller.abort();
        throw new Error('Upload aborted');
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers({ ETag: '"etag"' }),
      } as unknown as Response;
    }) as any;

    const client = {
      post: jest.fn(),
      files: {
        uploads: {
          create: jest.fn(async () => ({
            id: 'upload-abort',
            part_urls: [
              { part_number: 1, url: 'https://s3.example.com/1' },
              { part_number: 2, url: 'https://s3.example.com/2' },
              { part_number: 3, url: 'https://s3.example.com/3' },
            ],
          })),
          complete: jest.fn(),
          abort: jest.fn(),
        },
      },
    } as any;

    try {
      const file = createFile(fileSize);
      await expect(handleFileCreate(client, { file }, { signal: controller.signal })).rejects.toThrow(
        MultipartUploadError,
      );

      expect(client.files.uploads.abort).toHaveBeenCalledWith('upload-abort');
      expect(client.files.uploads.complete).not.toHaveBeenCalled();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('missing ETag throws', async () => {
    const fileSize = 150 * 1024 * 1024; // 2 parts

    const { client, restore } = createMockClient({
      uploadsCreateResult: {
        id: 'upload-no-etag',
        part_urls: [
          { part_number: 1, url: 'https://s3.example.com/1' },
          { part_number: 2, url: 'https://s3.example.com/2' },
        ],
      },
      fetchResponses: [
        { ok: true, status: 200, headers: new Map() }, // No ETag!
      ],
    });

    try {
      const file = createFile(fileSize);
      await expect(handleFileCreate(client, { file })).rejects.toThrow(/missing ETag/);
      expect(client.files.uploads.abort).toHaveBeenCalledWith('upload-no-etag');
    } finally {
      restore();
    }
  });

  test('custom threshold respected', async () => {
    const expectedResult = { id: 'file-custom', filename: 'custom.bin' };
    const { client, restore } = createMockClient({
      uploadsCreateResult: {
        id: 'upload-custom',
        part_urls: [{ part_number: 1, url: 'https://s3.example.com/1' }],
      },
      uploadsCompleteResult: expectedResult,
    });

    try {
      // File is 10MB, default threshold is 100MB, but custom is 5MB
      const file = createFile(10 * 1024 * 1024);
      const result = await handleFileCreate(client, {
        file,
        multipartUpload: { threshold: 5 * 1024 * 1024 },
      });

      // Should use multipart since 10MB > 5MB threshold
      expect(client.files.uploads.create).toHaveBeenCalled();
      expect(client.post).not.toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    } finally {
      restore();
    }
  });

  test('default behavior (no multipartUpload config) works for small files', async () => {
    const expectedResult = { id: 'file-default', filename: 'default.txt' };
    const { client, restore } = createMockClient({ postResult: expectedResult });

    try {
      const file = createFile(512, 'default.txt');
      const result = await handleFileCreate(client, { file });

      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.files.uploads.create).not.toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    } finally {
      restore();
    }
  });

  test('default behavior (no multipartUpload config) uses multipart for large files', async () => {
    const fileSize = 150 * 1024 * 1024;
    const expectedResult = { id: 'file-default-large', filename: 'big.bin' };

    const { client, restore } = createMockClient({
      uploadsCreateResult: {
        id: 'upload-default-large',
        part_urls: [
          { part_number: 1, url: 'https://s3.example.com/1' },
          { part_number: 2, url: 'https://s3.example.com/2' },
        ],
      },
      uploadsCompleteResult: expectedResult,
    });

    try {
      const file = createFile(fileSize, 'big.bin');
      const result = await handleFileCreate(client, { file });

      expect(client.post).not.toHaveBeenCalled();
      expect(client.files.uploads.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    } finally {
      restore();
    }
  });

  test('onPartUpload callback is called for each part with correct events', async () => {
    const partSize = 100 * 1024 * 1024;
    const fileSize = 250 * 1024 * 1024; // 3 parts: 100MB, 100MB, 50MB
    const lastPartSize = fileSize - 2 * partSize;

    const { client, restore } = createMockClient({
      uploadsCreateResult: {
        id: 'upload-progress',
        part_urls: [
          { part_number: 1, url: 'https://s3.example.com/1' },
          { part_number: 2, url: 'https://s3.example.com/2' },
          { part_number: 3, url: 'https://s3.example.com/3' },
        ],
      },
      uploadsCompleteResult: { id: 'file-progress' },
    });

    try {
      const events: PartUploadEvent[] = [];
      const file = createFile(fileSize);
      await handleFileCreate(client, {
        file,
        multipartUpload: {
          onPartUpload: (event) => events.push(event),
        },
      });

      expect(events).toHaveLength(3);

      // Sort events by partNumber since concurrency may reorder them
      events.sort((a, b) => a.partNumber - b.partNumber);

      // All events share the same totalParts and totalBytes
      for (const event of events) {
        expect(event.totalParts).toBe(3);
        expect(event.totalBytes).toBe(fileSize);
      }

      // Check individual part sizes
      expect(events[0]!.partNumber).toBe(1);
      expect(events[0]!.partSize).toBe(partSize);
      expect(events[1]!.partNumber).toBe(2);
      expect(events[1]!.partSize).toBe(partSize);
      expect(events[2]!.partNumber).toBe(3);
      expect(events[2]!.partSize).toBe(lastPartSize);

      // Final uploadedBytes should equal total file size
      const maxUploaded = Math.max(...events.map((e) => e.uploadedBytes));
      expect(maxUploaded).toBe(fileSize);
    } finally {
      restore();
    }
  });

  test('onPartUpload is not called for small files', async () => {
    const { client, restore } = createMockClient({ postResult: { id: 'file-small' } });

    try {
      const onPartUpload = jest.fn();
      const file = createFile(1024);
      await handleFileCreate(client, {
        file,
        multipartUpload: { onPartUpload },
      });

      expect(onPartUpload).not.toHaveBeenCalled();
    } finally {
      restore();
    }
  });

  test('partSize below 5MB throws', async () => {
    const { client, restore } = createMockClient();

    try {
      const file = createFile(1024);
      await expect(
        handleFileCreate(client, {
          file,
          multipartUpload: { partSize: 1 * 1024 * 1024 },
        }),
      ).rejects.toThrow(/partSize must be at least 5MB/);
    } finally {
      restore();
    }
  });

  test('threshold below 5MB throws', async () => {
    const { client, restore } = createMockClient();

    try {
      const file = createFile(1024);
      await expect(
        handleFileCreate(client, {
          file,
          multipartUpload: { threshold: 2 * 1024 * 1024 },
        }),
      ).rejects.toThrow(/threshold must be at least 5MB/);
    } finally {
      restore();
    }
  });
});
