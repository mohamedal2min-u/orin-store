import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function check_data({
  container,
}: {
  container: MedusaContainer;
}) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.*", "variants.prices.*"]
  });

  logger.info("Current products count: " + products.length);
  if (products.length > 0) {
    logger.info("Sample product data: " + JSON.stringify(products[0], null, 2));
  }
}
