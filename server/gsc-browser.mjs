import { chromium } from 'playwright';
import { receipt } from './gsc-whatsapp.mjs';

const GSC = 'https://search.google.com/search-console';
const submissionErrorText = /(?:Ocorreu um erro ao enviar sua solicitação de indexação[\s\S]{0,160}?Tente novamente mais tarde|(?:something went wrong|there was an error)[\s\S]{0,160}?sending your indexing request[\s\S]{0,160}?try again later)/i;

export function classifyGscState(url, text) {
  if (url.startsWith('https://accounts.google.com/') || url.includes('/search-console/about') || /fazer login|sign in|escolher uma conta/i.test(text)) return 'login_required';
  if (/(?:cota.*(?:excedida|atingida)|atingiu.*cota)|quota.*(exceeded|reached)|limite diário/i.test(text)) return 'quota_exceeded';
  if (/selecione todas as imagens|verify you are human|confirme que você não é um robô/i.test(text)) return 'captcha_required';
  return null;
}

export function classifyGscSubmissionError(text) {
  return submissionErrorText.test(String(text || '')) ? 'google_submission_error' : null;
}

export async function requestViaGsc({ url, property, profileDir, headless = true, executablePath, timeoutMs = 90000, browser = chromium, onPhase = () => {}, capture }) {
  const domain = property?.startsWith('sc-domain:') ? property.slice(10) : null;
  if (!domain || new URL(url).hostname !== domain || !profileDir) throw new Error('Invalid GSC property, URL or profile path');
  let context;
  let clicked = false;
  let phase = 'launch';
  let phaseStarted = Date.now();
  let phaseActive = false;
  const phaseLog = (state, code = null) => {
    try { onPhase({ phase, state, code, durationMs: state === 'start' ? null : Date.now() - phaseStarted }); } catch {}
  };
  const beginPhase = name => { phase = name; phaseStarted = Date.now(); phaseActive = true; phaseLog('start'); };
  const finishPhase = (state = 'complete', code = null) => { if (phaseActive) { phaseLog(state, code); phaseActive = false; } };
  const result = (status, code = status, clickState = clicked) => ({ status, clicked: clickState, diagnosis: { phase, code, clicked: clickState, detail: null } });
  try {
    beginPhase('launch');
    context = await browser.launchPersistentContext(profileDir, { headless, locale: 'pt-BR', ...(executablePath ? { executablePath } : {}) });
    const page = context.pages()[0] || await context.newPage();
    finishPhase();
    beginPhase('inspection');
    await page.goto(`${GSC}?hl=pt-BR&resource_id=${encodeURIComponent(property)}`, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    let state = classifyGscState(page.url(), await page.locator('body').innerText());
    if (state) { finishPhase('complete', state); return result(state); }
    try { await page.getByRole('combobox', { name: domain, exact: true }).waitFor({ state: 'visible', timeout: timeoutMs }); }
    catch { state = classifyGscState(page.url(), await page.locator('body').innerText()) || 'layout_changed'; finishPhase('complete', state); return result(state); }
    const inspect = page.getByRole('combobox', { name: `Inspecionar qualquer URL de ${domain}` });
    if (!await inspect.count()) { finishPhase('complete', 'layout_changed'); return result('layout_changed'); }
    await inspect.fill(url);
    await inspect.press('Enter');
    finishPhase();
    beginPhase('inspection_result');
    await page.waitForURL(/\/search-console\/inspect\?/, { timeout: timeoutMs });
    await page.getByText(url, { exact: true }).first().waitFor({ state: 'visible', timeout: timeoutMs });
    const button = page.getByRole('button', { name: /Solicitar indexação|Request indexing/i });
    // A visible action can remain disabled while Google finishes loading the inspection.
    // A trial waits for Playwright's click checks without dispatching a click.
    let actionable = false;
    if (!await receipt(page).isVisible()) {
      try {
        await button.click({ trial: true, timeout: timeoutMs });
        actionable = true;
      } catch (error) {
        if (error.name !== 'TimeoutError') throw error;
      }
    }
    const body = await page.locator('body').innerText();
    state = classifyGscState(page.url(), body);
    if (state) { finishPhase('complete', state); return result(state); }
    if (await receipt(page).isVisible().catch(() => false)) {
      finishPhase('complete', 'already_requested');
      const prior = result('already_requested');
      if (capture) prior.evidence = await capture(page).catch(() => null);
      return prior;
    }
    if (!actionable) {
      if (/O URL está no Google|URL is on Google/i.test(body)) { finishPhase('complete', 'already_indexed'); return result('already_indexed'); }
      if (!await button.count()) { finishPhase('complete', 'layout_changed'); return result('layout_changed'); }
      finishPhase('error', 'button_not_ready');
      return result('retry', 'button_not_ready', false);
    }
    finishPhase();
    beginPhase('click');
    // Until click resolves, its outcome is uncertain and must not trigger a retry.
    await button.click({ timeout: 180000 });
    clicked = true;
    finishPhase();
    beginPhase('confirmation');
    const confirmation = receipt(page).waitFor({ state: 'visible', timeout: 360000 })
      .then(() => 'confirmed', () => 'timeout');
    const providerError = page.getByText(submissionErrorText).filter({ visible: true }).first()
      .waitFor({ state: 'visible', timeout: 360000 })
      .then(() => 'provider_error', () => 'timeout');
    const outcome = await Promise.race([confirmation, providerError]);
    if (outcome === 'provider_error' && !await receipt(page).isVisible().catch(() => false)) {
      finishPhase('error', 'google_submission_error');
      const unknown = result('delivery_unknown', 'google_submission_error', true);
      if (capture) {
        const diagnostic = await capture(page, true).catch(() => null);
        if (diagnostic) unknown.diagnosis.detail = 'diagnostic_screenshot_saved';
      }
      return unknown;
    }
    if (outcome === 'confirmed' || await receipt(page).isVisible().catch(() => false)) {
      finishPhase('complete', 'requested');
      const confirmed = result('requested');
      if (capture) {
        try { confirmed.evidence = await capture(page); }
        catch { confirmed.diagnosis.detail = 'screenshot_failed'; }
      }
      return confirmed;
    }
    const pageText = await page.locator('body').innerText().catch(() => '');
    state = classifyGscState(page.url(), pageText);
    const diagnosisCode = state || classifyGscSubmissionError(pageText) || 'confirmation_unverified';
    const diagnostic = capture && await capture(page, true).catch(() => null);
    finishPhase('error', diagnosisCode);
    const unknown = result(state || 'delivery_unknown', diagnosisCode, true);
    if (diagnostic) unknown.diagnosis.detail = 'diagnostic_screenshot_saved';
    return unknown;
  } catch {
    const uncertain = phase === 'click' || phase === 'confirmation';
    finishPhase('error', uncertain ? 'click_outcome_unknown' : 'browser_step_failed');
    return result(uncertain ? 'delivery_unknown' : 'retry', uncertain ? 'click_outcome_unknown' : 'browser_step_failed', uncertain ? null : false);
  } finally {
    await context?.close().catch(() => {});
  }
}
