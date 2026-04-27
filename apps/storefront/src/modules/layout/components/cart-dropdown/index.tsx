"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const BagIcon = () => (
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

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full flex items-center focus:outline-none">
          <LocalizedClientLink
            className="relative flex items-center text-kv-secondary hover:text-kv-primary transition-colors duration-200"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Varukorg, ${totalItems} varor`}
          >
            <BagIcon />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-kv-primary text-kv-bg text-[10px] font-semibold rounded-circle flex items-center justify-center leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-kv-bg border border-kv-border w-[380px] text-kv-primary shadow-[0_8px_32px_rgba(28,23,20,0.08)]"
            data-testid="nav-cart-dropdown"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-kv-border flex items-center justify-between">
              <h3 className="text-[13px] font-semibold tracking-kv-wide uppercase text-kv-primary">
                Varukorg
              </h3>
              {totalItems > 0 && (
                <span className="text-[12px] text-kv-secondary">
                  {totalItems} {totalItems === 1 ? "vara" : "varor"}
                </span>
              )}
            </div>

            {cartState && cartState.items?.length ? (
              <>
                {/* Items */}
                <div className="overflow-y-auto max-h-[360px] px-5 py-4 flex flex-col gap-6 no-scrollbar">
                  {cartState.items
                    .sort((a, b) =>
                      (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                    )
                    .map((item) => (
                      <div
                        className="grid grid-cols-[80px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>

                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-x-3">
                            <div className="flex flex-col min-w-0">
                              <LocalizedClientLink
                                href={`/products/${item.product_handle}`}
                                className="text-[13px] text-kv-primary hover:text-kv-accent transition-colors line-clamp-2"
                                data-testid="product-link"
                              >
                                {item.title}
                              </LocalizedClientLink>
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                              <span
                                className="text-[12px] text-kv-secondary mt-0.5"
                                data-testid="cart-item-quantity"
                                data-value={item.quantity}
                              >
                                Antal: {item.quantity}
                              </span>
                            </div>
                            <div className="flex-shrink-0">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-2 text-[12px] text-kv-secondary hover:text-kv-primary self-start"
                            data-testid="cart-item-remove-button"
                          >
                            Ta bort
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-kv-border flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-kv-secondary">
                      Delsumma{" "}
                      <span className="text-[12px]">(exkl. moms)</span>
                    </span>
                    <span
                      className="text-[14px] font-semibold text-kv-primary"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <LocalizedClientLink href="/checkout?step=address" passHref>
                      <Button
                        variant="primary"
                        size="large"
                        className="w-full"
                        data-testid="go-to-checkout-button"
                      >
                        Gå till kassan
                      </Button>
                    </LocalizedClientLink>
                    <LocalizedClientLink href="/cart" passHref>
                      <Button
                        variant="secondary"
                        size="large"
                        className="w-full"
                        data-testid="go-to-cart-button"
                        onClick={close}
                      >
                        Visa varukorg
                      </Button>
                    </LocalizedClientLink>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 flex flex-col gap-4 items-center justify-center px-5">
                <div className="w-10 h-10 border border-kv-border flex items-center justify-center text-kv-secondary">
                  <BagIcon />
                </div>
                <p className="text-[13px] text-kv-secondary text-center">
                  Din varukorg är tom.
                </p>
                <LocalizedClientLink href="/store">
                  <Button
                    onClick={close}
                    variant="secondary"
                  >
                    Utforska klockor
                  </Button>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
