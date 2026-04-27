import { 
  IPricingModuleService, 
  IProductModuleService,
  IMedusaContainer 
} from "@medusajs/types"
import { ExecArgs } from "@medusajs/framework/types"
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

export default async function fixPrices({ container }: ExecArgs) {
  console.log("Fixing prices for all products...")

  const productModule: IProductModuleService = container.resolve("product")
  const pricingModule: IPricingModuleService = container.resolve("pricing")
  const remoteLink = container.resolve("remoteLink")

  const csvContent = fs.readFileSync(CSV_PATH, "utf8").replace(/^\uFEFF/, "")
  const lines = csvContent.split(/\r?\n/)
  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).filter(l => l.trim() !== "").map(parseCSVLine)

  for (const row of rows) {
    const data: Record<string, string> = {}
    headers.forEach((h, i) => {
      data[h] = row[i]
    })

    const sku = data["SKU"]
    const regularPrice = parseFloat(data["Regular price"]) || 0
    const salePrice = parseFloat(data["Sale price"]) || 0
    const finalPrice = salePrice > 0 ? salePrice : regularPrice

    if (!sku || finalPrice === 0) continue

    const variants = await productModule.listProductVariants({ sku: sku })
    if (variants.length === 0) {
      console.log(`Variant not found for SKU: ${sku}`)
      continue
    }

    const variant = variants[0]

    console.log(`Updating price for ${sku}: ${finalPrice} SEK`)

    // 1. Create Price Set
    const priceSet = await pricingModule.createPriceSets({
      prices: [
        {
          amount: finalPrice,
          currency_code: "sek"
        }
      ]
    })

    // 2. Link Price Set to Variant
    await remoteLink.create([
      {
        ["product"]: {
          variant_id: variant.id,
        },
        ["pricing"]: {
          price_set_id: priceSet.id,
        },
      },
    ])

    console.log(`Linked price set ${priceSet.id} to variant ${variant.id}`)
  }

  console.log("Price fix completed!")
}
