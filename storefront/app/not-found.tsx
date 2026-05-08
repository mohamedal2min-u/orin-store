import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sidan hittades inte — ORIN",
  description: "Den sida du letar efter finns inte.",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
          404
        </span>
        <h1 className="text-4xl font-bold mb-4">Sidan hittades inte</h1>
        <p className="text-text-muted mb-8 leading-relaxed">
          Den sida du letar efter finns inte eller har flyttats. Kolla att
          adressen stämmer, eller gå tillbaka till startsidan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Till startsidan
          </Link>
          <Link href="/klockor" className="btn-primary" style={{ background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-border-dark)" }}>
            Se alla klockor
          </Link>
        </div>
      </div>
    </div>
  );
}
