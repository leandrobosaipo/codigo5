import DOMPurify from 'dompurify';

// Editorial HTML keeps normal formatting and media, never executable markup.
export const safeArticleHtml = (html: string) => DOMPurify.sanitize(html, {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
  FORBID_ATTR: ['style'],
});
