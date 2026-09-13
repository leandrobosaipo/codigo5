import assert from 'node:assert/strict';
import test from 'node:test';
import { renderLlms } from './llms.mjs';

test('llms lists only public material and never dashboard paths', () => {
  const text = renderLlms([{ slug: 'atendimento-com-ia', title: 'Atendimento com IA', excerpt: 'Como empresas organizam atendimento.' }], true);
  assert.match(text, /https:\/\/codigo5\.com\.br\/blog\/atendimento-com-ia/);
  assert.doesNotMatch(text, /\/admin\b|token|rascunho/i);
});
