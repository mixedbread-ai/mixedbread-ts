import { withFileBatchHelpers } from '../../src/lib/file-batches';

function createFileBatches() {
  const filesCreate = jest.fn(async ({ file }: { file: File; multipartUpload?: unknown }) => ({
    id: `file_${file.name}`,
  }));
  const create = jest.fn().mockResolvedValue({ data: [] });
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

    await expect(fileBatches.upload({ storeIdentifier: 'store', files })).rejects.toThrow('at most 100');
    expect(filesCreate).not.toHaveBeenCalled();
  });
});
