import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "styles/globals.css"

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ORIN",
  url: getBaseURL(),
  description:
    "Ett noggrant urval av armbandsur från välkända varumärken — med tydliga priser, trygg betalning och leverans inom Sverige.",
  areaServed: "SE",
  knowsAbout: ["armbandsur", "lyxklockor", "schweiziska klockor"],
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "ORIN — Svenska Klockor",
    template: "%s | ORIN",
  },
  description:
    "Ett noggrant urval av armbandsur från välkända varumärken — med tydliga priser, trygg betalning och leverans inom Sverige.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: "ORIN",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="sv"
      data-mode="light"
      className={`${inter.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-kv-bg text-kv-primary antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
