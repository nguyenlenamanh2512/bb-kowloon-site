#!/usr/bin/env sh
set -eu

project_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$project_dir"

git pull --ff-only
docker compose build --pull
docker compose up -d --remove-orphans
docker compose ps
