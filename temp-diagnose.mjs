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
  // Check migration log
  console.log('=== Migration Log ===');
  const migLog = await run('orin-api', 'cat ~/migrate.log 2>/dev/null || echo "no log yet"');
  console.log(migLog);

  // Check if PostgreSQL is listening - simple test
  console.log('=== PostgreSQL port test (bash timeout) ===');
  const portTest = await run('orin-api',
    'timeout 3 bash -c "echo > /dev/tcp/127.0.0.1/5432" 2>&1 && echo "PORT OPEN" || echo "PORT CLOSED/TIMEOUT"',
    8000
  );
  console.log(portTest);

  // Check MySQL port
  console.log('=== MySQL port test ===');
  const mysqlTest = await run('orin-api',
    'timeout 3 bash -c "echo > /dev/tcp/127.0.0.1/3306" 2>&1 && echo "MYSQL PORT OPEN" || echo "MYSQL PORT CLOSED"',
    8000
  );
  console.log(mysqlTest);

  // List running processes related to DB (short command)
  console.log('=== DB processes ===');
  const procs = await run('orin-api', 'ls /var/run/postgresql/ 2>/dev/null || echo "no postgresql socket dir"');
  console.log(procs);

  // Check current .env DATABASE_URL
  console.log('=== Current .env ===');
  const env = await run('orin-api', 'grep -E "DATABASE|REDIS" /home/orin-api/htdocs/api.orin.se/apps/backend/.env');
  console.log(env);

  // Check CloudPanel DB type
  console.log('=== CloudPanel DB config ===');
  const clpConf = await run('orin-api', 'ls /home/orin-api/.my.cnf 2>/dev/null && echo "MYSQL CONFIG EXISTS" || echo "no mysql config"');
  console.log(clpConf);
})();
