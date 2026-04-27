import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  alt?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  alt = "",
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url
  const secondaryImage = images && images.length > 1 ? images[1]?.url : null

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden bg-kv-surface transition-all duration-300 ease-out",
        "group-hover:shadow-[0_2px_12px_rgba(28,23,20,0.06)]",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[4/5]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <>
          <Image
            src={initialImage}
            alt={alt ?? ""}
            className={clx(
              "absolute inset-0 object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-[1.03]",
              {
                "opacity-100 group-hover:opacity-0": !!secondaryImage,
              }
            )}
            draggable={false}
            quality={80}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            fill
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={alt ?? ""}
              className="absolute inset-0 object-cover object-center transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
              draggable={false}
              quality={80}
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              fill
            />
          )}
        </>
      ) : (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          <PlaceholderImage size={size === "small" ? 16 : 24} />
        </div>
      )}
    </div>
  )
}

export default Thumbnail
