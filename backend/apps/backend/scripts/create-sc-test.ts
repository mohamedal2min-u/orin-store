import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function create_sc_test({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve("logger");
  const query = container.resolve("query");
  const shippingProfileId = "sp_01KR4SVDFEQEJQ18N7NM6N68R0";

  try {
    const { data: scs } = await query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Default Sales Channel" } });
    const scId = scs[0]?.id;

    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Seiko SC Test",
            handle: "seiko-sc-test-" + Date.now(),
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileId,
            sales_channels: scId ? [{ id: scId }] : [],
            options: [{ title: "Default", values: ["Default"] }],
            variants: [
              {
                title: "Default",
                sku: "SC-TEST-" + Date.now(),
                options: { Default: "Default" }
              }
            ]
          }
        ]
      }
    });
    logger.info("Product with sales channel created: " + result[0].id);
  } catch (e) {
    logger.error("Failed: " + JSON.stringify(e, null, 2));
  }
}
