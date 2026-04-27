import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  const productData = {
    title: "Seiko Presage SPB167J1",
    description: "Automatisk klocka med safirkristall och 70h gångreserv.",
    handle: "seiko-presage-spb167j1",
    status: "published" as const,
    options: [
      {
        title: "Default Option",
        values: ["Default Value"],
      },
    ],
    variants: [
      {
        title: "Default Variant",
        sku: "SPB167J1",
        options: {
          "Default Option": "Default Value",
        },
        prices: [
          {
            currency_code: "sek",
            amount: 7500,
          },
        ],
      },
    ],
  };

  try {
    await createProductsWorkflow(container).run({
      input: {
        products: [productData],
      },
    });
    logger.info("✅ Test product created with SEK price.");
  } catch (error) {
    logger.error("Failed to create product:", error);
  }
}
