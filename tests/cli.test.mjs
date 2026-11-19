import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../bin/intent-driven-interface-design.mjs', import.meta.url));
async function fixture(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'idid-test-'));
  try { return await fn(root); } finally { await rm(root, { recursive: true, force: true }); }
}
function run(dir, ...args) {
  return spawnSync(process.execPath, [cli, ...args, '--dir', dir], { encoding: 'utf8' });
}

await test('help and version do not require a project', () => {
  const help = spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /install/);
  assert.match(spawnSync(process.execPath, [cli, '-v'], { encoding: 'utf8' }).stdout, /0\.1\.0/);
});

await test('installs full skill for OpenCode, reports status, uninstalls cleanly', () => fixture(async root => {
  const dest = path.join(root, '.opencode', 'skills', 'intent-driven-interface-design');
  const result = run(root, 'install');
  assert.equal(result.status, 0, result.stderr);
  assert.match(await readFile(path.join(dest, 'SKILL.md'), 'utf8'), /name: intent-driven-interface-design/);
  assert.match((await readdir(path.join(dest, 'references'))).join(' '), /rendered-review.md/);
  assert.match(run(root, 'status').stdout, /intact/);
  assert.equal(run(root, 'uninstall').status, 0);
  assert.match(run(root, 'status').stdout, /not installed/);
}));

await test('supports the portable .agents directory', () => fixture(async root => {
  assert.equal(run(root, 'install', '--agent', 'agents').status, 0);
  assert.match(await readFile(path.join(root, '.agents/skills/intent-driven-interface-design/SKILL.md'), 'utf8'), /Purpose/);
}));

await test('dry-run does not make any changes', () => fixture(async root => {
  const res = run(root, 'install', '--dry-run');
  assert.equal(res.status, 0, res.stderr);
  assert.match(res.stdout, /Would install/);
  assert.match(run(root, 'status').stdout, /not installed/);
}));

await test('refuses overwrite; force retains original as backup', () => fixture(async root => {
  const dest = path.join(root, '.opencode/skills/intent-driven-interface-design');
  await mkdir(dest, { recursive: true });
  await writeFile(path.join(dest, 'custom.md'), 'precious work');
  assert.notEqual(run(root, 'install').status, 0);
  assert.equal(run(root, 'install', '--force').status, 0);
  const siblings = await readdir(path.dirname(dest));
  const backup = siblings.find(n => n.startsWith('intent-driven-interface-design.backup-'));
  assert.ok(backup, siblings.join(','));
  assert.equal(await readFile(path.join(path.dirname(dest), backup, 'custom.md'), 'utf8'), 'precious work');
}));

await test('detects modified skill and refuses destructive uninstall', () => fixture(async root => {
  assert.equal(run(root, 'install').status, 0);
  const dest = path.join(root, '.opencode/skills/intent-driven-interface-design');
  await writeFile(path.join(dest, 'SKILL.md'), 'changed by user');
  assert.notEqual(run(root, 'status').status, 0);
  assert.notEqual(run(root, 'uninstall').status, 0);
  assert.equal(run(root, 'uninstall', '--force').status, 0);
  const siblings = await readdir(path.dirname(dest));
  assert.ok(siblings.some(n => n.includes('.backup-')));
}));

await test('invalid arguments fail rather than changing unexpected paths', () => fixture(async root => {
  assert.notEqual(run(root, 'install', '--agent', 'fake').status, 0);
  assert.notEqual(run(root, 'install', '--scope', 'global').status, 0);
  assert.notEqual(run(root, 'install', '--unknown').status, 0);
}));
