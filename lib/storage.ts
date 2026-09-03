import { createClient } from '@/lib/supabase/client';

export const MEDIA_BUCKET = 'post-media';
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

export function mediaKind(file: File): 'image' | 'video' {
  return file.type.startsWith('video/') ? 'video' : 'image';
}

export function validateMediaFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Use JPG, PNG, WEBP, GIF, MP4, MOV, or WEBM.');
  }
  const max = mediaKind(file) === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) {
    throw new Error(
      mediaKind(file) === 'video'
        ? 'Videos must be 100 MB or smaller.'
        : 'Images must be 10 MB or smaller.'
    );
  }
}

function extensionFor(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  if (file.type === 'video/quicktime') return 'mov';
  if (file.type.startsWith('video/')) return 'mp4';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/gif') return 'gif';
  return 'jpg';
}

export function storagePathFromPublicUrl(url: string, userId: string) {
  const marker = `/object/public/${MEDIA_BUCKET}/${userId}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return `${userId}/${decodeURIComponent(url.slice(index + marker.length))}`;
}

export async function uploadPostMedia(userId: string, file: File) {
  validateMediaFile(file);
  const supabase = createClient();
  const path = `${userId}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    throw new Error(error.message || 'Could not upload the file.');
  }
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return {
    url: data.publicUrl,
    path,
    type: mediaKind(file),
    name: file.name,
  };
}

export async function removePostMedia(path: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) {
    throw new Error(error.message || 'Could not remove the file.');
  }
}
