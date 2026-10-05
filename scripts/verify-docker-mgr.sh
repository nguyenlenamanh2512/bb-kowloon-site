#!/usr/bin/env sh
set -eu

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$project_dir"

env_file="${DOCKER_MGR_ENV_FILE:-.env.docker-mgr}"
compose_file="compose.docker-mgr.yaml"

if [ ! -f "$env_file" ]; then
  echo "Missing $env_file." >&2
  exit 1
fi

set -a
. "./$env_file"
set +a

data_path="${DATA_PATH:-/srv/bb-kowloon-v1/storage}"
app_port="${APP_PORT:-3000}"
container_id="$(docker compose --env-file "$env_file" -f "$compose_file" ps -q website)"

if [ -z "$container_id" ]; then
  echo "Website container is not running." >&2
  exit 1
fi

health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"
if [ "$health" != "healthy" ]; then
  echo "Website health is $health, expected healthy." >&2
  exit 1
fi

mounted_source="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/app/storage"}}{{.Source}}{{end}}{{end}}' "$container_id")"
if [ "$mounted_source" != "$data_path" ]; then
  echo "Unexpected storage mount: $mounted_source (expected $data_path)." >&2
  exit 1
fi

curl -fsS "http://127.0.0.1:$app_port/" >/dev/null
curl -fsS "http://127.0.0.1:$app_port/login" >/dev/null

if [ ! -f "$data_path/cms-data.json" ]; then
  echo "Persistent CMS file is missing: $data_path/cms-data.json" >&2
  exit 1
fi

checksum_before="$(sha256sum "$data_path/cms-data.json" | awk '{print $1}')"
docker compose --env-file "$env_file" -f "$compose_file" restart website >/dev/null

attempt=1
while [ "$attempt" -le 30 ]; do
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"
  [ "$health" = "healthy" ] && break
  sleep 2
  attempt=$((attempt + 1))
done

if [ "$health" != "healthy" ]; then
  echo "Website did not become healthy after restart." >&2
  exit 1
fi

checksum_after="$(sha256sum "$data_path/cms-data.json" | awk '{print $1}')"
if [ "$checksum_before" != "$checksum_after" ]; then
  echo "CMS data checksum changed unexpectedly across restart." >&2
  exit 1
fi

curl -fsS "http://127.0.0.1:$app_port/" >/dev/null
echo "Verification passed: healthy container, HTTP routes, bind mount, and persistent CMS data."

