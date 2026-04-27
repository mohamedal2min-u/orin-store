import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Om oss — ORIN",
  description:
    "ORIN är en svensk nätbutik för armbandsur. Vi erbjuder kurerade klockor från välkända varumärken med trygg leverans inom Sverige.",
  openGraph: {
    title: "Om oss — ORIN",
    description:
      "Läs mer om ORIN och vår passion för tidlösa armbandsur.",
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-kv-surface border-b border-kv-border">
        <div className="content-container py-10">
          <h1 className="text-[28px] font-light tracking-kv-wide uppercase text-kv-primary">
            Om oss
          </h1>
          <p className="text-[13px] text-kv-secondary mt-2 tracking-[0.03em]">
            Vår historia och våra värderingar
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16">
        <div className="max-w-[680px] flex flex-col gap-12">

          {/* Intro */}
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              ORIN
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              ORIN är en svensk nätbutik specialiserad på armbandsur av hög
              kvalitet. Vi har kurerat ett noggrant utvalt sortiment från
              välkända varumärken som Seiko, Tissot, Boss, Michael Kors och
              Citizen — klockor som kombinerar tidlös design med pålitlig
              funktion.
            </p>
          </section>

          {/* Philosophy */}
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Vår filosofi
            </h2>
            <p className="text-[15px] text-kv-secondary leading-relaxed">
              Vi tror att en välvald klocka är mer än bara ett tidmätningsinstrument
              — det är ett uttryck för personlighet och stil. Därför arbetar vi
              noga med att erbjuda ett sortiment som passar alla tillfällen,
              från vardagen till de mer festliga stunderna.
            </p>
          </section>

          {/* Why us */}
          <section>
            <h2 className="text-[18px] font-light tracking-kv-wide uppercase text-kv-primary mb-4">
              Varför välja oss
            </h2>
            <ul className="flex flex-col gap-4">
              {[
                {
                  title: "Kurerat urval",
                  desc: "Varje klocka i vårt sortiment är handplockat för kvalitet och design.",
                },
                {
                  title: "Trygg betalning",
                  desc: "Vi erbjuder säkra betalningsalternativ och krypterad checkout.",
                },
                {
                  title: "Leverans inom Sverige",
                  desc: "Snabb och pålitlig leverans till hela Sverige.",
                },
                {
                  title: "Kundservice",
                  desc: "Vi finns här för dig om du har frågor om din beställning eller en produkt.",
                },
              ].map(({ title, desc }) => (
                <li key={title} className="flex gap-4">
                  <span className="w-1 h-1 rounded-full bg-kv-primary mt-[10px] flex-shrink-0" />
                  <div>
                    <p className="text-[14px] font-medium text-kv-primary">{title}</p>
                    <p className="text-[13px] text-kv-secondary mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section className="border-t border-kv-border pt-10">
            <p className="text-[14px] text-kv-secondary mb-4">
              Redo att hitta din nästa klocka?
            </p>
            <LocalizedClientLink
              href="/store"
              className="inline-block px-6 py-3 text-[13px] tracking-kv-wide uppercase border border-kv-primary text-kv-primary hover:bg-kv-primary hover:text-kv-bg transition-colors duration-200"
            >
              Utforska klockor
            </LocalizedClientLink>
          </section>

        </div>
      </div>
    </>
  )
}
