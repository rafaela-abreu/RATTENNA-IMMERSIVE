import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('styles.css', 'dist/styles.css');
await cp('app.js', 'dist/app.js');
await cp('public', 'dist/public', { recursive: true });
console.log('Built dist/ for Rattenna Tecnologia');
