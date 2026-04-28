import { Client } from 'ssh2';

async function run(user, cmd, timeout = 10000) {
  return new Promise((resolve) => {
    const conn = new Client();
    const timer = setTimeout(() => { conn.end(); resolve('TIMEOUT') }, timeout);
    conn.on('ready', () => {
      conn.exec(cmd, (err, stream) => {
        if (err) { clearTimeout(timer); conn.end(); resolve(''); return; }
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.stderr.on('data', d => out += d.toString());
        stream.on('close', () => { clearTimeout(timer); conn.end(); resolve(out); });
      });
    }).on('error', e => { clearTimeout(timer); resolve(''); })
    .connect({ host: '82.29.181.61', port: 22, username: user, password: 'a550055A!' });
  });
}

(async () => {
  console.log('=== Backend Log ===');
  const b = await run('orin-api', 'tail -20 ~/deploy-backend.log 2>/dev/null || echo "log not ready yet"');
  console.log(b);

  console.log('=== Frontend Log ===');
  const f = await run('orin', 'tail -20 ~/deploy-frontend.log 2>/dev/null || echo "log not ready yet"');
  console.log(f);
})();
