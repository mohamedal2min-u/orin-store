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
    // 1. Check if user exists and delete if so (to ensure clean slate)
    const [existingUser] = await userModule.listUsers({ email });
    if (existingUser) {
      await userModule.deleteUsers([existingUser.id]);
      logger.info(`Deleted existing user: ${email}`);
    }

    // Also delete old test admin if exists
    const [oldAdmin] = await userModule.listUsers({ email: "admin@medusa-test.com" });
    if (oldAdmin) {
        await userModule.deleteUsers([oldAdmin.id]);
        logger.info(`Deleted old admin: admin@medusa-test.com`);
    }

    // 2. Create the new user using the workflow (this handles Auth automatically in v2)
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

    logger.info(`✅ Admin created successfully: ${email}`);
  } catch (error) {
    logger.error("Failed to recreate admin:", error);
  }
}
