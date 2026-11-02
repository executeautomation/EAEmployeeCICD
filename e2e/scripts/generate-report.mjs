import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const jsonPath = resolve(root, 'test-report/results.json');
const markdownPath = resolve(root, 'test-report/EXECUTION_REPORT.md');
mkdirSync(resolve(root, 'test-report'), { recursive: true });

if (!existsSync(jsonPath)) {
  writeFileSync(markdownPath, '# Playwright Test Execution Report\n\nNo JSON execution result was available.\n');
  process.exit(0);
}

const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
const stripAnsi = value => value.replace(/\u001b\[[0-9;]*m/g, '');
const tests = [];
const walk = suite => {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const result = test.results?.at(-1);
      tests.push({
        title: [...(suite.title ? [suite.title] : []), spec.title].join(' › '),
        project: test.projectName,
        status: result?.status ?? 'unknown',
        duration: result?.duration ?? 0,
        error: stripAnsi(result?.error?.message?.split('\n')[0] ?? '')
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child);
};
for (const suite of report.suites ?? []) walk(suite);

const counts = tests.reduce((all, test) => {
  all[test.status] = (all[test.status] ?? 0) + 1;
  return all;
}, {});
const generated = new Date().toISOString();
const defects = [
  ['TR-VAL-01', 'Negative salary was persisted when the browser minimum constraint was bypassed; server-side range validation is missing.'],
  ['TR-ONB-01', 'Create Employee does not expose the required welcome-email, PF-setup, or IT-equipment onboarding selections.'],
  ['TR-API-06', 'The employee API response omits all three documented onboarding status fields.'],
  ['TR-EXP-01 / TR-EXP-02', 'The Employee directory provides neither CSV nor XLSX export controls.']
].filter(([id]) => tests.some(test => test.status === 'failed' && test.title.includes(id)));
const lines = [
  '# Playwright Test Execution Report',
  '',
  `Generated: ${generated}`,
  '',
  '## Environment',
  '',
  `- Base URL: ${process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5114'}`,
  `- Platform: ${process.platform} ${process.arch}`,
  `- Node: ${process.version}`,
  '- Browser project: Google Chrome (Playwright channel)',
  '- Database: isolated SQLite database recreated for this run',
  '- Application target: .NET 8; local execution used installed runtime with configured roll-forward where required',
  '',
  '## Summary',
  '',
  '| Status | Count |',
  '| --- | ---: |',
  ...Object.entries(counts).sort().map(([status, count]) => `| ${status} | ${count} |`),
  `| Total | ${tests.length} |`,
  '',
  '## Defects observed',
  '',
  ...(defects.length ? defects.map(([id, description]) => `- **${id}:** ${description}`) : ['- None in this execution.']),
  '',
  '## Test results',
  '',
  '| Project | Test | Status | Duration (ms) | Failure summary |',
  '| --- | --- | --- | ---: | --- |',
  ...tests.map(test => `| ${test.project} | ${test.title.replaceAll('|', '\\|')} | ${test.status} | ${test.duration} | ${test.error.replaceAll('|', '\\|')} |`),
  '',
  '## Evidence',
  '',
  '- Interactive HTML report: `playwright-report/index.html`',
  '- Machine-readable JSON: `test-report/results.json`',
  '- CI-compatible JUnit: `test-report/results.xml`',
  '- Failure screenshots, videos, and traces: `test-results/artifacts/`',
  '',
  'Statuses are the actual Playwright outcomes. Product-requirement gaps are retained as failures rather than converted to passes.'
];

writeFileSync(markdownPath, `${lines.join('\n')}\n`);
console.log(`Markdown execution report: ${markdownPath}`);
