// Hand-written helpers for building mxjson files (`.mxjson` / `.mxjsonl`).
//
// An mxjson file is a JSON array of items that is uploaded like any other file. A `file` item
// carries a whole file as base64 (the shape of an OpenAI file input), which Mixedbread parses and chunks in the item's place;
// `mxjsonFileItem` builds one.

import { toFile, type ToFileInput } from '../internal/to-file';
import { MixedbreadError } from '../core/error';

/**
 * The file of an mxjson `file` item.
 */
export interface MxjsonFile {
  /**
   * The file, as a base64 data URI (`data:application/pdf;base64,...`) or as plain base64. It
   * cannot be another mxjson file.
   */
  file_data: string;

  /**
   * Filename of the file. Its type is detected from it when `file_data` is plain base64.
   */
  filename?: string;
}

/**
 * An mxjson `file` item, which carries a file for Mixedbread to parse and chunk.
 */
export interface MxjsonFileItem {
  type: 'file';

  /**
   * The file the item carries.
   */
  file: MxjsonFile;

  /**
   * Custom fields added to every chunk of the file.
   */
  generated_metadata?: Record<string, unknown>;
}

export interface MxjsonFileItemOptions {
  /**
   * Filename of the file, instead of the one `file` has.
   */
  filename?: string;

  /**
   * MIME type of the file, instead of the one `file` has. It makes `file_data` a data URI;
   * without one `file_data` is plain base64 and Mixedbread detects the type from the filename
   * and the bytes.
   */
  mimeType?: string;

  /**
   * Custom fields added to every chunk of the file.
   */
  generatedMetadata?: Record<string, unknown>;
}

// What `toFile` names a file it has no name for.
const UNNAMED = 'unknown_file';
// A multiple of three bytes, so the pieces' base64 can be joined.
const BASE64_PIECE_BYTES = 3 * 8192;

function toBase64(bytes: Uint8Array): string {
  const buffer = (globalThis as any).Buffer;
  if (typeof buffer !== 'undefined') {
    return buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
  }
  if (typeof btoa === 'undefined') {
    throw new MixedbreadError('Cannot generate base64 string; Expected `Buffer` or `btoa` to be defined');
  }
  let encoded = '';
  for (let start = 0; start < bytes.length; start += BASE64_PIECE_BYTES) {
    const piece = bytes.subarray(start, start + BASE64_PIECE_BYTES);
    encoded += btoa(String.fromCharCode.apply(null, piece as unknown as number[]));
  }
  return encoded;
}

/**
 * Build an mxjson `file` item that carries `file` itself, base64 encoded.
 *
 * `file` is what `toFile` takes: a `File`, `Blob`, `Response`, buffer or stream. Its name and
 * type are used unless `options` give others.
 *
 * The file is read into memory, and base64 makes it a third larger.
 */
export async function mxjsonFileItem(
  file: ToFileInput | PromiseLike<ToFileInput>,
  options: MxjsonFileItemOptions = {},
): Promise<MxjsonFileItem> {
  const resolved = await toFile(file);
  const encoded = toBase64(new Uint8Array(await resolved.arrayBuffer()));
  const mimeType = options.mimeType || resolved.type;
  const carried: MxjsonFile = { file_data: mimeType ? `data:${mimeType};base64,${encoded}` : encoded };
  const filename = options.filename || (resolved.name !== UNNAMED ? resolved.name : undefined);
  if (filename) carried.filename = filename;
  const item: MxjsonFileItem = { type: 'file', file: carried };
  if (options.generatedMetadata !== undefined) item.generated_metadata = options.generatedMetadata;
  return item;
}
