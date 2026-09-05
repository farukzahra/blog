# Design: Use the Frontier Model for Thinking, Not Typing

Date: 2026-09-05  
Status: draft, awaiting user review  
Type: bilingual blog article (not a product feature)

## Goal

Publish a first-person career/workflow essay in `agents/` that argues: keep Cursor for the harness, spend the frontier model (Grok) on Superpowers planning, and spend Composer on implementation — because the author is unemployed and needs the plan to last.

## Non-goals

- Price comparison table (Cursor vs Codex vs Claude) that will rot
- Tutorial that walks the reader through installing Superpowers
- Advocacy for or against Chinese models beyond one honest paragraph
- Pity-party or "hustle while broke" branding
- Runnable `exampleSlug` / sample repo
- Publishing (`draft: false`), commit, or LinkedIn in the same turn as the draft

## Thesis

Cursor wins on cost-benefit versus Codex and Claude **plus** the harness (skills, rules, Superpowers). The tactic that stretches usage: run Superpowers with Grok (frontier, cheaper on Cursor today) up to the implementation gate; implement with Composer. Unemployment is motivation, not the title.

## Voice and constraints

- First person, developer-to-developer, same register as `src/content/articles/agents/recap-session-delivery-skill.mdx`
- English primary MDX; Portuguese `-pt-BR.mdx` after
- User quotes from Portuguese chat: translate to English, fix grammar
- No "In today's fast-paced world"
- No invented dollar amounts; qualitative pricing only unless an official page confirms a number at write time
- Name Superpowers and Cursor; do not invent model SKUs

## Title, slug, placement

| Field | Value |
|-------|--------|
| Title | Use the Frontier Model for Thinking, Not Typing |
| Slug | `use-the-frontier-model-for-thinking-not-typing` |
| Category | `agents/` |
| Series | Agents in Production |
| `translationId` | `agents/use-the-frontier-model-for-thinking-not-typing` |
| `draft` | `true` until user says approved |
| `featured` | `false` |
| `author` | Faruk |
| Dates | `publishDate` / `updatedDate` = 2026-09-05 |
| Tags | AI Engineering, Agents, Cursor, Skills, Productivity, Developer Tools (4–8) |

Files:

- `src/content/articles/agents/use-the-frontier-model-for-thinking-not-typing.mdx`
- `src/content/articles/agents/use-the-frontier-model-for-thinking-not-typing-pt-BR.mdx`

## Outline (~1200–1600 words)

1. **Hook** — The tactic in one beat: Grok (frontier, cheaper on Cursor) thinks with Superpowers until the implementation gate; Composer writes the code.
2. **Why the bill matters** — Unemployed; the plan has to last. Arithmetic, not stoicism. Second paragraph, not the title.
3. **Why Cursor, not Codex or Claude** — Best cost-benefit of the three; the harness is why the author stays, not price alone.
4. **Why not Chinese models (yet)** — Cheap exists; the author does not want to leave the harness. Door left open. One paragraph.
5. **The split** — Superpowers (brainstorm → plan) on Grok; implementation on Composer. Mermaid flowchart. What each does well.
6. **What I do not do** — Grok typing CRUD; Composer deciding architecture alone; max-tier model on every turn.
7. **Takeaway** — Expensive model thinks; cheaper model executes a closed plan.

## Mermaid (required)

```mermaid
flowchart LR
  A["Superpowers: brainstorm + plan"] --> B["Grok: frontier thinking"]
  B --> C["Implementation gate"]
  C --> D["Composer: write the code"]
```

Exact node labels may be tightened at draft time; keep the four stages.

## Claims to verify at write time

| Claim | How to verify | If unverifiable |
|-------|----------------|-----------------|
| Grok is a frontier model available in Cursor | Cursor model picker / official docs | Soften to "the frontier model I actually pick" |
| Grok is the cheaper frontier option on Cursor vs Claude/GPT-class | Cursor usage/pricing docs | Qualitative: "cheaper than the other frontier picks I considered" |
| Composer is the implementation model in Cursor | Cursor product copy | Name it as the author's implementation model |
| Superpowers is a skill pack used until implementation | Local `.agents/skills` + obra/superpowers | Describe the process without over-claiming upstream |
| Cursor vs Codex vs Claude: author chose Cursor for cost + harness | Author statement | Keep as personal choice, not a benchmark |

## Delivery after draft

1. `npm run build` must pass
2. Dev server: HTTP 200 on EN and pt-BR article URLs before sharing
3. LinkedIn dry-run preview in Portuguese; wait for "aprovado"
4. Do not set `draft: false`, commit, push, or post until the user asks

## Success criteria

- Reader can repeat the split (Grok + Superpowers → Composer) without a pricing table
- Unemployment is visible and unsentimental
- Chinese-models paragraph is honest and short
- Both language files share `translationId` and required frontmatter
