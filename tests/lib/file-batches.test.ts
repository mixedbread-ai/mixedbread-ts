import { APIUserAbortError, UnprocessableEntityError } from '../../src/core/error';
import { MultipartUploadError } from '../../src/lib/upload-file';
import { withFileBatchHelpers } from '../../src/lib/file-batches';
import type { StoreFileBatch } from '../../src/resources/stores/file-batches';

const invalid = new UnprocessableEntityError(
  422,
  { code: 'file_invalid_error', message: 'Invalid file' },
  undefined,
  new Headers(),
);

function createFileBatches({ failures = {} }: { failures?: Record<string, Error> } = {}) {
  const filesCreate = jest.fn(async ({ file }: { file: File; multipartUpload?: unknown }) => {
    if (failures[file.name]) throw failures[file.name];
    return { id: `file_${file.name}` };
  });
  const create = jest.fn(async (_store: string, { files }: { files: Array<{ file_id: string }> }) => ({
    data: files.map((f) => ({ file_id: f.file_id, status: 'pending' })),
  }));
  class Base {
    _client = { files: { create: filesCreate } };
    create = create;
  }
  const FileBatches = withFileBatchHelpers(Base as any);
  return { fileBatches: new FileBatches(), filesCreate, create };
}

const file = (name: string) => new File(['x'], name);

describe('withFileBatchHelpers', () => {
  test('upload adds every file in one batch, in order, with per-file fields', async () => {
    const { fileBatches, create } = createFileBatches();

    await fileBatches.upload({
      storeIdentifier: 'store',
      files: [file('a'), { file: file('b'), external_id: 'doc-b', metadata: { deal: 'acme' } }],
    });

    expect(create).toHaveBeenCalledWith(
      'store',
      {
        files: [
          { file_id: 'file_a' },
          { file_id: 'file_b', external_id: 'doc-b', metadata: { deal: 'acme' } },
        ],
      },
      undefined,
    );
  });

  test('custom multipart settings keep the 5MB threshold', async () => {
    const { fileBatches, filesCreate } = createFileBatches();

    await fileBatches.upload({
      storeIdentifier: 'store',
      files: [file('a')],
      multipartUpload: { concurrency: 2 },
    });

    expect(filesCreate.mock.calls[0]![0].multipartUpload).toEqual({
      threshold: 5 * 1024 * 1024,
      concurrency: 2,
    });
  });

  test('more than 100 files are rejected before anything is uploaded', async () => {
    const { fileBatches, filesCreate } = createFileBatches();
    const files = Array.from({ length: 101 }, (_, i) => file(`${i}`));

    await expect(fileBatches.upload({ storeIdentifier: 'store', files })).rejects.toThrow('1 to 100');
    expect(filesCreate).not.toHaveBeenCalled();
  });

  test('a failed upload is reported in place and the other files are still added', async () => {
    const { fileBatches, create } = createFileBatches({ failures: { bad: invalid } });

    const result = await fileBatches.upload({
      storeIdentifier: 'store',
      files: [file('a'), { file: file('bad'), external_id: 'doc-bad' }, file('c')],
    });

    expect(create.mock.calls[0]![1]).toEqual({ files: [{ file_id: 'file_a' }, { file_id: 'file_c' }] });
    expect(result.object).toBe('store.file_batch');
    expect(result.data.map((d: StoreFileBatch.Data) => d.file_id)).toEqual(['file_a', '', 'file_c']);
    expect(result.data[1]).toEqual({
      file_id: '',
      external_id: 'doc-bad',
      error: { code: 'file_invalid_error', message: 'Invalid file' },
    });
  });

  test('when every upload fails nothing is added', async () => {
    const { fileBatches, create } = createFileBatches({ failures: { bad: invalid } });

    const result = await fileBatches.upload({ storeIdentifier: 'store', files: [file('bad')] });

    expect(create).not.toHaveBeenCalled();
    expect(result.data[0]!.error!.code).toBe('file_invalid_error');
  });

  test('a failed multipart transfer is reported in place', async () => {
    const broken = new MultipartUploadError('part upload failed', 'upload_1');
    const { fileBatches, create } = createFileBatches({ failures: { big: broken } });

    const result = await fileBatches.upload({ storeIdentifier: 'store', files: [file('a'), file('big')] });

    expect(create.mock.calls[0]![1]).toEqual({ files: [{ file_id: 'file_a' }] });
    expect(result.data[1]!.error).toEqual({ code: 'upload_error', message: 'part upload failed' });
  });

  test('an empty file list is rejected', async () => {
    const { fileBatches } = createFileBatches();

    await expect(fileBatches.upload({ storeIdentifier: 'store', files: [] })).rejects.toThrow('1 to 100');
  });

  test.each([
    ['a request', new APIUserAbortError()],
    ['a multipart transfer', new MultipartUploadError('Request was aborted.', 'upload_1')],
  ])('cancelling %s rejects the call instead of being reported per file', async (_path, aborted) => {
    const controller = new AbortController();
    controller.abort();
    const { fileBatches, create } = createFileBatches({ failures: { a: aborted } });

    await expect(
      fileBatches.upload({
        storeIdentifier: 'store',
        files: [file('a')],
        options: { signal: controller.signal },
      }),
    ).rejects.toBe(aborted);
    expect(create).not.toHaveBeenCalled();
  });
});
