import { expect, test } from '@playwright/test'

test('home search leads to filtered results', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox', { name: /where/i }).click()
  await page.getByRole('option', { name: 'London, UK' }).click()
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await expect(page).toHaveURL(/\/search\?city=London/)
  await expect(page.locator('article').first()).toBeVisible()
})

test('filters are written to the URL', async ({ page }) => {
  await page.goto('/search?city=London')
  await page.getByRole('button', { name: 'Filters' }).click()
  await page.getByRole('switch', { name: /verified only/i }).click()
  await page.getByRole('button', { name: 'Apply Filters' }).click()
  await expect(page).toHaveURL(/verified=1/)
})

test('mobile map opens full screen and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/search?city=London')
  const map = page.getByRole('complementary', { name: 'Map of results' })
  await expect(map).toBeHidden()
  await page.getByRole('button', { name: 'Map', exact: true }).click()
  await expect(map).toBeVisible()
  await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible()
  await page.getByRole('button', { name: 'Close map' }).click()
  await expect(map).toBeHidden()
})

test('closing the quick view leaves no extra history step', async ({ page }) => {
  await page.goto('/')
  await page.goto('/search?city=London')
  await page.getByRole('button', { name: 'View details' }).first().click()
  await expect(page).toHaveURL(/venue=v\d+/)
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page).toHaveURL(/\/search\?city=London$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
})

test('a search with no matches shows the empty state', async ({ page }) => {
  await page.goto('/search?category=warehouse&city=Dubai&capMin=1400')
  await expect(page.getByText('No data found for your search.')).toBeVisible()
})

test('vendors mode shows coming soon', async ({ page }) => {
  await page.goto('/search?mode=vendor')
  await expect(page.getByText('Vendors are coming soon')).toBeVisible()
})
