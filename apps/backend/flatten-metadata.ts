import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);
  
  try {
    const products = await productModule.listProducts({}, { relations: ["metadata"] });
    
    const updates = products.map(product => {
      if (product.metadata?.watch_specs && typeof product.metadata.watch_specs === "object") {
        const watchSpecs = product.metadata.watch_specs as Record<string, any>;
        const newMetadata: Record<string, any> = { ...product.metadata };
        
        // Flatten watch_specs into spec_Key
        Object.entries(watchSpecs).forEach(([key, value]) => {
          newMetadata[`spec_${key}`] = value;
        });
        
        // Optionally keep watch_specs for now or delete it
        // delete newMetadata.watch_specs; 

        return {
          id: product.id,
          metadata: newMetadata
        };
      }
      return null;
    }).filter(Boolean);

    if (updates.length > 0) {
      await updateProductsWorkflow(container).run({
        input: {
          products: updates as any
        }
      });
      logger.info(`✅ Flattened metadata for ${updates.length} products. They are now editable in Admin.`);
    } else {
      logger.info("No products found with nested watch_specs.");
    }
  } catch (error) {
    logger.error("Failed to flatten metadata:", error);
  }
}
