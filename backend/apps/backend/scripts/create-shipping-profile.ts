import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createShippingProfilesWorkflow } from "@medusajs/medusa/core-flows";

export default async function create_shipping_profile({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { result } = await createShippingProfilesWorkflow(container).run({
    input: {
      data: [
        {
          name: "Default Shipping Profile",
          type: "default"
        }
      ]
    }
  });

  logger.info("Shipping profile created: " + result[0].id);
}
