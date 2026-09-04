# Deploy — Tech Blog (Astro)

Referência operacional para **https://blog.faruk.dev.br**.

## Infra

| Item | Valor |
|------|-------|
| VPS | `66.23.231.218` |
| Path | `/opt/blog` |
| Porta interna | `127.0.0.1:8085` |
| Repo | `https://github.com/farukzahra/blog` |
| Proxy HTTPS | Caddy (`/etc/caddy/Caddyfile`) |

Credenciais locais: `secrets.local.md` (gitignored).

## DNS (Registro.br)

```text
A  blog  66.23.231.218
```

## GitHub Secrets

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | `66.23.231.218` |
| `VPS_USER` | `root` |
| `VPS_PORT` | `22` |
| `VPS_SSH_KEY` | conteúdo de `deploy_key` |
| `DEPLOY_PATH` | `/opt/blog` |

## Primeiro deploy manual

```bash
ssh -i C:/repo/secrets/vps/ssh/github-actions-vps-shared root@66.23.231.218

mkdir -p /opt/blog
git clone https://github.com/farukzahra/blog.git /opt/blog
cd /opt/blog
chmod +x scripts/deploy-vps.sh
WEB_PORT=8085 sh scripts/deploy-vps.sh
```

## Caddy

Snippet: [`deploy/caddy-blog.snippet`](caddy-blog.snippet)

```bash
# Editar /etc/caddy/Caddyfile, adicionar bloco blog.faruk.dev.br
systemctl reload caddy
curl -sI https://blog.faruk.dev.br/
```

## Deploy automático

Push em `main` → `.github/workflows/deploy.yml`:

1. `npm ci` + `npm run build` (CI)
2. SSH na VPS → `git reset` → `docker compose up -d --build`

## Verificação

```bash
curl -sI http://127.0.0.1:8085/
curl -sI https://blog.faruk.dev.br/
docker ps --filter name=blog
```
