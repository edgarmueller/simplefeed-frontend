import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests against the real backend, which has to be running on
 * http://localhost:5001 (see simplefeed-backend). Vite is started here.
 */
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // lets environments with a preinstalled Chromium skip `playwright install`
        launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
