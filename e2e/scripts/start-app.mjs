import { mkdirSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const dataDirectory = resolve(root, '.playwright-data');
const database = resolve(dataDirectory, 'e2e.sqlite');

mkdirSync(dataDirectory, { recursive: true });
for (const suffix of ['', '-shm', '-wal']) rmSync(`${database}${suffix}`, { force: true });

// Resolve dotnet from PATH by default so this launcher works both locally and
// on GitHub-hosted Linux runners. DOTNET_PATH remains available as an override.
const dotnet = process.env.DOTNET_PATH ?? 'dotnet';
const child = spawn(dotnet, ['run', '--no-build', '--no-launch-profile'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    DOTNET_ROLL_FORWARD: process.env.DOTNET_ROLL_FORWARD ?? 'Major',
    ASPNETCORE_URLS: process.env.ASPNETCORE_URLS ?? 'http://127.0.0.1:5114',
    ASPNETCORE_ENVIRONMENT: 'Development',
    Logging__LogLevel__Default: 'Warning',
    Logging__LogLevel__Microsoft_EntityFrameworkCore_Database_Command: 'Warning',
    ConnectionStrings__DefaultConnection: `DataSource=${database};Cache=Shared`,
    ApiSettings__ApiKey: process.env.E2E_API_KEY ?? 'local-e2e-key'
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
child.on('exit', code => process.exit(code ?? 1));
