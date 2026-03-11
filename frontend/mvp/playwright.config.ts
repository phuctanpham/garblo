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
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Assumes both servers are already running when running e2e tests.
<<<<<<< HEAD
<<<<<<< HEAD
  // Start them with:
  //   cd backend/mvp && npm run dev   (API on http://localhost:3001)
  //   cd frontend/mvp && npm run dev  (Vite on http://localhost:5173)
=======
  // Start them with: cd backend && npm run dev  AND  cd frontend && npm run dev
>>>>>>> 26a2d1d (feat(mvp): implement frontend MVP with pages, services, and tests)
=======
  // Start them with: cd backend && npm run dev  AND  cd frontend && npm run dev
>>>>>>> 26a2d1d (feat(mvp): implement frontend MVP with pages, services, and tests)
})
