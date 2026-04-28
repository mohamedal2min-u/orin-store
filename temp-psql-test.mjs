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
  // Write psql test result to file then read it
  console.log('=== Test 1: psql via TCP (write to file) ===');
  await run('orin-api',
    'PGPASSWORD="a550055A!" /usr/bin/psql -h 127.0.0.1 -U orinapi -d orinapi -c "SELECT 1" > ~/psql-test.txt 2>&1; echo "DONE"',
    10000
  );
  const psqlResult = await run('orin-api', 'cat ~/psql-test.txt 2>/dev/null || echo "no file"');
  console.log('psql TCP result:', psqlResult);

  // Try via Unix socket
  console.log('=== Test 2: psql via Unix socket ===');
  await run('orin-api',
    'PGPASSWORD="a550055A!" /usr/bin/psql -h /var/run/postgresql -U orinapi -d orinapi -c "SELECT 1" > ~/psql-sock.txt 2>&1; echo "DONE"',
    10000
  );
  const sockResult = await run('orin-api', 'cat ~/psql-sock.txt 2>/dev/null || echo "no file"');
  console.log('psql socket result:', sockResult);

  // Check if psql exists
  console.log('=== Test 3: which psql ===');
  const which = await run('orin-api', 'ls /usr/bin/psql 2>/dev/null && echo "EXISTS" || ls /usr/lib/postgresql/*/bin/psql 2>/dev/null | head -1');
  console.log(which);

  // Try DATABASE_URL with socket path
  console.log('=== Test 4: Check pg_hba via indirect read ===');
  const pgConf = await run('orin-api',
    'ls /etc/postgresql/*/main/pg_hba.conf 2>/dev/null | head -3',
    5000
  );
  console.log('pg_hba path:', pgConf);
})();
