import { mxjsonFileItem } from '../../src/lib/mxjson';
import { toFile } from '../../src/core/uploads';

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x00, 0xff, 0x0a]);
const PDF_BASE64 = Buffer.from(PDF).toString('base64');

describe('mxjsonFileItem', () => {
  test('carries a file with its name and type', async () => {
    const file = await toFile(PDF, 'exhibit-a.pdf', { type: 'application/pdf' });

    const item = await mxjsonFileItem(file, { generatedMetadata: { attachment: 'a-1' } });

    expect(item).toEqual({
      type: 'file',
      file: { file_data: `data:application/pdf;base64,${PDF_BASE64}`, filename: 'exhibit-a.pdf' },
      generated_metadata: { attachment: 'a-1' },
    });
    // The item is plain JSON, ready to go into an mxjson file.
    expect(JSON.parse(JSON.stringify([item]))).toEqual([item]);
  });

  test('bytes carry no name unless given, and a type makes a data URI', async () => {
    expect(await mxjsonFileItem(PDF)).toEqual({ type: 'file', file: { file_data: PDF_BASE64 } });
    expect(await mxjsonFileItem(PDF, { filename: 'a.pdf', mimeType: 'application/pdf' })).toEqual({
      type: 'file',
      file: { file_data: `data:application/pdf;base64,${PDF_BASE64}`, filename: 'a.pdf' },
    });
  });

  test('options override what the file says', async () => {
    const file = await toFile(PDF, 'a.pdf', { type: 'application/pdf' });

    const item = await mxjsonFileItem(file, { filename: 'b.pdf', mimeType: 'application/x-pdf' });

    expect(item.file).toEqual({
      file_data: `data:application/x-pdf;base64,${PDF_BASE64}`,
      filename: 'b.pdf',
    });
  });

  test('encodes without Buffer, in pieces', async () => {
    const large = new Uint8Array(3 * 8192 * 2 + 5).map((_, index) => index % 251);
    const expected = Buffer.from(large).toString('base64');
    const buffer = (globalThis as any).Buffer;
    (globalThis as any).Buffer = undefined;
    let item;
    try {
      item = await mxjsonFileItem(new Blob([large]));
    } finally {
      (globalThis as any).Buffer = buffer;
    }

    expect(item.file.file_data).toBe(expected);
  });
});
