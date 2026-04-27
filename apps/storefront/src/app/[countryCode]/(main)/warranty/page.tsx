import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Garanti — ORIN",
  description:
    "Läs om ORINs garanti och försäkring för dina armbandsur.",
}

export default function WarrantyPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-kv-surface border-b border-kv-border">
        <div className="content-container py-10">
          <h1 className="text-[28px] font-light tracking-kv-wide uppercase text-kv-primary">
            Garanti
          </h1>
          <p className="text-[13px] text-kv-secondary mt-2 tracking-[0.03em]">
            Din trygghet vid köp av kvalitetsklockor.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16">
        <div className="max-w-[680px] flex flex-col gap-10">
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Vår garanti
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Vi på ORIN vill att du ska känna dig helt trygg med din nya klocka. Därför erbjuder vi 2 års garanti på alla våra klockor, utöver de rättigheter du har enligt konsumentköplagen.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Vad täcker garantin?
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Garantin täcker fabrikationsfel och fel i urverket. Om klockan stannar eller visar tiden felaktigt på grund av interna fel under garantiperioden åtgärdar vi detta utan extra kostnad.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Vad täcker inte garantin?
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Garantin omfattar inte yttre skador orsakade av normalt slitage eller ovarsam hantering, såsom:
            </p>
            <ul className="list-disc ml-5 mt-3 flex flex-col gap-2 text-[15px] text-kv-secondary">
              <li>Repor på glas eller boett.</li>
              <li>Slitage på läderband eller länk.</li>
              <li>Vattenskador (om klockan inte är klassad för bad/dykning).</li>
              <li>Batteribyten efter 6 månader.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Hur gör jag ett garantiärende?
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Kontakta oss på support@kronvard.se med ditt ordernummer och en beskrivning av felet. Bifoga gärna en bild om felet är synligt. Vi återkommer sedan med instruktioner för insändning.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
