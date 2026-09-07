import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const sourceRoot = new URL('..', import.meta.url).pathname;
const server = join(sourceRoot, 'server.mjs');

async function waitForServer(proc, port) {
  for (let i = 0; i < 50; i++) {
    try { await fetch(`http://127.0.0.1:${port}/`); return; } catch { await new Promise(r => setTimeout(r, 50)); }
  }
  throw new Error('server did not start');
}

test('static server serves only the explicit public surface', async t => {
  const root = await mkdtemp(join(tmpdir(), 'mlbb-public-'));
  const outside = await mkdtemp(join(tmpdir(), 'mlbb-secret-'));
  const port = 43000 + Math.floor(Math.random() * 1000);
  await mkdir(join(root, 'assets'));
  await writeFile(join(root, 'index.html'), 'PUBLIC');
  await writeFile(join(root, 'assets', 'ok.txt'), 'ASSET');
  await writeFile(join(root, '.env'), 'SECRET=never-serve');
  await writeFile(join(root, 'README.md'), 'PRIVATE SOURCE');
  await writeFile(join(outside, 'secret.txt'), 'OUTSIDE SECRET');
  await symlink(join(outside, 'secret.txt'), join(root, 'assets', 'leak.txt'));

  const proc = spawn(process.execPath, [server], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  t.after(async () => { proc.kill('SIGTERM'); await rm(root, { recursive: true, force: true }); await rm(outside, { recursive: true, force: true }); });
  await waitForServer(proc, port);

  const get = async path => { const r = await fetch(`http://127.0.0.1:${port}${path}`); return { status: r.status, body: await r.text() }; };
  assert.equal((await get('/')).status, 200);
  assert.equal((await get('/assets/ok.txt')).status, 200);
  for (const path of ['/.env', '/README.md', '/.git/config', '/package.json', '/server.mjs', '/assets/leak.txt', '/%2e%2e/.env']) {
    const r = await get(path);
    assert.equal(r.status, 404, `must not expose ${path}`);
  }
});
