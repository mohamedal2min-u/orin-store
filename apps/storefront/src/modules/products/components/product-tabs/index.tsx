"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  // Extract specs for inline display
  const quickSpecs: [string, string][] = []
  if (product.metadata) {
    const specKeys = ["spec_Urverkstyp", "spec_Diameter", "spec_Glastyp", "spec_Vattentäthet", "spec_Armbandstyp", "spec_Material på boett"]
    specKeys.forEach(key => {
      const val = product.metadata?.[key]
      if (val && typeof val === "string") {
        const label = key.replace("spec_", "")
        quickSpecs.push([label, val])
      }
    })
  }

  const tabs = [
    {
      label: "Produktinformation",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Specifikationer",
      component: <SpecsTab quickSpecs={quickSpecs} />,
    },
    {
      label: "Leverans & Retur",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

/* ── Produktinformation Tab ── */
const ProductInfoTab = ({ product }: { product: HttpTypes.StoreProduct }) => (
  <div className="py-2 text-[14px] text-[#555] leading-relaxed">
    {product.description ? (
      <p className="whitespace-pre-line">{product.description}</p>
    ) : (
      <p>
        Alla klockor i vårt sortiment är noggrant utvalda för kvalitet och design.
        Varje produkt levereras i originalförpackning med tillhörande dokument.
      </p>
    )}
  </div>
)

/* ── Specs Tab ── */
const SpecsTab = ({ quickSpecs }: { quickSpecs: [string, string][] }) => (
  <div className="py-2">
    {quickSpecs.length > 0 ? (
      <div className="flex flex-col">
        {quickSpecs.map(([key, value]) => (
          <div key={key} className="flex justify-between items-center py-2.5 border-b border-[#eee] last:border-0">
            <span className="text-[13px] text-[#888]">{key}</span>
            <span className="text-[13px] font-medium text-[#333]">{value}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-[13px] text-[#888]">
        Inga detaljerade specifikationer tillgängliga.
      </p>
    )}
  </div>
)

/* ── Shipping Tab ── */
const ShippingInfoTab = () => (
  <div className="py-2 flex flex-col gap-3 text-[13px] text-[#555] leading-relaxed">
    <p>
      <strong className="text-[#333]">Leverans:</strong> Ditt paket levereras normalt inom 1–3 arbetsdagar.
      Fri frakt för ordrar över 1 000 kr.
    </p>
    <p>
      <strong className="text-[#333]">Retur:</strong> Du har 14 dagars ångerrätt.
      Varan ska returneras i originalskick och originalförpackning.
    </p>
  </div>
)

export default ProductTabs
