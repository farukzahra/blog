---
description: LinkedIn push
---

# LinkedIn push

Post a **published** blog article to LinkedIn. Requires prior user approval.

## Preconditions

- User explicitly approved (e.g. "aprovado", "post linkedin").
- Article is `draft: false`.
- `/commit-push` done and deploy **green**.
- Prod URL → 200.

Read skill: `.agents/skills/linkedin-push/SKILL.md`

## Steps

1. Verify GitHub Actions deploy success for the pushed commit.
2. Verify prod:
   ```bash
   curl -I https://blog.faruk.dev.br/articles/<category/slug>/
   ```
3. Dry-run:
   ```bash
   node scripts/linkedin-post.mjs --slug <category/slug> --dry-run
   ```
4. Show preview if user has not seen it this session.
5. Post:
   ```bash
   node scripts/linkedin-post.mjs --slug <category/slug>
   ```
   Or: `--text "custom copy..."`

## Failures

- `draft: true` → publish article first
- Prod 404 → fix deploy
- Token error → `npm run linkedin:auth`

Never post without explicit user approval.
