import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { identity, research, projects, siteRoutes } from '../src/data/site.js';
import { profile } from '../src/data/profile.js';

const root = fileURLToPath(new URL('../', import.meta.url));
async function files(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
let count = 0;
for (const file of [...await files(path.join(root, 'src')), ...await files(path.join(root, 'scripts')), path.join(root, 'public/print.js'), path.join(root,'public/demos/linecover/demo.js'), path.join(root,'public/demos/linecover/random-shapes.js')]) {
  if (!/\.m?js$/.test(file)) continue;
  const source=await readFile(file,'utf8');
  for (const match of source.matchAll(/(?:from\s+|import\s*\()['"]([^'"]+)['"]/g)) {
    assert.ok(match[1].startsWith('node:') || match[1].startsWith('.'),`External dependency in ${file}: ${match[1]}`);
  }
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  count += 1;
}
const localized = (value, field) => {
  for (const language of ['en', 'zh-tw']) assert.equal(typeof value?.[language], 'string', `${field}: missing ${language}`);
};
assert.equal(new URL(identity.website).protocol, 'https:');
assert.equal(new Set(siteRoutes).size, siteRoutes.length, 'Duplicate site route');
for (const work of [...research, ...projects]) {
  assert.match(work.slug, /^[a-z0-9-]+$/);
  for (const field of ['category', 'summary']) localized(work[field], `${work.slug}.${field}`);
  if (work.publicationStatus === 'published') {
    localized(work.publication?.venue, `${work.slug}.publication.venue`);
    assert.ok(work.publication.volume && work.publication.pages, 'Published work needs volume and page numbers');
  }
  if (work.translatedTitle) localized(work.translatedTitle, `${work.slug}.translatedTitle`);
  if (work.subtitle) localized(work.subtitle, `${work.slug}.subtitle`);
  if (work.demoRoute) assert.ok(siteRoutes.includes(work.demoRoute), `${work.slug}: demo route must be built`);
  for (const item of work.links) {
    localized(item.label, `${work.slug}.link.label`);
    assert.equal(new URL(item.href).protocol, 'https:');
  }
}
for (const item of profile.education) for (const field of ['institution', 'degree', 'shortDegree']) localized(item[field], `education.${field}`);
for (const text of profile.introduction) localized(text, 'introduction');
localized(profile.linuxExperience, 'linuxExperience');
const demoAssets=path.join(root,'public/demos/linecover');
const buildInfo=JSON.parse(await readFile(path.join(demoAssets,'build-info.json'),'utf8'));
const hash=data=>createHash('sha256').update(data).digest('hex');
for(const [file,expected] of Object.entries(buildInfo.sourceHashes)) assert.equal(hash(await readFile(path.join(root,'..',file))),expected,`${file}: rebuild the WebAssembly demo with linecover/scripts/build-web.sh`);
for(const [file,expected] of Object.entries(buildInfo.assetHashes)) assert.equal(hash(await readFile(path.join(demoAssets,file))),expected,`${file}: compiled demo asset hash`);
console.log(`Checked ${count} JavaScript files and bilingual content data (Node built-ins only).`);
