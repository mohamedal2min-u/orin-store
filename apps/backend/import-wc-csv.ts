import { 
  IProductModuleService, 
  IPricingModuleService, 
  IMedusaContainer,
  IRegionModuleService,
  ISalesChannelModuleService
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

export default async function importWCCSV({ container }: ExecArgs) {
  console.log("Starting product import from WooCommerce CSV...")

  const productModule: IProductModuleService = container.resolve("product")
  const pricingModule: IPricingModuleService = container.resolve("pricing")
  const regionModule: IRegionModuleService = container.resolve("region")
  const salesChannelModule: ISalesChannelModuleService = container.resolve("sales_channel")

  // Get default region or currency
  const regions = await regionModule.listRegions({})
  const sekRegion = regions.find(r => r.currency_code === "sek") || regions[0]
  
  if (!sekRegion) {
    console.error("No region found. Please create a region first.")
    return
  }

  // Get default sales channel
  const salesChannels = await salesChannelModule.listSalesChannels({})
  const defaultSalesChannel = salesChannels[0]

  const csvContent = fs.readFileSync(CSV_PATH, "utf8").replace(/^\uFEFF/, "")
  const lines = csvContent.split(/\r?\n/)
  if (lines.length < 2) {
    console.log("CSV is empty or only has header.")
    return
  }

  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).filter(l => l.trim() !== "").map(parseCSVLine)

  console.log(`Found ${rows.length} products to import.`)

  // Cache categories to avoid redundant creations
  const categoryCache: Record<string, any> = {}

  for (const row of rows) {
    const data: Record<string, string> = {}
    headers.forEach((h, i) => {
      data[h] = row[i]
    })

    const title = data["Name"]
    if (!title) continue

    console.log(`\n--- Processing: ${title} ---`)

    // 1. Handle Categories
    const categoryNames = data["Categories"] ? data["Categories"].split(",").map(c => c.trim()) : []
    const categoryIds: string[] = []

    for (const catName of categoryNames) {
      if (categoryCache[catName]) {
        categoryIds.push(categoryCache[catName].id)
      } else {
        let cat = (await productModule.listProductCategories({ name: catName }))[0]
        if (!cat) {
          console.log(`Creating category: ${catName}`)
          cat = await productModule.createProductCategories({ name: catName })
        }
        categoryCache[catName] = cat
        categoryIds.push(cat.id)
      }
    }

    // 2. Extract Metadata (Attributes)
    const metadata: Record<string, any> = {}
    for (let i = 1; i <= 21; i++) {
      const nameKey = `Attribute ${i} name`
      const valueKey = `Attribute ${i} value(s)`
      if (data[nameKey] && data[valueKey]) {
        metadata[`spec_${data[nameKey]}`] = data[valueKey]
      }
    }

    // 3. Handle Images
    const imageUrls = data["Images"] ? data["Images"].split(",").map(url => url.trim()) : []
    const images = imageUrls.map(url => ({ url }))

    // 4. Create Product
    const sku = data["SKU"] || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const regularPrice = parseFloat(data["Regular price"]) || 0
    const salePrice = parseFloat(data["Sale price"]) || 0
    const finalPrice = salePrice > 0 ? salePrice : regularPrice

    try {
      const products = await productModule.createProducts([{
        title: title,
        description: data["Description"] || "",
        subtitle: data["Short description"] || "",
        status: "published" as any,
        images: images,
        thumbnail: images[0]?.url || "",
        categories: categoryIds.map(id => ({ id })),
        metadata: metadata,
        variants: [
          {
            title: "Default",
            sku: sku,
            inventory_quantity: parseInt(data["Stock"]) || 10,
            manage_inventory: true,
          }
        ]
      }])

      const product = products[0]
      const variant = product.variants[0]

      // 5. Add Price
      // In Medusa v2, we link prices to variants via the Pricing Module
      // But for simplicity in this script, we can try to use the variant.prices if supported by the service
      // Or use pricingModule directly.
      
      await pricingModule.createPriceSets([{
        prices: [
          {
            amount: finalPrice,
            currency_code: "sek",
            rules: {}
          }
        ],
        links: {
          variant_id: variant.id
        }
      } as any])

      console.log(`Successfully created product and variant for: ${title}`)
    } catch (err) {
      console.error(`Failed to create product ${title}:`, err.message)
    }
  }

  console.log("\nImport completed successfully!")
}
