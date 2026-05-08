// PM2 process configuration for orin.se on Hetzner VPS.
// Start both processes: pm2 start ecosystem.config.js
// Reload without downtime: pm2 reload all
// Save process list across reboots: pm2 save && pm2 startup
//
// Secrets are loaded from env_file paths on the VPS — never commit actual .env files.
// Expected on VPS:
//   /home/deploy/.env.backend    (copy of backend/apps/backend/.env with production values)
//   /home/deploy/.env.storefront (NEXT_PUBLIC_* vars for the storefront)

module.exports = {
  apps: [
    {
      name: 'medusa',
      cwd: 'backend/apps/backend',
      script: 'node',
      args: '.medusa/server/index.js',
      // Load production secrets from outside the repo
      env_file: '/home/deploy/.env.backend',
      env: {
        NODE_ENV: 'production',
      },
      // Restart if heap exceeds 512 MB — guards against memory leaks during image processing
      max_memory_restart: '512M',
      // Keep last 14 days of logs; rotate at 10 MB per file
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/orin/medusa-error.log',
      out_file: '/var/log/orin/medusa-out.log',
      merge_logs: true,
    },
    {
      name: 'storefront',
      cwd: 'storefront',
      script: 'node',
      args: '.next/standalone/server.js',
      env_file: '/home/deploy/.env.storefront',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '127.0.0.1',
      },
      max_memory_restart: '384M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/orin/storefront-error.log',
      out_file: '/var/log/orin/storefront-out.log',
      merge_logs: true,
    },
  ],
}
