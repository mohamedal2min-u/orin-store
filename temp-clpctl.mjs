import { Client } from 'ssh2';
const HOST = '82.29.181.61';
const PASS = 'a550055A!';

async function run(user, cmd, timeout = 12000) {
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
  console.log('=== clpctlWrapper help ===');
  const help = await run('orin-api', 'sudo /usr/bin/clpctlWrapper --help 2>&1 | head -50');
  console.log(help);

  console.log('=== clpctlWrapper list commands ===');
  const list = await run('orin-api', 'sudo /usr/bin/clpctlWrapper list 2>&1 | head -50');
  console.log(list);

  // Try db commands
  console.log('=== clpctlWrapper db ===');
  const db = await run('orin-api', 'sudo /usr/bin/clpctlWrapper db 2>&1 | head -30');
  console.log(db);
})();
