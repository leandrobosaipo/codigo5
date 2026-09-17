import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

export function checkPage(url, response, html) {
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
  assert.match(response.headers.get('content-type') || '', /text\/html/i, `${url}: not HTML`);
  assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /\b(noindex|none)\b/i, `${url}: blocked header`);
  const document = new JSDOM(html).window.document;
  const robots = [...document.querySelectorAll('meta[name="robots" i],meta[name="googlebot" i]')];
  assert.ok(robots.some(meta => meta.name.toLowerCase() === 'robots'), `${url}: missing robots`);
  for (const meta of robots) assert.doesNotMatch(meta.content, /\b(noindex|none)\b/i, `${url}: blocked meta`);
  const canonicals = document.querySelectorAll('link[rel="canonical"]');
  assert.equal(canonicals.length, 1, `${url}: canonical count`);
  assert.equal(canonicals[0].getAttribute('href'), url, `${url}: canonical mismatch`);
  assert.equal(document.querySelectorAll('h1').length, 1, `${url}: missing/duplicate heading`);
  assert.ok((document.querySelector('main')?.textContent.trim().length || 0) > 200, `${url}: missing source content`);
}

export function sitemapUrls(xml, sitemapUrl) {
  const document = new JSDOM(xml, {contentType: 'application/xml'}).window.document;
  assert.equal(document.documentElement.localName, 'urlset', 'Expected urlset sitemap');
  const urls = [...document.querySelectorAll('url > loc')].map(loc => loc.textContent.trim());
  assert.ok(urls.length, 'Empty sitemap');
  assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
  const origin = new URL(sitemapUrl).origin;
  for (const url of urls) {
    assert.equal(new URL(url).origin, origin, 'Unexpected sitemap origin');
    assert.ok(!new URL(url).search && !new URL(url).hash, `Noncanonical sitemap URL: ${url}`);
  }
  for (const date of document.querySelectorAll('lastmod')) {
    assert.match(date.textContent, /^\d{4}-\d{2}-\d{2}$/, 'Invalid lastmod format');
    assert.equal(new Date(date.textContent).toISOString().slice(0, 10), date.textContent, 'Invalid lastmod date');
  }
  return urls;
}

export async function audit(target, request = fetch) {
  const read = url => request(url, {redirect: 'manual', signal: AbortSignal.timeout(15000)});
  const initial = await read(target);
  assert.equal(initial.status, 200, `${target}: HTTP ${initial.status}`);
  const body = await initial.text();
  if (!/xml/i.test(initial.headers.get('content-type') || '')) {
    checkPage(target, initial, body);
    return {checked: 1, urls: [target]};
  }
  const urls = sitemapUrls(body, target);
  // Sequential requests keep the publication check gentle on the origin.
  for (const url of urls) {
    const response = await read(url);
    checkPage(url, response, await response.text());
  }
  return {checked: urls.length, urls};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  audit(process.argv[2] || 'https://codigo5.com.br/sitemap.xml')
    .then(result => console.log(JSON.stringify({ok: true, ...result})))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
