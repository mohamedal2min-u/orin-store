import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const regionModule = container.resolve("region");

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "countries.*"],
  });

  let swedenRegionId = "";

  for (const region of regions) {
    if (region.name === "Sweden") {
      swedenRegionId = region.id;
    }
    const hasSweden = region.countries?.some(c => c && c.iso_2 === "se");
    if (hasSweden && region.name !== "Sweden") {
      logger.info(`Removing 'se' from region ${region.name}...`);
      await regionModule.updateRegions(region.id, {
        countries: region.countries?.filter(c => c && c.iso_2 !== "se").map(c => c!.iso_2) || []
      });
    }
  }

  if (swedenRegionId) {
    logger.info("Sweden region already exists. Updating it...");
    await regionModule.updateRegions(swedenRegionId, {
      currency_code: "sek",
      countries: ["se"],
      automatic_taxes: true,
    });
  } else {
    logger.info("Creating Sweden region...");
    await regionModule.createRegions({
      name: "Sweden",
      currency_code: "sek",
      countries: ["se"],
      automatic_taxes: true,
    });
  }

  logger.info("✅ Sweden region configured successfully.");
}
