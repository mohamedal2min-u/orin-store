import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const fulfillmentModule = container.resolve("fulfillment");

  try {
    const { data: fulfillmentSets } = await query.graph({
      entity: "fulfillment_set",
      fields: ["id", "name", "service_zones.*", "service_zones.geo_zones.*"],
    });

    if (fulfillmentSets.length === 0) {
      logger.error("No fulfillment sets found. Create one first via Admin.");
      return;
    }

    const defaultSet = fulfillmentSets[0];
    
    // Check if there is a service zone for Sweden, otherwise create one
    let swedenZone = defaultSet.service_zones?.find(sz => sz.name === "Sweden");
    
    if (!swedenZone) {
      logger.info("Creating service zone for Sweden...");
      const updatedSet = await fulfillmentModule.createServiceZones(defaultSet.id, {
        name: "Sweden",
        geo_zones: [{ type: "country", country_code: "se" }]
      });
      swedenZone = updatedSet.service_zones?.find(sz => sz.name === "Sweden");
      logger.info("Service zone created.");
    } else {
      logger.info("Service zone for Sweden already exists.");
    }

    // Now check shipping options
    const { data: shippingOptions } = await query.graph({
      entity: "shipping_option",
      fields: ["id", "name", "service_zone_id"],
      filters: { service_zone_id: swedenZone.id }
    });

    if (shippingOptions.length === 0) {
      logger.info("Creating Shipping Option for Sweden...");
      // We need a shipping profile
      const { data: profiles } = await query.graph({
        entity: "shipping_profile",
        fields: ["id", "name"]
      });
      
      const defaultProfile = profiles[0];
      
      // We need a fulfillment provider
      const { data: providers } = await query.graph({
        entity: "fulfillment_provider",
        fields: ["id"]
      });
      
      const provider = providers.find(p => p.id === "manual_manual") || providers[0];

      await fulfillmentModule.createShippingOptions({
        name: "Standard Shipping (Sweden)",
        price_type: "flat",
        service_zone_id: swedenZone.id,
        shipping_profile_id: defaultProfile.id,
        provider_id: provider.id,
        type: {
          label: "Standard",
          description: "Standard delivery",
          code: "standard",
        },
        prices: [
          {
            currency_code: "sek",
            amount: 50,
          }
        ]
      });
      logger.info("Shipping option created successfully.");
    } else {
      logger.info("Shipping option for Sweden already exists.");
    }
    
    logger.info("✅ Shipping configuration updated.");
  } catch (error) {
    logger.error("Error setting up shipping:", error);
  }
}
