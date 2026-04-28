import { Client } from 'ssh2';
const HOST = '82.29.181.61';
const PASS = 'a550055A!';

async function run(user, cmd, timeout = 15000) {
  return new Promise((resolve) => {
    const conn = new Client();
    const t = setTimeout(() => { conn.end(); resolve('TIMEOUT'); }, timeout);
    conn.on('ready', () => {
      conn.exec(cmd, (err, stream) => {
        if (err) { clearTimeout(t); conn.end(); resolve('ERROR: ' + err.message); return; }
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.stderr.on('data', d => out += d.toString());
        stream.on('close', () => { clearTimeout(t); conn.end(); resolve(out); });
      });
    }).on('error', e => { clearTimeout(t); resolve('AUTH FAILED: ' + e.message); })
    .connect({ host: HOST, port: 22, username: user, password: PASS });
  });
}

const BACKEND_ENV = `/home/orin-api/htdocs/api.orin.se/apps/backend/.env`;
const CORRECT_DB_URL = `postgres://orinapi:a550055A!@127.0.0.1/orinapi`;

(async () => {
  console.log('=== Step 1: Fix DATABASE_URL in backend .env ===');
  const fix = await run('orin-api',
    `sed -i 's|DATABASE_URL=.*|DATABASE_URL=${CORRECT_DB_URL}|' ${BACKEND_ENV} && echo "Fixed" || echo "Failed"`
  );
  console.log(fix);

  console.log('=== Step 2: Verify new .env ===');
  const verify = await run('orin-api', `grep DATABASE_URL ${BACKEND_ENV}`);
  console.log(verify);

  console.log('=== Step 3: Run db:migrate ===');
  console.log('(this may take 1-2 minutes...)');
  const migrate = await run('orin-api',
    `cd /home/orin-api/htdocs/api.orin.se/apps/backend && npx medusa db:migrate 2>&1 | tail -20`,
    120000
  );
  console.log(migrate);

  console.log('=== Step 4: Restart backend PM2 ===');
  const restart = await run('orin-api',
    `pm2 restart orin-backend && pm2 save && echo "Restarted OK"`,
    15000
  );
  console.log(restart);

  console.log('=== Step 5: Check PM2 status ===');
  const status = await run('orin-api', `pm2 list`, 10000);
  console.log(status);
})();
