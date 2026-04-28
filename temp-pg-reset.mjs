import { Client } from 'ssh2';
const HOST = '82.29.181.61';
const SITE_PASS = 'a550055A!';

// Run with PTY (allows sudo with use_pty requirement)
function runWithPty(user, commands) {
  return new Promise((resolve) => {
    const conn = new Client();
    let output = '';
    const timer = setTimeout(() => { conn.end(); resolve(output + '\nTIMEOUT'); }, 20000);

    conn.on('ready', () => {
      conn.shell({ term: 'xterm' }, (err, stream) => {
        if (err) { clearTimeout(timer); conn.end(); resolve('SHELL ERROR: ' + err.message); return; }
        stream.on('data', d => { output += d.toString(); });
        stream.stderr.on('data', d => { output += d.toString(); });

        // Send commands with delay
        let delay = 500;
        for (const cmd of commands) {
          setTimeout(() => stream.write(cmd + '\n'), delay);
          delay += 1500;
        }
        // Exit after all commands
        setTimeout(() => {
          stream.write('exit\n');
        }, delay + 1000);

        stream.on('close', () => { clearTimeout(timer); conn.end(); resolve(output); });
      });
    }).on('error', e => { clearTimeout(timer); resolve('AUTH FAILED: ' + e.message); })
    .connect({ host: HOST, port: 22, username: user, password: SITE_PASS });
  });
}

// Simple exec (no PTY)
function run(user, cmd, timeout = 12000) {
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
    .connect({ host: HOST, port: 22, username: user, password: SITE_PASS });
  });
}

(async () => {
  console.log('=== Attempt: Reset postgres password via PTY shell ===');
  const result = await runWithPty('orin-api', [
    `echo '${SITE_PASS}' | sudo -S -u postgres /usr/bin/psql -c "ALTER USER orinapi WITH PASSWORD '${SITE_PASS}';" 2>&1`,
    'sleep 2',
    'echo "CMD_DONE"'
  ]);
  console.log('PTY result:', result.split('\n').slice(-20).join('\n'));

  // Check if it worked
  console.log('\n=== Test connection after reset ===');
  await run('orin-api',
    `PGPASSWORD="${SITE_PASS}" /usr/bin/psql -h 127.0.0.1 -U orinapi -d orinapi -c "SELECT 1" > ~/psql-after-reset.txt 2>&1; echo done`,
    10000
  );
  const after = await run('orin-api', 'cat ~/psql-after-reset.txt 2>/dev/null');
  console.log('After reset:', after);
})();
