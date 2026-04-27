import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "supported_currencies.*"],
  });

  if (!stores || stores.length === 0) {
    logger.error("No store found.");
    return;
  }

  const store = stores[0];
  logger.info(`Store: ${store.name}`);
  logger.info("Supported currencies:");
  for (const c of store.supported_currencies || []) {
    if (c) {
      logger.info(`  ${c.currency_code.toUpperCase()} ${c.is_default ? "(DEFAULT)" : ""}`);
    }
  }
}
