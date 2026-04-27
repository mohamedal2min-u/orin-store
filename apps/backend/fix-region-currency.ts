import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const regionModule = container.resolve("region");

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  });

  for (const region of regions) {
    logger.info(`Region: ${region.name}, Currency: '${region.currency_code}'`);
    if (region.name === "Sweden") {
      logger.info(`Fixing Sweden region...`);
      await regionModule.updateRegions(region.id, {
        currency_code: "sek"
      });
      logger.info(`Updated Sweden region currency code to sek.`);
    }
  }
}
