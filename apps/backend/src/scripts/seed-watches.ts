import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils";
import { 
  createProductsWorkflow, 
  updateProductsWorkflow,
  createProductCategoriesWorkflow,
  createRegionsWorkflow
} from "@medusajs/medusa/core-flows";

export default async function seedWatches({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("🚀 Starting watch seeding script...");

  // 1. Ensure Sweden Region exists
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
    filters: { name: "Sweden" }
  });

  let regionId = regions[0]?.id;
  if (!regionId) {
    logger.info("Creating Sweden region...");
    const { result: newRegions } = await createRegionsWorkflow(container).run({
      input: {
        regions: [{
          name: "Sweden",
          currency_code: "sek",
          countries: ["se"],
          automatic_taxes: true,
        }]
      }
    });
    regionId = newRegions[0].id;
  } else {
    logger.info(`Found existing Sweden region: ${regionId}`);
  }

  // 2. Ensure Categories exist
  const categoriesToSeed = [
    { name: "Herrklockor", handle: "herrklockor" },
    { name: "Damklockor", handle: "damklockor" },
    { name: "Automatklockor", handle: "automatklockor" },
    { name: "Dressklockor", handle: "dressklockor" }
  ];

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  });

  const existingCategoryHandles = existingCategories.map(c => c.handle);
  const categoriesToCreate = categoriesToSeed.filter(c => !existingCategoryHandles.includes(c.handle));

  let allCategories = [...existingCategories];

  if (categoriesToCreate.length > 0) {
    logger.info(`Creating ${categoriesToCreate.length} missing categories...`);
    const { result: createdCategories } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: categoriesToCreate.map(c => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
          is_internal: false
        }))
      }
    });
    allCategories.push(...createdCategories);
  }

  const categoryMap = new Map(allCategories.map(c => [c.handle, c.id]));

  // 3. Get existing Sales Channel
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });

  const salesChannelId = salesChannels.find(sc => sc.name === "Default Sales Channel")?.id || salesChannels[0]?.id;
  
  if (!salesChannelId) {
    throw new Error("No sales channel found. Please ensure at least one sales channel exists.");
  }
  logger.info(`Using sales channel: ${salesChannelId}`);

  // 4. Sample Watch Products
  // Using unique SKUs for seeding to avoid conflicts with existing orphaned inventory items
  const products = [
    {
      title: "Seiko 5 Sports Midi Svart/Stål 38 mm",
      handle: "seiko-5-sports-midi-svartstal-38-mm",
      description: "Seiko 5 sports 38mm är en automatisk herrklockا i Seikos 5 Sports-serie med Ref.nr SRPK29K1. Denna Midi-version kombinerar kaliber 4R36 och dag-datumvisning med ett mer kompakt format.",
      subtitle: "Automatisk herrklocka med dag-datum",
      status: ProductStatus.PUBLISHED,
      thumbnail: "https://www.urme.se/wp-content/uploads/2025/12/seiko-5-sports-black-dial-automatic-watch-front-face-stainless-steel-srpk29k1.webp",
      category_ids: [categoryMap.get("herrklockor"), categoryMap.get("automatklockor")].filter(Boolean) as string[],
      options: [{ title: "Storlek", values: ["38 mm"] }],
      variants: [{
        title: "Default Variant",
        sku: "SRPK29K1-SEED", 
        options: { "Storlek": "38 mm" },
        prices: [{ currency_code: "sek", amount: 319800 }] 
      }],
      sales_channels: [{ id: salesChannelId }],
      metadata: {
        watch_specs: {
          "Märke": "Seiko",
          "Serie": "5 Sports",
          "Urverkstyp": "Automatiskt",
          "Diameter": "38 mm",
          "Vattentäthet": "10 ATM"
        }
      }
    },
    {
      title: "Hugo Boss Champion Svart Läder 44 mm",
      handle: "hugo-boss-champion-svart-lader-44-mm-1513880",
      description: "En sportig och elegant kronografklocka från Hugo Boss Champion-serien. Med en boett i svart stål och ett stilrent svart läderband.",
      subtitle: "Elegant kronografklocka",
      status: ProductStatus.PUBLISHED,
      category_ids: [categoryMap.get("herrklockor"), categoryMap.get("dressklockor")].filter(Boolean) as string[],
      options: [{ title: "Storlek", values: ["44 mm"] }],
      variants: [{
        title: "Default Variant",
        sku: "1513880-SEED",
        options: { "Storlek": "44 mm" },
        prices: [{ currency_code: "sek", amount: 329500 }]
      }],
      sales_channels: [{ id: salesChannelId }],
      metadata: {
        watch_specs: {
          "Märke": "Hugo Boss",
          "Serie": "Champion",
          "Urverkstyp": "Quartz",
          "Diameter": "44 mm",
          "Vattentäthet": "10 ATM"
        }
      }
    }
  ];

  for (const productData of products) {
    const { data: existingProducts } = await query.graph({
      entity: "product",
      fields: ["id", "handle"],
      filters: { handle: productData.handle }
    });

    if (existingProducts.length > 0) {
      const existingProduct = existingProducts[0];
      logger.info(`Product '${productData.title}' exists. Updating metadata and categories...`);
      
      await updateProductsWorkflow(container).run({
        input: {
          products: [{
            id: existingProduct.id,
            title: productData.title,
            description: productData.description,
            subtitle: productData.subtitle,
            metadata: productData.metadata,
            category_ids: productData.category_ids,
            status: productData.status
          }]
        }
      });
    } else {
      logger.info(`Creating new product: ${productData.title}`);
      await createProductsWorkflow(container).run({
        input: {
          products: [productData]
        }
      });
    }
  }

  logger.info("✅ Watch seeding completed successfully.");
}
