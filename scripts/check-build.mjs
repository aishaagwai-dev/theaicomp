import {readFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
const html = readFileSync('public/index.html', 'utf8');
for (const file of ['public/assets/contact-submit.mjs', 'public/robots.txt']) {
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
}
for (const [,asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)"/g)) {
  if (!existsSync(resolve('public', '.' + asset))) throw new Error(`Missing ${asset}`);
}
if (!html.includes('data-delivery="web3forms"') || !html.includes('name="access_key"')) throw new Error('Contact delivery configuration is missing.');
if (html.includes('Private website preview') || /name="robots" content="noindex/.test(html)) throw new Error('Private preview settings remain.');
if (!html.includes('https://www.theaicomp.ng/')) throw new Error('Canonical URL is missing.');
console.log('Production page, existing Web3Forms integration and assets checked.');
