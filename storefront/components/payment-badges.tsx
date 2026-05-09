// Static SVG-based payment trust badges shown in the footer.
// Replace with official brand assets when available — these are
// original designs that convey payment method availability.

export function StripeBadge() {
  return (
    <div className="payment-badge" aria-label="Betalning via Stripe">
      {/* Generic card icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
      <span>Stripe</span>
    </div>
  );
}

export function KlarnaBadge() {
  return (
    <div className="payment-badge payment-badge--klarna" aria-label="Betalning via Klarna">
      {/* K mark */}
      <svg
        width="14"
        height="18"
        viewBox="0 0 14 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0 0h3v20H0V0zm10.5 10L14 20h-3.5L7 10 10.5 0H14L10.5 10z" />
      </svg>
      <span>Klarna</span>
    </div>
  );
}

export function CardBrands() {
  return (
    <div className="payment-badge-row">
      <StripeBadge />
      <KlarnaBadge />
    </div>
  );
}
