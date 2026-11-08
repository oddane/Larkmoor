import { voiceOverTest as test } from '@guidepup/playwright';
import { scenarios } from './scenarios.mjs';
test.describe('VoiceOver', () => scenarios((name, fn) => test(name, async ({ page, voiceOver }, info) => fn(page, voiceOver, info)), 'voiceover'));
