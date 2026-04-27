"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import FilterBar from "../filter-bar"
import FilterDrawer from "../filter-drawer"
import { SortOptions } from "../refinement-list/sort-products"

type StoreFilterWrapperProps = {
  sortBy: SortOptions
  productCount: number
}

const StoreFilterWrapper = ({ sortBy, productCount }: StoreFilterWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueryParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <FilterBar
        openDrawer={() => setIsOpen(true)}
        productCount={productCount}
        sortBy={sortBy}
        setQueryParams={setQueryParams}
      />
      <FilterDrawer
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        sortBy={sortBy}
      />
    </>
  )
}

export default StoreFilterWrapper
