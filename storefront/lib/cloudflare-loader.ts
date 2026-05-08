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
  // Pass through absolute URLs that don't belong to our CDN (e.g. local file provider)
  if (src.startsWith("http://") || src.startsWith("//")) {
    return src;
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
