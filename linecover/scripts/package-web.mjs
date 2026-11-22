/** Publish only compiled runtime assets to the static site's approved public folder. */
import { createHash } from 'node:crypto';
import { readFile, copyFile, mkdir, writeFile, chmod } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../../',import.meta.url));
const build=path.resolve(process.argv[2] || path.join(root,'linecover/build/web'));
const output=path.join(root,'ribeye-cc/public/demos/linecover');
const hash=data=>createHash('sha256').update(data).digest('hex');
const sources=['linecover/CMakeLists.txt','linecover/include/linecover/core.hpp','linecover/src/core.cpp','linecover/src/viewer.cpp'];
const sourceHashes=Object.fromEntries(await Promise.all(sources.map(async name=>[name,hash(await readFile(path.join(root,name)))])));
await mkdir(output,{recursive:true});
const assetHashes={};
for(const name of ['linecover.js','linecover.wasm']) {
  const data=await readFile(path.join(build,name));
  assetHashes[name]=hash(data);
  await copyFile(path.join(build,name),path.join(output,name));
  await chmod(path.join(output,name),0o644);
}
await writeFile(path.join(output,'build-info.json'),JSON.stringify({schema:1,raylib:'6.0',raylibCommit:'dbc56a87da87d973a9c5baa4e7438a9d20121d28',emscripten:'4.0.20',sourceHashes,assetHashes},null,2)+'\n');
console.log('Packaged raylib JavaScript, WebAssembly and source/asset hashes for GitHub Pages.');
