import { Client } from 'ssh2';
const HOST = '82.29.181.61';
const PASS = 'a550055A!';

async function run(user, cmd, timeout = 30000) {
  return new Promise((resolve) => {
    const conn = new Client();
    const timer = setTimeout(() => { conn.end(); resolve('TIMEOUT') }, timeout);
    conn.on('ready', () => {
      conn.exec(cmd, (err, stream) => {
        if (err) { clearTimeout(timer); conn.end(); resolve('ERROR'); return; }
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.stderr.on('data', d => out += d.toString());
        stream.on('close', () => { clearTimeout(timer); conn.end(); resolve(out); });
      });
    }).on('error', e => {
      clearTimeout(timer); resolve('AUTH FAILED: ' + e.message);
    }).connect({ host: HOST, port: 22, username: user, password: PASS });
  });
}

(async () => {
  console.log('Fixing frontend .env.local on server (in apps/storefront)...');
  const fixEnvCmd = `echo "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_dummy_for_build" > /home/orin/htdocs/www.orin.se/apps/storefront/.env.local`;
  const envResult = await run('orin', fixEnvCmd);
  console.log('Env fix result:', envResult || 'OK');

  console.log('\nRestarting frontend deploy in background...');
  await run('orin', 'echo "=== Restarting deploy 2 ===" > ~/deploy-frontend.log');
  const f = await run('orin', 'nohup bash ~/deploy.sh >> ~/deploy-frontend.log 2>&1 & echo "PID: $!"', 10000);
  console.log('Frontend restarted:', f.trim());
})();
