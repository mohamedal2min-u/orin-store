import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createTaxRatesWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  // Find the tax region for Sweden
  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  });

  const seTaxRegion = taxRegions.find(r => r.country_code === "se");
  if (!seTaxRegion) {
    logger.error("❌ No tax region for Sweden. Create it first.");
    return;
  }

  await createTaxRatesWorkflow(container).run({
    input: [
      {
        tax_region_id: seTaxRegion.id,
        name: "Moms",
        code: "se-vat-25",
        rate: 25,
        is_default: true,
      },
    ],
  });

  logger.info("✅ Swedish VAT 25% (Moms) created successfully!");
}
