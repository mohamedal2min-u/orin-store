import { Client } from 'ssh2';
const HOST = '82.29.181.61';
const PASS = 'a550055A!';
const REPO = 'https://github.com/mohamedal2min-u/orin-store.git';

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

const BACKEND_PATH = '/home/orin-api/htdocs/api.orin.se';
const BACKEND_APP = `${BACKEND_PATH}/apps/backend`;

const FRONTEND_PATH = '/home/orin/htdocs/www.orin.se';
const FRONTEND_APP = `${FRONTEND_PATH}/apps/storefront`;

const backendScript = `#!/bin/bash
set -e
LOG=~/deploy-backend.log
echo "=== $(date) ===" > $LOG
echo "Cloning/pulling repo..." >> $LOG
mkdir -p ${BACKEND_PATH}
git -C ${BACKEND_PATH} init >> $LOG 2>&1
git -C ${BACKEND_PATH} remote add origin ${REPO} 2>/dev/null || true
git -C ${BACKEND_PATH} fetch origin >> $LOG 2>&1
git -C ${BACKEND_PATH} reset --hard origin/main >> $LOG 2>&1
echo "Installing dependencies..." >> $LOG
cd ${BACKEND_APP} && npm install --legacy-peer-deps >> $LOG 2>&1
echo "Building..." >> $LOG
cd ${BACKEND_APP} && npm run build >> $LOG 2>&1
echo "Running migrations..." >> $LOG
cd ${BACKEND_APP} && npx medusa db:migrate >> $LOG 2>&1
echo "Starting PM2..." >> $LOG
pm2 describe orin-backend > /dev/null 2>&1 && pm2 restart orin-backend >> $LOG 2>&1 || pm2 start npm --name orin-backend --cwd ${BACKEND_APP} -- run start >> $LOG 2>&1
pm2 save >> $LOG 2>&1
echo "DONE" >> $LOG
`;

const frontendScript = `#!/bin/bash
set -e
LOG=~/deploy-frontend.log
echo "=== $(date) ===" > $LOG
echo "Cloning/pulling repo..." >> $LOG
mkdir -p ${FRONTEND_PATH}
git -C ${FRONTEND_PATH} init >> $LOG 2>&1
git -C ${FRONTEND_PATH} remote add origin ${REPO} 2>/dev/null || true
git -C ${FRONTEND_PATH} fetch origin >> $LOG 2>&1
git -C ${FRONTEND_PATH} reset --hard origin/main >> $LOG 2>&1
echo "Installing dependencies..." >> $LOG
cd ${FRONTEND_APP} && npm install --legacy-peer-deps >> $LOG 2>&1
echo "Building..." >> $LOG
cd ${FRONTEND_APP} && npm run build >> $LOG 2>&1
echo "Starting PM2..." >> $LOG
pm2 describe orin-frontend > /dev/null 2>&1 && pm2 restart orin-frontend >> $LOG 2>&1 || pm2 start npm --name orin-frontend --cwd ${FRONTEND_APP} -- run start >> $LOG 2>&1
pm2 save >> $LOG 2>&1
echo "DONE" >> $LOG
`;

(async () => {
  console.log('Writing deploy scripts to server...');
  const w1 = await run('orin-api', `cat > ~/deploy.sh << 'SCRIPTEOF'\n${backendScript}\nSCRIPTEOF\nchmod +x ~/deploy.sh`);
  const w2 = await run('orin', `cat > ~/deploy.sh << 'SCRIPTEOF'\n${frontendScript}\nSCRIPTEOF\nchmod +x ~/deploy.sh`);
  console.log('Backend script written:', w1 || 'OK');
  console.log('Frontend script written:', w2 || 'OK');

  console.log('\nLaunching backend deploy in background...');
  const b = await run('orin-api', 'nohup bash ~/deploy.sh > /dev/null 2>&1 & echo "PID: $!"', 10000);
  console.log('Backend:', b.trim());

  console.log('Launching frontend deploy in background...');
  const f = await run('orin', 'nohup bash ~/deploy.sh > /dev/null 2>&1 & echo "PID: $!"', 10000);
  console.log('Frontend:', f.trim());

  console.log('\n✅ Both deploys running in background on server!');
})();
