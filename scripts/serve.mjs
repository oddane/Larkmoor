#!/usr/bin/env node
// Tiny static server for the docs and examples. Usage: node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain' };
export function serve(port = 4173) {
  const server = createServer(async (req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, path);
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); const body = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(body); }
    catch { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found'); }
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] || 4173);
  serve(port).then(() => console.log(`http://127.0.0.1:${port}/  (docs at /docs/, examples at /examples/tauawo/ and /examples/harbor/)`));
}
