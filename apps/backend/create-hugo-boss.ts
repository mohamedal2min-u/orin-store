import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createProductsWorkflow, updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);
  
  const productHandle = "hugo-boss-champion-svart-lader-44-mm-1513880";
  
  const specs = {
    "Märke": "Hugo Boss",
    "Serie": "Champion",
    "Ref.nr": "1513880",
    "Kön": "Herr",
    "Diameter": "44 mm",
    "Tjocklek": "11.5 mm",
    "Urverkstyp": "Quartz",
    "Urverk": "Quartz kronograf",
    "Vattentäthet": "10 ATM (100 m)",
    "Glastyp": "Mineralglas",
    "Material på boett": "Svart stål",
    "Boettfärg": "Svart",
    "Armbandstyp": "Läderband",
    "Färg på klockarmband": "Svart",
    "Urtavlefärg": "Svart",
    "Datumangivelse": "Datum",
    "Funktioner": "24-timmarsvisning, Kronograf, Separat sekundvisning, Takometer",
    "Lås": "Bygelspänne",
    "Garanti": "2 år",
    "EAN": "7613272442367",
    "Alternativa modellnummer": "1513880, HB1513880"
  };

  const productData = {
    title: "Hugo Boss Champion Svart Läder 44 mm",
    description: "En sportig och elegant kronografklocka från Hugo Boss Champion-serien. Med en boett i svart stål och ett stilrent svart läderband är detta en klocka som passar både till vardags och till fest.",
    handle: productHandle,
    status: "published" as const,
    metadata: {
      watch_specs: specs
    }
  };

  try {
    const [existingProduct] = await productModule.listProducts({ handle: [productHandle] });

    if (existingProduct) {
      await updateProductsWorkflow(container).run({
        input: {
          products: [{
            id: existingProduct.id,
            metadata: {
              watch_specs: specs
            }
          }]
        }
      });
      logger.info(`✅ Hugo Boss Champion product (ID: ${existingProduct.id}) updated with full specifications.`);
    } else {
      await createProductsWorkflow(container).run({
        input: {
          products: [{
            ...productData,
            options: [{ title: "Default Option", values: ["Default Value"] }],
            variants: [{
              title: "Default Variant",
              sku: "1513880",
              options: { "Default Option": "Default Value" },
              prices: [{ currency_code: "sek", amount: 329500 }] // Price in cents
            }]
          }]
        }
      });
      logger.info("✅ Hugo Boss Champion product created with full specifications.");
    }
  } catch (error) {
    logger.error("Failed to update/create product:", error);
  }
}
