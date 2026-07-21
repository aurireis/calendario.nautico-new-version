const { getStore } = require('@netlify/blobs');

function blobStore(name) {
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_API_TOKEN;
  if (process.env.NETLIFY_SITE_ID && token) {
    return getStore({
      name,
      siteID: process.env.NETLIFY_SITE_ID,
      token,
    });
  }

  return getStore(name);
}

module.exports = { blobStore };
