import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import FeaturedBrands from "@modules/home/components/featured-brands"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "ORIN — Tidlös precision, kurerad för Sverige",
  description:
    "Ett noggrant urval av armbandsur från välkända varumärken — med tydliga priser, trygg betalning och leverans inom Sverige.",
}

export default async function Home() {
  const region = await getRegion()

  if (!region) {
    return null
  }

  return (
    <div className="bg-kv-bg selection:bg-kv-primary selection:text-white">
      <Hero />
      <FeaturedBrands />
      <div id="collections" className="py-20 small:py-32 border-t border-kv-border/50">
        <div className="content-container mb-16 text-center flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-[0.2em] text-kv-secondary uppercase">
            ORIN Kollektioner
          </span>
          <h2 className="text-3xl small:text-4xl font-light tracking-[0.06em] text-kv-primary mt-4 max-w-2xl">
            Våra Utvalda Bästsäljare
          </h2>
          <div className="w-12 h-[1px] bg-kv-accent/50 mt-8" />
        </div>
        <div className="content-container">
          <FeaturedProducts region={region} />
        </div>
      </div>
    </div>
  )
}
