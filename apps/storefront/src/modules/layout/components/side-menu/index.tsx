"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"

const mainNavItems = [
  { name: "Alla klockor", href: "/store" },
  { name: "Nyheter", href: "/store?sortBy=created_at" },
]

// TODO: replace with real Medusa category handle once created in admin
const categories = [
  { name: "Herrklockor", href: "/store" },
  { name: "Damklockor", href: "/store" },
  { name: "Automatiska klockor", href: "/store" },
  { name: "Quartz-klockor", href: "/store" },
  { name: "Dressklockor", href: "/store" },
  { name: "Sportklockor", href: "/store" },
]

// TODO: replace with real Medusa collection handle once created in admin
const brands = [
  { name: "Seiko", href: "/store" },
  { name: "Tissot", href: "/store" },
  { name: "Boss", href: "/store" },
  { name: "Michael Kors", href: "/store" },
  { name: "Citizen", href: "/store" },
]

const bottomItems = [
  { name: "Mitt konto", href: "/account" },
  { name: "Varukorg", href: "/cart" },
  { name: "Om oss", href: "/about" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const HamburgerIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
)

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggle = useToggleState()
  const languageToggle = useToggleState()

  return (
    <div className="h-full flex items-center">
      <Popover className="h-full flex">
        {({ open, close }) => (
          <>
            <Popover.Button
              data-testid="nav-menu-button"
              className="flex items-center text-kv-secondary hover:text-kv-primary transition-colors duration-200 focus:outline-none"
              aria-label="Öppna meny"
            >
              <HamburgerIcon />
            </Popover.Button>

            {open && (
              <div
                className="fixed inset-0 z-[50] bg-kv-primary/20"
                onClick={close}
                data-testid="side-menu-backdrop"
              />
            )}

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-250"
              enterFrom="opacity-0 -translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 -translate-x-4"
            >
              <PopoverPanel className="fixed top-0 left-0 h-full w-[300px] z-[51] bg-kv-bg border-r border-kv-border overflow-y-auto flex flex-col">
                <div data-testid="nav-menu-popup" className="flex flex-col h-full">

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-kv-border flex-shrink-0">
                    <span className="text-[13px] font-semibold tracking-kv-wide uppercase text-kv-primary">
                      Meny
                    </span>
                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      className="text-kv-secondary hover:text-kv-primary transition-colors"
                      aria-label="Stäng meny"
                    >
                      <XMark />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">

                    {/* Main links */}
                    <ul className="flex flex-col gap-1">
                      {mainNavItems.map(({ name, href }) => (
                        <li key={name}>
                          <LocalizedClientLink
                            href={href}
                            className="block py-2 text-[15px] text-kv-primary hover:text-kv-accent transition-colors duration-150"
                            onClick={close}
                            data-testid={`${name.toLowerCase().replace(/ /g, "-")}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>

                    {/* Categories */}
                    <div>
                      <p className="text-[11px] font-medium tracking-kv-wider uppercase text-kv-secondary mb-3">
                        Kategorier
                      </p>
                      <ul className="flex flex-col gap-1">
                        {categories.map(({ name, href }) => (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="block py-2 text-[14px] text-kv-secondary hover:text-kv-primary transition-colors duration-150"
                              onClick={close}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Brands */}
                    <div>
                      <p className="text-[11px] font-medium tracking-kv-wider uppercase text-kv-secondary mb-3">
                        Varumärken
                      </p>
                      <ul className="flex flex-col gap-1">
                        {brands.map(({ name, href }) => (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="block py-2 text-[14px] text-kv-secondary hover:text-kv-primary transition-colors duration-150"
                              onClick={close}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Account & other */}
                    <div className="border-t border-kv-border pt-6">
                      <ul className="flex flex-col gap-1">
                        {bottomItems.map(({ name, href }) => (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="block py-2 text-[14px] text-kv-secondary hover:text-kv-primary transition-colors duration-150"
                              onClick={close}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-5 border-t border-kv-border flex flex-col gap-4 flex-shrink-0">
                    {!!locales?.length && (
                      <div
                        className="flex justify-between items-center"
                        onMouseEnter={languageToggle.open}
                        onMouseLeave={languageToggle.close}
                      >
                        <LanguageSelect
                          toggleState={languageToggle}
                          locales={locales}
                          currentLocale={currentLocale}
                        />
                        <ArrowRightMini
                          className={clx("transition-transform duration-150", {
                            "-rotate-90": languageToggle.state,
                          })}
                        />
                      </div>
                    )}
                    {regions && (
                      <div
                        className="flex justify-between items-center"
                        onMouseEnter={countryToggle.open}
                        onMouseLeave={countryToggle.close}
                      >
                        <CountrySelect
                          toggleState={countryToggle}
                          regions={regions}
                        />
                        <ArrowRightMini
                          className={clx("transition-transform duration-150", {
                            "-rotate-90": countryToggle.state,
                          })}
                        />
                      </div>
                    )}
                    <Text className="txt-compact-small text-kv-secondary">
                      © {new Date().getFullYear()} ORIN. Alla rättigheter
                      förbehållna.
                    </Text>
                  </div>

                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
