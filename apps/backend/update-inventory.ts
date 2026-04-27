import { 
  IInventoryModuleService, 
  IStockLocationModuleService 
} from "@medusajs/types"
import { ExecArgs } from "@medusajs/framework/types"

export default async function updateInventory({ container }: ExecArgs) {
  console.log("Updating inventory for all products to 5 pieces...")

  const inventoryModule: IInventoryModuleService = container.resolve("inventory")
  const stockLocationModule: IStockLocationModuleService = container.resolve("stock_location")
  const query = container.resolve("query")
  const remoteLink = container.resolve("remoteLink")

  // 1. Get default stock location
  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"]
  })
  
  let location = locations[0]
  if (!location) {
    console.log("No stock location found, creating default location...")
    location = await stockLocationModule.createStockLocations({ name: "Default Warehouse" })
  }

  // 2. Get all variants with their inventory items
  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id", "sku", "inventory_items.inventory_item_id"]
  })
  
  console.log(`Found ${variants.length} variants.`)

  for (const variant of variants) {
    let inventoryItemId: string

    if (variant.inventory_items && variant.inventory_items.length > 0) {
      inventoryItemId = variant.inventory_items[0].inventory_item_id
    } else {
      // Check if inventory item already exists for this SKU
      const existingItems = await inventoryModule.listInventoryItems({ sku: variant.sku })
      if (existingItems.length > 0) {
        inventoryItemId = existingItems[0].id
      } else {
        console.log(`Creating inventory item for SKU: ${variant.sku}`)
        const inventoryItem = await inventoryModule.createInventoryItems({
          sku: variant.sku,
          requires_shipping: true
        })
        inventoryItemId = inventoryItem.id
      }

      // Link it to variant
      try {
        await remoteLink.create([
          {
            ["product"]: {
              variant_id: variant.id,
            },
            ["inventory"]: {
              inventory_item_id: inventoryItemId,
            },
          },
        ])
      } catch (e) {
        // Link might already exist
      }
    }

    // Set inventory level to 5
    const levels = await inventoryModule.listInventoryLevels({
      inventory_item_id: inventoryItemId,
      location_id: location.id
    })

    if (levels.length > 0) {
      await inventoryModule.updateInventoryLevels([
        {
          inventory_item_id: inventoryItemId,
          location_id: location.id,
          stocked_quantity: 5
        }
      ])
    } else {
      await inventoryModule.createInventoryLevels([
        {
          inventory_item_id: inventoryItemId,
          location_id: location.id,
          stocked_quantity: 5
        }
      ])
    }
    
    console.log(`Updated inventory for variant: ${variant.sku} to 5`)
  }

  console.log("Inventory update completed!")
}
