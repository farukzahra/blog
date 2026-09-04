# Commit and push

Commit all staged/unstaged project changes and push to the tracked remote branch. Follow project git conventions in `AGENTS.md`.

## Preconditions

- User explicitly invoked `/commit-push` — you may commit and push.
- Never commit secrets (`.env`, `secrets.local.md`, credentials, keys).
- Never force-push to `main`/`master`.
- Never skip hooks unless the user explicitly asked.
- Never amend unless user rules allow it.

## Step 1 — Inspect (run in parallel)

```bash
git status
git diff
git diff --cached
git log -5 --oneline
git branch -vv
```

## Step 2 — Commit message (`caveman-commit` skill)

- Conventional Commits, **English**
- Subject ≤50 chars when possible
- Body only when "why" is not obvious

## Step 3 — Commit

```bash
git add <relevant files>
git commit -m "<subject>" -m "<optional body>"
```

On Windows PowerShell, use a here-string for multi-line messages if needed.

If nothing to commit, say so and stop — do not push.

## Step 4 — Push

```bash
git push origin HEAD
```

If upstream is not set:

```bash
git push -u origin HEAD
```

## Step 5 — Confirm

Report to the user:

- Commit SHA(s) and message(s)
- Branch pushed
- Remote URL if useful

## Step 6 — LinkedIn (after push + deploy green)

If the commit includes a **public article** (`draft: false` in `src/content/articles/**/*.mdx`):

1. Wait for GitHub Actions deploy **success** and verify prod URL → 200.
2. Run preview (use `node` directly — npm may swallow `--slug`):
   ```bash
   node scripts/linkedin-post.mjs --slug <category/slug> --dry-run
   ```
3. **Show the full preview text** to the user in the response.
4. **Ask explicitly:** post as-is, edit copy (`--text "..."`), or skip?
5. **Never post without user approval** in the same turn.
6. If user approves, post:
   ```bash
   node scripts/linkedin-post.mjs --slug <category/slug>
   ```
   Or with custom text: `--text "..."`.

Skip Step 6 when:

- No article changed, or article is `draft: true`
- Deploy/CI failed or prod 404
- User said skip LinkedIn

Copy rules: `.cursor/rules/publish-article-linkedin.mdc` — **body in Portuguese**, hashtags in English.

## Failures

- Pre-commit hook failed → fix issues, **new commit** (never amend a failed hook commit unless user rules allow)
- Push rejected → report error; do not force-push
- No remote → tell user to add `origin`
