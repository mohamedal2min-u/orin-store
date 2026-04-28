import { IPricingModuleService } from "@medusajs/types"
import { ExecArgs } from "@medusajs/framework/types"

export default async function checkDiscountStatus({ container }: ExecArgs) {
  const pricingModule: IPricingModuleService = container.resolve("pricing")
  const query = container.resolve("query")

  // 1. Check price lists
  const allPriceLists = await pricingModule.listPriceLists({})
  console.log("\n=== PRICE LISTS ===")
  for (const pl of allPriceLists) {
    console.log(`  [${pl.id}] "${pl.title}" | type=${pl.type} | status=${pl.status}`)
  }

  // 2. Check prices in the 10% price list
  const salePriceList = allPriceLists.find(pl => pl.title === "10% Off All Products")
  if (salePriceList) {
    const salePrices = await pricingModule.listPrices({ price_list_id: salePriceList.id })
    console.log(`\n=== PRICES IN "10% Off All Products" (first 5) ===`)
    for (const p of salePrices.slice(0, 5)) {
      console.log(`  amount=${p.amount} | currency=${p.currency_code} | price_set_id=${(p as any).price_set_id}`)
    }
    console.log(`  ... total: ${salePrices.length} prices`)
  } else {
    console.log("\n❌ Price list '10% Off All Products' NOT FOUND!")
  }

  // 3. Check a variant's full price data via query.graph
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: [
      "id", "sku",
      "price_set.id",
      "price_set.prices.id",
      "price_set.prices.amount",
      "price_set.prices.currency_code",
      "price_set.prices.price_list_id",
    ],
    pagination: { take: 2 },
  })

  console.log("\n=== SAMPLE VARIANT PRICES (first 2 variants) ===")
  for (const v of variants) {
    console.log(`\nVariant: ${v.sku || v.id}`)
    console.log(`  price_set_id: ${v.price_set?.id}`)
    const prices: any[] = v.price_set?.prices || []
    for (const p of prices) {
      const tag = p.price_list_id ? `[PRICE LIST: ${p.price_list_id}]` : "[BASE]"
      console.log(`  ${tag} ${p.amount} ${p.currency_code}`)
    }
  }
}
