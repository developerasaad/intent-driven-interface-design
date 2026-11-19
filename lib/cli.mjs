import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, mkdtemp, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = fileURLToPath(new URL('../', import.meta.url));
const SOURCE = path.join(PACKAGE_ROOT, 'skill', 'intent-driven-interface-design');
const NAME = 'intent-driven-interface-design';
const MARKER = '.intent-driven-interface-design-install.json';
const VERSION = JSON.parse(await readFile(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version;

function usage() {
  return `Intent-Driven Interface Design v${VERSION}

Usage:
  intent-driven-interface-design install [options]
  intent-driven-interface-design status [options]
  intent-driven-interface-design uninstall [options]

Options:
  --agent <opencode|agents>  Agent directory format (default: opencode)
  --scope <project|global>  Install location (default: project)
  --dir <directory>       Project root (default: current directory)
  --force                 Backup and replace an existing install; or backup modified files on uninstall
  --dry-run               Print the intended destination without making changes
  --help, -h              Show help
  --version, -v           Show version

Examples:
  npx intent-driven-interface-design@latest install
  npx intent-driven-interface-design@latest install --scope global
  npx intent-driven-interface-design@latest install --agent agents --dir ./my-app
  npx intent-driven-interface-design@latest status
  npx intent-driven-interface-design@latest uninstall

No files are overwritten without --force. Replacements retain a local backup.`;
}

function parse(argv) {
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') return { command: 'help' };
  if (argv[0] === '--version' || argv[0] === '-v') return { command: 'version' };
  const [command, ...args] = argv;
  if (!['install', 'status', 'uninstall'].includes(command)) throw new Error(`Unknown command: ${command}. Run --help.`);
  const opts = { command, agent: 'opencode', scope: 'project', dir: process.cwd(), force: false, dryRun: false };
  let usedDir = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--agent' || arg === '--scope' || arg === '--dir') {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      if (arg === '--agent') opts.agent = value;
      if (arg === '--scope') opts.scope = value;
      if (arg === '--dir') { opts.dir = path.resolve(value); usedDir = true; }
    } else if (arg === '--force') opts.force = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--help' || arg === '-h') return { command: 'help' };
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!['opencode', 'agents'].includes(opts.agent)) throw new Error('--agent must be opencode or agents');
  if (!['project', 'global'].includes(opts.scope)) throw new Error('--scope must be project or global');
  if (opts.scope === 'global' && usedDir) throw new Error('--dir may only be used with --scope project');
  if (opts.force && command === 'status') throw new Error('--force does not apply to status');
  return opts;
}

function destination({ agent, scope, dir }) {
  if (scope === 'project') {
    const folder = agent === 'opencode' ? '.opencode' : '.agents';
    return path.join(dir, folder, 'skills', NAME);
  }
  if (agent === 'agents') return path.join(os.homedir(), '.agents', 'skills', NAME);
  const config = process.env.XDG_CONFIG_HOME || (process.platform === 'win32'
    ? (process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'))
    : path.join(os.homedir(), '.config'));
  return path.join(config, 'opencode', 'skills', NAME);
}

async function exists(target) {
  try { return await lstat(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function filesWithin(root, prefix = '') {
  const entries = await readdir(path.join(root, prefix), { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const rel = path.join(prefix, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Refusing symbolic link in skill directory: ${rel}`);
    if (entry.isDirectory()) files = files.concat(await filesWithin(root, rel));
    else if (entry.isFile()) files.push(rel.split(path.sep).join('/'));
    else throw new Error(`Unsupported filesystem entry: ${rel}`);
  }
  return files.sort();
}

async function hashes(root, excludingMarker = true) {
  const result = {};
  for (const rel of await filesWithin(root)) {
    if (excludingMarker && rel === MARKER) continue;
    result[rel] = createHash('sha256').update(await readFile(path.join(root, rel))).digest('hex');
  }
  return result;
}

async function inspect(dest) {
  const entry = await exists(dest);
  if (!entry) return { exists: false };
  if (!entry.isDirectory() || entry.isSymbolicLink()) return { exists: true, managed: false, reason: 'not an ordinary directory' };
  try {
    const marker = JSON.parse(await readFile(path.join(dest, MARKER), 'utf8'));
    if (marker.package !== NAME || !marker.files || typeof marker.files !== 'object' || Array.isArray(marker.files)) {
      return { exists: true, managed: false, reason: 'invalid install marker' };
    }
    const current = await hashes(dest);
    const same = JSON.stringify(current) === JSON.stringify(marker.files);
    return { exists: true, managed: true, modified: !same, version: marker.version };
  } catch (error) {
    if (error.code === 'ENOENT') return { exists: true, managed: false, reason: 'no install marker' };
    return { exists: true, managed: false, reason: 'unreadable marker or files' };
  }
}

function backupPath(dest) {
  return `${dest}.backup-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`;
}

async function install(dest, { force, dryRun }) {
  const parent = path.dirname(dest);
  const previous = await inspect(dest);
  if (previous.exists && !force) throw new Error(`Destination exists: ${dest}. Use --force to back it up and replace it.`);
  if (dryRun) {
    console.log(`Would install ${NAME} v${VERSION} at ${dest}${previous.exists ? ' (backing up existing directory)' : ''}`);
    return;
  }
  if (!(await stat(SOURCE)).isDirectory()) throw new Error('Packaged skill is missing');
  await mkdir(parent, { recursive: true });
  const staged = await mkdtemp(path.join(parent, '.intent-driven-skill-staging-'));
  let moved = null;
  try {
    // mkdtemp creates the directory; fs.cp expects to create the target itself.
    await rm(staged, { recursive: true, force: true });
    await cp(SOURCE, staged, { recursive: true, force: false, errorOnExist: true });
    const manifest = { package: NAME, version: VERSION, files: await hashes(staged) };
    await writeFile(path.join(staged, MARKER), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    if (previous.exists) {
      moved = backupPath(dest);
      await rename(dest, moved);
    }
    await rename(staged, dest);
    console.log(`Installed ${NAME} v${VERSION} at ${dest}`);
    if (moved) console.log(`Previous directory backed up at ${moved}`);
  } catch (error) {
    if (moved && !(await exists(dest))) await rename(moved, dest);
    throw error;
  } finally {
    if (await exists(staged)) await rm(staged, { recursive: true, force: true });
  }
}

async function uninstall(dest, { force, dryRun }) {
  const state = await inspect(dest);
  if (!state.exists) { console.log(`Not installed at ${dest}`); return; }
  if ((!state.managed || state.modified) && !force) throw new Error(`Cannot safely uninstall ${dest}: unrecognized or modified contents. Use --force to back up the directory instead.`);
  if (dryRun) { console.log(`Would ${force ? 'move to backup' : 'uninstall'} ${dest}`); return; }
  if (force) {
    const backup = backupPath(dest);
    await rename(dest, backup);
    console.log(`Moved existing directory to ${backup}. No user files were deleted.`);
  } else {
    await rm(dest, { recursive: true });
    console.log(`Uninstalled ${NAME} from ${dest}`);
  }
}

export async function run(argv) {
  const opts = parse(argv);
  if (opts.command === 'help') { console.log(usage()); return; }
  if (opts.command === 'version') { console.log(VERSION); return; }
  const dest = destination(opts);
  if (opts.scope === 'project' && !(await exists(opts.dir))) throw new Error(`Project directory does not exist: ${opts.dir}`);
  if (opts.command === 'install') return install(dest, opts);
  if (opts.command === 'uninstall') return uninstall(dest, opts);
  const state = await inspect(dest);
  console.log(`${dest}: ${!state.exists ? 'not installed' : !state.managed ? `unrecognized directory (${state.reason})` : `installed v${state.version}${state.modified ? ' (modified)' : ' (intact)'}`}`);
  if (state.managed && state.modified) process.exitCode = 1;
}
