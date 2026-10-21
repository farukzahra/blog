#!/usr/bin/env sh
set -eu

APP_DIR="${APP_DIR:-/opt/blog}"
DEPLOY_REF="${DEPLOY_REF:-origin/main}"
WEB_PORT="${WEB_PORT:-8085}"
GITHUB_REPO="${GITHUB_REPO:-farukzahra/blog}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

cd "$APP_DIR"

sync_repo() {
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    git fetch "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" \
      "+refs/heads/*:refs/remotes/origin/*" --prune
  else
    git fetch --all --prune
  fi
  git reset --hard "$DEPLOY_REF"
}

ensure_docker() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    return 0
  fi
  echo "Docker or Docker Compose not found on VPS." >&2
  exit 1
}

deploy_stack() {
  docker compose -f "$COMPOSE_FILE" build --pull
  # Remove the previous container first: compose renames it during recreate and
  # a leftover name can block the next deploy with a name conflict.
  docker rm -f blog >/dev/null 2>&1 || true
  docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
}

health_check() {
  sleep 3
  curl -fsS "http://127.0.0.1:${WEB_PORT}/" >/dev/null
  echo "OK: blog responding on 127.0.0.1:${WEB_PORT}"
}

sync_repo
ensure_docker
deploy_stack
health_check
