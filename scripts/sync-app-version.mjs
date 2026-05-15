import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const appJsonPath = resolve(root, 'app.json');
const appJson = JSON.parse(await readFile(appJsonPath, 'utf8'));

const previous = appJson.expo.version;
appJson.expo.version = pkg.version;

await writeFile(appJsonPath, JSON.stringify(appJson, null, 2) + '\n', 'utf8');

console.log(`app.json version: ${previous} -> ${pkg.version}`);
