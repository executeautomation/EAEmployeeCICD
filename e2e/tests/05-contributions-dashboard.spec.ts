import { expect, test } from '@playwright/test';
import { ContributionsPage } from '../pages/contributions.page';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('Contributions and workforce analytics', () => {
  test('TR-PF-01 / TR-PF-02 | contribution directory and employee PF calculation are correct', async ({ page }) => {
    const contributions = new ContributionsPage(page);
    await contributions.open();
    await expect(contributions.rowByName('Jo Ann')).toContainText('₹ 4,000.00');
    await contributions.openPf('Jo Ann');
    await expect(page.getByRole('heading', { name: 'PF Contribution' })).toBeVisible();
    await expect(page.locator('.highlight-amount .amount')).toHaveText('₹ 11520.00');
    await expect(page.locator('.highlight-amount .label')).toContainText('12% × ₹4,000 × 24 months');
  });

  test('TR-PF-04 | unknown contribution IDs return 404', async ({ request }) => {
    expect((await request.get('/EmployeeDetails/EmployeePF/999999')).status()).toBe(404);
    expect((await request.get('/EmployeeDetails/EmployeeBonus/999999')).status()).toBe(404);
  });

  test('TR-DASH-01 | dashboard reconciles KPIs and distributions to the fixture', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.open();
    await expect(dashboard.metric('Total Employees')).toHaveText('12');
    await expect(dashboard.metric('Average Salary')).toHaveText('$6,500');
    await expect(dashboard.metric('Average Age')).toHaveText('48.6');
    await expect(dashboard.metric('Monthly Salary Bill')).toHaveText('$78,000');

    for (const [label, count] of [['< 30', '2'], ['30 – 39', '2'], ['40 – 49', '2'], ['50 – 59', '4'], ['60+', '2']] as const) {
      await expect(dashboard.distribution(label)).toHaveText(count);
    }
    for (const label of ['Junior', 'Middle', 'Senior', 'C-Level']) {
      await expect(dashboard.distribution(label)).toHaveText('3');
    }
    await expect(page.locator('.retirement-alert')).toContainText('2 employees at retirement age');
    await expect(page.locator('.retirement-alert')).toContainText('2 approaching retirement');
  });
});
