import type { CartLineItem } from "./types";

const DEV_BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

export function normalizeImageUrl(url: string): string {
  if (process.env.NODE_ENV !== "development") return url;

  // /uploads/<file> → <backend>/static/<file>  (legacy local-provider paths)
  if (url.startsWith("/uploads/")) {
    return `${DEV_BACKEND}/static/${url.slice("/uploads/".length)}`;
  }

  // <backend>/uploads/<file> → <backend>/static/<file>
  const absUploads = `${DEV_BACKEND}/uploads/`;
  if (url.startsWith(absUploads)) {
    return `${DEV_BACKEND}/static/${url.slice(absUploads.length)}`;
  }

  return url;
}

export function resolveCartItemImage(item: CartLineItem): string | null {
  const raw =
    item.thumbnail ??
    item.variant?.product?.thumbnail ??
    item.variant?.product?.images?.[0]?.url ??
    null;
  return raw ? normalizeImageUrl(raw) : null;
}
