import { expect, test } from '@playwright/test';
import type { EmployeeData } from '../fixtures/employees';
import { EmployeeFormPage } from '../pages/employee-form.page';
import { EmployeesPage } from '../pages/employees.page';

test.describe('Employee CRUD, duplicates, and validation', () => {
  test('TR-CREATE-01 / TR-EDIT-01 / TR-DEL-01 | administrator completes a CRUD lifecycle', async ({ page }) => {
    const directory = new EmployeesPage(page);
    const form = new EmployeeFormPage(page);
    const created: EmployeeData = { name: 'Lifecycle User', email: 'lifecycle@example.test', age: 41, salary: 4321.25, months: 25, grade: 2 };
    const edited: EmployeeData = { ...created, name: 'Lifecycle Updated', email: 'lifecycle.updated@example.test', age: 42, salary: 5000, months: 26, grade: 3 };

    await form.create(created);
    await directory.filter({ email: created.email });
    await expect(directory.rowByName(created.name)).toHaveCount(1);

    await directory.edit(created.name);
    await form.save(edited);
    await directory.filter({ email: edited.email });
    await expect(directory.rowByName(edited.name)).toContainText('$5,000.00');
    await expect(directory.rowByName(edited.name)).toContainText('Senior');

    await directory.delete(edited.name);
    await directory.filter({ email: edited.email });
    await expect(page.getByText('No employees found')).toBeVisible();
  });

  test('TR-DUP-01 | exact duplicate email displays existing employee and saves nothing', async ({ page }) => {
    const form = new EmployeeFormPage(page);
    await page.goto('/Employee/Create');
    await form.fill({ name: 'Duplicate Attempt', email: 'ann.alpha@team-a.example', age: 35, salary: 3000, months: 12, grade: 2 });
    await page.getByRole('button', { name: /Create Employee/ }).click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Ann Alpha');
    await expect(modal.getByRole('link', { name: /Edit Existing/ })).toHaveAttribute('href', /\/Employee\/Edit\/\d+/);
  });

  test('TR-VAL-01 | server rejects negative salary when browser constraints are bypassed', async ({ page }) => {
    const directory = new EmployeesPage(page);
    await page.goto('/Employee/Create');
    const token = await page.locator('main form input[name="__RequestVerificationToken"]').inputValue();
    const email = 'negative.salary@example.test';
    await page.context().request.post('/Employee/Create', {
      form: {
        __RequestVerificationToken: token,
        Name: 'Negative Salary',
        Age: '30',
        Salary: '-0.01',
        DurationWorked: '12',
        Grade: '2',
        Email: email
      }
    });

    await directory.open();
    await directory.filter({ email });
    const persisted = await directory.rows.count();
    expect.soft(persisted, 'invalid salary must not be persisted').toBe(0);
    if (persisted > 0) await directory.delete('Negative Salary');
  });

  test('TR-ONB-01 | Create exposes the three onboarding selections required by the baseline', async ({ page }) => {
    await page.goto('/Employee/Create');
    await expect(page.getByLabel(/welcome email/i)).toBeVisible();
    await expect(page.getByLabel(/PF.*setup/i)).toBeVisible();
    await expect(page.getByLabel(/IT equipment/i)).toBeVisible();
  });
});
