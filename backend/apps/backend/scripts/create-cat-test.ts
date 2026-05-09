import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow, createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows";

export default async function create_category_test({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve("logger");
  const shippingProfileId = "sp_01KR4SVDFEQEJQ18N7NM6N68R0";

  try {
    const { result: cats } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [{ name: "Test Cat " + Date.now(), is_active: true }]
      }
    });
    const catId = cats[0].id;

    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Seiko Cat Test",
            handle: "seiko-cat-test-" + Date.now(),
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileId,
            category_ids: [catId],
            options: [{ title: "Default", values: ["Default"] }],
            variants: [
              {
                title: "Default",
                sku: "CAT-TEST-" + Date.now(),
                options: { Default: "Default" }
              }
            ]
          }
        ]
      }
    });
    logger.info("Product with category created: " + result[0].id);
  } catch (e) {
    logger.error("Failed: " + JSON.stringify(e, null, 2));
  }
}
