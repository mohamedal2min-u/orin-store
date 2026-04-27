import React from "react"

const TrustSection = () => {
  return (
    <div className="bg-kv-surface border-y border-kv-border">
      <div className="content-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:gap-x-12">
          {/* Authentic Products */}
          <div className="flex flex-col items-center text-center gap-y-4">
            <div className="w-12 h-12 flex items-center justify-center bg-kv-bg border border-kv-border text-kv-accent">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-[14px] font-semibold tracking-kv-wide uppercase text-kv-primary">
                Äkta produkter
              </h3>
              <p className="text-[13px] text-kv-secondary leading-relaxed">
                Vi garanterar 100% äkthet på alla våra klockor.
              </p>
            </div>
          </div>

          {/* Fast Delivery */}
          <div className="flex flex-col items-center text-center gap-y-4">
            <div className="w-12 h-12 flex items-center justify-center bg-kv-bg border border-kv-border text-kv-accent">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-[14px] font-semibold tracking-kv-wide uppercase text-kv-primary">
                Snabb leverans
              </h3>
              <p className="text-[13px] text-kv-secondary leading-relaxed">
                Fri frakt över 1000 kr och snabb hantering av din order.
              </p>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="flex flex-col items-center text-center gap-y-4">
            <div className="w-12 h-12 flex items-center justify-center bg-kv-bg border border-kv-border text-kv-accent">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-[14px] font-semibold tracking-kv-wide uppercase text-kv-primary">
                Trygg betalning
              </h3>
              <p className="text-[13px] text-kv-secondary leading-relaxed">
                Säkra betalningar med Stripe och ledande svenska banker.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrustSection
