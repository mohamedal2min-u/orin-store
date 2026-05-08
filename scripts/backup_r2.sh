#!/usr/bin/env bash
# backup_r2.sh — Weekly sync of Cloudflare R2 bucket to Backblaze B2
#
# Schedule (crontab on VPS):
#   30 4 * * 0 /home/deploy/orin.se/scripts/backup_r2.sh >> /var/log/orin/backup_r2.log 2>&1
#
# Requirements on VPS:
#   - rclone installed and configured (https://rclone.org)
#   - rclone remote "r2" configured for Cloudflare R2 (S3-compatible)
#   - rclone remote "b2" configured for Backblaze B2
#   - /var/log/orin/ directory with write permissions for the deploy user
#
# rclone config for R2 (add to ~/.config/rclone/rclone.conf):
#   [r2]
#   type = s3
#   provider = Cloudflare
#   access_key_id = TODO_R2_ACCESS_KEY_ID
#   secret_access_key = TODO_R2_SECRET_ACCESS_KEY
#   endpoint = https://TODO_ACCOUNT_ID.r2.cloudflarestorage.com
#   no_check_bucket = true
#
# rclone config for B2 (add to ~/.config/rclone/rclone.conf):
#   [b2]
#   type = b2
#   account = TODO_B2_ACCOUNT_ID
#   key = TODO_B2_APPLICATION_KEY
#
# TODO: Replace ALL placeholder values below with your actual configuration.

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
R2_REMOTE="r2"
R2_BUCKET="medusa-uploads"         # TODO: match R2_BUCKET env var

B2_REMOTE="b2"
B2_BUCKET="orin-r2-backup"        # TODO: create this bucket in Backblaze B2

RETENTION_SNAPSHOTS=4              # keep last 4 weekly snapshots
LOG_PREFIX="[backup_r2 $(date '+%Y-%m-%d %H:%M:%S')]"
# ──────────────────────────────────────────────────────────────────────────────

SNAPSHOT_DIR="snapshots/$(date '+%Y%m%d')"
DEST="${B2_REMOTE}:${B2_BUCKET}/${SNAPSHOT_DIR}"

echo "${LOG_PREFIX} Starting R2 → B2 sync..."
echo "${LOG_PREFIX} Source: ${R2_REMOTE}:${R2_BUCKET}"
echo "${LOG_PREFIX} Destination: ${DEST}"

rclone sync \
  "${R2_REMOTE}:${R2_BUCKET}" \
  "${DEST}" \
  --progress \
  --transfers 8 \
  --checkers 16 \
  --retries 3 \
  --log-level INFO

echo "${LOG_PREFIX} Sync complete."

# Prune snapshots older than RETENTION_SNAPSHOTS weeks
echo "${LOG_PREFIX} Pruning old snapshots (keeping last ${RETENTION_SNAPSHOTS})..."
SNAPSHOT_COUNT=$(rclone lsd "${B2_REMOTE}:${B2_BUCKET}/snapshots/" 2>/dev/null | wc -l || echo 0)
if [ "${SNAPSHOT_COUNT}" -gt "${RETENTION_SNAPSHOTS}" ]; then
  PRUNE_COUNT=$(( SNAPSHOT_COUNT - RETENTION_SNAPSHOTS ))
  rclone lsd "${B2_REMOTE}:${B2_BUCKET}/snapshots/" \
    | sort \
    | head -n "${PRUNE_COUNT}" \
    | awk '{print $NF}' \
    | while read -r DIR; do
        echo "${LOG_PREFIX} Deleting old snapshot: ${DIR}"
        rclone purge "${B2_REMOTE}:${B2_BUCKET}/snapshots/${DIR}"
      done
fi

echo "${LOG_PREFIX} Done. Total snapshots: $(rclone lsd "${B2_REMOTE}:${B2_BUCKET}/snapshots/" 2>/dev/null | wc -l || echo 0)"
