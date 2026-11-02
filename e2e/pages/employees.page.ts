import { expect, type Locator, type Page } from '@playwright/test';

export class EmployeesPage {
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('table tbody tr').filter({ has: page.locator('.emp-name') });
  }

  async open(query = '') {
    await this.page.goto(`/Employee${query}`);
    await expect(this.page.getByText('Manage your workforce records')).toBeVisible();
  }

  async filter(options: { name?: string; email?: string; grade?: number }) {
    if (options.name !== undefined) await this.page.getByPlaceholder('Search by name...').fill(options.name);
    if (options.email !== undefined) await this.page.getByPlaceholder('Search by email...').fill(options.email);
    if (options.grade !== undefined) await this.page.locator('select[name="gradeFilter"]').selectOption(String(options.grade));
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  rowByName(name: string) {
    return this.page.locator('table tbody tr', { has: this.page.locator('.emp-name', { hasText: name }) });
  }

  async edit(name: string) {
    await this.rowByName(name).getByRole('link', { name: /Edit/ }).click();
  }

  async delete(name: string) {
    await this.rowByName(name).getByRole('link', { name: /Delete/ }).click();
    await expect(this.page.getByRole('heading', { name: 'Delete Employee' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Delete' }).click();
    await this.page.waitForURL(/\/Employee(?:\?.*)?$/);
  }
}
