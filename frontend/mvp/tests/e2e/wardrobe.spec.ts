import { test, expect } from '@playwright/test'

// Minimal valid 1x1 JPEG (no external fixture files needed)
const MINIMAL_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRof' +
    'Hh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB' +
    '/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAA' +
    'AAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ACWAB//Z',
  'base64',
)

test.describe('Garblo Wardrobe', () => {
  test('login renders the GARBLO heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('GARBLO')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('submitting the login form advances to the model upload page', async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.locator('h2')).toContainText('Setup Model', { timeout: 5_000 })
  })

  test('full journey: login → upload model → upload item → select → generate', async ({
    page,
  }) => {
    // 1. Login
    await page.goto('/')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.locator('h2')).toContainText('Setup Model', { timeout: 5_000 })

    // 2. Upload model photo
    await page.locator('[data-testid="model-file-input"]').setInputFiles({
      name: 'model.jpg',
      mimeType: 'image/jpeg',
      buffer: MINIMAL_JPEG,
    })

    // 3. Wait for Wardrobe page to load
    await expect(page.locator('h2')).toContainText('Wardrobe', { timeout: 15_000 })

    // 4. Upload a clothing item
    await page.locator('[data-testid="item-file-input"]').setInputFiles({
      name: 'shirt.jpg',
      mimeType: 'image/jpeg',
      buffer: MINIMAL_JPEG,
    })

    // 5. Wait for item card to appear
    await expect(page.locator('[data-testid="item-card"]').first()).toBeVisible({
      timeout: 10_000,
    })

    // 6. Select the item
    await page.locator('[data-testid="item-card"]').first().click()

    // 7. Generate outfit
    await page.locator('[data-testid="generate-btn"]').click()

    // 8. Wait for "AI Fitting Active" badge – confirms generation completed successfully
    await expect(page.locator('span:has-text("AI Fitting Active")')).toBeVisible({
      timeout: 90_000,
    })
  })
})
