---
name: blog-article
description: Write and format technical articles for this Astro blog. MDX frontmatter, English content, Mermaid diagrams, exampleSlug linking. Use when creating or editing src/content/articles/**/*.mdx.
---

# Blog Article (Astro MDX)

Articles live in `src/content/articles/<category>/<slug>.mdx`.

## Frontmatter (required)

```yaml
---
title: string
description: string          # SEO, ~150 chars
publishDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD
author: Faruk
tags: string[]               # 4–8 tags
draft: true                  # false only after build + fact-check + user approval
                              # draft articles are previewable at /articles/<slug>/ on localhost (npm run dev)
featured: false              # true for homepage highlight
series: string               # optional, e.g. "Agents in Production"
exampleSlug: string        # optional — folder under examples/
---
```

Schema: `src/content.config.ts`.

## Bilingual articles (en + pt-BR)

Every public article has **two MDX files** linked by `translationId`:

| Version | File pattern | Example |
|---------|--------------|---------|
| English (primary) | `<category>/<slug>.mdx` | `agents/my-post.mdx` |
| Portuguese | `<category>/<slug>-pt-BR.mdx` | `agents/my-post-pt-BR.mdx` |

Required frontmatter on **both** files:

```yaml
lang: en          # or pt-BR
translationId: agents/my-post   # same id on both versions
```

- Write the English version first, then create the `-pt-BR.mdx` translation.
- Listings (homepage, RSS) show English only; the 🇺🇸/🇧🇷 toggle on the article page switches languages.
- Code blocks stay in English in both versions.

## Content rules

- **Language:** English for the primary `.mdx`; Portuguese for `-pt-BR.mdx`
- **User quotes:** If the author wrote in Portuguese (chat with the LLM), **translate to English** in the article. Fix spelling/grammar in the translation (e.g. *denovo* → *again*, *nao* → *don't*). Keep original repo artifact names (README headings, ADRs) only when citing files—add English gloss in parentheses if helpful.
- **Tone:** Direct, developer-to-developer — see `technical-writing` skill
- **Structure:** Hook → what you build → architecture → implementation → lessons
- **Diagrams:** Mermaid fenced blocks (blog renders them)
- **Code:** Real snippets from source repo; cite paths in prose
- **No fluff:** Skip "In today's fast-paced world", generic pros/cons lists

## Runnable examples

If the article includes runnable code:

1. Create `examples/<exampleSlug>/` with README + project
2. Set `exampleSlug` in frontmatter
3. GitHub link auto-renders: `github.com/farukzahra/blog/tree/main/examples/<exampleSlug>`

For **external repos** (e.g. faruk-base2): link directly in prose — no `exampleSlug` unless code is copied into this repo.

## Article categories

| Folder | Use for |
|--------|---------|
| `agents/` | AI agents, skills, orchestration |
| `mcp/` | Model Context Protocol |
| `java/` | Spring, JVM |
| `architecture/` | System design |

Pick category from primary topic.

## Post-publish (draft: false)

Follow `.cursor/rules/publish-article-linkedin.mdc`:

1. `npm run build` passes
2. Commit/push only if user asked
3. Verify prod URL 200
4. `node scripts/linkedin-post.mjs --slug <category/slug> --dry-run` first

## Delivery checklist (end of every article task)

Before asking for approval, always deliver to the user:

1. **Localhost preview URLs** — dev server running (`npm run dev` if needed); **HTTP 200 on the exact path** before sharing:
   - EN: `http://localhost:4321/articles/<category>/<slug>/`
   - pt-BR: `http://localhost:4321/articles/<category>/<slug>-pt-br/` (lowercase)
2. **LinkedIn preview** — Portuguese body, English hashtags; run dry-run (works on `draft: true`):
   ```bash
   node scripts/linkedin-post.mjs --slug <category/slug> --dry-run
   ```
   Show the **full post text** in the response. Craft manually if auto-copy is off-topic.
3. **Wait for approval** — user replies "aprovado" / "approved".

After approval:

1. Set `draft: false` on both MDX files (en + pt-BR)
2. Run `/commit-push` (see `.cursor/commands/commit-push.md`)
3. After deploy green → `/linkedin-push` (see `.agents/skills/linkedin-push/SKILL.md`)

Never commit, push, or post to LinkedIn in the same turn you finish the draft — wait for explicit approval.

## Scratch workspace

Pipeline artifacts: `.scratch/<slug>/`

Do not commit scratch files unless user wants research preserved in repo.
