import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createUsersWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModule = container.resolve(Modules.USER);
  const authModule = container.resolve(Modules.AUTH);

  const email = "mohamed@alamin.se";
  const password = "a550055A!";

  try {
    logger.info("Cleaning up ALL users and identities for a fresh start...");

    // 1. Delete all users
    const users = await userModule.listUsers();
    if (users.length > 0) {
      await userModule.deleteUsers(users.map(u => u.id));
      logger.info(`Deleted ${users.length} users.`);
    }

    // 2. Delete all auth identities (this is the key part)
    // We fetch them all and delete them to avoid any conflicts
    const identities = await authModule.listIdentities();
    if (identities.length > 0) {
      await authModule.deleteIdentities(identities.map(i => i.id));
      logger.info(`Deleted ${identities.length} auth identities.`);
    }

    // 3. Create the new user using the workflow
    // This will correctly create the user and the hashed identity
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

    logger.info(`✅ Admin successfully RE-CREATED: ${email}`);
    logger.info("Please refresh your browser and try logging in again.");
  } catch (error) {
    logger.error("Final repair attempt failed:", error);
  }
}
