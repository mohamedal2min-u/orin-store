import { ExecArgs } from "@medusajs/framework/types"

export default async function checkStoreApi({ container }: ExecArgs) {
  const query = container.resolve("query")

  // Get price sets and their prices (base + price list)
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
    pagination: { take: 3 },
  })

  console.log("=== VARIANT PRICES IN DB ===")
  for (const v of variants) {
    console.log(`\nVariant: ${v.sku} | price_set: ${v.price_set?.id}`)
    const prices: any[] = v.price_set?.prices || []
    if (prices.length === 0) {
      console.log("  NO PRICES!")
    }
    for (const p of prices) {
      const tag = p.price_list_id ? `SALE (plist: ${p.price_list_id})` : "BASE"
      console.log(`  [${tag}] ${p.amount} ${p.currency_code}`)
    }
  }

  // Now test the store HTTP endpoint directly
  console.log("\n=== STORE API TEST ===")
  try {
    const regionModule = container.resolve("region")
    const regions = await regionModule.listRegions({})
    console.log("Regions found:", regions.map((r: any) => `${r.id} (${r.name})`).join(", "))

    const region = regions[0]
    if (!region) {
      console.log("No regions found!")
      return
    }

    // Use Medusa's query with pricing context
    const { data: pricedVariants } = await query.graph({
      entity: "product_variant",
      fields: [
        "id", "sku",
        "calculated_price.calculated_amount",
        "calculated_price.original_amount",
        "calculated_price.is_calculated_price_price_list",
        "calculated_price.calculated_price.price_list_type",
      ],
      pagination: { take: 2 },
      context: {
        currency_code: "sek",
        region_id: region.id,
      } as any,
    })

    console.log("\nCalculated prices with context:")
    for (const v of pricedVariants) {
      const cp = (v as any).calculated_price
      console.log(`\n  ${v.sku}:`)
      console.log(`    calculated_amount: ${cp?.calculated_amount}`)
      console.log(`    original_amount: ${cp?.original_amount}`)
      console.log(`    is_price_list: ${cp?.is_calculated_price_price_list}`)
      console.log(`    price_list_type: ${cp?.calculated_price?.price_list_type}`)
    }
  } catch (e: any) {
    console.log("Error:", e.message)
  }
}
