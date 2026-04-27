import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const storeModule = container.resolve("store");

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "supported_currencies.*"],
  });

  if (!stores || stores.length === 0) {
    logger.error("No store found.");
    return;
  }

  const store = stores[0];
  const currentCurrencies = store.supported_currencies || [];
  
  if (currentCurrencies.some(c => c && c.currency_code === "sek")) {
    logger.info("SEK is already a supported currency.");
    return;
  }

  logger.info("Adding SEK to supported currencies...");

  await storeModule.updateStores(store.id, {
    supported_currencies: [
      ...currentCurrencies.filter(c => c !== null).map(c => ({
        currency_code: c!.currency_code,
        is_default: c!.is_default,
      })),
      { currency_code: "sek", is_default: false }
    ]
  });

  logger.info("✅ SEK added to store supported currencies successfully.");
}
