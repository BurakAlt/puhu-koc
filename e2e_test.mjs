// End-to-end check of index.html in installed Chrome (uses local veri/veri.js).
// Run: node e2e_test.mjs
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL_ = 'file:///' + new URL('./index.html', import.meta.url).pathname.replace(/^\//, '');
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1366,1000', '--mute-audio'] });
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
if (best && kind !== 'pat') {                                           // pat cards accept any non-stalemate move, so 'wrong = not best' is not wrong there
  await page.click('[data-ask="tehlike"]');
  const g = await say();
  assert.match(g, /senin görevin/, 'danger chip must not answer before the card is solved: ' + g);
  assert.doesNotMatch(g, /[a-h][1-8]/, 'no square names leaked: ' + g);
  const wrong = await page.evaluate((fen, best) => new koc.Chess(fen).moves({ verbose: true }).map(m => m.from + m.to).find(u => u !== best.slice(0, 4)), fen, best);
  await move(wrong);
  assert.match(await say(), /rakip gözüyle bak/, 'wrong move: opponent view: ' + await say());
  assert.doesNotMatch(await say(), /olmaz/);
  assert.equal(await page.$eval('#coachRule', e => e.hidden), true, 'no golden rule on a wrong answer');
  await new Promise(r => setTimeout(r, 1000));
  await move(best);
  assert.match(await say(), /Dikkatle bakıp buldun/, 'best move: process praise: ' + await say());
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
for (let i = 0; i < 3 && !(await page.evaluate(() => koc.P.theme === 'patTrap' && !!koc.P.fen)); i++) {
  await page.click('[data-th="patTrap"]');                              // chips re-render on mode entry; retry a stale click
  await new Promise(r => setTimeout(r, 400));
}
await page.waitForFunction(() => koc.P.fen && koc.P.theme === 'patTrap', { timeout: 5000 });
await page.click('[data-ask="tehlike"]');                              // danger chip before the puzzle is solved: still the child's task
assert.match(await say(), /senin görevin/, 'danger chip silent in an open puzzle: ' + await say());
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
assert.match(await say(), /Ailene soralım, not aldım/);
assert.equal((await page.$$('#askSug [data-ask]')).length, 3, '3 suggestion buttons');
await page.type('#askIn', 'catal nedir');
await page.click('#askForm button[type="submit"]');
assert.match(await say(), /^Çatal:/, 'folded question: ' + await say());

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
assert.equal(await page.$$eval('#veliBody .kpi', k => k.at(-1).querySelector('span').textContent), 'Rapid puanı', 'rapid box last');
assert.match(await page.$eval('#veliBody', e => e.textContent), /yalnız analizli oyunlar/);
assert.doesNotMatch(await page.$$eval('#veliBody .kpi', k => k.find(x => /Puhu ile çalışma/.test(x.textContent)).textContent), /dakika/);
assert.equal(await page.$$eval('#veliBody svg.chart', s => s.length) >= 1, true, 'weekly chart drawn');
assert.match(await page.$eval("#veliBody", e => e.textContent), /bilemediği sorular[^]*uzay gemisi/, "unknown question listed for parent");
await page.screenshot({ path: new URL('./veli_e2e.png', import.meta.url).pathname.replace(/^\//, ''), fullPage: true });

// 3d. Post-game review: feeling -> own guess -> Puhu's finding -> lesson saved; home shows the lesson
await page.click('[data-go="mac"]');
await page.waitForSelector('[data-feel]', { timeout: 10000 });
await page.click('[data-feel="Zordu"]');
await page.waitForSelector('#macPick');
// move the slider to the child's own first move, then pick it
await page.evaluate(() => { const s = document.getElementById('macSlider'); const g = koc.R.g, white = g.players.white.user?.id === koc.S.me; s.value = white ? 1 : 2; s.dispatchEvent(new Event('input')); });
assert.equal(await page.$eval('#macPick', b => b.disabled), false, 'own move can be picked');
await page.click('#macPick');
await page.waitForSelector('#macToLesson', { timeout: 120000 });     // may run the engine on an unanalyzed game
console.log('review says:', (await say()).slice(0, 90));
await page.click('#macToLesson');
await page.click('[data-idea="0"]');
await page.click('#macSave');
const saved = await page.evaluate(() => { const all = JSON.parse(localStorage.getItem('incelenen:' + koc.S.me) || '{}'); return Object.values(all)[0]; });
assert.equal(saved.his, 'Zordu'); assert.ok(saved.ders.length > 5); assert.ok([0, 1, 2].includes(saved.puan));
assert.match(await say(), /Dersini kaydettim/);
assert.match(await page.$eval('#macPanel', e => e.textContent), /giriş yap/, 'local mode explains the Lichess sign-in');

// 4. Home reflects progress
await page.click('[data-go="bugun"]');
const steps = await page.$$eval('#steps li span', s => s.map(x => x.textContent));
console.log('steps:', steps, 'stars:', await stars());
assert.ok(steps[1].startsWith('1'), 'hunt step counted');

// 4b. Last-3-months map in Karnem: filter by kind, click a tile -> that exact mistake opens on the board
await page.click('[data-go="karne"]');
await page.waitForSelector('#mapBox .tile', { timeout: 10000 });
const beast = await page.$eval('#mapBox .beast', b => b.dataset.kind);
await page.click('#mapBox .beast');
assert.ok(await page.$$eval(`#mapBox .tile:not(.dim)`, t => t.length) >= 1, 'filter keeps its own tiles');
assert.equal(await page.$eval('#mapBox .beast', b => b.getAttribute('aria-pressed')), 'true', 'filter ' + beast);
const tileKey = await page.$eval('#mapBox .tile:not(.dim)', t => t.dataset.key);
await page.click(`#mapBox .tile[data-key="${tileKey}"]`);
await page.waitForFunction(k => koc.S.mode === 'hata' && koc.T.it?.key === k, { timeout: 5000 }, tileKey);
await page.click('[data-go="karne"]');
await page.waitForSelector('#mapBox .tile');
await page.screenshot({ path: new URL('./harita_e2e.png', import.meta.url).pathname.replace(/^\//, ''), fullPage: true });

// 5. Rank-up celebration: at 24 stars a clean stalemate-trap solve (+2) reaches the Knight rank
await page.evaluate(() => { const d = new Date().toLocaleDateString('sv-SE'); localStorage.setItem('stars', JSON.stringify({ [d]: 24 })); });
await page.click('[data-go="bulmaca"]');
for (let i = 0; i < 3 && !(await page.evaluate(() => koc.P.theme === 'patTrap' && !!koc.P.fen && koc.P.step === 0)); i++) {
  await page.click('[data-th="patTrap"]'); await new Promise(r => setTimeout(r, 400));
}
const mate2 = await page.evaluate(() => { const c = new koc.Chess(koc.P.fen); for (const m of c.moves({ verbose: true })) { c.move(m); if (c.isCheckmate()) return m.from + m.to; c.undo(); } });
await move(mate2);
await page.waitForFunction(() => !document.getElementById('celebrate').hidden, { timeout: 5000 });
assert.match(await page.$eval('#celTitle', e => e.textContent), /At rütbesi/);
await page.screenshot({ path: new URL('./kutlama_e2e.png', import.meta.url).pathname.replace(/^\//, '') });
await page.click('#celClose');
assert.equal(await page.$eval('#celebrate', e => e.hidden), true);

// 6. Weekly day count instead of a streak; finished plan hides the CTA and shows the rest card
await page.click('[data-go="bugun"]');
assert.match(await page.$eval('#streak', e => e.textContent), /Bu hafta \d \/ 7 gün/, 'weekly day count');
assert.equal(await page.$eval('#cta', e => e.hidden), false, 'cta visible while the plan is open');
await page.evaluate(() => { const g = {}; g[new Date().toLocaleDateString('sv-SE')] = { hata: 3, avci: 5, bulmaca: 5 }; localStorage.setItem('gun', JSON.stringify(g)); });
await page.goto(URL_ + '#bugun'); await page.reload();
await page.waitForFunction(() => window.koc?.S.loaded, { timeout: 20000 });
assert.equal(await page.$eval('#cta', e => e.hidden), true, 'cta hidden when the plan is done');
assert.equal(await page.$eval('#restCard', e => e.hidden), false, 'rest card shown');
assert.match(await page.$eval('#restCard', e => e.textContent), /Bugünlük bitti! Şimdi Lichess'te rapid bir oyun oyna ya da dinlen\./, 'rest card text');

// 7. E7: wrong move then mode switch within 100 ms: the stale timer must not touch the board or throw
await page.click('[data-go="hata"]');
await page.waitForFunction(() => window.koc.T.it && !window.koc.T.done, { timeout: 5000 });
const wrongUci = await page.evaluate(() => { const c = new koc.Chess(koc.T.it.fen); return c.moves({ verbose: true }).map(m => m.from + m.to).find(u => u !== koc.T.it.best); });
await clickSquare(wrongUci.slice(0, 2)); await clickSquare(wrongUci.slice(2, 4));
await page.click('[data-go="bulmaca"]');
await new Promise(r => setTimeout(r, 1200));
assert.equal(await page.evaluate(() => koc.S.mode), 'bulmaca');
// parent panel: checklist persists, backup carries only progress, opponent shown as rakip (puan)
await page.click('[data-go="veli"]');
await page.waitForSelector('#yedekIndir', { timeout: 15000 });
await page.click('[data-kontrol="kid"]');
assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('veliKontrol')).kid), true, 'checklist stored');
assert.match(await page.$$eval('#veliBody .sheet', els => els.find(e => /Son 10 oyun/.test(e.textContent)).textContent), /rakip \(\d+\)|bilgisayar/, 'opponent as rakip (puan)');

assert.deepEqual(errors, [], 'no page errors');
await browser.close();
console.log('OK: e2e passes');
