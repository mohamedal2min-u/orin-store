import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Köpvillkor — ORIN",
  description:
    "Allmänna villkor för köp hos ORIN — Stockholm Atelier.",
}

export default function TermsPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-kv-surface border-b border-kv-border">
        <div className="content-container py-10">
          <h1 className="text-[28px] font-light tracking-kv-wide uppercase text-kv-primary">
            Köpvillkor
          </h1>
          <p className="text-[13px] text-kv-secondary mt-2 tracking-[0.03em]">
            Dessa villkor gäller för alla beställningar på ORIN.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16">
        <div className="max-w-[680px] flex flex-col gap-10">
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              1. Allmänt
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Genom att göra en beställning hos ORIN godkänner du våra köpvillkor. För att handla hos oss måste du vara minst 18 år eller ha målsmans godkännande.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              2. Priser och Betalning
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Alla priser anges i svenska kronor (SEK) inklusive moms. Vi erbjuder säkra betalningar via kort och faktura. Vi förbehåller oss rätten att justera priser vid uppenbara felskrivningar.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              3. Leverans
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Vi levererar inom Sverige. Normal leveranstid är 2-5 arbetsdagar. Vid eventuella leveransförseningar kommer vi att meddela dig via e-post.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              4. Ångerrätt
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Enligt distansavtalslagen har du som konsument rätt att ångra ditt köp inom 14 dagar från det att du mottagit varan. Varan måste returneras i originalskick med alla originalförpackningar och tillbehör.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              5. Reklamation
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Om en vara är skadad eller felaktig vid ankomst har du rätt att reklamera den. Kontakta vår kundtjänst så snart som möjligt för hjälp med returfrakt och ersättning.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
