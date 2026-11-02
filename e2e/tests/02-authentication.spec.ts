import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

test.describe('Authentication and roles', () => {
  const anonymousState = { cookies: [], origins: [] };

  test('TR-AUTH-03 | invalid credentials show generic feedback', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL as string, storageState: anonymousState });
    const page = await context.newPage();
    const login = new LoginPage(page);
    await login.open();
    await login.login('admin', 'incorrect-password');
    await expect(page.getByText('Invalid login attempt.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Hello admin!' })).toHaveCount(0);
    await context.close();
  });

  test('TR-AUTH-01 / TR-AUTH-06 | registered User can view details but cannot mutate employees', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL as string, storageState: anonymousState });
    const page = await context.newPage();
    const register = new RegisterPage(page);
    await register.register('testuser01', 'testuser01@example.test', 'secure-pass');

    await expect(page.getByRole('link', { name: 'Hello testuser01!' })).toBeVisible();
    await expect(page.getByRole('link', { name: '📈 Details', exact: true })).toBeVisible();
    await page.goto('/Employee');
    await expect(page.getByRole('link', { name: /New Employee/ })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Edit/ })).toHaveCount(0);

    await page.goto('/Employee/Create');
    await expect(page).toHaveURL(/\/Account\/AccessDenied/);
    await context.close();
  });

  test('TR-AUTH-04 / TR-AUTH-05 | local return URL is honored and logout ends the session', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL as string, storageState: anonymousState });
    const page = await context.newPage();
    const login = new LoginPage(page);
    await login.open('/EmployeeDetails');
    await login.login('admin', 'password');
    await expect(page).toHaveURL(/\/EmployeeDetails$/);

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await page.goto('/EmployeeDetails');
    await expect(page).toHaveURL(/\/Account\/Login\?ReturnUrl=/i);
    await context.close();
  });
});
