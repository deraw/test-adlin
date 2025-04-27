import { test, expect } from '@playwright/test'

test('Visits the home page', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Réserver une salle')
})
