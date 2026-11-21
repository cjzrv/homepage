import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { stat } from 'node:fs/promises';
import { createStaticServer } from './serve.mjs';

let server, origin;
before(async () => {
  server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });

test('localized routes, canonical redirects, HEAD and custom 404', async () => {
  const redirect = await fetch(origin + '/zh-tw/about?from=test', { redirect: 'manual' });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), '/zh-tw/about/?from=test');
  const page = await fetch(origin + '/zh-tw/about/');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Arch Linux/);
  const head = await fetch(origin + '/', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.ok(Number(head.headers.get('content-length')) > 100);
  assert.equal(await head.text(), '');
  const missing = await fetch(origin + '/does-not-exist/');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /找不到此頁面/);
});

test('video streaming supports byte ranges and rejects invalid ranges', async () => {
  const url = origin + '/media/accisage-introduction.mp4';
  const size = (await stat(new URL('../dist/media/accisage-introduction.mp4', import.meta.url))).size;
  const response = await fetch(url, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-type'), 'video/mp4');
  assert.equal(response.headers.get('content-range'), `bytes 0-1023/${size}`);
  assert.equal((await response.arrayBuffer()).byteLength, 1024);
  const suffix = await fetch(url, { headers: { Range: 'bytes=-16' } });
  assert.equal(suffix.status, 206);
  assert.equal((await suffix.arrayBuffer()).byteLength, 16);
  for (const range of [`bytes=${size}-`, 'bytes=9-2', 'bytes=0-2,8-9', 'bytes=-0']) {
    const invalid = await fetch(url, { headers: { Range: range } });
    assert.equal(invalid.status, 416, range);
    await invalid.text();
  }
});

test('only built files are served; no source files or write methods', async () => {
  for (const route of ['/package.json', '/src/data/profile.js', '/%2e%2e%2fsrc/data/profile.js', '/.env', '/%00']) {
    const response = await fetch(origin + route);
    assert.ok([400, 404].includes(response.status), route);
    await response.text();
  }
  const write = await fetch(origin + '/', { method: 'POST' });
  assert.equal(write.status, 405);
  assert.equal(write.headers.get('allow'), 'GET, HEAD');
  await write.text();
});
