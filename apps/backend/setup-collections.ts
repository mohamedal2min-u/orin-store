import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createCollectionsWorkflow } from "@medusajs/medusa/core-flows";
import { IProductModuleService } from "@medusajs/framework/types";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);

  const targetCollections = [
    { title: "Seiko", handle: "seiko" },
    { title: "Tissot", handle: "tissot" },
    { title: "Hugo Boss", handle: "hugo-boss" },
    { title: "BOSS", handle: "boss" },
    { title: "Michael Kors", handle: "michael-kors" },
    { title: "Guess", handle: "guess" },
  ];

  try {
    // 1. Fetch existing collections
    const existingCollections = await productModuleService.listProductCollections({}, { take: 1000 });
    const existingTitles = existingCollections.map(c => c.title.toLowerCase());
    const existingHandles = existingCollections.map(c => c.handle);

    const alreadyExists: string[] = [];
    const created: string[] = [];
    const toCreate: any[] = [];

    for (const target of targetCollections) {
      if (existingTitles.includes(target.title.toLowerCase()) || existingHandles.includes(target.handle)) {
        alreadyExists.push(target.title);
      } else {
        toCreate.push(target);
      }
    }

    if (toCreate.length > 0) {
      // 3. Create missing collections
      await createCollectionsWorkflow(container).run({
        input: {
          collections: toCreate,
        },
      });
      created.push(...toCreate.map(c => c.title));
    }

    // Report
    logger.info("=== Collections Report ===");
    logger.info(`Already Existing: ${alreadyExists.length > 0 ? alreadyExists.join(", ") : "None"}`);
    logger.info(`Newly Created: ${created.length > 0 ? created.join(", ") : "None"}`);
    logger.info("==========================");

  } catch (error) {
    logger.error("Failed to process collections:", error);
  }
}
