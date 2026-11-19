import { expect, test } from '@playwright/test'

test('protected route redirects, login lands on dashboard, logout locks it again', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login\?from=%2Fdashboard$/)

  await page.getByLabel('Email', { exact: true }).fill('eve.holt@reqres.in')
  await page.getByLabel('Password', { exact: true }).fill('cityslicka')
  await page.getByRole('button', { name: 'Log in', exact: true }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Hi, Eve' })).toBeVisible()

  await page.reload()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Hi, Eve' })).toBeVisible()

  await page.getByRole('main').getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL(/\/$/)

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('unknown email shows the reqres error', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email', { exact: true }).fill('nobody@x.com')
  await page.getByLabel('Password', { exact: true }).fill('secret12')
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
  await expect(page.locator('form').getByRole('alert')).toHaveText('No account found with this email.')
})
