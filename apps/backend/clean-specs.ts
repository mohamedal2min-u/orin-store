import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  logger.info("Initializing Product Module...");
  
  const productModuleService = container.resolve("product");

  logger.info("Fetching all products...");
  const products = await productModuleService.listProducts({}, { take: 500 });
  logger.info(`Found ${products.length} products.`);

  let updatedCount = 0;
  const batch = [];

  for (const product of products) {
    if (!product.description) continue;

    const parts = product.description.split("---");
    
    // If we have specs after '---'
    if (parts.length > 1) {
      const descriptionText = parts[0].trim();
      const specsText = parts[1].trim();

      const parsedSpecs: Record<string, string> = {};
      specsText.split("\n").forEach((line: string) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex !== -1) {
          const key = line.substring(0, separatorIndex).trim();
          const value = line.substring(separatorIndex + 1).trim();
          if (key && value) {
            parsedSpecs[key] = value;
          }
        }
      });

      // Prepare metadata update
      const existingMetadata = product.metadata || {};
      const newMetadata = {
        ...existingMetadata,
        watch_specs: {
          ...(existingMetadata.watch_specs as object || {}),
          ...parsedSpecs
        }
      };

      batch.push({
        id: product.id,
        description: descriptionText,
        metadata: newMetadata
      });
    }
  }

  logger.info(`Found ${batch.length} products to update.`);

  if (batch.length > 0) {
    // Process in batches of 10
    const batchSize = 10;
    for (let i = 0; i < batch.length; i += batchSize) {
      const currentBatch = batch.slice(i, i + batchSize);
      try {
        logger.info(`Updating batch ${Math.floor(i/batchSize) + 1} / ${Math.ceil(batch.length/batchSize)}`);
        await updateProductsWorkflow(container).run({
          input: {
            products: currentBatch
          }
        });
        updatedCount += currentBatch.length;
      } catch (err: any) {
        logger.error(`Failed at batch ${Math.floor(i/batchSize) + 1}: ${err.message}`);
        if (err.response && err.response.data) {
          logger.error(JSON.stringify(err.response.data, null, 2));
        }
      }
    }
  }

  logger.info(`Finished updating ${updatedCount} products.`);
}
