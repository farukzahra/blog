---
name: linkedin-push
description: Post a published blog article to LinkedIn after user approval. Verifies prod URL, runs dry-run preview, posts via scripts/linkedin-post.mjs. Use when user says approved/aprovado and wants LinkedIn post after /commit-push.
---

# LinkedIn Push

Post a published blog article to the author's LinkedIn profile.

## Language

- **Post body:** Portuguese (LinkedIn has built-in translation for readers)
- **Hashtags:** English (PascalCase) — never translate hashtags

## Preconditions

- User explicitly approved posting (e.g. "aprovado", "post it", "linkedin push").
- Article `draft: false` in `src/content/articles/<category>/<slug>.mdx`.
- `/commit-push` completed and GitHub Actions deploy is **green**.
- Prod URL returns 200: `https://blog.faruk.dev.br/articles/<slug>/`
- Secrets in `secrets.local.md`: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REFRESH_TOKEN`, `LINKEDIN_PERSON_URN`.

## Workflow

1. **Verify deploy** — check GitHub Actions for the pushed commit; confirm prod 200.
2. **Dry-run** (always first, even if user already saw preview):
   ```bash
   node scripts/linkedin-post.mjs --slug <category/slug> --dry-run
   ```
3. **Show preview** to user if not shown in this session.
4. **Post** only after explicit approval:
   ```bash
   node scripts/linkedin-post.mjs --slug <category/slug>
   ```
   Custom copy: `--text "..."`.

## Copy rules

See `.cursor/rules/publish-article-linkedin.mdc`:

- Portuguese body, conversational, ~10 lines
- Hook → context → 3–4 technical points → takeaway
- At least 10 hashtags in **English** (article tags + pool), **before** the URL
- URL always last
- No emoji spam

If `generateLinkedInCopy` output is off-topic for the article, craft copy manually with `--text`.

## Failures

| Error | Fix |
|-------|-----|
| `draft: true` | Set `draft: false`, commit, push, redeploy |
| Prod 404 | Wait for deploy or fix CI |
| Token expired | `npm run linkedin:auth` |
| Missing secrets | Check `secrets.local.md` |

## Never

- Post without user approval in the same turn they approved commit
- Post when article is `draft: true`
- Commit secrets
