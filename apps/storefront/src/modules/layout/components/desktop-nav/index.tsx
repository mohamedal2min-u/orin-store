"use client"

import { useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const brands = [
  // TODO: replace with real Medusa collection handle once created in admin
  { name: "Seiko", href: "/store" },
  { name: "Tissot", href: "/store" },
  { name: "Boss", href: "/store" },
  { name: "Michael Kors", href: "/store" },
  { name: "Citizen", href: "/store" },
]

const watchCategories = [
  // TODO: replace with real Medusa category handle once created in admin
  { name: "Herrklockor", href: "/store" },
  { name: "Damklockor", href: "/store" },
  { name: "Automatiska klockor", href: "/store" },
  { name: "Quartz-klockor", href: "/store" },
  { name: "Dressklockor", href: "/store" },
  { name: "Sportklockor", href: "/store" },
]

type SubItem = { name: string; href: string }

type NavItem = {
  name: string
  href?: string
  dropdown?: SubItem[]
}

const NAV_ITEMS: NavItem[] = [
  { name: "Klockor", href: "/store", dropdown: watchCategories },
  { name: "Varumärken", dropdown: brands },
  // TODO: replace with real Medusa category handle once created in admin
  { name: "Herrklockor", href: "/store" },
  { name: "Damklockor", href: "/store" },
  { name: "Nyheter", href: "/store?sortBy=created_at" },
  { name: "Om oss", href: "/about" },
]

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

export default function DesktopNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(name)
  }

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  const close = () => setOpenMenu(null)

  return (
    <div className="hidden small:flex items-center gap-x-7 h-full">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.name}
          className="relative h-full flex items-center"
          onMouseEnter={() => item.dropdown && handleEnter(item.name)}
          onMouseLeave={() => item.dropdown && handleLeave()}
        >
          {item.href ? (
            <LocalizedClientLink
              href={item.href}
              className="text-[13px] tracking-[0.04em] text-kv-secondary hover:text-kv-primary transition-colors duration-200 whitespace-nowrap flex items-center gap-1"
            >
              {item.name}
              {item.dropdown && <ChevronDown open={openMenu === item.name} />}
            </LocalizedClientLink>
          ) : (
            <button
              className="text-[13px] tracking-[0.04em] text-kv-secondary hover:text-kv-primary transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
              aria-expanded={openMenu === item.name}
              aria-haspopup="true"
              onClick={() =>
                setOpenMenu(openMenu === item.name ? null : item.name)
              }
            >
              {item.name}
              <ChevronDown open={openMenu === item.name} />
            </button>
          )}

          {item.dropdown && openMenu === item.name && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-px z-50"
              onMouseEnter={() => handleEnter(item.name)}
              onMouseLeave={handleLeave}
            >
              <div className="bg-kv-bg border border-kv-border shadow-[0_8px_32px_rgba(28,23,20,0.08)] min-w-[200px] py-2">
                {item.dropdown.map((sub) => (
                  <LocalizedClientLink
                    key={sub.name}
                    href={sub.href}
                    className="block px-5 py-2.5 text-[13px] tracking-[0.02em] text-kv-secondary hover:text-kv-primary hover:bg-kv-surface transition-colors duration-150 whitespace-nowrap"
                    onClick={close}
                  >
                    {sub.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
