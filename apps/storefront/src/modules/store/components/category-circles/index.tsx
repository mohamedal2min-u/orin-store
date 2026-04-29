"use client"

import { useParams, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

type Category = {
  name: string
  icon: React.ReactNode
  param?: { key: string; value: string }
}

const categories: Category[] = [
  {
    name: "Alla",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    name: "Herr",
    param: { key: "category", value: "herr" },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    name: "Dam",
    param: { key: "category", value: "dam" },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    name: "Automatisk",
    param: { key: "category", value: "automatisk" },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Kvarts",
    param: { key: "category", value: "kvarts" },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    name: "Seiko",
    param: { key: "collection", value: "seiko" },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    name: "Tissot",
    param: { key: "collection", value: "tissot" },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    name: "Premium",
    param: { key: "collection", value: "premium" },
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
]

const CategoryCircles = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isStorePage = pathname === `/store`

  const activeCategory = searchParams.get("category")
  const activeCollection = searchParams.get("collection")

  const isActive = (cat: Category) => {
    if (!cat.param) {
      // "Alla" is active when on store page with no category/collection filter
      return isStorePage && !activeCategory && !activeCollection
    }
    if (cat.param.key === "category") return activeCategory === cat.param.value
    if (cat.param.key === "collection") return activeCollection === cat.param.value
    return false
  }

  const getHref = (cat: Category) => {
    if (!cat.param) return `/store`
    const params = new URLSearchParams(searchParams.toString())
    // Keep sortBy if present, reset page
    const newParams = new URLSearchParams()
    if (params.get("sortBy")) newParams.set("sortBy", params.get("sortBy")!)
    newParams.set(cat.param.key, cat.param.value)
    return `/store?${newParams.toString()}`
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-6 small:gap-8 py-2 px-1 min-w-max small:justify-center">
        {categories.map((cat) => {
          const active = isActive(cat)
          return (
            <Link
              key={cat.name}
              href={getHref(cat)}
              className="flex flex-col items-center gap-2.5 group"
            >
              {/* Circle */}
              <div
                className={`
                  relative flex items-center justify-center w-16 h-16 small:w-[72px] small:h-[72px] rounded-full
                  transition-all duration-300 ease-out
                  ${
                    active
                      ? "bg-kv-primary text-kv-bg shadow-lg shadow-kv-primary/20 scale-105"
                      : "bg-kv-surface text-kv-secondary border border-kv-border/60 hover:border-kv-accent/50 hover:text-kv-accent hover:shadow-md hover:scale-105"
                  }
                `}
              >
                {cat.icon}
                {active && (
                  <div className="absolute -inset-[3px] rounded-full border-2 border-kv-accent/40 animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  text-[11px] font-medium tracking-wide transition-colors duration-200
                  ${active ? "text-kv-primary font-semibold" : "text-kv-secondary group-hover:text-kv-primary"}
                `}
              >
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryCircles
