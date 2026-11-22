/** Local preview only. GitHub Pages serves the built files without this server. */
import { createServer } from 'node:http';
import { createReadStream, watch } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4',
};

function byteRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2]) || size === 0) return null;
  const first = Number(match[1]);
  const last = Number(match[2]);
  if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last)) return null;
  const start = match[1] ? first : Math.max(0, size - last);
  const end = match[1] ? (match[2] ? Math.min(last, size - 1) : size - 1) : size - 1;
  return start <= end && start < size ? { start, end } : null;
}

export function createStaticServer(directory = path.join(projectRoot, 'dist')) {
  const root = path.resolve(directory);
  const inside = filename => filename === root || filename.startsWith(root + path.sep);
  return createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-cache');
    const sendText = (status, message, headers = {}) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': Buffer.byteLength(message), ...headers });
      response.end(request.method === 'HEAD' ? undefined : message);
    };
    if (!['GET', 'HEAD'].includes(request.method)) return sendText(405, 'Method not allowed', { Allow: 'GET, HEAD' });
    let url, pathname;
    try {
      url = new URL(request.url, 'http://localhost');
      pathname = decodeURIComponent(url.pathname);
      if (pathname.includes('\0')) throw new Error('Invalid path');
    } catch { return sendText(400, 'Invalid URL'); }
    let filename = path.resolve(root, '.' + pathname);
    if (!inside(filename) || pathname.split('/').some(part => part.startsWith('.'))) return sendText(404, 'Not found');
    let info;
    try {
      info = await stat(filename);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) {
          response.writeHead(308, { Location: url.pathname + '/' + url.search });
          return response.end();
        }
        filename = path.join(filename, 'index.html');
        info = await stat(filename);
      }
      if (!info.isFile() || !inside(await realpath(filename))) return sendText(404, 'Not found');
    } catch {
      try {
        const body = await readFile(path.join(root, '404.html'));
        response.writeHead(404, { 'Content-Type': mime['.html'], 'Content-Length': body.length });
        return response.end(request.method === 'HEAD' ? undefined : body);
      } catch { return sendText(404, 'Not found'); }
    }
    const range = request.method === 'GET' && request.headers.range ? byteRange(request.headers.range, info.size) : undefined;
    if (range === null) return sendText(416, 'Range not satisfiable', { 'Content-Range': `bytes */${info.size}` });
    const headers = {
      'Content-Type': mime[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      'Content-Length': range ? range.end - range.start + 1 : info.size,
      'Accept-Ranges': 'bytes',
    };
    if (range) headers['Content-Range'] = `bytes ${range.start}-${range.end}/${info.size}`;
    response.writeHead(range ? 206 : 200, headers);
    if (request.method === 'HEAD') return response.end();
    const stream = createReadStream(filename, range);
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  });
}

async function runBuild() {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(projectRoot, 'scripts/build.mjs')], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Build exited with ${code}`)));
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let host = '127.0.0.1', port = 4321, watching = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--watch') watching = true;
    else if (args[i] === '--host' && args[i + 1]) host = args[++i];
    else if (args[i] === '--port' && args[i + 1]) port = Number(args[++i]);
    else throw new Error(`Unknown argument: ${args[i]}`);
  }
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port');
  if (watching) await runBuild();
  else await stat(path.join(projectRoot, 'dist/index.html'));
  const server = createStaticServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`Local: http://${host}:${server.address().port}/ (${watching ? 'rebuilds on edits; refresh to view' : 'production preview'})`));
  const watchers = [];
  let timer, building = false, pending = false;
  async function rebuild() {
    if (building) { pending = true; return; }
    building = true;
    try { await runBuild(); } catch (error) { console.error(error.message); }
    finally { building = false; if (pending) { pending = false; await rebuild(); } }
  }
  if (watching) for (const directory of ['src', 'public']) {
    watchers.push(watch(path.join(projectRoot, directory), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 100);
    }));
  }
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
    clearTimeout(timer);
    for (const watcher of watchers) watcher.close();
    server.close();
  });
}
