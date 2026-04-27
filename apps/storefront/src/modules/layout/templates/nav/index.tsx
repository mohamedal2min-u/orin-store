import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import DesktopNav from "@modules/layout/components/desktop-nav"

const SearchIcon = () => (
  <svg
    className="w-[18px] h-[18px]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
    />
  </svg>
)

const AccountIcon = () => (
  <svg
    className="w-[18px] h-[18px]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
)

const CartFallbackIcon = () => (
  <svg
    className="w-[18px] h-[18px]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
    />
  </svg>
)

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <nav
          className="content-container flex items-center w-full h-full text-[13px] tracking-[0.04em] text-kv-secondary"
          aria-label="Huvudnavigation"
        >
          {/* Left: Mobile hamburger + Desktop logo */}
          <div className="flex items-center gap-x-5 flex-1">
            <div className="small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="hidden small:flex items-center gap-3 group"
              data-testid="nav-store-link"
            >
              {/* Logo mark */}
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-kv-primary group-hover:bg-kv-accent transition-colors duration-300">
                <span className="text-[10px] font-bold tracking-[0.08em] text-white">O</span>
              </div>
              <span className="text-[16px] font-semibold tracking-[0.12em] text-kv-primary uppercase">
                ORIN
              </span>
            </LocalizedClientLink>
          </div>

          {/* Center: Mobile logo + Desktop navigation */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="small:hidden flex items-center gap-2"
              data-testid="nav-store-link-mobile"
            >
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-kv-primary">
                <span className="text-[9px] font-bold tracking-[0.08em] text-white">O</span>
              </div>
              <span className="text-[15px] font-semibold tracking-[0.12em] text-kv-primary uppercase">
                ORIN
              </span>
            </LocalizedClientLink>
            <DesktopNav />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-x-5 h-full flex-1 justify-end">
            {/* Search — desktop only */}
            <button
              className="hidden small:flex items-center justify-center w-9 h-9 rounded-full hover:bg-kv-surface text-kv-secondary hover:text-kv-primary transition-all duration-200"
              aria-label="Sök"
            >
              <SearchIcon />
            </button>

            {/* Account — desktop only */}
            <LocalizedClientLink
              href="/account"
              className="hidden small:flex items-center justify-center w-9 h-9 rounded-full hover:bg-kv-surface text-kv-secondary hover:text-kv-primary transition-all duration-200"
              aria-label="Mitt konto"
              data-testid="nav-account-link"
            >
              <AccountIcon />
            </LocalizedClientLink>

            {/* Cart — always visible */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-kv-surface text-kv-secondary hover:text-kv-primary transition-all duration-200"
                  href="/cart"
                  data-testid="nav-cart-link"
                  aria-label="Varukorg"
                >
                  <CartFallbackIcon />
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
