import { chromium } from 'playwright';

const GSC = 'https://search.google.com/search-console';

export function classifyGscState(url, text) {
  if (url.startsWith('https://accounts.google.com/') || url.includes('/search-console/about') || /fazer login|sign in|escolher uma conta/i.test(text)) return 'login_required';
  if (/(?:cota.*(?:excedida|atingida)|atingiu.*cota)|quota.*(exceeded|reached)|limite diário/i.test(text)) return 'quota_exceeded';
  if (/selecione todas as imagens|verify you are human|confirme que você não é um robô/i.test(text)) return 'captcha_required';
  return null;
}

export async function requestViaGsc({ url, property, profileDir, headless = true, executablePath, timeoutMs = 45000 }) {
  const domain = property?.startsWith('sc-domain:') ? property.slice(10) : null;
  if (!domain || new URL(url).hostname !== domain || !profileDir) throw new Error('Invalid GSC property, URL or profile path');
  let context;
  let clicked = false;
  try {
    context = await chromium.launchPersistentContext(profileDir, { headless, locale: 'pt-BR', ...(executablePath ? { executablePath } : {}) });
    const page = context.pages()[0] || await context.newPage();
    await page.goto(`${GSC}?resource_id=${encodeURIComponent(property)}`, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    let state = classifyGscState(page.url(), await page.locator('body').innerText());
    if (state) return { status: state, clicked };
    try { await page.getByRole('combobox', { name: domain, exact: true }).waitFor({ state: 'visible', timeout: timeoutMs }); }
    catch { return { status: classifyGscState(page.url(), await page.locator('body').innerText()) || 'layout_changed', clicked }; }
    const inspect = page.getByRole('combobox', { name: `Inspecionar qualquer URL de ${domain}` });
    if (!await inspect.count()) return { status: 'layout_changed', clicked };
    await inspect.fill(url);
    await inspect.press('Enter');
    await page.waitForURL(/\/search-console\/inspect\?/, { timeout: timeoutMs });
    await page.getByText(url, { exact: true }).first().waitFor({ state: 'visible', timeoutMs });
    const body = await page.locator('body').innerText();
    state = classifyGscState(page.url(), body);
    if (state) return { status: state, clicked };
    if (await page.getByText('Indexação solicitada', { exact: true }).first().isVisible()) return { status: 'already_requested', clicked };
    if (/O URL está no Google|URL is on Google/i.test(body)) return { status: 'already_indexed', clicked };
    const button = page.getByRole('button', { name: /Solicitar indexação|Request indexing/i });
    if (!await button.count() || !await button.isEnabled()) return { status: 'layout_changed', clicked };
    clicked = true; // A timeout from here is unknown; never retry the click automatically.
    await button.click({ timeoutMs });
    try {
      await page.getByText('Indexação solicitada', { exact: true }).waitFor({ state: 'visible', timeoutMs });
      return { status: 'requested', clicked };
    } catch {
      state = classifyGscState(page.url(), await page.locator('body').innerText());
      return { status: state || 'delivery_unknown', clicked };
    }
  } catch {
    return { status: clicked ? 'delivery_unknown' : 'retry', clicked };
  } finally {
    await context?.close().catch(() => {});
  }
}
