import { supabase, supabaseAnonKey, supabaseUrl } from '@/lib/supabase';

/** Longest side of an uploaded photo. Plenty for judging a profile picture. */
const MAX_PHOTO_DIMENSION = 2000;
/** Below this a photo is already small enough; re-encoding would only cost quality. */
const COMPRESS_THRESHOLD = 1.5 * 1024 * 1024;
const COMPRESSIBLE_TYPES = /^image\/(jpeg|png|webp|heic|heif)$/i;

/**
 * Phones hand over photos of 5–30 MB (a 26 MB PNG in Daria's test). On mobile
 * upload speeds that alone is minutes of waiting, while the admin only needs a
 * recognisable picture. Re-encode to a JPEG of at most 2000px: typically a few
 * hundred KB.
 *
 * Any failure (a browser that cannot decode HEIC, a canvas that is too large
 * for the device's memory) falls back to the original file. Shrinking is a
 * nicety; it must never stop someone from registering.
 */
export const compressPhoto = async (file: File): Promise<File> => {
  if (file.size < COMPRESS_THRESHOLD || !COMPRESSIBLE_TYPES.test(file.type)) return file;

  let source: ImageBitmap | HTMLImageElement | null = null;
  try {
    source = await decodeImage(file);
    const width = 'naturalWidth' in source ? source.naturalWidth : source.width;
    const height = 'naturalHeight' in source ? source.naturalHeight : source.height;

    const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    // PNG screenshots can be transparent; JPEG would turn that black.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85)
    );
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'foto';
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
  } catch (error) {
    console.warn('Photo compression skipped, uploading original:', error);
    return file;
  } finally {
    if (source && 'close' in source) source.close();
  }
};

/**
 * createImageBitmap decodes large photos reliably (HTMLImageElement.decode()
 * rejects big PNGs in Chrome) and applies EXIF orientation, so portrait phone
 * photos stay upright. Older Safari lacks it: fall back to a plain <img>.
 */
const decodeImage = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* fall through to <img> */
    }
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image could not be decoded'));
      img.src = objectUrl;
    });
    return img;
  } finally {
    // The decoded pixels stay available to drawImage after the URL is revoked.
    URL.revokeObjectURL(objectUrl);
  }
};

export class UploadAborted extends Error {
  constructor() {
    super('Upload aborted');
    this.name = 'UploadAborted';
  }
}

export interface ProgressUpload {
  promise: Promise<void>;
  abort: () => void;
}

/**
 * Uploads to the `uploads` bucket exactly like supabase-js does (same endpoint,
 * same multipart body, same apikey/Authorization headers), but over
 * XMLHttpRequest. fetch() cannot report upload progress, and without progress
 * a long video upload looks like a frozen page.
 */
export const uploadWithProgress = (
  path: string,
  file: File,
  onProgress: (loaded: number, total: number) => void
): ProgressUpload => {
  const xhr = new XMLHttpRequest();

  const promise = (async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token ?? supabaseAnonKey;

    const body = new FormData();
    body.append('cacheControl', '3600');
    body.append('', file);

    await new Promise<void>((resolve, reject) => {
      xhr.open('POST', `${supabaseUrl}/storage/v1/object/uploads/${path}`);
      xhr.setRequestHeader('apikey', supabaseAnonKey);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('x-upsert', 'false');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded, e.total);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) return resolve();
        let message = `HTTP ${xhr.status}`;
        try {
          const parsed = JSON.parse(xhr.responseText);
          message = parsed.message || parsed.error || message;
        } catch {
          /* non-JSON error body: keep the status code */
        }
        reject(new Error(message));
      };
      // Same wording fetch() uses, so uploadErrorMessage recognises it.
      xhr.onerror = () => reject(new Error('Failed to fetch'));
      xhr.onabort = () => reject(new UploadAborted());
      xhr.send(body);
    });
  })();

  return { promise, abort: () => xhr.abort() };
};
