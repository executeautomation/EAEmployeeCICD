import { expect, test } from '@playwright/test';
import { EmployeesPage } from '../pages/employees.page';

test.describe('Employee directory, search, and pagination', () => {
  test('TR-LIST-01 / TR-LIST-04 | directory shows five records, total, fields, and grade labels', async ({ page }) => {
    const directory = new EmployeesPage(page);
    await directory.open();
    await expect(page.locator('.stat-badge')).toContainText('12 employees');
    await expect(directory.rows).toHaveCount(5);
    const ann = directory.rowByName('Ann Alpha');
    await expect(ann).toContainText('18 yrs');
    await expect(ann).toContainText('$1,000.00');
    await expect(ann).toContainText('6 mo.');
    await expect(ann).toContainText('Junior');
    await expect(ann).toContainText('ann.alpha@team-a.example');
  });

  test('TR-LIST-02 | name, email, and grade filters combine with AND', async ({ page }) => {
    const directory = new EmployeesPage(page);
    await directory.open();
    await directory.filter({ name: 'Ann', email: 'team-a', grade: 2 });
    await expect(directory.rows).toHaveCount(1);
    await expect(directory.rows.first()).toContainText('Anna Beta');
  });

  test('TR-LIST-03 | pagination retains active filters and Clear resets them', async ({ page }) => {
    const directory = new EmployeesPage(page);
    await directory.open();
    await directory.filter({ email: 'team-a' });
    await expect(page.locator('.stat-badge')).toContainText('7 employees');
    await page.getByRole('link', { name: /Next/ }).click();
    await expect(page).toHaveURL(/emailTerm=team-a/);
    await expect(directory.rows).toHaveCount(2);
    await page.getByRole('link', { name: /Clear/ }).click();
    await expect(page).not.toHaveURL(/emailTerm=/);
    await expect(page.locator('.stat-badge')).toContainText('12 employees');
  });

  test('TR-LIST-05 | invalid page values do not cause server errors', async ({ request }) => {
    for (const pageNumber of [0, -1, 999999]) {
      const response = await request.get(`/Employee?page=${pageNumber}`);
      expect(response.status(), `page=${pageNumber}`).toBeLessThan(500);
    }
  });
});
