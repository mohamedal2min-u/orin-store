import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-kv-bg relative small:min-h-screen">
      <div className="h-16 bg-kv-bg border-b border-kv-border">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-kv-secondary flex items-center gap-x-2 uppercase flex-1 basis-0 hover:text-kv-primary transition-colors"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus">
              Tillbaka till varukorgen
            </span>
            <span className="mt-px block small:hidden txt-compact-plus">
              Tillbaka
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="txt-compact-xlarge-plus text-kv-primary hover:text-kv-accent uppercase tracking-kv-wider transition-colors"
            data-testid="store-link"
          >
            ORIN
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
