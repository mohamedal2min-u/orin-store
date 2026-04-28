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
  // Try original password OrinDb2026Pass
  console.log('=== Test: old password OrinDb2026Pass ===');
  await run('orin-api',
    'PGPASSWORD="OrinDb2026Pass" /usr/bin/psql -h 127.0.0.1 -U orinapi -d orinapi -c "SELECT 1" > ~/psql-old.txt 2>&1; echo done',
    10000
  );
  const old = await run('orin-api', 'cat ~/psql-old.txt 2>/dev/null');
  console.log(old);

  // Try sudo to get postgres access
  console.log('=== Test: sudo psql as postgres ===');
  await run('orin-api',
    'sudo -u postgres /usr/bin/psql -c "\\\\du" > ~/psql-sudo.txt 2>&1; echo done',
    8000
  );
  const sudo = await run('orin-api', 'cat ~/psql-sudo.txt 2>/dev/null');
  console.log('sudo result:', sudo);

  // Check if we have sudo rights
  console.log('=== sudo -l ===');
  const sudoL = await run('orin-api', 'sudo -l 2>&1 | head -10');
  console.log(sudoL);
})();
