(function () {
  const metaTag = document.querySelector('meta[name="supabase-api-base"]');
  const metaValue = metaTag?.content?.trim();
  const fallback = window.SITE_API_BASE || '';

  const apiBase = [metaValue, fallback].find((value) => typeof value === 'string' && value.length > 0) || '';

  if (!apiBase) {
    console.warn('SiteConfig: Supabase API base URL is not defined. Set the meta tag "supabase-api-base" or the global SITE_API_BASE variable.');
  }

  window.SiteConfig = Object.freeze({
    apiBase,
    endpoints: {
      products: '/products',
      contact: '/contact',
      newsletter: '/newsletter'
    }
  });
})();
