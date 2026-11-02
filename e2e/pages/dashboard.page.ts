import { expect, type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/Home/Dashboard');
    await expect(this.page.getByRole('heading', { name: 'Workforce Dashboard' })).toBeVisible();
  }

  metric(label: string) {
    return this.page.locator('.stat-card', { hasText: label }).locator('.sc-value');
  }

  distribution(label: string) {
    return this.page.locator('.bar-row', { has: this.page.locator('.bar-label', { hasText: label }) }).locator('.bar-count');
  }
}
