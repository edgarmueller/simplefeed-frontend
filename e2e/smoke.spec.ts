import { expect, test } from '@playwright/test'

test('sign up, subscribe to a channel and tune it', async ({ page }) => {
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
  await expect(page.getByText("You're all caught up.")).toBeVisible()

  await page.getByRole('link', { name: 'Channels', exact: true }).click()
  await page.getByRole('button', { name: 'Subscribe' }).first().click()
  const channel = page.getByLabel('Your channels').getByRole('link', { name: /Hacker News/ })
  await expect(channel).toBeVisible()

  // the channels worker answers in the chat, so it has to run for this part
  await channel.click()
  await page.getByRole('tab', { name: 'Tune' }).click()
  await page.getByPlaceholder('Type a message').fill('mute crypto')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText('Leaving out: crypto').first()).toBeVisible({ timeout: 15_000 })
})
