import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function create_non_string_meta_test({
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
            title: "Seiko Non-String Meta Test",
            handle: "seiko-non-str-meta-test-" + Date.now(),
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileId,
            options: [{ title: "Default", values: ["Default"] }],
            variants: [
              {
                title: "Default",
                sku: "NON-STR-META-TEST-" + Date.now(),
                options: { Default: "Default" }
              }
            ],
            metadata: {
              test_num: 24 // Number
            }
          }
        ]
      }
    });
    logger.info("Product created: " + result[0].id);
  } catch (e) {
    logger.error("Failed: " + JSON.stringify(e, null, 2));
  }
}
