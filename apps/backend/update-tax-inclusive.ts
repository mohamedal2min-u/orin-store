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

  const swedenRegion = regions.find(r => r.name === "Sweden");

  if (swedenRegion) {
    // NOTE: In Medusa v2, `is_tax_inclusive` and `includes_tax` were removed
    // from UpdateRegionDTO. Tax-inclusive pricing is now configured at the
    // price level in the Pricing Module (set `includes_tax: true` on prices).
    // `automatic_taxes: true` ensures taxes are calculated automatically.
    await regionModule.updateRegions(swedenRegion.id, {
      automatic_taxes: true,
    });
    logger.info("automatic_taxes set to true for Sweden region.");
    logger.info(
      "Note: Tax-inclusive pricing in Medusa v2 is configured per-price in the Pricing Module, not at region level."
    );
  }

  logger.info("Tax inclusive pricing configuration completed.");
}
