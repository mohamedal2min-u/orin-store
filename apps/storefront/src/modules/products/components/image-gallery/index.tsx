"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import clx from "clsx"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle?: string
}

const LENS_SIZE = 200
const ZOOM_FACTOR = 2.0

const ImageGallery = ({ images, productTitle = "" }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = imageContainerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setContainerSize((prev) => {
        if (prev.width !== rect.width || prev.height !== rect.height) {
          return { width: rect.width, height: rect.height }
        }
        return prev
      })

      const halfLens = LENS_SIZE / 2
      const clampedX = Math.max(halfLens, Math.min(x, rect.width - halfLens))
      const clampedY = Math.max(halfLens, Math.min(y, rect.height - halfLens))

      setLensPos({ x: clampedX, y: clampedY })
    },
    []
  )

  const handleMouseEnter = useCallback(() => {
    setIsZooming(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false)
  }, [])

  const goToPrev = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  if (!images.length) return null

  const currentImage = images[selectedImage]

  return (
    <div className="flex flex-col gap-y-0">
      {/* Main Image + Thumbnails Row */}
      <div className="flex flex-row gap-x-0">
        {/* ── Thumbnails — vertical sidebar like ditur ── */}
        {images.length > 1 && (
          <div className="hidden small:flex flex-col items-center gap-y-1 w-[80px] shrink-0 py-4 px-2 relative">
            {/* Up arrow */}
            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                className="w-full flex items-center justify-center py-1 text-[#999] hover:text-[#333] transition-colors"
                aria-label="Föregående bild"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              </button>
            )}

            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={clx(
                  "relative aspect-square w-full overflow-hidden bg-[#f5f5f5] rounded transition-all duration-200",
                  selectedImage === index
                    ? "ring-2 ring-[#2E7D32] opacity-100"
                    : "opacity-60 hover:opacity-90 ring-1 ring-[#e5e5e5]"
                )}
                aria-label={`Visa bild ${index + 1}`}
              >
                <Image
                  src={image.url || ""}
                  alt={`${productTitle} — bild ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}

            {/* Down arrow */}
            {selectedImage < images.length - 1 && (
              <button
                onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                className="w-full flex items-center justify-center py-1 text-[#999] hover:text-[#333] transition-colors"
                aria-label="Nästa bild"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* ── Main Image with Prev/Next arrows like ditur ── */}
        <div className="flex-1 relative">
          <div
            ref={imageContainerRef}
            className="relative aspect-[4/5] w-full overflow-hidden bg-white cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={currentImage?.url || ""}
              priority
              fill
              className="object-contain transition-transform duration-500"
              alt={productTitle}
              sizes="(max-width: 576px) 100vw, (max-width: 768px) 480px, (max-width: 992px) 640px, 800px"
            />

            {/* ← → Navigation Arrows (ditur-style) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-[#333] transition-all z-10"
                  aria-label="Föregående"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-[#333] transition-all z-10"
                  aria-label="Nästa"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {/* Circular Magnifying Lens — Desktop only */}
            {isZooming && currentImage?.url && containerSize.width > 0 && (
              <div
                className="hidden small:block absolute pointer-events-none z-20 overflow-hidden bg-white"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensPos.x - LENS_SIZE / 2,
                  top: lensPos.y - LENS_SIZE / 2,
                  borderRadius: "50%",
                  border: "2px solid rgba(0,0,0,0.1)",
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: containerSize.width * ZOOM_FACTOR,
                    height: containerSize.height * ZOOM_FACTOR,
                    left: LENS_SIZE / 2 - lensPos.x * ZOOM_FACTOR,
                    top: LENS_SIZE / 2 - lensPos.y * ZOOM_FACTOR,
                  }}
                >
                  <Image
                    src={currentImage.url}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="1200px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Thumbnails — horizontal scroll */}
      {images.length > 1 && (
        <div className="flex small:hidden flex-row gap-x-2 overflow-x-auto p-3 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={clx(
                "relative aspect-square w-16 shrink-0 overflow-hidden bg-[#f5f5f5] rounded transition-all duration-200",
                selectedImage === index
                  ? "ring-2 ring-[#2E7D32] opacity-100"
                  : "opacity-50"
              )}
              aria-label={`Visa bild ${index + 1}`}
            >
              <Image
                src={image.url || ""}
                alt={`${productTitle} — bild ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
