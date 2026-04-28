import { IPricingModuleService } from "@medusajs/types"
import { ExecArgs } from "@medusajs/framework/types"
import { PriceListType } from "@medusajs/utils"

const DISCOUNT_PERCENT = 10
const PRICE_LIST_TITLE = "10% Off All Products"
const CURRENCY = "sek"
const REGION_ID = "reg_01KPY2G580VSC7KF8T74QW058R" // Sweden

export default async function applyDiscount10({ container }: ExecArgs) {
  console.log(`Applying ${DISCOUNT_PERCENT}% discount to all products...`)

  const pricingModule: IPricingModuleService = container.resolve("pricing")
  const query = container.resolve("query")

  // 1. Delete existing price list to avoid duplicates
  const existing = await pricingModule.listPriceLists({ title: PRICE_LIST_TITLE })
  if (existing.length > 0) {
    await pricingModule.deletePriceLists(existing.map((pl) => pl.id))
    console.log(`Deleted ${existing.length} old price list(s)`)
  }

  // 2. Collect base prices and calculate 10% off
  let offset = 0
  const batchSize = 100
  const discountedPrices: {
    amount: number
    currency_code: string
    price_set_id: string
    rules: Record<string, string>
  }[] = []

  let total = 0
  let skipped = 0

  while (true) {
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: ["id", "sku", "price_set.id"],
      pagination: { skip: offset, take: batchSize },
    })

    if (variants.length === 0) break

    for (const variant of variants) {
      total++
      const priceSetId = variant.price_set?.id
      if (!priceSetId) { skipped++; continue }

      const allPrices = await pricingModule.listPrices({ price_set_id: priceSetId })
      const basePrice = allPrices.find(
        (p) => p.currency_code === CURRENCY && !(p as any).price_list_id
      )

      if (!basePrice) { skipped++; continue }

      const originalAmount = basePrice.amount as number
      const discountedAmount = Math.round(originalAmount * (1 - DISCOUNT_PERCENT / 100))

      discountedPrices.push({
        amount: discountedAmount,
        currency_code: CURRENCY,
        price_set_id: priceSetId,
        rules: { region_id: REGION_ID },
      })

      console.log(`  ${variant.sku || variant.id}: ${originalAmount} → ${discountedAmount} ${CURRENCY.toUpperCase()}`)
    }

    if (variants.length < batchSize) break
    offset += batchSize
  }

  console.log(`\nProcessed ${total} variants (${skipped} skipped)`)

  if (discountedPrices.length === 0) {
    console.log("No prices found.")
    return
  }

  // 3. Create Price List with region rule + prices in one call
  const [priceList] = await pricingModule.createPriceLists([
    {
      title: PRICE_LIST_TITLE,
      description: `${DISCOUNT_PERCENT}% discount on all products`,
      type: PriceListType.SALE,
      status: "active",
      starts_at: new Date().toISOString(),
      rules: { region_id: [REGION_ID] },
      prices: discountedPrices,
    },
  ])

  console.log(`\n✓ Created Price List "${priceList.title}" (${priceList.id})`)
  console.log(`  ${discountedPrices.length} sale prices added with region rule.`)
}
