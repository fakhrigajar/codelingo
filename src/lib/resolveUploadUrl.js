import { UPLOADS_BASE } from "./apiBase";

export function resolveUploadUrl(url) {
  if (!url) return url;
  const idx = url.indexOf("/uploads/");
  if (idx === -1) return url;
  return `${UPLOADS_BASE}${url.slice(idx)}`;
}
