import { requireSecret } from './secrets.mjs';

const LINKEDIN_VERSION = '202601';

export async function refreshAccessToken(env) {
  const refresh = env.LINKEDIN_REFRESH_TOKEN?.trim();
  if (refresh && refresh !== 'undefined') {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
      client_id: requireSecret(env, 'LINKEDIN_CLIENT_ID'),
      client_secret: requireSecret(env, 'LINKEDIN_CLIENT_SECRET'),
    });

    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (res.ok) {
      const data = await res.json();
      return data.access_token;
    }
  }

  const access = env.LINKEDIN_ACCESS_TOKEN?.trim();
  if (access && access !== 'undefined') {
    return access;
  }

  throw new Error(
    'No valid LinkedIn token. Re-run: npm run linkedin:auth',
  );
}

/**
 * @param {object} opts
 * @param {string} opts.accessToken
 * @param {string} opts.authorUrn
 * @param {string} opts.commentary Post text (English)
 * @param {string} opts.articleUrl Production URL
 * @param {string} opts.title Article title for link card
 * @param {string} opts.description Short description for link card
 */
export async function createArticleShare({
  accessToken,
  authorUrn,
  commentary,
  articleUrl,
  title,
  description,
}) {
  const payload = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: commentary },
        shareMediaCategory: 'ARTICLE',
        media: [
          {
            status: 'READY',
            originalUrl: articleUrl,
            title: { text: title },
            description: { text: description.slice(0, 256) },
          },
        ],
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': LINKEDIN_VERSION,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn post failed (${res.status}): ${await res.text()}`);
  }

  const postUrn = res.headers.get('x-restli-id') ?? res.headers.get('X-RestLi-Id');
  return { postUrn, status: res.status };
}

/**
 * Update commentary on an existing post (Posts API partial update).
 * @param {object} opts
 * @param {string} opts.accessToken
 * @param {string} opts.postUrn e.g. urn:li:share:7502515350823919617
 * @param {string} opts.commentary New post body (hashtags + URL as needed)
 */
export async function updatePostCommentary({ accessToken, postUrn, commentary }) {
  const encodedUrn = encodeURIComponent(postUrn);
  const payload = {
    patch: {
      $set: {
        commentary,
      },
    },
  };

  const res = await fetch(`https://api.linkedin.com/rest/posts/${encodedUrn}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'X-RestLi-Method': 'PARTIAL_UPDATE',
      'LinkedIn-Version': LINKEDIN_VERSION,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn update failed (${res.status}): ${await res.text()}`);
  }

  return { postUrn, status: res.status };
}
