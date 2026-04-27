import { Heading } from "@modules/common/components/ui"

type ProductSpecificationsProps = {
  specs?: Record<string, string | number> | null
}

const CATEGORIES: Record<string, string[]> = {
  "Modellöversikt": ["Märke", "Serie", "Ref.nr", "Kön", "Alternativa modellnummer", "EAN", "Garanti"],
  "Boett": ["Diameter", "Tjocklek", "Material på boett", "Boettfärg", "Glastyp", "Vattentäthet", "Lås"],
  "Urverk": ["Urverkstyp", "Urverk"],
  "Urtavla": ["Urtavlefärg", "Datumangivelse"],
  "Armband": ["Armbandstyp", "Färg på klockarmband"],
  "Funktioner": ["Funktioner"]
}

const ProductSpecifications = ({ specs }: ProductSpecificationsProps) => {
  if (!specs || typeof specs !== "object" || Object.keys(specs).length === 0) {
    return null
  }

  // Group specs by category
  const groupedSpecs: Record<string, [string, string | number][]> = {}
  const remainingSpecs = { ...specs }

  Object.entries(CATEGORIES).forEach(([category, keys]) => {
    const found: [string, string | number][] = []
    keys.forEach(key => {
      if (remainingSpecs[key]) {
        found.push([key, remainingSpecs[key]])
        delete remainingSpecs[key]
      }
    })
    if (found.length > 0) {
      groupedSpecs[category] = found
    }
  })

  // Add any remaining specs to "Övrigt"
  const leftover = Object.entries(remainingSpecs)
  if (leftover.length > 0) {
    groupedSpecs["Övrigt"] = leftover
  }

  return (
    <div className="border-t border-[#D9D3CC]/40 bg-[#FAF8F5]">
      <div className="content-container py-16 small:py-20">
        <div className="flex flex-col items-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B7355] mb-2">
            Detaljer
          </span>
          <Heading
            level="h2"
            className="text-[22px] small:text-[26px] font-light tracking-wide text-[#1C1714]"
          >
            Tekniska Specifikationer
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 max-w-[1100px] mx-auto">
          {Object.entries(groupedSpecs).map(([category, items]) => (
            <div key={category} className="flex flex-col">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1714] pb-3 mb-3 border-b border-[#1C1714]">
                {category}
              </h4>
              <div className="flex flex-col">
                {items.map(([key, value], index) => (
                  <div
                    key={key}
                    className="flex justify-between items-baseline gap-x-4 py-2.5 border-b border-[#D9D3CC]/30 last:border-0"
                  >
                    <span className="text-[13px] text-[#6B635B]">{key}</span>
                    <span className="text-[13px] font-medium text-[#1C1714] text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductSpecifications
