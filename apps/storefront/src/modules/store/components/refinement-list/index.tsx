"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const FilterGroup = ({ title, options, icon }: { title: string; options: string[]; icon?: React.ReactNode }) => {
    const [isExpanded, setIsExpanded] = useState(true)

    return (
      <div className="group/section">
        {/* Section Header — clickable to collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full py-1 mb-3"
        >
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="text-kv-accent">{icon}</span>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kv-primary">
              {title}
            </span>
          </div>
          <svg
            className={`w-3.5 h-3.5 text-kv-secondary transition-transform duration-300 ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Options */}
        <div
          className={`flex flex-col gap-y-1 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-x-3 cursor-pointer group px-1 py-2 rounded-sm hover:bg-kv-surface/60 transition-all duration-150"
            >
              {/* Custom Checkbox */}
              <div className="relative flex items-center justify-center w-[18px] h-[18px] border border-kv-border rounded-[2px] group-hover:border-kv-accent transition-colors duration-200">
                <input
                  type="checkbox"
                  className="absolute inset-0 opacity-0 cursor-pointer peer"
                />
                {/* Checkmark (shown on check via CSS) */}
                <svg
                  className="w-3 h-3 text-kv-bg opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6L5 8.5L9.5 3.5" />
                </svg>
                {/* Background fill on check */}
                <div className="absolute inset-0 rounded-[2px] bg-kv-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-150 -z-10" />
              </div>

              <span className="text-[13px] text-kv-secondary group-hover:text-kv-primary transition-colors duration-150 select-none">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-6">
      {/* Sort Section */}
      <div className="pb-2">
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-kv-border/70 to-transparent" />

      {/* Filter Groups */}
      <FilterGroup
        title="Varumärke"
        options={["Seiko", "Tissot", "Boss", "Michael Kors"]}
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
        }
      />

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-kv-border/40 to-transparent" />

      <FilterGroup
        title="Kön"
        options={["Herr", "Dam", "Unisex"]}
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        }
      />

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-kv-border/40 to-transparent" />

      <FilterGroup
        title="Urverk"
        options={["Automatiskt", "Kvarts", "Mekaniskt"]}
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-kv-border/40 to-transparent" />

      <FilterGroup
        title="Armband"
        options={["Läder", "Rostfritt stål", "Gummi", "Tyg"]}
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        }
      />
    </div>
  )
}

export default RefinementList
