import { nvdaTest as test } from '@guidepup/playwright';
import { scenarios } from './scenarios.mjs';
test.describe('NVDA', () => scenarios(
  (name, fn) => test(name, async ({ page, nvda }, info) => fn(page, nvda, info)),
  'nvda',
  (name, reason) => test.fixme(name, { annotation: { type: 'known gap', description: reason } }, () => {}),
));
