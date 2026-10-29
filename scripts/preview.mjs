import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';

const root = resolve('public');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.svg':'image/svg+xml','.txt':'text/plain','.xml':'application/xml'};
createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost:3000');
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end();return;}
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!path.startsWith(root + sep)) {res.writeHead(403);res.end();return;}
    const data = await readFile(path);
    res.writeHead(200, {'Content-Type':types[extname(path)] || 'application/octet-stream'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(404);res.end('Page not found');}
}).listen(3000, '127.0.0.1', () => console.log('Local preview: http://localhost:3000 (contact submission uses the existing Web3Forms account).'));
