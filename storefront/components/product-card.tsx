import Image from "next/image";
import Link from "next/link";
import { formatPriceRaw } from "@/lib/locale";
import { normalizeImageUrl } from "@/lib/normalize-image-url";
import { OrinPlaceholder } from "@/components/product-image-placeholder";
import type { MedusaProduct } from "@/lib/types";

type Props = {
  product: MedusaProduct;
  /** Priority hint for LCP images (first visible cards). */
  priority?: boolean;
  sizes?: string;
};

export function ProductCard({ product, priority = false, sizes = "(max-width:640px) 50vw, 25vw" }: Props) {
  const price = product.variants?.[0]?.calculated_price;
  const currentPrice = price ? price.calculated_amount / 100 : null;
  const originalPrice = price ? price.original_amount / 100 : null;

  // Deal badge: only when original > current (real discount from Medusa)
  const hasDiscount = currentPrice !== null && originalPrice !== null && originalPrice > currentPrice && currentPrice > 0;
  const discountPct = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  // Premium badge: from metadata or tags
  const isPremium =
    product.metadata?.premium === "true" ||
    product.tags?.some((t) => t.value.toLowerCase() === "premium");

  // Case size: from metadata
  const caseSize = product.metadata?.diameter ?? product.metadata?.case_size ?? product.metadata?.size_mm ?? null;

  // Brand: extract from metadata
  const brand = product.metadata?.brand ?? null;

  const allUrls = [
    product.thumbnail,
    ...(product.images?.map((img) => img.url) ?? []),
  ].filter((url, i, arr): url is string =>
    typeof url === "string" && url.length > 0 && arr.indexOf(url) === i
  );
  const primaryImg = allUrls[0] ? normalizeImageUrl(allUrls[0]) : null;
  const secondaryImg = allUrls[1] ? normalizeImageUrl(allUrls[1]) : null;

  return (
    <Link
      href={`/produkter/${product.handle}`}
      className="group relative flex flex-col rounded-lg bg-white border border-border overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
    >
      {/* ── Image area with hover swap ── */}
      <div className="relative aspect-square bg-white overflow-hidden">
        {primaryImg ? (
          <>
            {/* Primary image — visible by default, fades out on hover when secondary exists */}
            <Image
              src={primaryImg}
              alt={product.title}
              fill
              priority={priority}
              className={`object-contain p-0 transition-opacity duration-500 ${secondaryImg ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform"}`}
              sizes={sizes}
            />
            {/* Secondary image — hidden by default, fades in on hover */}
            {secondaryImg && (
              <Image
                src={secondaryImg}
                alt={`${product.title} – bild 2`}
                fill
                className="object-contain p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                sizes={sizes}
              />
            )}
          </>
        ) : (
          <OrinPlaceholder />
        )}

        {/* Badges overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && discountPct > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-sale text-white text-[10px] font-bold tracking-wide">
              {discountPct}% Deal
            </span>
          )}
          {isPremium && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-bg-dark text-text-inverse text-[10px] font-bold tracking-wide">
              Premium
            </span>
          )}
        </div>

        {/* Case size / diameter badge — on the image */}
        {caseSize && (
          <span className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2 py-1 rounded bg-white/90 backdrop-blur-sm border border-border text-[10px] font-semibold text-text tabular-nums shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="opacity-50">
              <circle cx="12" cy="12" r="10" />
            </svg>
            {String(caseSize).replace(/\s*mm$/i, "")} mm
          </span>
        )}
      </div>

      {/* ── Info area ── */}
      <div className="flex flex-col gap-1 px-4 py-4">
        {brand && (
          <span className="text-sm font-bold uppercase tracking-wide leading-tight">{brand}</span>
        )}
        <h3 className="text-[13px] text-text-muted leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {product.title}
        </h3>

        {/* Price row */}
        {currentPrice !== null && (
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className={`text-base font-bold tabular-nums ${hasDiscount ? "text-sale" : "text-text"}`}>
              {formatPriceRaw(currentPrice)}
            </span>
            {hasDiscount && originalPrice !== null && (
              <span className="text-xs text-text-muted line-through tabular-nums">
                {formatPriceRaw(originalPrice)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

/** Skeleton placeholder matching ProductCard dimensions. */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg bg-white border border-border overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-bg-secondary" />
      <div className="px-4 py-4 space-y-2">
        <div className="h-3 w-16 bg-border rounded" />
        <div className="h-3.5 w-3/4 bg-border/70 rounded" />
        <div className="h-4 w-20 bg-border rounded mt-1" />
      </div>
    </div>
  );
}
