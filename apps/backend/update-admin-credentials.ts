import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Modules } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModule = container.resolve(Modules.USER);
  const authModule = container.resolve(Modules.AUTH);

  const newEmail = "mohamed@alamin.se";
  const newPassword = "a550055A!";
  const oldEmail = "admin@medusa-test.com";

  try {
    // 1. Find the user
    const [user] = await userModule.listUsers({ email: oldEmail });
    
    if (!user) {
      logger.error(`❌ User ${oldEmail} not found.`);
      return;
    }

    // 2. Update User Email
    await userModule.updateUsers({
      id: user.id,
      email: newEmail
    });

    // 3. Update Auth Identity (Password and Email mapping)
    // In Medusa v2, we find the identity linked to this user
    const [identity] = await authModule.listIdentities({ 
      provider_identities: { entity_id: oldEmail } 
    });

    if (identity) {
      // Update identity with new email and password
      await authModule.updateIdentities({
        id: identity.id,
        provider_identities: {
            entity_id: newEmail,
            password: newPassword
        }
      });
    } else {
        // Alternative: update by identifier if using email provider
        const [identityById] = await authModule.listIdentities({
            entity_id: oldEmail
        });
        if (identityById) {
            await authModule.updateIdentities({
                id: identityById.id,
                entity_id: newEmail,
                provider_identities: {
                    password: newPassword
                }
            });
        }
    }

    logger.info(`✅ Admin credentials updated successfully to: ${newEmail}`);
  } catch (error) {
    logger.error("Failed to update admin credentials:", error);
  }
}
