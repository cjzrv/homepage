/** Check the actual static output: links, translations, metadata and document semantics. */
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteRoutes, localUrl } from '../src/data/site.js';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://ribeye.cc';
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(match => match[0]);
const isFile = async file => { try { return (await stat(file)).isFile(); } catch { return false; } };
async function walk(dir) {
  return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(entry => {
    assert.ok(!entry.isSymbolicLink(),`Public output must not contain symlinks: ${entry.name}`);
    return entry.isDirectory() ? walk(path.join(dir,entry.name)) : path.join(dir,entry.name);
  }))).flat();
}
const files = await walk(root);
const pages = new Map();
for (const file of files.filter(file => file.endsWith('.html'))) {
  const route = '/' + path.relative(root,file).split(path.sep).join('/').replace(/index\.html$/,'');
  pages.set(route,await readFile(file,'utf8'));
}
const expectedRoutes = siteRoutes.flatMap(route => ['en','zh-tw'].map(lang => localUrl(route,lang)));
assert.deepEqual(new Set(pages.keys()),new Set([...expectedRoutes,'/zh-tw/','/404.html']),'Every bilingual route, legacy Chinese homepage and custom 404 must be built');
assert.match(pages.get('/'), /<html lang="zh-Hant-TW">/, 'The root homepage defaults to Traditional Chinese');
assert.match(pages.get('/'), /我是莊淳傑/, 'The root homepage contains Chinese content');
assert.match(pages.get('/en/'), /<html lang="en">/, 'The English homepage remains available');
assert.match(pages.get('/en/'), /I am Chun-Jie Zhuang/, 'The English homepage contains English content');
const fail = (route,message) => `${route}: ${message}`;
for (const [route,html] of pages) {
  assert.ok(!/data-astro|\/_astro\//.test(html),fail(route,'no framework runtime or generated framework assets'));
  assert.equal((html.match(/<h1\b/g)||[]).length,1,fail(route,'exactly one h1'));
  assert.match(html,/<title>[^<]+<\/title>/,fail(route,'page title'));
  assert.match(html,/<main\b[^>]*\bid="main"[^>]*\btabindex="-1"/,fail(route,'focusable skip target'));
  const metadata=tags(html,'meta');
  assert.ok(metadata.some(tag => attr(tag,'name')==='description' && attr(tag,'content')?.length>15),fail(route,'useful description'));
  let previous=0;
  for (const heading of html.matchAll(/<h([1-6])\b/g)) {
    const level=Number(heading[1]);
    assert.ok(level<=previous+1,fail(route,`heading jump h${previous} to h${level}`));
    previous=level;
  }
  for (const img of tags(html,'img')) {
    assert.ok(attr(img,'alt')?.trim(),fail(route,'image alternative text'));
    assert.ok(attr(img,'width') && attr(img,'height'),fail(route,'reserved image dimensions'));
    assert.ok(attr(img,'src')?.startsWith('/images/'),fail(route,'self-hosted image'));
  }
  const scripts=tags(html,'script');
  const demo=route.endsWith('/projects/linecover/demo/');
  assert.equal(scripts.length,route.endsWith('/about/')||demo?1:0,fail(route,'scripts are confined to CV and interactive demo pages'));
  if (scripts.length) assert.equal(attr(scripts[0],'src'),demo?'/demos/linecover/demo.js':'/print.js',fail(route,'page-specific script'));
  if (demo) {
    assert.equal(attr(scripts[0],'type'),'module',fail(route,'demo module'));
    assert.ok(tags(html,'canvas').some(tag=>attr(tag,'aria-label') && attr(tag,'tabindex')==='0'),fail(route,'accessible canvas'));
    const wasm=await readFile(path.join(root,'demos/linecover/linecover.wasm'));
    assert.deepEqual([...wasm.subarray(0,4)],[0,97,115,109],'compiled WebAssembly magic');
  }
  for (const video of tags(html,'video')) {
    assert.match(video,/\scontrols(?:\s|>)/,fail(route,'native video controls'));
    assert.equal(attr(video,'preload'),'none',fail(route,'video must not preload the full file'));
    assert.ok(!/\sautoplay(?:\s|>)/.test(video),fail(route,'no autoplay'));
  }
  for (const table of html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/g)) {
    assert.match(table[1],/<caption\b/,fail(route,'table caption'));
    assert.ok(tags(table[1],'th').every(tag => ['row','col'].includes(attr(tag,'scope'))),fail(route,'table header scope'));
  }
  for (const tag of [...tags(html,'a'),...tags(html,'link'),...tags(html,'img'),...tags(html,'script'),...tags(html,'source'),...tags(html,'video')]) {
    const value=attr(tag,'href')||attr(tag,'src')||attr(tag,'poster');
    if (!value || value.startsWith('mailto:')) continue;
    const url=new URL(value.replaceAll('&amp;','&'),origin+route);
    if (url.origin!==origin) continue;
    if (pages.has(url.pathname)) {
      if (url.hash) assert.ok(pages.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),fail(route,`missing anchor ${value}`));
    } else {
      assert.ok(await isFile(path.join(root,decodeURIComponent(url.pathname))),fail(route,`missing resource ${value}`));
    }
  }
  const noindex=metadata.some(tag => attr(tag,'name')==='robots' && attr(tag,'content')?.includes('noindex'));
  if (route==='/404.html') { assert.ok(noindex,'404 must not be indexed'); continue; }
  assert.ok(!noindex,fail(route,'public content must be indexable'));
  const language=route==='/' || route.startsWith('/zh-tw/')?'zh-Hant-TW':'en';
  assert.equal(attr(tags(html,'html')[0],'lang'),language,fail(route,'document language'));
  const links=tags(html,'link');
  const canonicalRoute=route==='/zh-tw/'?'/':route;
  assert.equal(attr(links.find(tag=>attr(tag,'rel')==='canonical')||'','href'),origin+canonicalRoute,fail(route,'canonical URL'));
  const counterpart=route==='/' || route==='/zh-tw/'?'/en/':route==='/en/'?'/':route.startsWith('/zh-tw/')?route.replace(/^\/zh-tw/,''):'/zh-tw'+route;
  const alternateLang=language==='en'?'zh-Hant-TW':'en';
  assert.equal(attr(links.find(tag=>attr(tag,'hreflang')===alternateLang)||'','href'),origin+counterpart,fail(route,'alternate language metadata'));
  assert.ok(tags(html,'a').some(tag=>attr(tag,'class')==='nav-language' && attr(tag,'href')===counterpart),fail(route,'language switch preserves page'));
  assert.equal(attr(links.find(tag=>attr(tag,'hreflang')==='x-default')||'','href'),origin+(language==='en'?counterpart:canonicalRoute),fail(route,'Chinese is the default language'));
}
const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
const locations=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
assert.deepEqual(new Set(locations),new Set(expectedRoutes),'Sitemap covers canonical bilingual pages without duplicating the legacy homepage');
assert.ok(!files.some(file => /\.pdf$/i.test(file)),'Private PDFs must stay outside the public output');
assert.ok(!files.some(file => file.includes(`${path.sep}_astro${path.sep}`)),'No retired framework output');
assert.ok(!pages.get('/projects/dldr/').includes('<img'),'DLDR must not embed the unsuitable repository screenshot');
assert.match(pages.get('/research/accisage/'),/Manuscript/,'AcciSAGE manuscript status');
assert.match(pages.get('/research/accisage/'),/0\.5503/,'AcciSAGE reference result');
assert.match(pages.get('/research/pcb-coverage/'),/1753\.16%/,'PCB comparison figure');
for (const [route,html] of pages) {
  assert.ok(!/Hao-Chen Gao|Chi-Ming Huang|高浩宸|黃志明/.test(html),fail(route,'PCB author list remains omitted'));
}
for (const lang of ['en','zh-tw']) {
  for (const route of ['/','/research/','/projects/','/research/pcb-coverage/','/projects/linecover/','/about/']) {
    const href=localUrl('/projects/linecover/demo/',lang);
    const html=pages.get(localUrl(route,lang));
    assert.ok(tags(html,'a').some(tag=>attr(tag,'href')===href),fail(localUrl(route,lang),'PCB interactive demo must be directly discoverable'));
  }
  for (const route of ['/','/research/','/research/accisage/','/about/']) assert.ok(pages.get(localUrl(route,lang)).includes('https://hdl.handle.net/11296/u6rz3a'),'Thesis link must be retained');
  for (const route of ['/','/research/']) {
    const html=pages.get(localUrl(route,lang));
    const graduate=lang==='en'?'Graduate research':'碩士研究';
    const journal=lang==='en'?'Journal article':'期刊論文';
    assert.ok(html.indexOf(`>${graduate}<`)<html.indexOf(`>${journal}<`),'Graduate research must appear first');
  }
  const cv=pages.get(localUrl('/about/',lang));
  for (const fact of ['Arch Linux','Docker','ROS','Voice Processing','x86 assembly']) assert.ok(cv.includes(fact),`CV retains ${fact}`);
}
console.log(`Checked ${pages.size} HTML pages: internal links and assets, heading hierarchy, bilingual routes, SEO, table/image accessibility, sitemap, and private-file boundaries.`);
