"use client"

import { SortOptions } from "../refinement-list/sort-products"

type FilterBarProps = {
  openDrawer: () => void
  productCount: number
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
}

const sortOptions = [
  { value: "created_at", label: "Nyast" },
  { value: "price_asc", label: "Pris: lågt till högt" },
  { value: "price_desc", label: "Pris: högt till lågt" },
]

const FilterIcon = () => (
  <svg
    className="w-[14px] h-[14px]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  </svg>
)

const GridIcon = ({ cols }: { cols: number }) => (
  <svg
    className="w-[16px] h-[16px]"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    {cols === 3 ? (
      <>
        <rect x="0" y="0" width="4.5" height="4.5" rx="0.5" />
        <rect x="5.75" y="0" width="4.5" height="4.5" rx="0.5" />
        <rect x="11.5" y="0" width="4.5" height="4.5" rx="0.5" />
        <rect x="0" y="5.75" width="4.5" height="4.5" rx="0.5" />
        <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.5" />
        <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.5" />
        <rect x="0" y="11.5" width="4.5" height="4.5" rx="0.5" />
        <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.5" />
        <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.5" />
      </>
    ) : (
      <>
        <rect x="0" y="0" width="7" height="7" rx="0.5" />
        <rect x="9" y="0" width="7" height="7" rx="0.5" />
        <rect x="0" y="9" width="7" height="7" rx="0.5" />
        <rect x="9" y="9" width="7" height="7" rx="0.5" />
      </>
    )}
  </svg>
)

const FilterBar = ({
  openDrawer,
  productCount,
  sortBy,
  setQueryParams,
}: FilterBarProps) => {
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || "Sortera"

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-b border-kv-border/60 mb-8">
      {/* Left side */}
      <div className="flex items-center gap-5">
        {/* Filter Trigger */}
        <button
          onClick={openDrawer}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-kv-primary text-kv-bg text-[11px] font-semibold uppercase tracking-[0.14em] rounded-sm shadow-sm hover:shadow-md hover:bg-kv-primary/90 transition-all duration-200"
          aria-label="Öppna filtermenyn"
        >
          <FilterIcon />
          <span>Filtrera</span>
          <span className="w-[1px] h-3 bg-kv-bg/20 mx-0.5" />
          <span className="text-kv-bg/60 font-normal text-[10px]">{productCount}</span>
        </button>

        {/* Product Count Label */}
        <span className="hidden small:inline text-[12px] text-kv-secondary tracking-wide">
          {productCount} {productCount === 1 ? "artikel" : "artiklar"}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-kv-secondary tracking-[0.14em] uppercase font-medium">
            Sortera:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setQueryParams("sortBy", e.target.value)}
            className="bg-transparent text-[12px] font-medium text-kv-primary border-none focus:ring-0 cursor-pointer p-0 pr-5 appearance-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B635B\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              backgroundSize: '0.85rem',
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid view toggle — desktop only */}
        <div className="hidden small:flex items-center gap-1.5 border-l border-kv-border/50 pl-5">
          <button
            className="p-1.5 text-kv-secondary hover:text-kv-primary transition-colors duration-150"
            aria-label="Visa 2 kolumner"
          >
            <GridIcon cols={2} />
          </button>
          <button
            className="p-1.5 text-kv-primary"
            aria-label="Visa 3 kolumner"
          >
            <GridIcon cols={3} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
