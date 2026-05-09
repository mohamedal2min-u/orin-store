type Props = { size?: number };

export function OrinPlaceholder({ size = 36 }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        className="text-border-dark"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="1" />
        <line x1="12" y1="3" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21" />
        <line x1="3" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21" y2="12" />
      </svg>
      <span className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-semibold">ORIN</span>
    </div>
  );
}
