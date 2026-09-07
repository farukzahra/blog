# AGENTS.md

Guia operacional para agentes de IA trabalhando no **blog** (Astro SSG). Leia antes de fazer alterações.

## O que é este repo

Blog técnico estático em **Astro** — artigos sobre Java, Spring, AI Engineering, MCP, LLMs, RAG, arquitetura e carreira.

* Plano completo: [`plan.md`](plan.md)
* Guia visual Lumen: [`docs/ESTILO-WEB.md`](docs/ESTILO-WEB.md) — alinhado a [faruk.dev.br](https://www.faruk.dev.br)
* Infra VPS/PAT (local, gitignored): [`secrets.local.md`](secrets.local.md)
* Template de convenções: [`C:\repo\faruk_base\AGENTS.md`](C:\repo\faruk_base\AGENTS.md)

## Stack

| Camada | Escolha |
|--------|---------|
| Framework | Astro 5 + TypeScript |
| Estilo | Tailwind CSS |
| Conteúdo | MDX + Content Collections |
| Busca | Pagefind |
| Syntax highlight | Shiki |
| Diagramas | Mermaid |
| Matemática | KaTeX |
| Deploy | GitHub Actions → Docker (Nginx) → VPS |
| HTTPS | Caddy no host (`blog.faruk.dev.br`) |

**Sem backend**, **sem banco** — site 100% estático.

## Workflow do agente

Ordem padrão (herdado do Faruk Base):

```
brainstorming
  → writing-plans
  → implement
  → verification-before-completion
  → /commit-push (caveman-commit + push)
```

| Fase | Skill | Obrigatório? |
|------|-------|--------------|
| Design | `brainstorming` | Sim, antes de código criativo |
| Plano | `writing-plans` | Sim, salvar em `docs/plans/` |
| UI | `frontend-design`, `hallmark` | Ao construir layout/visual |
| Build | implementação direta | Astro components + MDX |
| Debug | `systematic-debugging` | Antes de chutar fixes |
| Done | `verification-before-completion` | Sempre — build + preview |
| Commit | `caveman-commit` | Só via `/commit-push` ou pedido explícito |

### Skills do Faruk Base — o que usar aqui

Restaurar skills após clone (copiar `skills-lock.json` do faruk_base ou instalar manualmente):

```bash
npx skills experimental_install
```

| Skill | Usar neste projeto? | Quando |
|-------|---------------------|--------|
| `brainstorming` | ✅ Sim | Nova feature, layout, UX |
| `writing-plans` | ✅ Sim | Antes de implementar fases do plan.md |
| `frontend-design` | ✅ Sim | Homepage, tipografia, paleta |
| `hallmark` | ✅ Sim | Redesign / identidade visual distintiva |
| `verification-before-completion` | ✅ Sim | Antes de dizer "pronto" |
| `systematic-debugging` | ✅ Sim | Build quebrado, deploy falhou |
| `caveman-commit` | ✅ Sim | Commits (Conventional Commits, inglês) |
| `find-skills` | ✅ Sob demanda | Buscar skills em skills.sh |
| `tdd` | ⚠️ Opcional | Se adicionarmos testes Vitest/Playwright |
| `playwright-best-practices` | ⚠️ Opcional | E2E de páginas críticas |
| `vercel-react-best-practices` | ⚠️ Parcial | Só em islands React, se houver |
| `prisma-*` | ❌ Não | Sem banco |
| `nodejs-backend-patterns` | ❌ Não | Sem API backend |
| `vue-best-practices` | ❌ Não | Stack Astro, não Vue SPA |

Skills ficam em `.agents/skills/<name>/SKILL.md` — copiar do `faruk_base` na Fase 1 ou instalar via `npx skills experimental_install`.

### Pipeline — artigo a partir de repositório

Orquestrador: **`article-from-repo`**. Skills em `.agents/skills/`.

```
research-codebase → codebase-summary → c4-architecture
  → content-research-writer → technical-writing → fact-checker
  → blog-article → verification-before-completion (npm run build)
```

| Skill | Origem | Função |
|-------|--------|--------|
| `research-codebase` | local | Discovery no codebase fonte |
| `codebase-summary` | local | Contexto consolidado para o writer |
| `c4-architecture` | softaworks/agent-toolkit | Diagramas Mermaid |
| `content-research-writer` | composiohq/awesome-claude-skills | Outline + rascunho |
| `technical-writing` | mindrally/skills | Estilo dev (HOW/WHY) |
| `fact-checker` | local | Claims vs evidência |
| `blog-article` | local | MDX + frontmatter deste blog |

Artefatos intermediários: `.scratch/<slug>/`. Publicação LinkedIn: regra `publish-article-linkedin.mdc`.

Instalar skills upstream:

```bash
npx skills add softaworks/agent-toolkit --skill c4-architecture
npx skills add composiohq/awesome-claude-skills --skill content-research-writer
npx skills add mindrally/skills --skill technical-writing
```

(`research-codebase`, `codebase-summary`, `fact-checker` são locais — upstream removido ou renomeado nos repos originais.)

## Comandos slash (Cursor)

| Comando | Arquivo | Propósito |
|---------|---------|-----------|
| `/commit-push` | `.cursor/commands/commit-push.md` | Commit + push (único gatilho de commit automático) |

## Regras Cursor

| Regra | Arquivo | Propósito |
|-------|---------|-----------|
| Dev server ao concluir task | `.cursor/rules/finish-task-dev-server.mdc` | Subir preview e informar URL |

## Idioma

* **Commits:** inglês, Conventional Commits
* **Copy do site:** inglês (UI e artigos)
* **Skills (SKILL.md):** inglês
* **Respostas ao usuário:** português

## Git

* Commitar **somente** quando o usuário pedir (inclui `/commit-push`)
* **Nunca** commitar secrets (`.env`, `secrets.local.md`, chaves)
* **Nunca** force-push em `main`

## Dev server (fim de task)

Ao concluir task que altere código:

```bash
npm run dev
```

| Item | Valor |
|------|-------|
| URL padrão | http://localhost:4321 |
| Validar | homepage carrega, artigo de exemplo renderiza |

Antes de deploy, validar build:

```bash
npm run build
npm run preview   # http://localhost:4321 ou porta indicada
```

## Mermaid (diagramas em artigos)

Blog usa **Mermaid 11.16** no cliente (`src/components/MermaidInit.astro`). Diagrama com syntax error aparece como *"Syntax error in text"* na página — tratar como bug.

**Antes de entregar** qualquer ` ```mermaid ` novo ou alterado em MDX:

1. **Compilar** com o mesmo major do blog:
   ```bash
   npm run verify:mermaid -- path/to/diagram.mmd
   # ou: echo 'flowchart LR; A-->B' | npm run verify:mermaid -- --stdin
   ```
2. **Validar na página** — dev server + artigo no browser; confirmar SVG renderizado (sem caixa de erro).
3. **Incluir no `npm run build`** quando o artigo for publicado (`draft: false`).

**Regras de sintaxe (evitar falhas silenciosas no browser):**

* Diagramas em **inglês ASCII** nos dois idiomas do artigo (mesma regra dos code blocks).
* Evitar em labels de nó: `+`, extensões com ponto (`AGENTS.md` → `AGENTS doc pointer`), acentos.
* Preferir `A[Label text]` a aspas quando o label é simples; aspas só se necessário.
* Skills que geram Mermaid (`c4-architecture`, `blog-article`) devem rodar `verify:mermaid` antes de concluir.

## Deploy VPS

Ver [`plan.md`](plan.md) § VPS e [`secrets.local.md`](secrets.local.md).

Resumo:

| Item | Valor |
|------|-------|
| Path VPS | `/opt/blog` |
| Porta | `8085` |
| Domínio | `blog.faruk.dev.br` |
| SSH key | `C:\repo\secrets\vps\ssh\github-actions-vps-shared` |
| PAT | `C:\repo\secrets\github\pat.txt` |

## Estrutura alvo

```
astro/
├── AGENTS.md
├── README.md
├── plan.md
├── secrets.local.md          # gitignored
├── .env.example
├── .cursor/
│   ├── commands/commit-push.md
│   └── rules/finish-task-dev-server.mdc
├── .github/workflows/deploy.yml
├── Dockerfile
├── docker-compose.prod.yml
├── src/
│   ├── content/articles/     # MDX por categoria
│   ├── components/
│   ├── layouts/
│   └── pages/
└── public/
```

## Conteúdo — frontmatter obrigatório

```yaml
title: string
description: string
publishDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD
author: Faruk
tags: string[]
draft: boolean
```

## Performance (Lighthouse targets)

* Performance > 95
* SEO > 100
* Accessibility > 95
* Best Practices > 95

## Bootstrap checklist

1. [ ] `npm create astro@latest` com TypeScript + Tailwind
2. [ ] Content collections (`src/content/articles/`)
3. [ ] Integrações: Pagefind, Mermaid, KaTeX, RSS, sitemap
4. [ ] Homepage conforme plan.md
5. [ ] Dockerfile + compose + workflow deploy
6. [ ] DNS + Caddy + primeiro deploy VPS
7. [ ] Artigo inaugural publicado

## Superpowers workflow

| Phase | Skill | Output |
|-------|-------|--------|
| Design | `brainstorming` | Approved design â†’ `docs/superpowers/specs/YYYY-MM-DD-*-design.md` |
| Plan | `writing-plans` | `docs/superpowers/plans/YYYY-MM-DD-*.md` |
| Build | stack skills + `tdd` | Code + tests |
| Verify | `verification-before-completion` | Evidence before "done" |
| Debug | `systematic-debugging` | Root cause before fix |
| Ship | `/commit-push` | `semantic-version` + `caveman-commit` + push + CI |

**Gates:** no feature code before approved spec; no "done" without verification; version bump only on `/commit-push`.

Invoke `/init` to (re)bootstrap skills and folders.
