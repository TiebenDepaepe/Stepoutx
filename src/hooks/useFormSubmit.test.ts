import { describe, expect, it, vi, afterEach } from 'vitest';
import { assertFileReadable, uploadErrorMessage, UploadFailure } from './useFormSubmit';

/** A file whose bytes are genuinely there. */
const readableFile = (bytes: number): File =>
  new File([new Uint8Array(bytes)], 'foto.jpg', { type: 'image/jpeg' });

/**
 * A file whose pointer has gone stale: metadata still reports the old values,
 * but reading the bytes fails. This is what iOS Safari hands back after the tab
 * has been backgrounded, and it is what produced "No content provided".
 */
const staleFile = (size = 2_000_000): File =>
  ({
    name: 'foto.jpg',
    size,
    slice: () => ({
      arrayBuffer: () => Promise.reject(new Error('NotReadableError')),
    }),
  }) as unknown as File;

/** A file that reads successfully but yields nothing - a truncated upload. */
const emptyReadFile = (size = 2_000_000): File =>
  ({
    name: 'foto.jpg',
    size,
    slice: () => ({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)) }),
  }) as unknown as File;

/** Safari before 14: Blob.arrayBuffer() does not exist. */
const legacyBrowserFile = (size = 2_000_000): File =>
  ({ name: 'foto.jpg', size, slice: () => ({}) }) as unknown as File;

afterEach(() => vi.restoreAllMocks());

describe('assertFileReadable', () => {
  it('accepts a file whose bytes are readable', async () => {
    await expect(assertFileReadable(readableFile(1024), 'foto')).resolves.toBeUndefined();
  });

  it('rejects a 0-byte file, which the 50MB size validation lets through', async () => {
    await expect(assertFileReadable(readableFile(0), 'foto')).rejects.toThrow(UploadFailure);
    await expect(assertFileReadable(readableFile(0), 'foto')).rejects.toThrow(/leeg \(0 bytes\)/);
  });

  it('rejects a stale file pointer before anything is uploaded', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(assertFileReadable(staleFile(), 'video')).rejects.toThrow(
      /niet meer lezen/
    );
  });

  it('rejects a file that reads back zero bytes despite a non-zero size', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(assertFileReadable(emptyReadFile(), 'foto')).rejects.toThrow(UploadFailure);
  });

  it('lets the upload proceed when the browser cannot probe, instead of guessing', async () => {
    await expect(assertFileReadable(legacyBrowserFile(), 'foto')).resolves.toBeUndefined();
  });

  it('names the right file kind in its message', async () => {
    await expect(assertFileReadable(readableFile(0), 'video')).rejects.toThrow(/Je video is leeg/);
  });
});

describe('uploadErrorMessage', () => {
  it('translates the Storage error seen in production', () => {
    const message = uploadErrorMessage('No content provided', 'foto');
    expect(message).toMatch(/kwam leeg aan bij de server/);
    expect(message).not.toMatch(/no content provided/i);
  });

  it('gives video-specific advice when the server rejects the size', () => {
    expect(uploadErrorMessage('The object exceeded the maximum allowed size', 'video')).toMatch(
      /1080p/
    );
    expect(uploadErrorMessage('Payload too large', 'foto')).toMatch(/kleinere foto/);
  });

  it('recognises a dropped connection', () => {
    expect(uploadErrorMessage('Failed to fetch', 'foto')).toMatch(/verbinding viel weg/);
    expect(uploadErrorMessage('Load failed', 'video')).toMatch(/verbinding viel weg/);
  });

  it('never leaks an untranslated API message to the visitor', () => {
    const unknown = uploadErrorMessage('Bucket not found', 'foto');
    expect(unknown).not.toMatch(/bucket/i);
    expect(unknown).toMatch(/mislukt/);
  });

  it('produces Dutch for an empty message too', () => {
    expect(uploadErrorMessage('', 'video')).toMatch(/Het uploaden van je video is mislukt/);
  });
});
