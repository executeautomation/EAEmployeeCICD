# Playwright Test Execution Report

Generated: 2026-11-02T06:01:03.933Z

## Environment

- Base URL: http://127.0.0.1:5114
- Platform: darwin arm64
- Node: v24.14.1
- Browser project: Google Chrome (Playwright channel)
- Database: isolated SQLite database recreated for this run
- Application target: .NET 8; local execution used installed runtime with configured roll-forward where required

## Summary

| Status | Count |
| --- | ---: |
| failed | 4 |
| passed | 21 |
| Total | 25 |

## Defects observed

- **TR-VAL-01:** Negative salary was persisted when the browser minimum constraint was bypassed; server-side range validation is missing.
- **TR-ONB-01:** Create Employee does not expose the required welcome-email, PF-setup, or IT-equipment onboarding selections.
- **TR-API-06:** The employee API response omits all three documented onboarding status fields.
- **TR-EXP-01 / TR-EXP-02:** The Employee directory provides neither CSV nor XLSX export controls.

## Test results

| Project | Test | Status | Duration (ms) | Failure summary |
| --- | --- | --- | ---: | --- |
| setup | 00-fixture.setup.ts › TR-OPS-01 \| initialize a fresh database and deterministic employee fixture | passed | 2104 |  |
| chromium | Public navigation and authorization › TR-NAV-01 \| public pages render with usable navigation | passed | 2825 |  |
| chromium | Public navigation and authorization › TR-NAV-02 / TR-AUTH-06 \| anonymous user sees auth links and cannot open Create | passed | 317 |  |
| chromium | Public navigation and authorization › TR-UX-02 \| mobile navigation and public directory remain usable | passed | 261 |  |
| chromium | Authentication and roles › TR-AUTH-03 \| invalid credentials show generic feedback | passed | 358 |  |
| chromium | Authentication and roles › TR-AUTH-01 / TR-AUTH-06 \| registered User can view details but cannot mutate employees | passed | 428 |  |
| chromium | Authentication and roles › TR-AUTH-04 / TR-AUTH-05 \| local return URL is honored and logout ends the session | passed | 504 |  |
| chromium | Employee directory, search, and pagination › TR-LIST-01 / TR-LIST-04 \| directory shows five records, total, fields, and grade labels | passed | 288 |  |
| chromium | Employee directory, search, and pagination › TR-LIST-02 \| name, email, and grade filters combine with AND | passed | 376 |  |
| chromium | Employee directory, search, and pagination › TR-LIST-03 \| pagination retains active filters and Clear resets them | passed | 467 |  |
| chromium | Employee directory, search, and pagination › TR-LIST-05 \| invalid page values do not cause server errors | passed | 16 |  |
| chromium | Employee CRUD, duplicates, and validation › TR-CREATE-01 / TR-EDIT-01 / TR-DEL-01 \| administrator completes a CRUD lifecycle | passed | 910 |  |
| chromium | Employee CRUD, duplicates, and validation › TR-DUP-01 \| exact duplicate email displays existing employee and saves nothing | passed | 625 |  |
| chromium | Employee CRUD, duplicates, and validation › TR-VAL-01 \| server rejects negative salary when browser constraints are bypassed | failed | 541 | Error: invalid salary must not be persisted |
| chromium | Employee CRUD, duplicates, and validation › TR-ONB-01 \| Create exposes the three onboarding selections required by the baseline | failed | 8111 | Error: expect(locator).toBeVisible() failed |
| chromium | Contributions and workforce analytics › TR-PF-01 / TR-PF-02 \| contribution directory and employee PF calculation are correct | passed | 393 |  |
| chromium | Contributions and workforce analytics › TR-PF-04 \| unknown contribution IDs return 404 | passed | 16 |  |
| chromium | Contributions and workforce analytics › TR-DASH-01 \| dashboard reconciles KPIs and distributions to the fixture | passed | 308 |  |
| chromium | Read-only employee API › TR-API-01 \| missing and invalid keys are rejected | passed | 12 |  |
| chromium | Read-only employee API › TR-API-02 / TR-API-05 \| default paging and combined filters match the fixture | passed | 12 |  |
| chromium | Read-only employee API › TR-API-03 / TR-API-04 \| paging parameters are normalized and no-match is empty | passed | 8 |  |
| chromium | Read-only employee API › TR-API-06 \| single employee response includes the documented baseline schema | failed | 12 | Error: expect(received).toHaveProperty(path) |
| chromium | Read-only employee API › TR-API-07 \| unsupported write operations cannot mutate employees | passed | 15 |  |
| chromium | Read-only employee API › TR-API-08 \| Swagger UI and schema expose both GET operations and API-key security | passed | 49 |  |
| chromium | Employee exports › TR-EXP-01 / TR-EXP-02 \| directory offers CSV and XLSX exports | failed | 8183 | Error: expect(locator).toBeVisible() failed |

## Evidence

- Interactive HTML report: `playwright-report/index.html`
- Machine-readable JSON: `test-report/results.json`
- CI-compatible JUnit: `test-report/results.xml`
- Failure screenshots, videos, and traces: `test-results/artifacts/`

Statuses are the actual Playwright outcomes. Product-requirement gaps are retained as failures rather than converted to passes.
