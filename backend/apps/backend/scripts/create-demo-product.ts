import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  createProductCategoriesWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function create_full_demo_product({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve("logger");
  const query = container.resolve("query");
  const shippingProfileId = "sp_01KR4SVDFEQEJQ18N7NM6N68R0";

  logger.info("Creating full demo product...");

  // 1. Categories
  const categoryNames = ["Herrklockor", "Seiko", "Seiko Presage", "Automatiska klockor", "Japanska klockor", "Silverklockor"];
  const categoryIds: string[] = [];
  for (const name of categoryNames) {
    const { data: existing } = await query.graph({ entity: "product_category", fields: ["id"], filters: { name } });
    if (existing.length > 0) { categoryIds.push(existing[0].id); } 
    else {
      const { result } = await createProductCategoriesWorkflow(container).run({ input: { product_categories: [{ name, is_active: true }] } });
      categoryIds.push(result[0].id);
    }
  }

  // 2. Collection
  const { data: existingCol } = await query.graph({ entity: "product_collection", fields: ["id"], filters: { title: "Seiko Presage" } });
  const collectionId = existingCol.length > 0 ? existingCol[0].id : (await createCollectionsWorkflow(container).run({ input: { collections: [{ title: "Seiko Presage", handle: "seiko-presage" }] } })).result[0].id;

  // 3. Sales Channel
  const { data: scs } = await query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Default Sales Channel" } });
  const scId = scs[0]?.id;

  // 4. Product
  const { result: createdProducts } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Seiko Presage Cocktail Automatic SRPB41J1",
          handle: "seiko-presage-cocktail-automatic-srpb41j1",
          subtitle: "Presage Cocktail Automatic",
          description: "Seiko Presage Cocktail Automatic SRPB41J1 är ett bevis på Seikos rika historia inom japansk klocktillverkning, som kombinerar tradition med modern innovation.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          collection_id: collectionId,
          category_ids: categoryIds,
          sales_channels: scId ? [{ id: scId }] : [],
          options: [{ title: "Title", values: ["Default"] }],
          metadata: {
            ref_nr: "SRPB41J1",
            brand: "Seiko",
            meta_title: "Seiko Presage Cocktail Automatic SRPB41J1 | ORIN",
            meta_description: "Seiko Presage Cocktail Automatic SRPB41J1 med blå urtavla...",
            // User requested specs
            series: "Presage Cocktail Time",
            gender: "Herr",
            warranty: "3 år Seiko",
            movement_type: "Automatiskt",
            movement: "Seiko 4R35",
            power_reserve: "41 timmar",
            jewels: "24",
            diameter: "41 mm",
            thickness: "15 mm",
            water_resistance: "5 ATM / 50 meter",
            glass: "Hardlex Mineralglas",
            caseback: "Genomskinligt bakstycke",
            manufacturer: "Seiko Watch Europe S.A.S"
          },
          variants: [
            {
              title: "Default",
              sku: "SRPB41J1",
              ean: "4954628214584",
              barcode: "4954628214584",
              options: { Title: "Default" },
              prices: [
                {
                  amount: 5798,
                  currency_code: "sek"
                }
              ],
              manage_inventory: true
            }
          ]
        }
      ]
    }
  });

  const product = createdProducts[0];
  const variant = product.variants[0];
  logger.info("Product created successfully: " + product.id);

  // 5. Inventory
  const { data: vData } = await query.graph({
    entity: "product_variant",
    fields: ["id", "inventory_items.*"],
    filters: { id: variant.id }
  });

  const invId = vData[0]?.inventory_items?.[0]?.inventory_item_id;
  if (invId) {
    const { data: locs } = await query.graph({ entity: "stock_location", fields: ["id"] });
    if (locs[0]) {
      await createInventoryLevelsWorkflow(container).run({
        input: {
          inventory_levels: [{ inventory_item_id: invId, location_id: locs[0].id, stocked_quantity: 5 }]
        }
      });
      logger.info("Inventory set to 5.");
    }
  }
}
