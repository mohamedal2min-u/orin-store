import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function create_minimal_with_price({
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
            title: "Seiko Price Test",
            handle: "seiko-price-test-" + Date.now(),
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileId,
            options: [{ title: "Default", values: ["Default"] }],
            variants: [
              {
                title: "Default",
                sku: "PRICE-TEST-" + Date.now(),
                options: { Default: "Default" },
                prices: [
                  {
                    amount: 5798,
                    currency_code: "sek"
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    logger.info("Product with price created: " + result[0].id);
  } catch (e) {
    logger.error("Failed: " + JSON.stringify(e, null, 2));
  }
}
