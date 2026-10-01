import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyGscState } from './gsc-browser.mjs';

test('GSC classifier separates login, quota and visible challenge', () => {
  assert.equal(classifyGscState('https://search.google.com/search-console/about', ''), 'login_required');
  assert.equal(classifyGscState('https://accounts.google.com/signin', ''), 'login_required');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Você atingiu sua cota diária'), 'quota_exceeded');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Selecione todas as imagens'), 'captcha_required');
  assert.equal(classifyGscState('https://search.google.com/search-console', 'Indexação solicitada'), null);
});
