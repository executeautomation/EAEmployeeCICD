import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(returnUrl?: string) {
    const query = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
    await this.page.goto(`/Account/Login${query}`);
  }

  async login(username: string, password: string, rememberMe = false) {
    await this.page.getByLabel('User Name').fill(username);
    await this.page.getByLabel('Password').fill(password);
    if (rememberMe) await this.page.getByLabel('Keep me signed in').check();
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async loginAsAdmin() {
    await this.open();
    await this.login('admin', 'password');
    await expect(this.page.getByRole('link', { name: 'Hello admin!' })).toBeVisible();
  }
}
