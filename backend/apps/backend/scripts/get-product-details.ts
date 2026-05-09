import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function get_product_details({
  container,
}: {
  container: MedusaContainer;
}) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const productId = "prod_01KR4TBZPA3N11P8XQ8H5XS9V2";
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id", "title", "status", "variants.*", "variants.prices.*", "variants.inventory_items.*"
    ],
    filters: { id: productId }
  });

  logger.info("Product Details: " + JSON.stringify(products[0], null, 2));
}
