import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createUsersWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModule = container.resolve(Modules.USER);
  const authModule = container.resolve(Modules.AUTH);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const email = "mohamed@alamin.se";
  const password = "a550055A!";

  try {
    logger.info("Starting deep clean for admin user...");

    // 1. Delete user from User Module
    const { data: users } = await query.graph({
      entity: "user",
      fields: ["id"],
      filters: { email: [email, "admin@medusa-test.com"] }
    });

    if (users.length > 0) {
      await userModule.deleteUsers(users.map(u => u.id));
      logger.info(`Deleted ${users.length} users from User module.`);
    }

    // 2. Delete identities from Auth Module
    const { data: identities } = await query.graph({
      entity: "auth_identity",
      fields: ["id"],
      filters: { entity_id: [email, "admin@medusa-test.com"] }
    });

    if (identities.length > 0) {
      await authModule.deleteIdentities(identities.map(i => i.id));
      logger.info(`Deleted ${identities.length} identities from Auth module.`);
    }

    // 3. Create user using the official workflow
    // This workflow is responsible for creating BOTH the user and the auth identity
    // correctly hashed and linked.
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

    logger.info(`✅ Deep clean & Re-creation successful for: ${email}`);
    logger.info("Please REFRESH the browser page before trying to login again.");
  } catch (error) {
    logger.error("Deep clean failed:", error);
  }
}
