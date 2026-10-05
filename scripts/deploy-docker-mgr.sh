#!/usr/bin/env sh
set -eu

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$project_dir"

env_file="${DOCKER_MGR_ENV_FILE:-.env.docker-mgr}"
compose_file="compose.docker-mgr.yaml"

if [ ! -f "$env_file" ]; then
  echo "Missing $env_file. Copy .env.docker-mgr.example to .env.docker-mgr and set production values." >&2
  exit 1
fi

set -a
. "./$env_file"
set +a

: "${SITE_URL:?SITE_URL is required}"
: "${AUTH_SECRET:?AUTH_SECRET is required}"

if [ "${#AUTH_SECRET}" -lt 32 ]; then
  echo "AUTH_SECRET must contain at least 32 characters." >&2
  exit 1
fi

data_path="${DATA_PATH:-/srv/bb-kowloon-v1/storage}"
case "$data_path" in
  /*) ;;
  *) echo "DATA_PATH must be an absolute path." >&2; exit 1 ;;
esac

case "$data_path" in
  /|/srv|/var|/home|/root) echo "Refusing unsafe DATA_PATH: $data_path" >&2; exit 1 ;;
esac

mkdir -p "$data_path"

if [ ! -f "$data_path/cms-data.json" ] && [ -f "$project_dir/storage/cms-data.json" ]; then
  cp -R "$project_dir/storage/." "$data_path/"
  echo "Imported the bundled local CMS data into $data_path."
fi

if [ ! -f "$data_path/cms-data.json" ]; then
  : "${CMS_BOOTSTRAP_USERNAME:?CMS_BOOTSTRAP_USERNAME is required for a fresh data directory}"
  : "${CMS_BOOTSTRAP_DISPLAY_NAME:?CMS_BOOTSTRAP_DISPLAY_NAME is required for a fresh data directory}"
  : "${CMS_BOOTSTRAP_PASSWORD:?CMS_BOOTSTRAP_PASSWORD is required for a fresh data directory}"
  if [ "${#CMS_BOOTSTRAP_PASSWORD}" -lt 12 ]; then
    echo "CMS_BOOTSTRAP_PASSWORD must contain at least 12 characters." >&2
    exit 1
  fi
fi

chown -R 1001:1001 "$data_path"

if [ -f "$data_path/cms-data.json" ]; then
  backup_dir="$(dirname "$data_path")/backups"
  mkdir -p "$backup_dir"
  timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
  tar -czf "$backup_dir/storage-$timestamp.tar.gz" -C "$data_path" .
  echo "Created data backup: $backup_dir/storage-$timestamp.tar.gz"
fi

docker compose --env-file "$env_file" -f "$compose_file" config >/dev/null
docker compose --env-file "$env_file" -f "$compose_file" build --pull
docker compose --env-file "$env_file" -f "$compose_file" up -d --remove-orphans

container_id="$(docker compose --env-file "$env_file" -f "$compose_file" ps -q website)"
if [ -z "$container_id" ]; then
  echo "Website container was not created." >&2
  exit 1
fi

attempt=1
while [ "$attempt" -le 30 ]; do
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"
  if [ "$health" = "healthy" ]; then
    docker compose --env-file "$env_file" -f "$compose_file" ps
    echo "Website is healthy on port ${APP_PORT:-3000}."
    exit 0
  fi
  if [ "$health" = "unhealthy" ] || [ "$health" = "exited" ] || [ "$health" = "dead" ]; then
    docker compose --env-file "$env_file" -f "$compose_file" logs --tail 100 website >&2
    exit 1
  fi
  sleep 2
  attempt=$((attempt + 1))
done

docker compose --env-file "$env_file" -f "$compose_file" logs --tail 100 website >&2
echo "Website did not become healthy within 60 seconds." >&2
exit 1
