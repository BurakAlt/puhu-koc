// End-to-end check of index.html in installed Chrome (uses local veri/veri.js).
// Run: node e2e_test.mjs
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL_ = 'file:///' + new URL('./index.html', import.meta.url).pathname.replace(/^\//, '');
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1366,1000'] });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 1000 });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

const say = () => page.$eval('#coachSay', e => e.textContent);
async function clickSquare(sq) {
  const box = await page.$eval('#board', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
  const orient = await page.evaluate(() => document.querySelector('.cg-wrap').classList.contains('orientation-black') ? 'black' : 'white');
  const f = sq.charCodeAt(0) - 97, r = +sq[1] - 1, s = box.w / 8;
  const col = orient === 'white' ? f : 7 - f, row = orient === 'white' ? 7 - r : r;
  await page.mouse.click(box.x + col * s + s / 2, box.y + row * s + s / 2);
  await new Promise(r => setTimeout(r, 150));
}
const move = async uci => { await clickSquare(uci.slice(0, 2)); await clickSquare(uci.slice(2, 4)); await new Promise(r => setTimeout(r, 300)); };
const stars = () => page.$eval('#starTotal', e => +e.textContent);

await page.goto(URL_ + '#hata');
await page.waitForFunction(() => window.koc?.S.loaded && window.koc.T.it, { timeout: 20000 });
await page.evaluate(() => localStorage.clear());

// 1. Hatalarım: wrong move first (a legal non-best move), then the best move
const { best, fen, kind } = await page.evaluate(() => ({ best: koc.T.it.best, fen: koc.T.it.fen, kind: koc.T.it.ex.kind }));
console.log('hata item:', kind, best);
if (best) {
  const wrong = await page.evaluate((fen, best) => new koc.Chess(fen).moves({ verbose: true }).map(m => m.from + m.to).find(u => u !== best.slice(0, 4)), fen, best);
  await move(wrong);
  assert.match(await say(), /olmaz|değil/, 'wrong move must be rejected');
  await new Promise(r => setTimeout(r, 1000));
  await move(best);
  assert.match(await say(), /aferin/, 'best move must be praised: ' + await say());
  assert.equal(await stars(), 1);
  assert.equal(await page.$eval('#coachRule', e => e.hidden), false, 'golden rule shown');
}

// 2. Tehdit avı: wrong square, then a correct target
await page.click('[data-go="avci"]');
await page.waitForFunction(() => koc.H.it);
const targets = await page.evaluate(() => koc.H.it.targets.map(t => t.sq));
const emptySq = await page.evaluate(() => { const c = new koc.Chess(koc.H.it.fen); return koc.Chess && ['a1','b1','c1','d1','e1','f1','g1','h1','a4','b4','c4','d4','e4','f4','g4','h4'].find(s => !c.get(s) && !koc.H.it.targets.some(t => t.sq === s)); });
await clickSquare(emptySq);
assert.match(await say(), /Orada değil/);
await clickSquare(targets[0]);
assert.match(await say(), /Evet/, 'hunt hit: ' + await say());

// 3. Pat tuzağı: stalemate move is rejected, mate is accepted
await page.click('[data-go="bulmaca"]');
await page.waitForSelector('[data-th="patTrap"]');
await page.click('[data-th="patTrap"]');
await page.waitForFunction(() => koc.P.fen && koc.P.theme === 'patTrap');
const { mate, pat } = await page.evaluate(() => {
  const c = new koc.Chess(koc.P.fen); let mate, pat;
  for (const m of c.moves({ verbose: true })) { c.move(m); if (c.isCheckmate()) mate = m.from + m.to; else if (c.isStalemate()) pat = m.from + m.to; c.undo(); }
  return { mate, pat };
});
await move(pat);
assert.match(await say(), /PAT/, 'stalemate explained: ' + await say());
await new Promise(r => setTimeout(r, 1200));
await move(mate);
assert.match(await say(), /Çözdün/, 'mate solves: ' + await say());

// 3b. Ask Puhu: typed question and position danger chip
await page.type('#askIn', 'Çatal nedir?');
await page.click('#askForm button[type="submit"]');
assert.match(await say(), /^Çatal:/, 'glossary answer: ' + await say());
await page.click('[data-ask="tehlike"]');
assert.ok((await say()).length > 20, 'danger report spoken');
await page.type('#askIn', 'uzay gemisi');
await page.click('#askForm button[type="submit"]');
assert.match(await say(), /henüz bilmiyorum/);

// 3c. Parent dashboard: gate rejects a wrong answer, accepts the right one, KPIs render
await page.click('[data-go="veli"]');
await page.type('#gateIn', '1');
await page.click('#veliGate button');
assert.match(await page.$eval('#gateMsg', e => e.textContent), /yanlış/);
await new Promise(r => setTimeout(r, 1100));
const [ga, gb] = (await page.$eval('#gateQ', e => e.textContent)).match(/\d+/g).map(Number);
await page.type('#gateIn', String(ga * gb));
await page.click('#veliGate button');
await page.waitForFunction(() => document.querySelectorAll('#veliBody .kpi').length === 8, { timeout: 15000 });
assert.equal(await page.$$eval('#veliBody svg.chart', s => s.length) >= 1, true, 'weekly chart drawn');
await page.screenshot({ path: new URL('./veli_e2e.png', import.meta.url).pathname.replace(/^\//, ''), fullPage: true });

// 4. Home reflects progress
await page.click('[data-go="bugun"]');
const steps = await page.$$eval('#steps li span', s => s.map(x => x.textContent));
console.log('steps:', steps, 'stars:', await stars());
assert.ok(steps[1].startsWith('1'), 'hunt step counted');

assert.deepEqual(errors, [], 'no page errors');
await browser.close();
console.log('OK: e2e passes');
