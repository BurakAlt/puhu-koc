// Run: node test_akil.mjs
// Tests the pure "brain" block of index.html (between AKIL-BASLA / AKIL-BITIR markers).
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const block = html.split('// AKIL-BASLA')[1].split('// AKIL-BITIR')[0];
const dir = mkdtempSync(join(tmpdir(), 'akil-'));
const file = join(dir, 'akil.mjs');
const chessUrl = pathToFileURL(join(process.cwd(), 'node_modules/chess.js/dist/esm/chess.js')).href;
writeFileSync(file, `import { Chess } from '${chessUrl}';\n${block}\nexport { explain, hangingPieces, leitnerNext, pickTheme, makeStalemateTrap, thinkTimes, sayable, answer, dangerReport };`);
const A = await import(pathToFileURL(file).href);

const cases = [
  ['pat', '7k/8/6K1/8/8/8/8/5Q2 w - - 0 1', 'f1f7', 'f1f8'],
  ['matIzin', 'rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2', 'g2g4', 'b1c3'],
  ['matKacti', '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', 'g1f2', 'a1a8'],
  ['asili', '4k3/8/3p4/8/8/5N2/8/4K3 w - - 0 1', 'f3e5', 'f3d4'],
  ['tehdit', '4k3/8/8/8/8/2b5/8/R6K w - - 0 1', 'h1g1', 'a1a3'],
  ['korumasiz', '3rk3/8/8/8/3N4/4P3/8/4K3 w - - 0 1', 'e3e4', 'd4f5'],
  ['catal', '4k3/8/8/8/1n6/8/8/1Q2K3 w - - 0 1', 'b1a1', 'b1b4'],
  ['bedava', '4k3/8/8/3n4/8/8/8/3RK3 w - - 0 1', 'e1f2', 'd1d5'],
];
for (const [kind, fen, played, best] of cases) {
  const r = A.explain(fen, played, best);
  assert.equal(r.kind, kind, `${kind}: got ${r.kind}`);
  assert.ok(r.text.length > 10 && r.rule && r.theme, `${kind}: needs text/rule/theme`);
}
// lichess comment fallback when board rules find nothing
assert.equal(A.explain('4k3/8/8/8/8/8/8/R3K3 w - - 0 1', 'e1d2', 'a1a2', 'Lost forced checkmate sequence').kind, 'matKacti');

// hanging pieces of a color (king never counts)
assert.deepEqual(A.hangingPieces('4k3/8/8/8/8/2b5/8/R6K w - - 0 1', 'w').map(h => h.sq), ['a1']);
assert.deepEqual(A.hangingPieces('4k3/8/8/8/8/2b5/1P6/R1K5 w - - 0 1', 'w'), []);

// Leitner: correct moves up a box and pushes due date, wrong resets to box 1 due now
const now = 1_000_000_000_000, day = 864e5;
let c = A.leitnerNext(undefined, true, now);
assert.equal(c.box, 2); assert.equal(c.due, now + day);
c = A.leitnerNext(c, true, now); assert.equal(c.box, 3); assert.equal(c.due, now + 3 * day);
c = A.leitnerNext(c, false, now); assert.equal(c.box, 1); assert.equal(c.due, now);

// pickTheme: weakest (big share, low mastery) wins with deterministic rng
const profile = { asili: 10, catal: 1 }, mastery = { asili: { ok: 0, n: 0 }, catal: { ok: 0, n: 0 } };
assert.equal(A.pickTheme(profile, mastery, () => 0), 'hangingPiece');
assert.equal(A.pickTheme({ asili: 1, catal: 1 }, { asili: { ok: 50, n: 50 }, catal: { ok: 0, n: 50 } }, () => 0), 'fork');

// stalemate trap: mate-in-1 exists AND a stalemating move exists
for (let i = 0; i < 5; i++) {
  const fen = A.makeStalemateTrap(Math.random);
  const ch = new (await import(chessUrl)).Chess(fen);
  const ms = ch.moves({ verbose: true });
  const res = ms.map(m => { ch.move(m); const r = ch.isCheckmate() ? 'mate' : ch.isStalemate() ? 'pat' : ''; ch.undo(); return r; });
  assert.ok(res.includes('mate') && res.includes('pat'), 'trap needs both');
}

// think time: centiseconds, spent = previous own clock - current + increment
const g = { clocks: [60000, 60000, 59000, 58000, 58500, 50000], clock: { increment: 5 } };
assert.deepEqual(A.thinkTimes(g), [null, null, 15, 25, 10, 85]);

// speech: Turkish SAN and squares become words; normal words untouched
assert.equal(A.sayable('Burada <b>Fxd7</b> oynadın.'), 'Burada fil alır d yedi oynadın.');
assert.equal(A.sayable('Ae5 ile, e4 karesine'), 'at e beş ile, e dört karesine');
assert.equal(A.sayable('Vh5# ve O-O, exd5+'), 'vezir h beş mat ve kısa rok, e alır d beş şah');
assert.equal(A.sayable('Şah çekebilir miyim? Kale!'), 'Şah çekebilir miyim? Kale!');

// ask Puhu: glossary by keyword, Turkish casing, unknown -> null
assert.match(A.answer('Çatal nedir?')[0], /^Çatal:/);
assert.match(A.answer('ROK NASIL YAPILIR')[0], /^Rok:/);
assert.equal(A.answer('uzay gemisi'), null);

// danger report for the side to move
const d1 = A.dangerReport('4k3/8/8/8/8/2b5/8/R6K w - - 0 1');          // my rook a1 hangs to the bishop
assert.deepEqual(d1.mine, ['a1']); assert.deepEqual(d1.theirs, []); assert.equal(d1.mateThreat, null);
const d2 = A.dangerReport('6k1/8/8/8/8/8/5PPP/r5K1 w - - 0 1');        // in check: no mate-threat scan
assert.equal(d2.inCheck, true);
const d3 = A.dangerReport('3r2k1/8/8/8/8/8/5PPP/6K1 w - - 0 1');       // Rd1# threatened on my back rank
assert.equal(d3.mateThreat, 'd1');

console.log('OK: all brain tests pass');
