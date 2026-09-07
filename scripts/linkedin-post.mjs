#!/usr/bin/env node
/**
 * Post an article to LinkedIn (profile) after prod is live.
 *
 * Usage:
 *   npm run linkedin:post -- --slug agents/enterprise-sales-intelligence-agent-mcp-rag
 *   npm run linkedin:post -- --slug mcp/adapting-spring-boot-rest-to-mcp --dry-run
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadSecrets, requireSecret, root } from './lib/secrets.mjs';
import { refreshAccessToken, createArticleShare, updatePostCommentary } from './lib/linkedin-api.mjs';
import { generateLinkedInCopy } from './lib/linkedin-copy.mjs';

const SITE_URL = process.env.SITE_URL ?? 'https://blog.faruk.dev.br';

function parseArgs(argv) {
  const args = { slug: '', dryRun: false, skipVerify: false, text: '', updateUrn: '' };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--slug') args.slug = argv[++i] ?? '';
    else if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--skip-verify') args.skipVerify = true;
    else if (argv[i] === '--text') args.text = argv[++i] ?? '';
    else if (argv[i] === '--update-urn') args.updateUrn = argv[++i] ?? '';
  }
  if (!args.slug) throw new Error('Missing --slug (e.g. agents/my-article-slug)');
  return args;
}

function parseFrontmatter(mdxPath) {
  const raw = readFileSync(mdxPath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`No frontmatter in ${mdxPath}`);

  const fm = match[1];
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
  };

  const tags = [];
  const tagsBlock = fm.match(/^tags:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (tagsBlock) {
    for (const line of tagsBlock[1].split('\n')) {
      const t = line.match(/^\s+-\s+(.+)/);
      if (t) tags.push(t[1].trim());
    }
  }

  const draft = get('draft') === 'true';
  return {
    title: get('title'),
    description: get('description'),
    draft,
    tags,
  };
}

async function verifyProd(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Prod check failed: ${url} → ${res.status}`);
  }
  const html = await res.text();
  if (!html.includes('<title')) {
    throw new Error(`Prod page looks empty: ${url}`);
  }
  return true;
}

async function main() {
  const args = parseArgs(process.argv);
  const mdxPath = resolve(root, 'src/content/articles', `${args.slug}.mdx`);
  const mdPath = resolve(root, 'src/content/articles', `${args.slug}.md`);
  const articlePath = existsSync(mdxPath) ? mdxPath : existsSync(mdPath) ? mdPath : null;

  if (!articlePath) {
    throw new Error(`Article not found: ${args.slug}`);
  }

  const meta = parseFrontmatter(articlePath);
  if (meta.draft && !args.dryRun) {
    throw new Error('Refusing to post: article is draft: true');
  }
  if (!meta.title || !meta.description) {
    throw new Error('Article needs title and description in frontmatter');
  }

  const articleUrl = `${SITE_URL.replace(/\/$/, '')}/articles/${args.slug}/`;

  if (!args.skipVerify && !args.dryRun) {
    console.log('Verifying prod URL…', articleUrl);
    await verifyProd(articleUrl);
    console.log('Prod OK');
  }

  const commentary =
    args.text || generateLinkedInCopy({ ...meta, url: articleUrl });

  console.log('\n--- LinkedIn post preview ---\n');
  console.log(commentary);
  console.log('\n--- end preview ---\n');

  if (args.dryRun) {
    console.log('Dry run — not posting.');
    return;
  }

  const env = loadSecrets();
  requireSecret(env, 'LINKEDIN_PERSON_URN');
  const hasToken =
    (env.LINKEDIN_REFRESH_TOKEN?.trim() && env.LINKEDIN_REFRESH_TOKEN !== 'undefined') ||
    (env.LINKEDIN_ACCESS_TOKEN?.trim() && env.LINKEDIN_ACCESS_TOKEN !== 'undefined');
  if (!hasToken) {
    throw new Error('Missing LinkedIn token. Run: npm run linkedin:auth');
  }

  const accessToken = await refreshAccessToken(env);

  if (args.updateUrn) {
    const { status } = await updatePostCommentary({
      accessToken,
      postUrn: args.updateUrn,
      commentary,
    });
    console.log(`Updated (${status})`, args.updateUrn);
    return;
  }

  const { postUrn, status } = await createArticleShare({
    accessToken,
    authorUrn: requireSecret(env, 'LINKEDIN_PERSON_URN'),
    commentary,
    articleUrl,
    title: meta.title,
    description: meta.description,
  });

  console.log(`Posted (${status})`, postUrn ?? '(no URN in response headers)');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
