import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function create_minimal_product({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve("logger");
  const shippingProfileId = "sp_01KR4SVDFEQEJQ18N7NM6N68R0";

  try {
    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Seiko Test",
            handle: "seiko-test-" + Date.now(),
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileId,
            options: [{ title: "Default", values: ["Default"] }],
            variants: [
              {
                title: "Default",
                sku: "TEST-" + Date.now(),
                options: { Default: "Default" }
              }
            ]
          }
        ]
      }
    });
    logger.info("Minimal product created: " + result[0].id);
  } catch (e) {
    logger.error("Failed to create minimal product: " + JSON.stringify(e, null, 2));
  }
}
