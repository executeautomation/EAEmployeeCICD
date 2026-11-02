import { expect, test } from '@playwright/test';

test.describe('Employee exports', () => {
  test('TR-EXP-01 / TR-EXP-02 | directory offers CSV and XLSX exports', async ({ page }) => {
    await page.goto('/Employee');
    await expect(page.getByRole('link', { name: /CSV/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Excel|XLSX/i })).toBeVisible();
  });
});
