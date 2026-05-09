"use client";

import { useState } from "react";
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/normalize-image-url";

type Props = {
  images: { id: string; url: string }[];
  title: string;
  diameter?: string;
};

export function ProductGallery({ images, title, diameter }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [xy, setXY] = useState([0, 0]);
  // imgSize is state (not a ref) so the magnifier can read it during render.
  // setImgSize is only called in handleMouseEnter, so it batches with
  // setShowMagnifier and causes exactly one re-render per hover activation.
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  const MAGNIFIER_SIZE = 280; // lens diameter in pixels
  const ZOOM_LEVEL = 3.5;     // zoom level applied inside the lens

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // only activate on screens wider than mobile
    if (window.innerWidth > 768) {
      const { width, height } = e.currentTarget.getBoundingClientRect();
      setImgSize({ width, height });
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    setXY([e.clientX - left, e.clientY - top]);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[3/4] bg-bg-secondary rounded flex items-center justify-center text-text-muted text-sm border border-border">
        Ingen bild
      </div>
    );
  }

  // Normalize /uploads/ → /static/ for local dev so both optimized and
  // unoptimized (magnifier) images resolve correctly.
  const normalizedImages = images.map((img) => ({
    ...img,
    url: normalizeImageUrl(img.url),
  }));

  const activeImage = normalizedImages[activeIndex];

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Thumbnails (vertical strip) */}
      <div className="flex flex-col gap-3 w-20 overflow-y-auto no-scrollbar shrink-0">
        {normalizedImages.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-[3/4] w-full rounded border-2 overflow-hidden transition-colors ${
              idx === activeIndex
                ? "border-accent"
                : "border-transparent hover:border-border-dark"
            }`}
            aria-label={`Visa bild ${idx + 1}`}
          >
            <Image
              src={img.url}
              alt={`${title} - bild ${idx + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              quality={80}
            />
          </button>
        ))}
      </div>

      {/* Main image with magnifier */}
      <div
        className="relative flex-1 bg-white rounded border border-border overflow-hidden cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage.url}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain p-8"
        />

        {/* Diameter badge — only shown when the product has a diameter spec */}
        {diameter && (
          <div className="absolute bottom-4 right-4 bg-white border border-border text-xs px-3 py-1 rounded-full font-medium shadow-sm z-10 pointer-events-none">
            {diameter}
          </div>
        )}

        {/* Magnifier lens — unoptimized to preserve full resolution for zooming */}
        {showMagnifier && (
          <div
            className="absolute shadow-xl rounded-full pointer-events-none z-50 overflow-hidden bg-white ring-2 ring-accent/20"
            style={{
              top: `${xy[1] - MAGNIFIER_SIZE / 2}px`,
              left: `${xy[0] - MAGNIFIER_SIZE / 2}px`,
              width: `${MAGNIFIER_SIZE}px`,
              height: `${MAGNIFIER_SIZE}px`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: `${imgSize.width * ZOOM_LEVEL}px`,
                height: `${imgSize.height * ZOOM_LEVEL}px`,
                left: `${MAGNIFIER_SIZE / 2 - xy[0] * ZOOM_LEVEL}px`,
                top: `${MAGNIFIER_SIZE / 2 - xy[1] * ZOOM_LEVEL}px`,
              }}
            >
              <Image
                src={activeImage.url}
                alt={`${title} zoomed`}
                fill
                unoptimized
                className="object-contain"
                style={{ padding: `${32 * ZOOM_LEVEL}px` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
