import { type Page } from '@playwright/test';

export class RegisterPage {
  constructor(private readonly page: Page) {}

  async register(username: string, email: string, password: string) {
    await this.page.goto('/Account/Register');
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Email Address').fill(email);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.getByLabel('Confirm Password').fill(password);
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }
}
