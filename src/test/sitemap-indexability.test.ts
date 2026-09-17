import { expect, it } from 'vitest';
import { onRequestGet } from '../../functions/sitemap.xml';
import posts from '../content/blog-posts.json';

it('excludes bundled and dynamic redirect sources while keeping final published URLs', async () => {
  const redirected = '/blog/' + posts[0].slug;
  const env = {
    COD5_STATIC_REDIRECT_SOURCES: ['/blog/static-redirect', '/blog/categoria/seo'],
    BOT_DB: { prepare: (sql: string) => {
      const rows = sql.includes('FROM posts') ? [{ slug: 'new-public', updated_at: '2026-09-17 10:00:00' }, {slug: 'static-redirect'}] : [{source_path: redirected}];
      return { all: async () => ({results: rows}), bind: (source: string) => ({all: async () => ({results: source === redirected ? [{source_path: redirected}] : []})}) };
    } },
  };
  const response = await onRequestGet({env} as never);
  const xml = await response.text();
  expect(response.status).toBe(200);
  expect(xml).not.toContain(`<loc>https://codigo5.com.br${redirected}</loc>`);
  expect(xml).not.toContain('<loc>https://codigo5.com.br/blog/static-redirect</loc>');
  expect(xml).not.toContain('<loc>https://codigo5.com.br/blog/categoria/seo</loc>');
  expect(xml).toContain('<loc>https://codigo5.com.br/blog/new-public</loc>');
  expect(xml).toContain('<lastmod>2026-09-17</lastmod>');
  expect(xml).not.toContain('/blog/tag/');
});
