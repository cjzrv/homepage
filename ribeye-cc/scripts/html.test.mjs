import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, link } from '../src/html.js';

test('shared text and URL attributes cannot introduce HTML', () => {
  assert.equal(escapeHtml('<img src="x" onerror=\'bad()\'> &'), '&lt;img src=&quot;x&quot; onerror=&#39;bad()&#39;&gt; &amp;');
  assert.equal(link('https://example.org/?a=1&b=2', 'C < C++'), '<a href="https://example.org/?a=1&amp;b=2">C &lt; C++</a>');
  assert.match(link('/research/accisage/#video', '研究介紹影片'), /href="\/research\/accisage\/#video"/);
});

test('links allow normal site/contact destinations, not executable protocols', () => {
  assert.match(link('mailto:cjz89k@gmail.com', 'Email'), /mailto:/);
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'file:///etc/passwd']) {
    assert.throws(() => link(url, 'Link'), /Unsupported link/);
  }
});
