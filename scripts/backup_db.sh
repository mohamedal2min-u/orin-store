#!/usr/bin/env bash
# backup_db.sh — PostgreSQL daily backup to Hetzner Storage Box
#
# Schedule (crontab on VPS):
#   0 3 * * * /home/deploy/orin.se/scripts/backup_db.sh >> /var/log/orin/backup_db.log 2>&1
#
# Requirements on VPS:
#   - pg_dump available (postgresql-client package)
#   - rsync available
#   - ~/.ssh/config entry named "storage-box" pointing to your Hetzner Storage Box
#   - /var/log/orin/ directory with write permissions for the deploy user
#
# TODO: Replace ALL placeholder values below with your actual VPS configuration.

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
DB_NAME="orin_medusa"               # TODO: match DATABASE_URL db name
DB_USER="postgres"                  # TODO: match DATABASE_URL user
DB_HOST="127.0.0.1"
DB_PORT="5432"

BACKUP_DIR="/tmp/orin-db-backups"
STORAGE_BOX_HOST="storage-box"     # TODO: SSH alias from ~/.ssh/config
STORAGE_BOX_PATH="/backups/db"     # TODO: path on your Storage Box

RETENTION_DAYS=7                   # keep last 7 daily dumps locally
LOG_PREFIX="[backup_db $(date '+%Y-%m-%d %H:%M:%S')]"
# ──────────────────────────────────────────────────────────────────────────────

TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
DUMP_FILE="${BACKUP_DIR}/orin_medusa_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "${LOG_PREFIX} Starting pg_dump of ${DB_NAME}..."
PGPASSFILE=~/.pgpass pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  --no-password \
  --format=plain \
  --no-owner \
  --no-acl \
  "${DB_NAME}" | gzip > "${DUMP_FILE}"

echo "${LOG_PREFIX} Dump complete: ${DUMP_FILE} ($(du -sh "${DUMP_FILE}" | cut -f1))"

echo "${LOG_PREFIX} Uploading to Storage Box..."
rsync -az --no-perms "${DUMP_FILE}" "${STORAGE_BOX_HOST}:${STORAGE_BOX_PATH}/"

echo "${LOG_PREFIX} Upload complete."

# Remove local dumps older than RETENTION_DAYS
find "${BACKUP_DIR}" -name "orin_medusa_*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete
echo "${LOG_PREFIX} Cleaned up local dumps older than ${RETENTION_DAYS} days."

echo "${LOG_PREFIX} Done."

# ── Restore instructions ──────────────────────────────────────────────────────
# To restore from a dump:
#   gunzip -c orin_medusa_YYYYMMDD_HHMMSS.sql.gz | psql -U postgres orin_medusa
# ─────────────────────────────────────────────────────────────────────────────
