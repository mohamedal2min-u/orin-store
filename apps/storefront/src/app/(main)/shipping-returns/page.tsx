import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Frakt & Returer — ORIN",
  description:
    "Information om leveranstider, fraktkostnader och hur du returnerar din vara.",
}

export default function ShippingPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-kv-surface border-b border-kv-border">
        <div className="content-container py-10">
          <h1 className="text-[28px] font-light tracking-kv-wide uppercase text-kv-primary">
            Frakt & Returer
          </h1>
          <p className="text-[13px] text-kv-secondary mt-2 tracking-[0.03em]">
            Vi gör det enkelt att handla och returnera.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16">
        <div className="max-w-[680px] flex flex-col gap-10">
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Frakt & Leverans
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Vi erbjuder snabb leverans inom Sverige via PostNord eller DHL. Normal leveranstid är 2-4 arbetsdagar.
            </p>
            <ul className="list-disc ml-5 mt-3 flex flex-col gap-2 text-[15px] text-kv-secondary">
              <li>Standardfrakt: 49 SEK (Fri frakt vid köp över 1000 SEK).</li>
              <li>Expressleverans: 99 SEK.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Returer
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Du har 14 dagars öppet köp från det att du mottagit din vara. För att en retur ska godkännas måste varan vara oanvänd och ligga i sin originalförpackning med alla etiketter kvar.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Hur gör jag en retur?
            </h2>
            <ol className="list-decimal ml-5 mt-3 flex flex-col gap-2 text-[15px] text-kv-secondary">
              <li>Kontakta oss på support@kronvard.se för en retursedel.</li>
              <li>Packa klockan noga i originalboxen.</li>
              <li>Lämna in paketet hos ditt närmaste ombud.</li>
            </ol>
            <p className="text-[14px] text-kv-secondary mt-4">
              Återbetalning sker senast 10 dagar efter att vi mottagit och godkänt din retur.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
