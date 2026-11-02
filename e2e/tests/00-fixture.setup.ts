import { expect, test as setup } from '@playwright/test';
import { employees } from '../fixtures/employees';
import { EmployeeFormPage } from '../pages/employee-form.page';
import { EmployeesPage } from '../pages/employees.page';
import { LoginPage } from '../pages/login.page';

setup('TR-OPS-01 | initialize a fresh database and deterministic employee fixture', async ({ page }) => {
  const login = new LoginPage(page);
  const form = new EmployeeFormPage(page);
  const directory = new EmployeesPage(page);

  await login.loginAsAdmin();
  for (const employee of employees) await form.create(employee);

  await directory.open();
  await expect(page.locator('.stat-badge')).toContainText('12 employees');
  await expect(directory.rows).toHaveCount(5);
  await page.context().storageState({ path: 'e2e/.auth/admin.json' });
});
