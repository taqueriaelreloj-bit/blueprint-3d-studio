import { test, expect } from '@playwright/test';

test('Blueprint 3D Studio opens cleanly in Chrome', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');

  await expect(page.getByText('Blueprint 3D Studio', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Upload Blueprint PDF/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /AI Auto Build/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Review \/ Edit/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Draw Missing Walls/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Door/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Window/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /AI Kitchen Layout/i })).toHaveCount(0);

  await page.screenshot({ path: 'test-results/blueprint-home.png', fullPage: true });

  expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});

test('main editor controls respond without crashing', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');
  await page.getByRole('button', { name: /Review \/ Edit/i }).click();
  await page.getByRole('button', { name: /^Door$/i }).click();
  await page.getByRole('button', { name: /^Window$/i }).click();

  await expect(page.getByText('Blueprint / 2D Editor', { exact: false })).toBeVisible();
  expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toEqual([]);
});
