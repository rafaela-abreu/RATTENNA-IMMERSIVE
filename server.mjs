import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  const cleanPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const safePath = normalize(requested).replace(/^\.\.(\/|\\|$)/, '');
  let filePath = join(root, safePath);
  if (safePath.startsWith('/manus-storage/')) {
    filePath = join(root, 'public', safePath.split('/').at(-1));
  }
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': mime[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    const publicPath = join(root, 'public', safePath);
    try {
      const publicInfo = await stat(publicPath);
      if (!publicInfo.isFile()) throw new Error('not a public file');
      const body = await readFile(publicPath);
      res.writeHead(200, { 'Content-Type': mime[extname(publicPath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(body);
      return;
    } catch {
      if (!extname(filePath)) {
      const body = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': mime['.html'], 'Cache-Control': 'no-cache' });
      res.end(body);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
      }
    }
  }
});

server.listen(port, '0.0.0.0', () => console.log(`Rattenna preview listening on ${port}`));
