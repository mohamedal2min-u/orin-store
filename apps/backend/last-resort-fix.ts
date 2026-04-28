import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createUsersWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModule = container.resolve(Modules.USER);
  const authModule = container.resolve(Modules.AUTH);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const email = "mohamed@orin.se";
  const password = "a550055A!";

  try {
    logger.info("Cleaning up ALL users and identities...");

    // 1. Delete all users via module
    const users = await userModule.listUsers();
    if (users.length > 0) {
      await userModule.deleteUsers(users.map(u => u.id));
      logger.info(`Deleted ${users.length} users.`);
    }

    // 2. Delete all identities via Query and Module
    // We use query.graph to find IDs because listIdentities is missing
    const { data: identities } = await query.graph({
      entity: "auth_identity",
      fields: ["id"],
    });

    if (identities.length > 0) {
      // Many modules in v2 use delete() or deleteIdentities()
      // Let's check what authModule has.
      const method = (authModule as any).deleteIdentities ? "deleteIdentities" : "delete";
      await (authModule as any)[method](identities.map(i => i.id));
      logger.info(`Deleted ${identities.length} auth identities.`);
    }

    // 3. Create the new user using the workflow
    await createUsersWorkflow(container).run({
      input: {
        users: [
          {
            email,
            password,
          },
        ],
      },
    });

    logger.info(`✅ SUCCESS: Admin created for ${email}`);
  } catch (error) {
    logger.error("Last resort failed:", error);
  }
}
