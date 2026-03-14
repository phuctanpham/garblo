import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  // Assumes both servers are already running when running e2e tests.
  // Start them with:
  //   cd backend/mvp && npm run dev   (API on http://localhost:3001)
  //   cd frontend/mvp && npm run dev  (Vite on http://localhost:5173)
})
