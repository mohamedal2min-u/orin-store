type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudflareLoader({
  src,
  width,
  quality,
}: LoaderArgs): string {
  // Mirrors normalizeImageUrl() in lib/normalize-image-url.ts — inlined here
  // because Next.js loaderFile must be a self-contained module (no imports).
  if (process.env.NODE_ENV === "development" && src.startsWith("/uploads/")) {
    const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
    src = `${base}/static/${src.slice("/uploads/".length)}`;
  }

  // In development, pass through localhost URLs from the local file provider.
  // In production all media comes from cdn.orin.se — no raw http:// passthrough.
  if (process.env.NODE_ENV === "development" && src.startsWith("http://")) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  if (process.env.NEXT_PUBLIC_USE_CF_RESIZING === "true") {
    const params = [
      `width=${width}`,
      `quality=${quality || 80}`,
      "format=auto",
      "fit=scale-down",
    ].join(",");
    return `https://cdn.orin.se/cdn-cgi/image/${params}/${src}`;
  }

  // MVP: pick pre-generated variant based on requested width
  const variant =
    width <= 300 ? "thumb" : width <= 600 ? "medium" : "large";
  const variantSrc = src.replace(/\.[^.]+$/, `-${variant}.webp`);
  return `https://cdn.orin.se/${variantSrc}`;
}
