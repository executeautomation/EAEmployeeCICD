import { type Page } from '@playwright/test';
import type { EmployeeData } from '../fixtures/employees';

export class EmployeeFormPage {
  constructor(private readonly page: Page) {}

  async fill(employee: EmployeeData) {
    await this.page.getByLabel('Full Name').fill(employee.name);
    await this.page.getByLabel('Age').fill(String(employee.age));
    await this.page.getByLabel('Monthly Salary').fill(String(employee.salary));
    await this.page.getByLabel('Duration Worked (months)').fill(String(employee.months));
    await this.page.getByLabel('Grade').selectOption(String(employee.grade));
    await this.page.getByLabel('Email Address').fill(employee.email);
  }

  async create(employee: EmployeeData) {
    await this.page.goto('/Employee/Create');
    await this.fill(employee);
    await this.page.getByRole('button', { name: /Create Employee/ }).click();
    await this.page.waitForURL(/\/Employee(?:\?.*)?$/);
  }

  async save(employee: EmployeeData) {
    await this.fill(employee);
    await this.page.getByRole('button', { name: /Save Changes/ }).click();
    await this.page.waitForURL(/\/Employee(?:\?.*)?$/);
  }
}
