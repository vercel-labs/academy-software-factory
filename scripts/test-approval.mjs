import { copyFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Eve snapshots only the fixture app. Copy the actual tool into that boundary.
const root = new URL('../', import.meta.url);
await mkdir(new URL('fixtures/approval-runtime/agent/tools/', root), { recursive: true });
await copyFile(new URL('agent/tools/approve_spec.ts', root), new URL('fixtures/approval-runtime/agent/tools/approve_spec.ts', root));
const child = spawn(fileURLToPath(new URL('node_modules/.bin/eve', root)), ['eval', '--strict'], {
  cwd: fileURLToPath(new URL('fixtures/approval-runtime/', root)),
  stdio: 'inherit',
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
