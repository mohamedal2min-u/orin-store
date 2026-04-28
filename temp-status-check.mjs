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

(async () => {
  console.log('=== Backend PM2 Logs (last 30 lines) ===');
  const logs = await run('orin-api', 'pm2 logs orin-backend --lines 30 --nostream 2>/dev/null', 12000);
  console.log(logs);

  console.log('=== PM2 List ===');
  const list = await run('orin-api', 'pm2 list', 10000);
  console.log(list);

  console.log('=== Run migration in background ===');
  const migrate = await run('orin-api',
    'nohup bash -c "cd /home/orin-api/htdocs/api.orin.se/apps/backend && npx medusa db:migrate >> ~/migrate.log 2>&1; pm2 restart orin-backend; pm2 save" > /dev/null 2>&1 & echo "PID: $!"',
    10000
  );
  console.log('Migration started:', migrate.trim());
})();
