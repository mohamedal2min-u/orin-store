import { 
  IPricingModuleService, 
  IProductModuleService,
  IMedusaContainer 
} from "@medusajs/types"
import { ExecArgs } from "@medusajs/framework/types"
import { PriceListType } from "@medusajs/utils"
import * as fs from "fs"

const CSV_PATH = "C:\\Users\\moham\\Desktop\\wc-product-export-25-4-2026-1777124382337.csv"

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let cell = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cell += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cell.trim())
      cell = ""
    } else {
      cell += char
    }
  }
  result.push(cell.trim())
  return result
}

// Improved CSV parser
function parseCSV(content: string) {
  const lines = content.split(/\r?\n/).filter(l => l.trim() !== "")
  if (lines.length === 0) return { headers: [], rows: [] }
  
  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(parseCSVLine)
  
  return { headers, rows }
}

export default async function restoreDiscounts({ container }: ExecArgs) {
  console.log("Restoring discounted prices...")

  const productModule: IProductModuleService = container.resolve("product")
  const pricingModule: IPricingModuleService = container.resolve("pricing")
  const query = container.resolve("query")
  const remoteLink = container.resolve("remoteLink")

  const csvContent = fs.readFileSync(CSV_PATH, "utf8").replace(/^\uFEFF/, "")
  const { headers, rows } = parseCSV(csvContent)

  // 1. Ensure "Sale" Price List exists with correct rules
  let salePriceList: any
  const regionId = "reg_01KPY2G580VSC7KF8T74QW058R" // Sweden region
  const existingPriceLists = await pricingModule.listPriceLists({ title: "Summer Sale" })
  
  if (existingPriceLists.length > 0) {
    salePriceList = existingPriceLists[0]
    console.log(`Using existing Price List: ${salePriceList.title} (${salePriceList.id})`)
  } else {
    const createdLists = await pricingModule.createPriceLists([{
      title: "Summer Sale",
      description: "Restored from CSV import",
      type: PriceListType.SALE,
      status: "active",
      starts_at: new Date().toISOString(),
      rules: {
        region_id: [regionId]
      }
    }])
    salePriceList = createdLists[0]
    console.log(`Created new Price List: ${salePriceList.title} (${salePriceList.id}) with region rule`)
  }

  const salePricesToAdd: any[] = []

  for (const row of rows) {
    const data: Record<string, string> = {}
    headers.forEach((h, i) => {
      data[h] = row[i]
    })

    const sku = data["SKU"]
    const regularPrice = parseFloat(data["Regular price"]) || 0
    const salePrice = parseFloat(data["Sale price"]) || 0

    if (!sku || regularPrice === 0) continue

    const variants = await productModule.listProductVariants({ sku: sku })
    if (variants.length === 0) continue

    const variant = variants[0]

    // Find Price Set linked to variant using query.graph
    const { data: [variantData] } = await query.graph({
      entity: "product_variant",
      fields: ["id", "price_set.id"],
      filters: { id: variant.id }
    })
    
    let priceSetId = variantData?.price_set?.id

    if (!priceSetId) {
      // Create Price Set if missing
      const priceSets = await pricingModule.createPriceSets([{
        prices: [{ amount: regularPrice, currency_code: "sek" }]
      }])
      priceSetId = priceSets[0].id
      
      await remoteLink.create([
        {
          ["product"]: { variant_id: variant.id },
          ["pricing"]: { price_set_id: priceSetId },
        },
      ])
      console.log(`Created and linked Price Set for ${sku}`)
    } else {
      // Update regular price in Price Set
      const prices = await pricingModule.listPrices({ price_set_id: priceSetId })
      const sekPrice = prices.find(p => p.currency_code === "sek")
      
      if (sekPrice) {
        await pricingModule.updatePrices([{ id: sekPrice.id, amount: regularPrice }])
      } else {
        await pricingModule.addPrices([{ price_set_id: priceSetId, amount: regularPrice, currency_code: "sek" }])
      }
    }

    // Add to Sale Price List if salePrice exists
    if (salePrice > 0 && salePrice < regularPrice) {
      salePricesToAdd.push({
        amount: salePrice,
        currency_code: "sek",
        price_set_id: priceSetId,
        price_list_id: salePriceList.id
      })
      console.log(`Queued sale price for ${sku}: ${salePrice} SEK (Regular: ${regularPrice})`)
    }
  }

  if (salePricesToAdd.length > 0) {
    await pricingModule.updatePriceLists([{
      id: salePriceList.id,
      prices: salePricesToAdd.map(p => ({
        amount: p.amount,
        currency_code: p.currency_code,
        price_set_id: p.price_set_id
      }))
    }])
    console.log(`Successfully added ${salePricesToAdd.length} sale prices to the Price List.`)
  }

  console.log("Restoration complete!")
}
