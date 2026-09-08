import { expect, it } from 'vitest';
import { safeArticleHtml } from '@/lib/safeArticleHtml';
it('keeps editorial formatting and removes executable HTML', () => {
  const html = safeArticleHtml('<h2>Título</h2><p>Texto <a href="https://codigo5.com.br">link</a></p><img src="/capa.jpg" onerror=alert(1)><script>alert(1)</script><a href="java&#x73;cript:alert(1)">x</a><iframe srcdoc="<script>alert(1)</script>"></iframe><svg onload=alert(1)></svg>');
  expect(html).toContain('<h2>Título</h2>');
  expect(html).toContain('href="https://codigo5.com.br"');
  expect(html).toContain('src="/capa.jpg"');
  expect(html).not.toMatch(/script|onerror|onload|iframe|svg/i);
});
