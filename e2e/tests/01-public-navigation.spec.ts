import { expect, test } from '@playwright/test';

test.describe('Public navigation and authorization', () => {
  const anonymousState = { cookies: [], origins: [] };

  test('TR-NAV-01 | public pages render with usable navigation', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL as string, storageState: anonymousState });
    const page = await context.newPage();
    const destinations = [
      ['/', 'Employee Management'],
      ['/Employee', 'Employees'],
      ['/Home/Dashboard', 'Workforce Dashboard'],
      ['/Home/About', 'About ExecuteAutomation'],
      ['/Home/Contact', 'Contact']
    ] as const;

    for (const [path, text] of destinations) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
    }
    await context.close();
  });

  test('TR-NAV-02 / TR-AUTH-06 | anonymous user sees auth links and cannot open Create', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL as string, storageState: anonymousState });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Details/ })).toHaveCount(0);

    await page.goto('/Employee/Create');
    await expect(page).toHaveURL(/\/Account\/Login\?ReturnUrl=/i);
    await context.close();
  });

  test('TR-UX-02 | mobile navigation and public directory remain usable', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL as string, storageState: anonymousState, viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto('/Employee');
    await expect(page.getByRole('table')).toBeVisible();
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.getByRole('link', { name: /Employees/ })).toBeVisible();
    await context.close();
  });
});
