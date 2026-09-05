# Frontier Thinking, Not Typing — Implementation Plan

> **For agentic workers:** Execute inline in this session. Article work, not a product feature — no TDD cycle. Do not commit unless the user asks.

**Goal:** Ship bilingual draft MDX for the essay *Use the Frontier Model for Thinking, Not Typing*.

**Architecture:** Follow `docs/superpowers/specs/2026-09-05-frontier-thinking-not-typing-design.md`. English MDX first, then pt-BR. Fact-check against Cursor docs and obra/superpowers. `draft: true`.

**Tech Stack:** Astro 5 content collections, MDX, Mermaid.

## Global Constraints

- Title: Use the Frontier Model for Thinking, Not Typing
- Slug: `use-the-frontier-model-for-thinking-not-typing`
- Category: `agents/`
- Series: Agents in Production
- `translationId`: `agents/use-the-frontier-model-for-thinking-not-typing`
- `draft: true` until user says approved
- Unemployment in paragraph 2, not the title
- No rotting price table; no invented dollar amounts
- Chinese models: one honest paragraph
- Voice: first person, same register as `recap-session-delivery-skill.mdx`
- Do not commit, push, or set `draft: false` in this plan

---

### Task 1: Research notes

**Files:**
- Create: `.scratch/use-the-frontier-model-for-thinking-not-typing/04-outline.md`
- Create: `.scratch/use-the-frontier-model-for-thinking-not-typing/research.md`

- [ ] **Step 1:** Record verified sources (Cursor models-and-pricing, Grok docs, obra/superpowers) and the approved outline.

### Task 2: English draft

**Files:**
- Create: `src/content/articles/agents/use-the-frontier-model-for-thinking-not-typing.mdx`

- [ ] **Step 1:** Write EN MDX with required frontmatter, seven outline sections, one Mermaid flowchart.

### Task 3: Fact-check

**Files:**
- Create: `.scratch/use-the-frontier-model-for-thinking-not-typing/06-fact-check.md`
- Modify: EN MDX if any claim is wrong or unverified

- [ ] **Step 1:** Classify every factual claim. Fix wrong/unverified before translation.

### Task 4: Portuguese draft

**Files:**
- Create: `src/content/articles/agents/use-the-frontier-model-for-thinking-not-typing-pt-BR.mdx`

- [ ] **Step 1:** Translate EN to pt-BR. Same `translationId`. Code/model names stay in English.

### Task 5: Verify

- [ ] **Step 1:** `npm run build` — expect exit 0
- [ ] **Step 2:** Dev server + HTTP 200 on both article URLs
- [ ] **Step 3:** LinkedIn `--dry-run` and show full preview; wait for "aprovado"
