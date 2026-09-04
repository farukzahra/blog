function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Sanitize tag label → LinkedIn hashtag (no spaces). */
function toHashtag(label) {
  const cleaned = label.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
  if (!cleaned) return '';
  const parts = cleaned.split(/[\s-]+/);
  if (parts.length === 1) return `#${parts[0]}`;
  return `#${parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')}`;
}

const DEFAULT_HASHTAG_POOL = [
  'SoftwareEngineering',
  'TechBlog',
  'Developer',
  'Programming',
  'OpenSource',
  'CloudComputing',
  'DevOps',
  'Backend',
  'Frontend',
  'Architecture',
  'ArtificialIntelligence',
  'MachineLearning',
  'GenerativeAI',
  'LLM',
  'Python',
  'Java',
  'SpringBoot',
  'Azure',
  'Docker',
  'API',
];

const MIN_HASHTAGS = 10;

/**
 * Build at least MIN_HASHTAGS unique hashtags (article tags first, then pool).
 * Hashtags stay in English regardless of post body language.
 * @param {string[]} articleTags
 * @param {number} seed
 * @param {string} [title]
 */
export function buildHashtags(articleTags, seed, title = '') {
  const seen = new Set();
  const result = [];

  const add = (tag) => {
    const h = toHashtag(tag);
    const key = h.toLowerCase();
    if (!h || seen.has(key)) return;
    seen.add(key);
    result.push(h);
  };

  for (const tag of articleTags) add(tag);

  if (title) {
    for (const word of title.split(/\s+/)) {
      if (word.length > 3) add(word);
      if (result.length >= MIN_HASHTAGS) break;
    }
  }

  const pool = [...DEFAULT_HASHTAG_POOL];
  for (let i = 0; i < pool.length && result.length < MIN_HASHTAGS; i += 1) {
    add(pool[(seed + i) % pool.length]);
  }

  let i = 0;
  while (result.length < MIN_HASHTAGS) {
    add(`Tech${i}`);
    i += 1;
  }

  return result.slice(0, Math.max(MIN_HASHTAGS, result.length));
}

/**
 * Generate a ~10-line LinkedIn post in Portuguese (human tone, URL at the end).
 * Hashtags remain in English. Always includes at least 10 hashtags before the URL.
 * @param {{ title: string; description: string; tags?: string[]; url: string }} article
 */
export function generateLinkedInCopy(article) {
  const seed = hashString(article.url);
  const desc = article.description.replace(/\.$/, '');
  const tags = article.tags ?? [];
  const hashtags = buildHashtags(tags, seed, article.title).join(' ');

  const lines = [
    desc,
    '',
    `Escrevi sobre isso no blog — vale a leitura se o tema te interessa.`,
    '',
    `Tópicos: ${tags.slice(0, 5).join(' · ') || 'engenharia de software'}.`,
    '',
    hashtags,
    '',
    article.url,
  ];

  return lines.join('\n').trim();
}
