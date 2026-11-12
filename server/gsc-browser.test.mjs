import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyGscState, requestViaGsc } from './gsc-browser.mjs';

test('GSC classifier separates login, quota and visible challenge', () => {
  assert.equal(classifyGscState('https://search.google.com/search-console/about', ''), 'login_required');
  assert.equal(classifyGscState('https://accounts.google.com/signin', ''), 'login_required');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Você atingiu sua cota diária'), 'quota_exceeded');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Selecione todas as imagens'), 'captcha_required');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Indexação solicitada'), null);
});

function fakeBrowser({ indexed = false, requested = false, clickError = false, confirmationError = false } = {}) {
  let clicked = false;
  const locator = { innerText: async () => requested ? 'Indexação solicitada' : indexed ? 'O URL está no Google' : 'URL inspecionado' };
  const inspect = { count: async () => 1, fill: async () => {}, press: async () => {} };
  const button = { waitFor: async () => {}, count: async () => 1, isEnabled: async () => true, click: async ({ trial }) => { if (trial) return; if (clickError) throw Error('private raw error'); clicked = true; } };
  const context = {
    pages: () => [page], newPage: async () => page, close: async () => {},
  };
  const page = {
    goto: async () => {}, url: () => 'https://search.google.com/search-console/inspect?resource_id=x',
    locator: () => locator,
    getByRole: (_role, options) => options?.name === 'Inspecionar qualquer URL de codigo5.com.br' ? inspect : options?.name === 'Solicitar indexação|Request indexing' ? button : button,
    getByText: (text) => ({ first() { return this; }, filter() { return this; }, waitFor: async () => { if (text instanceof RegExp && text.test('Indexação solicitada') && ((!clicked && !requested) || (clicked && confirmationError))) throw Error('not visible'); }, isVisible: async () => text instanceof RegExp && text.test('Indexação solicitada') && requested }),
    waitForURL: async () => {},
  };
  return { launchPersistentContext: async () => context };
}

const request = (options, onPhase) => requestViaGsc({ url: 'https://codigo5.com.br/blog/article', property: 'sc-domain:codigo5.com.br', profileDir: '/profile', browser: fakeBrowser(options), onPhase });

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
