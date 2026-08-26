import { test, expect } from '@playwright/test';

function captureRuntimeErrors(page) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  return { consoleErrors, pageErrors };
}

test('Blueprint 3D Studio opens cleanly in Chrome', async ({ page }) => {
  const { consoleErrors, pageErrors } = captureRuntimeErrors(page);

  await page.goto('/');

  await expect(page.getByText('Blueprint 3D Studio', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /New Design/i })).toBeVisible();
  await expect(page.getByText('Import / Scan', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Review \/ Edit/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Draw Missing Walls/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Door$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Window$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /AI Kitchen Layout/i })).toHaveCount(0);

  await page.screenshot({ path: 'test-results/blueprint-home.png', fullPage: true });

  expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});

test('design-first editor starts blank without requiring a blueprint', async ({ page }) => {
  const { pageErrors } = captureRuntimeErrors(page);

  await page.goto('/');

  await expect(page.getByText('2D Design Editor', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: /Review \/ Edit/i })).toBeDisabled();
  await expect(page.getByRole('button', { name: /Draw Missing Walls/i })).toBeDisabled();
  await expect(page.getByRole('button', { name: /^Door$/i })).toBeDisabled();
  await expect(page.getByRole('button', { name: /^Window$/i })).toBeDisabled();

  await page.getByRole('button', { name: /Create Blank Design/i }).click();
  await expect(page.getByText('Blank design canvas', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: /Stop Walls/i })).toBeEnabled();

  expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toEqual([]);
});

test('Create Room draws a closed rectangular perimeter on the shared 2D/3D model', async ({ page }) => {
  const { consoleErrors, pageErrors } = captureRuntimeErrors(page);
  await page.goto('/');
  await page.getByRole('button', { name: /Create Blank Design/i }).click();
  await page.getByRole('button', { name: /Rectangle Room/i }).click();

  const editor = page.locator('svg.drawing-overlay');
  const box = await editor.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + 180, box.y + 160);
  await page.mouse.down();
  await page.mouse.move(box.x + 500, box.y + 380, { steps: 8 });
  await page.mouse.up();

  await expect(editor.locator('line.wall')).toHaveCount(4);
  await expect(page.getByText(/Room created with 4 new walls/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Undo/i })).toBeEnabled();
  expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});

test('global undo and redo restore a real project edit', async ({ page }) => {
  const { consoleErrors, pageErrors } = captureRuntimeErrors(page);
  await page.goto('/');

  const levelName = page.getByLabel('Level name');
  const undo = page.getByRole('button', { name: /Undo/i });
  const redo = page.getByRole('button', { name: /Redo/i });

  await expect(levelName).toHaveValue('Level 1');
  await expect(undo).toBeDisabled();
  await levelName.fill('Main Floor');
  await levelName.blur();
  await expect(undo).toBeEnabled();

  await undo.click();
  await expect(levelName).toHaveValue('Level 1');
  await expect(redo).toBeEnabled();

  await redo.click();
  await expect(levelName).toHaveValue('Main Floor');

  await levelName.fill('Ground Floor');
  await levelName.blur();
  await page.locator('body').press('Control+z');
  await expect(levelName).toHaveValue('Main Floor');
  await page.locator('body').press('Control+Shift+z');
  await expect(levelName).toHaveValue('Ground Floor');

  expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});
