import { expect, test } from '@playwright/test'

test('sign up, sign in, post and like', async ({ page }) => {
  const username = `e2e${Date.now()}`
  const email = `${username}@example.com`

  await page.goto('/sign-up')
  await page.fill('#input-email', email)
  await page.fill('#input-username', username)
  await page.fill('#input-first-name', 'End')
  await page.fill('#input-last-name', 'ToEnd')
  await page.fill('#input-password', 'secret')
  await page.fill('#input-confirm-password', 'secret')
  await page.getByRole('button', { name: 'Sign up' }).click()
  await expect(page.getByText('Sign up successful!')).toBeVisible()

  await page.getByRole('link', { name: 'Sign in here' }).click()
  await page.getByPlaceholder('Email address').fill(email)
  await page.getByPlaceholder('Password').fill('secret')
  await page.getByPlaceholder('Password').press('Enter')
  await expect(page).toHaveURL(/\/feed$/)

  const message = `Hello from ${username}`
  await page.getByPlaceholder("What's on your mind?").fill(message)
  await page.getByRole('button', { name: 'Post' }).click()
  await expect(page.getByText(message)).toBeVisible()

  await page.getByRole('button', { name: 'Like', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Unlike' })).toBeVisible()
})
