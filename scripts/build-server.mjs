import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(`${dir}/${entry.name}`) : `${dir}/${entry.name}`))).flat();
}
const routes = (await files('functions/api')).filter(file => file.endsWith('.ts') && !file.endsWith('_middleware.ts'));
routes.push('functions/sitemap.xml.ts');
await mkdir('output', { recursive: true });
await writeFile('output/routes.ts', routes.map((file, i) => `import * as route${i} from '../${file}';`).join('\n') + '\nexport default {\n' + routes.map((file, i) => `${JSON.stringify('/' + file.replace(/^functions\//, '').replace(/\.ts$/, ''))}: route${i}`).join(',\n') + '\n};\n');
await build({ entryPoints: ['server/index.mjs'], outfile: 'output/server.mjs', bundle: true, platform: 'node', target: 'node24', format: 'esm', logLevel: 'info' });
