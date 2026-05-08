---
name: vps-deployment
description: VPS deployment and server management for ORIN.SE on Hetzner. Covers CloudPanel, PM2, Nginx, PostgreSQL, backup strategy, and disk management.
---

# VPS Deployment — ORIN.SE

> Hetzner VPS with CloudPanel. No Docker. PM2 for process management. Images off-disk via R2.

---

## When to Use

- Provisioning or configuring the VPS
- Deploying application updates
- Managing PM2 processes
- Setting up or testing backups
- Troubleshooting server issues
- Monitoring disk usage

---

## Server Specifications

| Spec           | Value                   |
|----------------|-------------------------|
| Provider       | Hetzner                 |
| OS             | Ubuntu (LTS)            |
| Disk           | 100 GB SSD              |
| Panel          | CloudPanel              |
| Web Server     | Nginx (via CloudPanel)  |
| Node.js        | LTS (via nvm or system) |
| Process Mgr    | PM2 (global)            |
| Database       | PostgreSQL              |

---

## Disk Budget

| Item                              | Size   | Notes                        |
|-----------------------------------|--------|------------------------------|
| Ubuntu OS + packages              | ~10 GB |                              |
| CloudPanel + Nginx                | ~2 GB  |                              |
| PostgreSQL data                   | ~5 GB  | Grows with orders            |
| Medusa + node_modules             | ~2 GB  |                              |
| Next.js + node_modules + .next    | ~3 GB  |                              |
| Logs (with rotation)              | ~5 GB  | Configure logrotate          |
| Local DB backups (4 × 6h)         | ~3 GB  |                              |
| **Free headroom**                 | **~70 GB** | Monitor with `df -h`     |

> **Critical rule**: Images are NOT stored on VPS. They live in Cloudflare R2.

---

## PM2 Configuration

### Process List

```bash
# Medusa Backend
pm2 start npm --name "medusa-backend" -- run start
# or
pm2 start "node .medusa/server/index.js" --name "medusa-backend"

# Next.js Storefront (standalone)
pm2 start "node .next/standalone/server.js" --name "nextjs-storefront"

# Save & persist across reboots
pm2 save
pm2 startup
```

### Common Commands

```bash
pm2 status                           # View all processes
pm2 logs medusa-backend --lines 50   # View logs
pm2 restart medusa-backend --update-env  # Restart with new env
pm2 restart nextjs-storefront        # Restart storefront
pm2 monit                            # Real-time monitoring
```

---

## Port Layout

| Service     | Port  | Reverse Proxy     |
|-------------|-------|-------------------|
| Next.js     | 3000  | orin.se → :3000   |
| Medusa v2   | 9000  | admin.orin.se → :9000 |
| PostgreSQL  | 5432  | localhost only     |

Nginx (CloudPanel) handles SSL termination and reverse proxying.

---

## Deployment Script

```bash
#!/bin/bash
# /home/deploy/scripts/deploy.sh
set -euo pipefail

echo "🔄 Pulling latest code..."
cd /home/deploy/orin.se
git pull origin main

echo "📦 Building backend..."
cd backend
pnpm install --frozen-lockfile
pnpm build
pm2 restart medusa-backend --update-env

echo "🎨 Building storefront..."
cd ../storefront
pnpm install --frozen-lockfile
pnpm build
pm2 restart nextjs-storefront

echo "✅ Deploy complete!"
pm2 status
```

---

## Backup Strategy

### PostgreSQL (Daily at 03:00)

```bash
#!/bin/bash
# /home/deploy/scripts/backup-db.sh
set -euo pipefail

BACKUP_DIR="/home/deploy/backups/db"
DATE=$(date +%Y-%m-%d_%H%M)
DB_NAME="medusa_db"

mkdir -p "$BACKUP_DIR"
pg_dump "$DB_NAME" | gzip > "$BACKUP_DIR/$DB_NAME-$DATE.sql.gz"

# Keep last 4 backups (24h apart = ~4 days retention)
ls -t "$BACKUP_DIR"/*.gz | tail -n +5 | xargs -r rm

# Sync to Hetzner Storage Box
rsync -az "$BACKUP_DIR/" user@storagebox:/backups/db/
```

Cron: `0 3 * * * /home/deploy/scripts/backup-db.sh`

### R2 → Backblaze B2 (Weekly, Sunday 04:30)

```bash
#!/bin/bash
# /home/deploy/scripts/backup-r2-weekly.sh
set -euo pipefail

DATE=$(date +%Y-%m-%d)

rclone sync \
  r2:medusa-uploads \
  b2:watches-backup-weekly/snapshot-$DATE/ \
  --progress \
  --transfers 8 \
  --checkers 16 \
  --log-file /var/log/r2-backup.log

# Keep last 4 snapshots
rclone lsd b2:watches-backup-weekly | \
  awk '{print $5}' | \
  sort | head -n -4 | \
  while read dir; do
    rclone purge "b2:watches-backup-weekly/$dir"
  done

echo "[$DATE] R2 → B2 backup completed"
```

Cron: `30 4 * * 0 /home/deploy/scripts/backup-r2-weekly.sh`

### Config Files (Weekly)

```bash
# Sync .env and nginx configs to Storage Box
rsync -az /home/deploy/orin.se/backend/.env user@storagebox:/backups/config/
rsync -az /etc/nginx/sites-available/ user@storagebox:/backups/nginx/
```

---

## Security Checklist

- [ ] SSH key-only authentication (disable password login)
- [ ] Firewall: only 22, 80, 443 open
- [ ] PostgreSQL: localhost only, strong password
- [ ] `.env` files: `chmod 600`
- [ ] Automatic security updates enabled
- [ ] CloudPanel admin: strong password + 2FA
- [ ] R2 API token: scoped to `medusa-uploads` bucket only

---

## Monitoring

```bash
# Disk usage
df -h

# Memory
free -h

# PM2 processes
pm2 status

# PostgreSQL connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Nginx error log
tail -f /var/log/nginx/error.log
```

---

## Rules

1. **All scripts use `set -euo pipefail`** — fail fast
2. **Never store images on VPS** — R2 only
3. **`pnpm install --frozen-lockfile`** in production — no surprises
4. **Run `pnpm build` before `pm2 restart`** — always
5. **Monitor disk with `df -h`** — alert if below 20 GB free
6. **Backup DB daily, R2 weekly** — no exceptions
7. **Log rotation** must be configured for PM2 and Nginx logs
