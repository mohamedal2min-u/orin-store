import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function check_shipping({
  container,
}: {
  container: MedusaContainer;
}) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { data: profiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"]
  });

  logger.info("Shipping profiles: " + JSON.stringify(profiles, null, 2));
}
