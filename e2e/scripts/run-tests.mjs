import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
mkdirSync(resolve(root, 'test-report'), { recursive: true });

const passthrough = process.argv.slice(2);
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const testRun = spawnSync(command, ['playwright', 'test', ...passthrough], {
  cwd: root,
  env: process.env,
  stdio: 'inherit'
});

spawnSync(process.execPath, ['e2e/scripts/generate-report.mjs'], {
  cwd: root,
  env: process.env,
  stdio: 'inherit'
});

process.exit(testRun.status ?? 1);
