// Premium payment method chips for the cart trust section.
// Uses crisp text labels with minimal SVG accents — sharp on every screen.
// Consistent sizing, alignment, and hover states across all methods.
import { KlarnaLogo, SwishLogo, VisaLogo, MastercardLogo } from './icons/payment-logos';
import { TruckIcon, SwapIcon } from './icons/icons';
const chip =
  "inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded " +
  "border border-border bg-white text-[11px] font-semibold tracking-wide text-text " +
  "transition-all duration-200 " +
  "hover:border-border-dark hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1";

/* ── Small geometric accent marks (crisp at any DPI) ── */


/* ── Payment chips ── */

export function PaymentTrustBlock() {
  return (
    <div className="mt-4 rounded border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-bg-secondary/50 border-b border-border flex items-center gap-2.5">
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5"
          className="text-accent shrink-0" aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
          Säker betalning
        </span>
      </div>

      {/* Chips grid */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap gap-2" role="list" aria-label="Betalningsmetoder">
          <span className={chip} role="listitem">
            <KlarnaLogo monochrome className="w-8 h-4 opacity-70" />
          </span>
          <span className={chip} role="listitem">
            <VisaLogo monochrome className="w-8 h-4 opacity-70" />
          </span>
          <span className={chip} role="listitem">
            <MastercardLogo monochrome className="w-8 h-4 opacity-70" />
          </span>
          <span className={chip} role="listitem">
            <SwishLogo monochrome className="w-10 h-4 opacity-70" />
          </span>
          <span className={chip} role="listitem">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0 opacity-70">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83Z" />
              <path d="M15 1c.1.89-.25 1.78-.82 2.42-.57.64-1.5 1.14-2.42 1.07-.12-.85.32-1.74.84-2.3.57-.6 1.55-1.05 2.4-1.19Z" />
            </svg>
            Apple Pay
          </span>
          <span className={chip} role="listitem">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 opacity-60">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174C7.989 19.574 4.5 15.968 4.5 11.5c0-4.457 3.489-8.074 7.74-8.074 2.506 0 4.185 1.067 5.142 1.99l3.498-3.37C18.558.887 15.68 0 12.24 0 5.7 0 .36 5.372.36 12s5.34 12 11.88 12c6.852 0 11.4-4.814 11.4-11.592 0-.78-.084-1.374-.186-1.968H12.24Z" fill="currentColor" />
            </svg>
            Google Pay
          </span>
        </div>
      </div>
    </div>
  );
}

export function GuaranteesBlock() {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <div className="p-3.5 rounded border border-border bg-white flex items-center gap-2.5 transition-colors hover:border-border-dark">
        <SwapIcon className="text-accent shrink-0" size={18} strokeWidth={1.5} />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider leading-none block">30 dagars</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider leading-none text-text-muted block mt-0.5">öppet köp</span>
        </div>
      </div>
      <div className="p-3.5 rounded border border-border bg-white flex items-center gap-2.5 transition-colors hover:border-border-dark">
        <TruckIcon className="text-accent shrink-0" size={18} strokeWidth={1.5} />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider leading-none block">Snabb</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider leading-none text-text-muted block mt-0.5">leverans</span>
        </div>
      </div>
    </div>
  );
}
