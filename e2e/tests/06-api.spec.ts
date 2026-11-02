import { expect, test } from '@playwright/test';

const apiKey = process.env.E2E_API_KEY ?? 'local-e2e-key';
const headers = { 'X-Api-Key': apiKey };

test.describe('Read-only employee API', () => {
  test('TR-API-01 | missing and invalid keys are rejected', async ({ request }) => {
    expect((await request.get('/api/employees')).status()).toBe(401);
    expect((await request.get('/api/employees', { headers: { 'X-Api-Key': 'wrong' } })).status()).toBe(401);
  });

  test('TR-API-02 / TR-API-05 | default paging and combined filters match the fixture', async ({ request }) => {
    const first = await request.get('/api/employees', { headers });
    expect(first.status()).toBe(200);
    const body = await first.json();
    expect(body).toMatchObject({ totalCount: 12, page: 1, pageSize: 10, totalPages: 2 });
    expect(body.data).toHaveLength(10);
    expect(body.data.map((employee: { id: number }) => employee.id)).toEqual([...body.data.map((employee: { id: number }) => employee.id)].sort((a, b) => a - b));

    const filtered = await request.get('/api/employees?searchTerm=Ann&emailTerm=team-a&gradeFilter=2', { headers });
    const filteredBody = await filtered.json();
    expect(filteredBody.totalCount).toBe(1);
    expect(filteredBody.data[0].name).toBe('Anna Beta');
  });

  test('TR-API-03 / TR-API-04 | paging parameters are normalized and no-match is empty', async ({ request }) => {
    const normalized = await request.get('/api/employees?page=0&pageSize=51', { headers });
    expect(await normalized.json()).toMatchObject({ page: 1, pageSize: 50, totalCount: 12 });

    const empty = await request.get('/api/employees?searchTerm=Nobody', { headers });
    expect(await empty.json()).toMatchObject({ totalCount: 0, totalPages: 0, data: [] });
  });

  test('TR-API-06 | single employee response includes the documented baseline schema', async ({ request }) => {
    const list = await (await request.get('/api/employees?searchTerm=Ann%20Alpha', { headers })).json();
    const response = await request.get(`/api/employees/${list.data[0].id}`, { headers });
    expect(response.status()).toBe(200);
    const employee = await response.json();
    expect(employee).toMatchObject({
      name: 'Ann Alpha',
      email: 'ann.alpha@team-a.example',
      age: 18,
      salary: 1000,
      durationWorked: 6,
      grade: 1
    });
    expect(employee).toHaveProperty('isWelcomeEmailSent');
    expect(employee).toHaveProperty('isPFAccountSetupCompleted');
    expect(employee).toHaveProperty('isITEquipmentAssigned');
  });

  test('TR-API-07 | unsupported write operations cannot mutate employees', async ({ request }) => {
    const before = await (await request.get('/api/employees', { headers })).json();
    const response = await request.post('/api/employees', { headers, data: { name: 'API Write' } });
    expect([404, 405]).toContain(response.status());
    const after = await (await request.get('/api/employees', { headers })).json();
    expect(after.totalCount).toBe(before.totalCount);
  });

  test('TR-API-08 | Swagger UI and schema expose both GET operations and API-key security', async ({ request }) => {
    expect((await request.get('/swagger/index.html')).status()).toBe(200);
    const schema = await (await request.get('/swagger/v1/swagger.json')).json();
    expect(schema.paths['/api/employees'].get).toBeTruthy();
    expect(schema.paths['/api/employees/{id}'].get).toBeTruthy();
    expect(schema.components.securitySchemes.ApiKey).toMatchObject({ name: 'X-Api-Key', in: 'header' });
  });
});
