import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookies — ORIN",
  description:
    "Information om hur ORIN använder cookies för att förbättra din användarupplevelse.",
}

export default function CookiesPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-kv-surface border-b border-kv-border">
        <div className="content-container py-10">
          <h1 className="text-[28px] font-light tracking-kv-wide uppercase text-kv-primary">
            Cookies
          </h1>
          <p className="text-[13px] text-kv-secondary mt-2 tracking-[0.03em]">
            Vi använder cookies för att göra din upplevelse bättre.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16">
        <div className="max-w-[680px] flex flex-col gap-10">
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Vad är cookies?
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              En cookie är en liten textfil som sparas på din dator eller mobila enhet när du besöker en webbplats. Den hjälper webbplatsen att komma ihåg dina inställningar och val under en viss tid.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Hur vi använder cookies
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              ORIN använder cookies för att:
            </p>
            <ul className="list-disc ml-5 mt-3 flex flex-col gap-2 text-[15px] text-kv-secondary">
              <li>Hålla reda på vilka produkter du lagt i varukorgen.</li>
              <li>Spara dina språkinställningar och landval.</li>
              <li>Samla in anonym statistik för att förbättra vår webbplats.</li>
              <li>Anpassa marknadsföring och visa relevanta annonser.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Hantera cookies
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Du kan själv välja att blockera eller radera cookies i din webbläsare. Observera att vissa funktioner på webbplatsen (som varukorgen) kan sluta fungera om du väljer att blockera alla cookies.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
