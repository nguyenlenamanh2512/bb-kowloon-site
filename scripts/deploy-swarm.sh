#!/usr/bin/env sh
set -eu

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$project_dir"

env_file="${SWARM_ENV_FILE:-.env.swarm}"
if [ ! -f "$env_file" ]; then
  echo "Missing $env_file. Copy .env.swarm.example to .env.swarm first." >&2
  exit 1
fi

set -a
. "./$env_file"
set +a

: "${STACK_NAME:?STACK_NAME is required}"
: "${IMAGE_NAME:?IMAGE_NAME is required}"

if [ "$(docker info --format '{{.Swarm.LocalNodeState}}')" != "active" ]; then
  echo "Docker Swarm is not active. Run: docker swarm init" >&2
  exit 1
fi

docker pull "$IMAGE_NAME"
docker stack deploy --with-registry-auth --prune -c docker-stack.yml "$STACK_NAME"
docker stack services "$STACK_NAME"
