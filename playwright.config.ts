import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5114';
const chromeDevice = {
  ...devices['Desktop Chrome'],
  // Local runs may use an installed Chrome. CI uses Playwright's pinned
  // Chromium build, which is installed by the workflow.
  ...(process.env.CI ? {} : { channel: 'chrome' })
};

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 7_500 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-report/results.xml' }],
    ['json', { outputFile: 'test-report/results.json' }]
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'node e2e/scripts/start-app.mjs',
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe'
      },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: chromeDevice
    },
    {
      name: 'chromium',
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['setup'],
      use: {
        ...chromeDevice,
        storageState: 'e2e/.auth/admin.json'
      }
    }
  ]
});
