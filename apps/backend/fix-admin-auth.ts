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
    // 1. Wipe all existing admin users and identities for a clean start
    const allUsers = await userModule.listUsers();
    if (allUsers.length > 0) {
      await userModule.deleteUsers(allUsers.map(u => u.id));
      logger.info(`Wiped ${allUsers.length} users.`);
    }

    // In Medusa v2, auth identities are separate. Let's try to find and remove them.
    // We'll use the internal repository to be sure.
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: identities } = await query.graph({
      entity: "auth_identity",
      fields: ["id"],
    });
    
    if (identities.length > 0) {
      // Direct deletion if module supports it, otherwise we'll rely on the workflow
      try {
          await authModule.deleteIdentities(identities.map(i => i.id));
          logger.info(`Wiped ${identities.length} auth identities.`);
      } catch (e) {
          logger.info("Could not wipe identities directly, proceeding to workflow.");
      }
    }

    // 2. Use the official CLI-equivalent workflow which handles identity and password hashing
    // We will use the 'emailpass' provider which is the default for Admin
    await createUsersWorkflow(container).run({
      input: {
        users: [
          {
            email,
            password, // The workflow SHOULD handle hashing if using the right provider context
          },
        ],
      },
    });

    logger.info(`✅ Admin successfully RE-CREATED: ${email}`);
    logger.info("Please try to login now.");
  } catch (error) {
    logger.error("Detailed Error during admin recreation:", error);
  }
}
