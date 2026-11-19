import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
const demo = path.join(root, 'examples', 'opencode-template', 'dist');
const site = path.join(root, 'site');
const website = path.join(output, 'index.html');
const exists = async p => { try { return (await stat(p)).isDirectory(); } catch (e) { if (e.code === 'ENOENT') return false; throw e; } };

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(site, output, { recursive: true });
let markup = await readFile(website, 'utf8');
if (await exists(demo)) {
  const entries = await readdir(demo);
  if (!entries.includes('index.html')) throw new Error('Demo dist/ exists but has no index.html; cannot deploy');
  await cp(demo, path.join(output, 'demo'), { recursive: true });
  markup = markup.replace('<!-- DEMO_NAV -->', '<a href="./demo/">Example site</a>');
  markup = markup.replace('<!-- DEMO_STATUS -->', '<a class="button secondary" href="./demo/">View the OpenCode-built example ↗</a>');
  console.log('Included OpenCode demo from examples/opencode-template/dist/');
} else {
  markup = markup.replace('<!-- DEMO_NAV -->', '');
  markup = markup.replace('<!-- DEMO_STATUS -->', '<p class="muted">The OpenCode example will appear here once its source is added and built. No demo has been published yet.</p>');
  console.log('No OpenCode demo dist/ found; publishing skill documentation only.');
}
await writeFile(website, markup, 'utf8');
await writeFile(path.join(output, '.nojekyll'), '', 'utf8');
console.log(`GitHub Pages output: ${output}`);
