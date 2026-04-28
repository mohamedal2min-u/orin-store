import { Client } from 'ssh2';
const HOST = '82.29.181.61';
const PASS = 'a550055A!';

async function run(user, cmd, timeout = 20000) {
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
  console.log('=== Check postgres process ===');
  const ps = await run('orin-api', 'ps aux | grep -i postgres | grep -v grep | head -5');
  console.log(ps || '(empty)');

  console.log('=== Check DB connection via psql ===');
  const psql = await run('orin-api', 'PGPASSWORD=OrinDb2026Pass psql -h 127.0.0.1 -U orinapi orinapi -c "SELECT 1" 2>&1 | head -10');
  console.log(psql || '(empty)');

  console.log('=== CloudPanel DB info ===');
  const clpdb = await run('orin-api', 'cat /home/orin-api/.clp_db 2>/dev/null || ls /etc/cloudpanel/ 2>/dev/null | head -10 || echo "no clp config"');
  console.log(clpdb || '(empty)');

  console.log('=== Check .env DATABASE_URL ===');
  const env = await run('orin-api', 'grep DATABASE_URL /home/orin-api/htdocs/api.orin.se/apps/backend/.env 2>/dev/null');
  console.log(env || '(empty)');

  console.log('=== Frontend package.json storefront deps ===');
  const pkg = await run('orin', 'cat /home/orin/htdocs/www.orin.se/apps/storefront/package.json 2>/dev/null | grep medusajs');
  console.log(pkg || '(empty)');

  console.log('=== Check if @medusajs/ui installed ===');
  const ui = await run('orin', 'ls /home/orin/htdocs/www.orin.se/apps/storefront/node_modules/@medusajs/ui 2>/dev/null | head -5 || echo "NOT INSTALLED"');
  console.log(ui || '(empty)');

  console.log('=== Check storefront node_modules root ===');
  const nm = await run('orin', 'ls /home/orin/htdocs/www.orin.se/node_modules/@medusajs/ 2>/dev/null | head -10 || echo "not in root"');
  console.log(nm || '(empty)');
})();
