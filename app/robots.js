export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: 'https://salesgarners.com/sitemap.xml',
    host: 'https://salesgarners.com',
  };
}
