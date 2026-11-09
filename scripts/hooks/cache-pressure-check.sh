#!/usr/bin/env bash
# cache-pressure-check — warn when disk space is low
# Trigger: periodic (cron) or pre-build
# Advisory: prints disk usage + cleanup suggestion
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
THRESHOLD_GB="${DISK_THRESHOLD_GB:-10}"  # env override, default 10GB
if ! [[ "$THRESHOLD_GB" =~ ^[0-9]+$ ]]; then
  echo "[hooks] invalid DISK_THRESHOLD_GB='$THRESHOLD_GB'; using 10" >&2
  THRESHOLD_GB=10
fi

AVAILABLE_KB=$(df -k "$ROOT" 2>/dev/null | awk 'NR==2 {print $4}' || echo "0")
[[ "$AVAILABLE_KB" =~ ^[0-9]+$ ]] || AVAILABLE_KB=0
AVAILABLE_GB=$((AVAILABLE_KB / 1024 / 1024))

echo "[hooks] disk space: ${AVAILABLE_GB}GB available"
if [ "$AVAILABLE_GB" -lt "$THRESHOLD_GB" ]; then
  echo "[hooks] LOW DISK: ${AVAILABLE_GB}GB < ${THRESHOLD_GB}GB threshold"
  echo "[hooks] run: clean-system-cache"
else
  echo "[hooks] disk space OK"
fi
exit 0
