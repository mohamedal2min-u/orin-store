import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FeaturedBrands = () => {
  const brands = [
    { name: "Seiko", tag: "Japansk precision", href: "/store" },
    { name: "Tissot", tag: "Schweiziskt arv", href: "/store" },
    { name: "Boss", tag: "Modern elegans", href: "/store" },
    { name: "Michael Kors", tag: "Samtida lyx", href: "/store" },
  ]

  return (
    <section className="bg-white py-16 small:py-24 border-t border-kv-border/40">
      <div className="content-container flex flex-col items-center gap-12">
        <div className="flex flex-col items-center text-center gap-2 max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-kv-secondary uppercase">
            Våra Partners
          </span>
          <h2 className="text-3xl small:text-4xl font-light tracking-[0.04em] text-kv-primary mt-2">
            Världsledande Varumärken
          </h2>
          <p className="text-[14px] text-kv-secondary mt-3 max-w-md mx-auto leading-relaxed">
            Vi är stolta återförsäljare av klockor som definierar branschen — från japansk innovation till schweizisk urmakarkonst.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {brands.map((brand) => (
            <LocalizedClientLink
              href={brand.href}
              key={brand.name}
              className="group relative flex flex-col items-center justify-center py-12 px-6 border border-kv-border/50 bg-[#FAF8F5] hover:bg-kv-primary transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-500 group-hover:-translate-y-1">
                <span className="text-2xl font-bold tracking-widest text-kv-primary group-hover:text-white transition-colors duration-500">
                  {brand.name.toUpperCase()}
                </span>
                <span className="text-[10px] font-medium tracking-[0.15em] text-kv-secondary uppercase opacity-0 group-hover:opacity-100 group-hover:text-white/70 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  {brand.tag}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedBrands
