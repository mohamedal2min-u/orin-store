import { execSync } from 'child_process'

try { await import('ssh2') } catch {
  console.log('Installing ssh2...')
  execSync('npm install ssh2', { stdio: 'inherit' })
}

const { Client } = await import('ssh2')

const HOST  = '82.29.181.61'
const PASS  = 'a550055A!'
const REPO  = 'https://github.com/mohamedal2min-u/orin-store.git'

const BACKEND_PATH = '/home/orin-api/htdocs/api.orin.se'
const BACKEND_APP  = `${BACKEND_PATH}/apps/backend`

const FRONTEND_PATH = '/home/orin/htdocs/www.orin.se'
const FRONTEND_APP  = `${FRONTEND_PATH}/apps/storefront`

// ─── Backend (Medusa v2) ───────────────────────────────────────────────────
const BACKEND_CMDS = [
  // init git (safe even if dir already has files or is already a repo)
  `mkdir -p ${BACKEND_PATH}`,
  `git -C ${BACKEND_PATH} init`,
  `git -C ${BACKEND_PATH} remote add origin ${REPO} 2>/dev/null || true`,
  // pull latest
  `git -C ${BACKEND_PATH} fetch origin`,
  `git -C ${BACKEND_PATH} reset --hard origin/main`,
  // install & build
  `cd ${BACKEND_APP} && npm install --legacy-peer-deps`,
  `cd ${BACKEND_APP} && npm run build`,
  // run migrations
  `cd ${BACKEND_APP} && npx medusa db:migrate`,
  // start or restart PM2
  `pm2 describe orin-backend > /dev/null 2>&1 && pm2 restart orin-backend || pm2 start npm --name orin-backend --cwd ${BACKEND_APP} -- run start`,
  `pm2 save`,
]

// ─── Frontend (Next.js 15) ────────────────────────────────────────────────
const FRONTEND_CMDS = [
  // init git (same safe approach)
  `mkdir -p ${FRONTEND_PATH}`,
  `git -C ${FRONTEND_PATH} init`,
  `git -C ${FRONTEND_PATH} remote add origin ${REPO} 2>/dev/null || true`,
  // pull latest
  `git -C ${FRONTEND_PATH} fetch origin`,
  `git -C ${FRONTEND_PATH} reset --hard origin/main`,
  // install & build
  `cd ${FRONTEND_APP} && npm install --legacy-peer-deps`,
  `cd ${FRONTEND_APP} && npm run build`,
  // start or restart PM2
  `pm2 describe orin-frontend > /dev/null 2>&1 && pm2 restart orin-frontend || pm2 start npm --name orin-frontend --cwd ${FRONTEND_APP} -- run start`,
  `pm2 save`,
]

// ─── SSH runner ───────────────────────────────────────────────────────────
function runSSH(user, commands) {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => {
      console.log(`\n🔗 Connected as ${user}\n`)
      let i = 0
      function next() {
        if (i >= commands.length) { conn.end(); resolve(); return }
        const cmd = commands[i++]
        console.log(`>>> ${cmd}`)
        conn.exec(cmd, (err, stream) => {
          if (err) { console.error(err); next(); return }
          stream.on('data', d => process.stdout.write(d.toString()))
          stream.stderr.on('data', d => process.stderr.write(d.toString()))
          stream.on('close', code => {
            if (code !== 0) console.warn(`  ⚠  exit code: ${code}`)
            console.log()
            next()
          })
        })
      }
      next()
    })
    .on('error', reject)
    .connect({ host: HOST, port: 22, username: user, password: PASS })
  })
}

// ─── Entry point ──────────────────────────────────────────────────────────
const mode = process.argv[2] // 'backend' | 'frontend' | undefined = both

if (!mode || mode === 'backend') {
  console.log('🔧 Deploying Backend  →  api.orin.se (Medusa v2)')
  await runSSH('orin-api', BACKEND_CMDS)
  console.log('✅ Backend done!')
}

if (!mode || mode === 'frontend') {
  console.log('\n🎨 Deploying Frontend  →  www.orin.se (Next.js 15)')
  await runSSH('orin', FRONTEND_CMDS)
  console.log('✅ Frontend done!')
}

console.log('\n🚀 ORIN store deployed!')
