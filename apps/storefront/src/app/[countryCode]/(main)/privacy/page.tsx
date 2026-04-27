import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Integritetspolicy — ORIN",
  description:
    "Information om hur ORIN samlar in, använder och skyddar dina personuppgifter.",
}

export default function PrivacyPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-kv-surface border-b border-kv-border">
        <div className="content-container py-10">
          <h1 className="text-[28px] font-light tracking-kv-wide uppercase text-kv-primary">
            Integritetspolicy
          </h1>
          <p className="text-[13px] text-kv-secondary mt-2 tracking-[0.03em]">
            Senast uppdaterad: 27 april 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16">
        <div className="max-w-[680px] flex flex-col gap-10">
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              1. Information vi samlar in
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              ORIN samlar in information som är nödvändig för att kunna hantera din beställning och erbjuda en god kundupplevelse. Detta inkluderar namn, adress, e-postadress, telefonnummer och betalningsinformation.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              2. Hur vi använder din information
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Vi använder dina uppgifter för att:
            </p>
            <ul className="list-disc ml-5 mt-3 flex flex-col gap-2 text-[15px] text-kv-secondary">
              <li>Hantera och leverera dina beställningar.</li>
              <li>Kommunicera med dig gällande din order.</li>
              <li>Skicka nyhetsbrev (om du valt att prenumerera).</li>
              <li>Förbättra vår webbplats och våra tjänster.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              3. Datasäkerhet
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Vi vidtar alla rimliga åtgärder för att skydda dina personuppgifter från obehörig åtkomst. Vi använder krypterade anslutningar vid betalning och lagrar endast information hos betrodda partners.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              4. Dina rättigheter
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Du har rätt att när som helst begära ut information om de uppgifter vi har lagrade om dig, samt begära att de rättas eller raderas.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              5. Kontakt
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Om du har frågor om vår integritetspolicy är du välkommen att kontakta oss på hej@kronvard.se.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
