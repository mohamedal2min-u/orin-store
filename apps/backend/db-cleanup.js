const { Client } = require('pg');

async function cleanDb() {
  const client = new Client({
    connectionString: 'postgres://postgres:a550055A!@localhost/medusa-kronvard'
  });

  try {
    await client.connect();
    console.log("Connected to DB");

    // 1. Delete from user
    const resUser = await client.query("DELETE FROM \"user\" WHERE email = $1 RETURNING id", ['mohamed@alamin.se']);
    console.log(`Deleted ${resUser.rowCount} users from 'user' table.`);

    // 2. Delete from auth_identity where provider_identities contains the email
    // Or we can just delete from provider_identity first
    const resProvider = await client.query("DELETE FROM provider_identity WHERE entity_id = $1 RETURNING auth_identity_id", ['mohamed@alamin.se']);
    console.log(`Deleted ${resProvider.rowCount} provider identities.`);

    if (resProvider.rowCount > 0) {
      const authIds = resProvider.rows.map(r => r.auth_identity_id);
      // We need to delete auth_identity
      const authIdsStr = authIds.map(id => `'${id}'`).join(',');
      const resAuth = await client.query(`DELETE FROM auth_identity WHERE id IN (${authIdsStr})`);
      console.log(`Deleted ${resAuth.rowCount} auth identities.`);
    }

    // Also try to find if there's any auth_identity linked directly
    const resAuth2 = await client.query("DELETE FROM auth_identity WHERE app_metadata->>'email' = $1 OR user_metadata->>'email' = $1", ['mohamed@alamin.se']);
    console.log(`Deleted ${resAuth2.rowCount} additional auth identities.`);

    console.log("Database cleanup successful. You can now use the CLI to create the user.");
  } catch (error) {
    console.error("DB cleanup failed:", error);
  } finally {
    await client.end();
  }
}

cleanDb();
