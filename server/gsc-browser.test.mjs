import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyGscState, classifyGscSubmissionError, requestViaGsc } from './gsc-browser.mjs';

test('GSC classifier separates login, quota and visible challenge', () => {
  assert.equal(classifyGscState('https://search.google.com/search-console/about', ''), 'login_required');
  assert.equal(classifyGscState('https://accounts.google.com/signin', ''), 'login_required');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Você atingiu sua cota diária'), 'quota_exceeded');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Selecione todas as imagens'), 'captcha_required');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Indexação solicitada'), null);
});

test('Google submission error is diagnostic, not proof of acceptance', () => {
  assert.equal(classifyGscSubmissionError('Ocorreu um erro ao enviar sua solicitação de indexação. Tente novamente mais tarde.'), 'google_submission_error');
  assert.equal(classifyGscSubmissionError('There was an error sending your indexing request. Try again later.'), 'google_submission_error');
  assert.equal(classifyGscSubmissionError('Indexação solicitada'), null);
});

function fakeBrowser({ indexed = false, requested = false, clickError = false, confirmationError = false, submissionError = false } = {}) {
  let clicked = false;
  const bodyText = () => 'https://codigo5.com.br/blog/article ' + (submissionError && clicked
    ? 'Ops... algo deu errado. Ocorreu um erro ao enviar sua solicitação de indexação. Tente novamente mais tarde.'
    : requested || (clicked && !confirmationError) ? 'Indexação solicitada' : indexed ? 'O URL está no Google' : 'URL inspecionado');
  const locator = { innerText: async () => bodyText() };
  const inspect = { count: async () => 1, fill: async () => {}, press: async () => {} };
  const button = { waitFor: async () => {}, count: async () => 1, isEnabled: async () => true, click: async ({ trial }) => { if (trial) return; if (clickError) throw Error('private raw error'); clicked = true; } };
  const textContent = text => {
    if (!(text instanceof RegExp)) return bodyText();
    if (text.source === /(?:Ocorreu um erro ao enviar sua solicitação de indexação[\s\S]{0,160}?Tente novamente mais tarde|(?:something went wrong|there was an error)[\s\S]{0,160}?sending your indexing request[\s\S]{0,160}?try again later)/i.source) {
      return submissionError && clicked ? 'Ocorreu um erro ao enviar sua solicitação de indexação. Tente novamente mais tarde.' : '';
    }
    return requested || (clicked && !confirmationError && !submissionError) ? 'Indexação solicitada' : '';
  };
  const context = {
    pages: () => [page], newPage: async () => page, close: async () => {},
  };
  const page = {
    goto: async () => {}, url: () => 'https://search.google.com/search-console/inspect?resource_id=x',
    locator: () => locator,
    getByRole: (_role, options) => options?.name === 'Inspecionar qualquer URL de codigo5.com.br' ? inspect : options?.name === 'Solicitar indexação|Request indexing' ? button : button,
    getByText: (text) => ({ first() { return this; }, filter() { return this; }, waitFor: async () => {
      const visible = () => text instanceof RegExp ? text.test(textContent(text)) : bodyText().includes(String(text));
      if (visible()) return;
      await new Promise(resolve => setTimeout(resolve, 5));
      if (!visible()) throw Error('not visible');
    }, isVisible: async () => text instanceof RegExp ? text.test(textContent(text)) : bodyText().includes(String(text)) }),
    waitForURL: async () => {},
  };
  return { launchPersistentContext: async () => context };
}

const request = (options, onPhase, capture) => requestViaGsc({ url: 'https://codigo5.com.br/blog/article', property: 'sc-domain:codigo5.com.br', profileDir: '/profile', browser: fakeBrowser(options), onPhase, capture });

test('successful click is reported only after visible confirmation', async () => {
  const result = await request({});
  assert.equal(result.status, 'requested');
  assert.equal(result.diagnosis.clicked, true);
  assert.equal(result.diagnosis.phase, 'confirmation');
});

test('indexed article still clicks when request action is available', async () => {
  const result = await request({ indexed: true });
  assert.equal(result.diagnosis.phase, 'confirmation');
});

test('a click timeout is uncertain and does not claim a completed click', async () => {
  const result = await request({ clickError: true });
  assert.equal(result.status, 'delivery_unknown');
  assert.equal(result.diagnosis.code, 'click_outcome_unknown');
  assert.equal(result.clicked, null);
});

test('confirmation timeout preserves the resolved click', async () => {
  const result = await request({ confirmationError: true });
  assert.equal(result.status, 'delivery_unknown');
  assert.equal(result.diagnosis.code, 'confirmation_unverified');
  assert.equal(result.clicked, true);
});

test('Google submit error stays delivery-unknown and records only a diagnostic', async () => {
  const result = await request({ submissionError: true }, undefined, async (_page, diagnostic) => {
    assert.equal(diagnostic, true);
    return '/diagnostico.png';
  });
  assert.equal(result.status, 'delivery_unknown');
  assert.equal(result.diagnosis.code, 'google_submission_error');
  assert.equal(result.diagnosis.clicked, true);
  assert.equal(result.diagnosis.detail, 'diagnostic_screenshot_saved');
});

test('browser phase logs are ordered and include durations', async () => {
  const phases = [];
  await request({}, event => phases.push(event));
  assert.deepEqual(phases.map(({ phase, state }) => `${phase}:${state}`), [
    'launch:start', 'launch:complete', 'inspection:start', 'inspection:complete',
    'inspection_result:start', 'inspection_result:complete', 'click:start', 'click:complete',
    'confirmation:start', 'confirmation:complete',
  ]);
  assert.ok(phases.filter(event => event.state !== 'start').every(event => Number.isInteger(event.durationMs)));
});

test('already requested is reported without starting another click', async () => {
  const result = await request({ requested: true });
  assert.equal(result.status, 'already_requested');
  assert.equal(result.clicked, false);
});
