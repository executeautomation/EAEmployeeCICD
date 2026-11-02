import { expect, type Page } from '@playwright/test';

export class ContributionsPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/EmployeeDetails');
    await expect(this.page.getByText('PF & Company contribution breakdown per employee')).toBeVisible();
  }

  rowByName(name: string) {
    return this.page.locator('table tbody tr', { has: this.page.locator('.emp-name', { hasText: name }) });
  }

  async openPf(name: string) {
    await this.rowByName(name).getByRole('link', { name: /PF Contribution/ }).click();
  }
}
