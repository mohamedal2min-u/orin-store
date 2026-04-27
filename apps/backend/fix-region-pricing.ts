/**
 * Run with: npx ts-node -e "require('./fix-region-pricing')"
 * OR via Medusa exec:  npx medusa exec ./fix-region-pricing.ts
 *
 * This script detects regions that exist in the region module but are missing
 * from the pricing module context, then recreates them via the proper workflow
 * so the pricing module is back in sync.
 */
import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  deleteRegionsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function fixRegionPricing({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const pricingModule = container.resolve(Modules.PRICING)

  logger.info("Checking regions for pricing context issues...")

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })

  logger.info(`Found ${regions.length} region(s)`)

  for (const region of regions) {
    logger.info(`Checking region: ${region.name} (${region.id})`)

    try {
      // Try to build a pricing context for this region - if it throws, it's broken
      await pricingModule.retrievePriceSet(region.id).catch(() => null)

      // A more reliable check: list price rules for this region
      const rules = await pricingModule
        .listPriceRules({ attribute: "region_id", value: region.id })
        .catch(() => null)

      if (rules === null) {
        logger.warn(
          `Region ${region.name} (${region.id}) may have pricing issues - attempting repair`
        )
        await repairRegion(container, region, logger)
      } else {
        logger.info(`Region ${region.name} pricing context: OK`)
      }
    } catch (err) {
      logger.warn(`Region ${region.name} has pricing issue: ${(err as Error).message}`)
      await repairRegion(container, region, logger)
    }
  }

  logger.info("Done fixing region pricing contexts.")
}

async function repairRegion(
  container: MedusaContainer,
  region: { id: string; name: string; currency_code: string; countries?: { iso_2: string }[] },
  logger: any
) {
  const countryCodes = (region.countries ?? []).map((c) => c.iso_2)

  logger.info(`Deleting and recreating region: ${region.name}`)

  try {
    await deleteRegionsWorkflow(container).run({
      input: { ids: [region.id] },
    })
    logger.info(`Deleted region ${region.id}`)

    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: region.name,
            currency_code: region.currency_code,
            countries: countryCodes,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })

    logger.info(
      `Recreated region: ${result[0].name} with new id: ${result[0].id}`
    )
  } catch (err) {
    logger.error(
      `Failed to repair region ${region.name}: ${(err as Error).message}`
    )
  }
}
