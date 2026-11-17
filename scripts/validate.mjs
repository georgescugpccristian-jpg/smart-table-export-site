// Dependency-free checks for this small static site, not a full HTML conformance validator.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let checks = 0;
function check(condition, message) {
  assert.ok(condition, message);
  checks++;
}

function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g)]
    .map(([, key, double, single, bare]) => [key.toLowerCase(), double ?? single ?? bare ?? '']));
}

const pages = new Map(readdirSync(root).filter(name => name.endsWith('.html')).map(name => {
  const html = readFileSync(resolve(root, name), 'utf8');
  const tags = [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<([a-z][\w:-]*)\b([^<>]*?)>/gi)]
    .map(([, tag, source]) => ({ tag: tag.toLowerCase(), attrs: attributes(source) }));
  const ids = tags.filter(tag => 'id' in tag.attrs).map(tag => tag.attrs.id);
  check(new Set(ids).size === ids.length, `${name}: duplicate IDs`);
  return [name, { html, tags, ids: new Set(ids) }];
}));

const external = new Set();
for (const [name, { html, tags, ids }] of pages) {
  check(/^<!doctype html>/i.test(html), `${name}: missing HTML doctype`);
  check(tags.some(t => t.tag === 'html' && t.attrs.lang === 'en'), `${name}: missing language`);
  check(tags.some(t => t.tag === 'meta' && t.attrs.charset === 'utf-8'), `${name}: missing UTF-8`);
  check(tags.some(t => t.tag === 'meta' && t.attrs.name === 'viewport' &&
    t.attrs.content === 'width=device-width, initial-scale=1'), `${name}: mobile viewport`);
  check(tags.filter(t => t.tag === 'h1').length === 1, `${name}: expected one h1`);
  check(/<title>[^<]+<\/title>/.test(html), `${name}: missing title`);
  check(tags.some(t => t.tag === 'meta' && t.attrs.name === 'description' && t.attrs.content?.trim()),
    `${name}: missing description`);
  check(!/lemon\s*squeezy|lemonsqueezy|two (?:devices|activations)|up to two/i.test(html),
    `${name}: obsolete provider/device claim`);
  check(!html.includes('\uFFFD'), `${name}: replacement characters`);
  check(!tags.some(t => ['script', 'form', 'iframe'].includes(t.tag)), `${name}: unexpected active content`);
  for (const { tag, attrs } of tags) {
    check(!Object.keys(attrs).some(key => /^on/i.test(key)), `${name}: inline event handler`);
    if (tag === 'img') check('alt' in attrs, `${name}: image missing alt`);
    if (tag === 'a') check(Boolean(attrs.href), `${name}: anchor without destination`);
    for (const key of ['aria-labelledby', 'aria-describedby']) {
      for (const id of (attrs[key] || '').split(/\s+/).filter(Boolean)) {
        check(ids.has(id), `${name}: missing ${key} target ${id}`);
      }
    }
    for (const ref of [attrs.href, attrs.src].filter(value => value !== undefined)) {
      check(Boolean(ref), `${name}: empty link or source`);
      const url = new URL(ref, `https://local.invalid/smart-table-export-site/${name}`);
      if (url.origin !== 'https://local.invalid') {
        check(url.protocol === 'https:' && !url.username && !url.password, `${name}: unsafe external URL`);
        check(!/(?:^|\.)gumroad\.com$/.test(url.hostname) || url.pathname === '/privacy',
          `${name}: checkout must remain disabled`);
        check(!['chromewebstore.google.com', 'chrome.google.com'].includes(url.hostname),
          `${name}: install must remain disabled`);
        external.add(url.href);
        continue;
      }
      const prefix = '/smart-table-export-site/';
      check(url.pathname.startsWith(prefix), `${name}: link escapes GitHub Pages project path`);
      const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
      const target = resolve(root, relative);
      check(target.startsWith(root + sep) && existsSync(target), `${name}: missing asset/page ${relative}`);
      if (url.hash) check(pages.get(relative)?.ids.has(decodeURIComponent(url.hash.slice(1))),
        `${name}: broken fragment ${ref}`);
    }
  }
}

const home = pages.get('index.html');
for (const [id, status] of [['install-cta', 'install-status'], ['purchase-cta', 'purchase-status']]) {
  const cta = home.tags.find(t => t.attrs.id === id);
  check(cta?.tag === 'button' && 'disabled' in cta.attrs && cta.attrs.type === 'button', `${id}: gate is open`);
  check(!('href' in cta.attrs) && !('formaction' in cta.attrs), `${id}: navigable disabled CTA`);
  check(cta.attrs['aria-describedby'] === status, `${id}: missing status description`);
  check(new RegExp(`id="${id}"[^>]*>[^<]*Coming soon<`).test(home.html), `${id}: misleading label`);
}
check(home.tags.find(t => t.attrs.id === 'purchase-cta').attrs['data-launch-url'] ===
  'https://georgescu0.gumroad.com/l/smart-table-export', 'Incorrect final Gumroad URL');
check(!('data-launch-url' in home.tags.find(t => t.attrs.id === 'install-cta').attrs), 'Unverified store URL');
check(/\$7\.99 <span>USD<\/span>/.test(home.html), 'Incorrect public Pro price');
check(existsSync(resolve(root, '.nojekyll')), 'Missing static GitHub Pages marker');
console.log(`PASS: ${checks} static checks across ${pages.size} pages (assets, fragments, metadata, accessibility references, launch gates).`);
console.log('No build step or dependencies. External URLs syntax-checked; live destinations not requested:');
for (const url of external) console.log(`  ${url}`);
