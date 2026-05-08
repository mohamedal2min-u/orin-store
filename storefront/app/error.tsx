"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error reporting service when one is added (e.g. Sentry)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <h1 className="text-4xl font-bold mb-4">Något gick fel</h1>
        <p className="text-text-muted mb-8 leading-relaxed">
          Ett oväntat fel uppstod. Försök igen eller gå tillbaka till startsidan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Försök igen
          </button>
          <Link href="/" className="btn-primary" style={{ background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-border-dark)" }}>
            Till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}
