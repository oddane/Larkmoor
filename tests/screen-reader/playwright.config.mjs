// Real screen readers: VoiceOver (macOS, WebKit) and NVDA (Windows, Firefox) driven by Guidepup.
// CI only (.github/workflows/screen-readers.yml): the runner must be prepared with `npx @guidepup/setup --ci`.
import { devices } from '@playwright/test';
import { screenReaderConfig } from '@guidepup/playwright';

const viewport = { width: 700, height: 900 }; // below 760px so the tab bar is shown
export default {
  ...screenReaderConfig,
  testDir: '.',
  reportSlowTests: null,
  timeout: 5 * 60 * 1000,
  retries: 2,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: '../../reports/screen-reader/results.json' }]],
  webServer: { command: 'node scripts/serve.mjs 4173', cwd: '../..', url: 'http://127.0.0.1:4173/tests/screen-reader/', reuseExistingServer: true },
  use: { baseURL: 'http://127.0.0.1:4173', video: 'retain-on-failure' },
  projects: [
    { name: 'voiceover', testMatch: 'voiceover.spec.mjs', use: { ...devices['Desktop Safari'], headless: false, viewport } },
    { name: 'nvda', testMatch: 'nvda.spec.mjs', use: { ...devices['Desktop Firefox'], headless: false, viewport } },
  ],
};
