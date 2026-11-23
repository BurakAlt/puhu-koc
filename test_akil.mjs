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
writeFileSync(file, `import { Chess } from '${chessUrl}';\n${block}\nexport { explain, hangingPieces, leitnerNext, isBeaten, pickTheme, makeStalemateTrap, thinkTimes, sayable, answer, dangerReport, parentMetrics, KINDS, difficultyFor, gameStats, pendingReviews, reviewTruth, guessScore, reviewPgn, monthBuckets, weekDays, weekStart, weekWork, normBest, KONTROL, thinkNote, rakipGozu, oppLabel, packProgress, unpackProgress, foldTr, addQuestion, speedScores, speedNote };`);
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
// P5: counting exchange (SEE), value order, forker safety
assert.ok(A.hangingPieces('7k/8/4p3/3r4/1N3N2/8/8/7K w - - 0 1', 'b').some(h => h.sq === 'd5'), 'iki atın saldırdığı, tek piyonun koruduğu kale asılı');
assert.ok(A.hangingPieces('7k/8/8/3n4/1N6/2N1n3/8/7K b - - 0 1', 'b').some(h => h.sq === 'd5'), 'two knights vs one knight defender wins the knight');
assert.ok(A.hangingPieces('8/8/4k3/3b4/1N6/2N5/8/7K b - - 0 1', 'b').some(h => h.sq === 'd5'), 'king cannot recapture while another attacker remains');
assert.deepEqual(A.hangingPieces('8/8/4k3/3b4/8/2N5/8/7K b - - 0 1', 'b'), [], 'king may recapture the last attacker');
assert.equal(A.explain('4k3/2b5/8/8/q7/8/1N5P/2K5 w - - 0 1', 'c1b1', 'b2a4').kind, 'bedava', 'vezir bedava + piyon asılı');
assert.equal(A.explain('4k3/8/8/8/1n6/8/7R/1Q2K3 w - - 0 1', 'b1a1', 'b1b4').kind, 'bedava', 'a forker taken for free is no fork');

// Leitner (P11): 1, 3, 7, 16, 35 days; wrong -> box 1, back in 10 minutes
const now = 1_000_000_000_000, day = 864e5;
let c = A.leitnerNext(undefined, true, now);
assert.equal(c.box, 2); assert.equal(c.due, now + day);
for (const d of [3, 7, 16, 35]) { const t = c.due; c = A.leitnerNext(c, true, t); assert.equal(c.due, t + d * day); }
{ const t = c.due; c = A.leitnerNext(c, true, t); assert.equal(c.due, t + 35 * day, 'top box stays at 35 days'); }
c = A.leitnerNext(c, false, now); assert.equal(c.box, 1); assert.equal(c.due, now + 10 * 60e3);
// E1: a card that is not due yet does not skip boxes on a correct answer
{ const card = { box: 2, due: now + day };
  assert.deepEqual(A.leitnerNext(card, true, now), card, 'not due: correct answer changes nothing');
  assert.deepEqual(A.leitnerNext(card, true, now + day), { box: 3, due: now + day + 3 * day }, 'due: box +1');
  assert.deepEqual(A.leitnerNext(card, false, now), { box: 1, due: now + 10 * 60e3 }, 'not due: wrong still box 1, 10 min');
  assert.equal(A.leitnerNext(undefined, true, now).box, 2, 'new card goes to box 2');
  assert.equal(A.isBeaten({ box: 2, due: 0 }), false); assert.equal(A.isBeaten({ box: 3, due: 0 }), true); assert.equal(A.isBeaten(undefined), false); }

// pickTheme (P2): returns the weakest mistake KIND, so mastery is credited to the right kind
const profile = { asili: 10, catal: 1 }, mastery = { asili: { ok: 0, n: 0 }, catal: { ok: 0, n: 0 } };
assert.equal(A.pickTheme(profile, mastery, () => 0), 'asili');
assert.equal(A.pickTheme({ asili: 1, catal: 1 }, { asili: { ok: 50, n: 50 }, catal: { ok: 0, n: 50 } }, () => 0), 'catal');
assert.equal(A.pickTheme({ korumasiz: 5, catal: 1 }, {}, () => 0), 'korumasiz');
// defensive mistakes train defence, not "take the hanging piece"
assert.equal(A.KINDS.asili.tema, 'defensiveMove'); assert.equal(A.KINDS.korumasiz.tema, 'defensiveMove');

// puzzle difficulty (P1): with a token Lichess calibrates to the child's own rating
assert.equal(A.difficultyFor([], true), 'normal');
assert.equal(A.difficultyFor([true, true, true, true, true, true, true], true), 'harder');
assert.equal(A.difficultyFor([true, false, false, true, false, true], true), 'easier');
assert.equal(A.difficultyFor([true, true, false, false, false], true), 'easiest');
assert.equal(A.difficultyFor([], false), 'easier');                     // no token: old anonymous thresholds
assert.equal(A.difficultyFor([true, true, true, true, true], false), 'normal');

// outcome metrics (P3): engine-free per-game stats
const G = (moves, white = 'kid') => ({ id: 'g', createdAt: 1, moves, players: { white: { user: { id: white } }, black: { user: { id: white === 'kid' ? 'x' : 'kid' } } } });
let s = A.gameStats(G('f3 e5 g4 Qh4#'), 'kid');                         // fool's mate: kid allowed mate in 1 with g4
assert.equal(s.allowedMate, true); assert.deepEqual(s.card, { ply: 2, kind: 'matIzin', best: null });
s = A.gameStats(G('e4 e5 Bc4 Nc6 Qh5 Nf6 a3'), 'kid');                   // Qxf7# was there, kid played a3
assert.equal(s.missedMate, true); assert.equal(s.card.kind, 'matKacti'); assert.equal(s.card.best, 'h5f7');
s = A.gameStats(G('e4 d5 exd5 Qxd5'), 'kid');                            // even trade is not a loss
assert.equal(s.loss, 0); assert.equal(s.ownMoves, 2);
s = A.gameStats(G('e4 e5 Nf3 d6 Ng5 Qxg5'), 'kid');                     // knight left en prise
assert.equal(s.loss, 3); assert.equal(s.ownMoves, 3);
s = A.gameStats(G('e4 e5 Nf3 d6 Ng5 Qxg5', 'x'), 'kid');                 // kid is black: he won the knight
assert.equal(s.loss, 0); assert.equal(s.allowedMate, false);

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
assert.equal(A.foldTr('ÇŞĞİIıÖÜ çşğöü'), 'csgiiiou csgou');
assert.match(A.answer('catal nedir')[0], /^Çatal:/);
assert.match(A.answer('ACMAZ NEDIR')[0], /^Açmaz:/);
assert.match(A.answer('SIS')[0], /^Şiş:/);
// short keys (3 letters or fewer) match whole words only
for (const q of ['satranç nedir', 'kapat', 'matematik']) assert.ok(!(A.answer(q) || []).some(a => /^(ŞAT|Pat|Mat):/.test(a)), q);
assert.match(A.answer('pat nedir')[0], /^Pat/);
assert.match(A.answer('şat nedir')[0], /ŞAT/);
assert.equal(A.addQuestion([], 'x', 'd').length, 1);
const many = Array.from({ length: 50 }, (_, i) => ({ q: 'q' + i, d: 'd' }));
const more = A.addQuestion(many, 'yeni', 'd');
assert.equal(more.length, 50); assert.equal(more.at(-1).q, 'yeni'); assert.equal(more[0].q, 'q1');

// danger report for the side to move
const d1 = A.dangerReport('4k3/8/8/8/8/2b5/8/R6K w - - 0 1');          // my rook a1 hangs to the bishop
assert.deepEqual(d1.mine, ['a1']); assert.deepEqual(d1.theirs, []); assert.equal(d1.mateThreat, null);
const d2 = A.dangerReport('6k1/8/8/8/8/8/5PPP/r5K1 w - - 0 1');        // in check: no mate-threat scan
assert.equal(d2.inCheck, true);
const d3 = A.dangerReport('3r2k1/8/8/8/8/8/5PPP/6K1 w - - 0 1');       // Rd1# threatened on my back rank
assert.equal(d3.mateThreat, 'd1');

// parent metrics: weekly buckets, last-30-day habits, blunder trend
{
  const now = new Date(2026, 10, 21, 12).getTime(), H = 36e5, D = 24 * H;    // Sat 21 Nov 2026, local time
  const mk = (ago, o = {}) => ({ createdAt: now - ago, lastMoveAt: now - ago + 10 * 60e3, speed: 'rapid', winner: 'white',
    players: { white: { user: { id: 'kid' }, analysis: o.bl == null ? undefined : { blunder: o.bl } }, black: { user: { id: 'x' } } }, ...o.g });
  const games = [
    mk(1 * H, { bl: 0 }),                                                          // this week, win, 10 min
    mk(2 * H, { bl: 2, g: { winner: 'black' } }),                                  // this week, loss
    mk(3 * H, { g: { speed: 'blitz', winner: undefined } }),                       // this week, draw, fast
    mk(7 * D, { bl: 4 }),                                                          // last week
    mk(now - new Date(2026, 10, 19, 23).getTime(), {}),                            // Thu 23:00 -> late night, this week
    mk(200 * D, {}),                                                               // outside 12 weeks
  ];
  const m = A.parentMetrics(games, 'kid', now);
  assert.equal(m.weeks.length, 12);
  assert.deepEqual([m.thisWeek.games, m.thisWeek.W, m.thisWeek.L, m.thisWeek.D], [4, 2, 1, 1]);
  assert.equal(m.thisWeek.minutes, 40);
  assert.equal(m.lastWeek.games, 1);
  assert.equal(m.last30.total, 5);
  assert.equal(m.last30.late, 1);
  assert.equal(m.last30.fastShare, 1 / 5);
  assert.deepEqual(m.blunders, { recent: 2, before: null, n: 3 });            // 3 analyzed games: (0+2+4)/3, fewer than 2x10
}

// post-game review: which games wait, where the real mistake was, how close the child's guess was, PGN for Lichess
{
  const now = new Date(2026, 10, 21, 12).getTime(), D = 864e5;
  const base = { variant: 'standard', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5', players: { white: { user: { id: 'kid' } }, black: { user: { id: 'x' } } } };
  const games = [
    { ...base, id: 'old', createdAt: now - 9 * D },                  // older than 7 days
    { ...base, id: 'done', createdAt: now - 1 * D },                 // already reviewed
    { ...base, id: 'short', createdAt: now - 1 * D, moves: 'e4 e5 Qh5' }, // too short
    { ...base, id: 'b', createdAt: now - 2 * D },
    { ...base, id: 'a', createdAt: now - 1 * 36e5 },
    { ...base, id: 'chess960', createdAt: now - 36e5, variant: 'chess960' },
  ];
  assert.deepEqual(A.pendingReviews(games, { done: {} }, now).map(g => g.id), ['a', 'b']);

  // truth: biggest eval swing among the child's own judged moves (white here: even plies)
  const g = { ...base, id: 't', analysis: [
    { eval: 30 }, { eval: 25 }, { eval: 20, judgment: { name: 'Inaccuracy' } }, { eval: 20 },
    { eval: -150, judgment: { name: 'Mistake' } }, { eval: -140 }, { eval: -600, judgment: { name: 'Blunder' } }, { eval: -610 } ] };
  assert.equal(A.reviewTruth(g, 'kid', []), 6);                      // -140 -> -600 is the largest drop
  assert.equal(A.reviewTruth({ ...base, id: 'n' }, 'kid', [{ ply: 8 }, { ply: 4 }]), 4);   // no analysis: earliest known mistake
  assert.equal(A.reviewTruth({ ...base, id: 'n' }, 'kid', []), null);

  assert.equal(A.guessScore(6, 6), 2);
  assert.equal(A.guessScore(4, 6), 1);                               // one own move earlier: close
  assert.equal(A.guessScore(0, 6), 0);
  assert.equal(A.guessScore(null, 6), 0);                            // "no big mistake" when there was one
  assert.equal(A.guessScore(null, null), 2);                         // clean game, child said clean

  const pgn = A.reviewPgn({ ...base, id: 'p', createdAt: now, winner: 'black', players: { white: { user: { id: 'kid', name: 'Kid' } }, black: { user: { id: 'x', name: 'Rival' } } } },
    { guess: 4, truth: 6, lesson: 'Hamleden önce {rakibe} bak', feeling: 'Zordu' });
  assert.match(pgn, /\[White "Kid"\]/); assert.match(pgn, /\[Result "0-1"\]/);
  assert.match(pgn, /3\. Bc4 \{Benim tahminim: fırsat burada kaçtı\.\}/);
  assert.match(pgn, /4\. Ng5 \{Puhu: asıl hata bu hamleydi\.\}/);
  assert.match(pgn, /\{Dersim: Hamleden önce \(rakibe\) bak\. Maç: Zordu\.\} 0-1$/);   // braces inside a comment are escaped
}

// monthBuckets: last 3 calendar months, oldest first, kind counts per month
{
  const { monthBuckets } = A;
  const at = d => ({ g: { createdAt: new Date(d).getTime() }, ex: { kind: 'tehdit' } });
  const now = new Date('2026-11-21T12:00').getTime();
  const list = [at('2026-11-02'), at('2026-10-15'), at('2026-10-01T09:00'), { ...at('2026-09-30'), ex: { kind: 'catal' } }, at('2026-08-31')];
  const b = monthBuckets(list, now);
  assert.deepEqual(b.months.map(m => m.items.length), [1, 2, 1]);
  assert.equal(b.months[2].label, 'Kasım');
  assert.deepEqual(b.kinds.tehdit, [0, 2, 1]);
  assert.deepEqual(b.kinds.catal, [1, 0, 0]);
  assert.equal(b.total, 4);                                   // August is outside the window
}

{ // weekDays: starred days since Monday of this week (local keys), gaps never reset
  const now = new Date(2026, 10, 25, 12).getTime();           // Wednesday 25 Nov 2026
  assert.equal(A.weekDays({}, now), 0);
  assert.equal(A.weekDays({ '2026-11-23': 2, '2026-11-24': 1, '2026-11-25': 3 }, now), 3);
  assert.equal(A.weekDays({ '2026-11-22': 5, '2026-11-16': 2 }, now), 0);          // last week does not count
  assert.equal(A.weekDays({ '2026-11-23': 2, '2026-11-25': 1, '2026-11-20': 4 }, now), 2);  // gap keeps the count
  assert.equal(A.weekDays({ '2026-11-24': 0 }, now), 0);                           // zero stars is not a day
}

{ // weekWork: per-step totals since Monday; reviews counted only if dated this week
  const now = new Date(2026, 10, 25, 12).getTime();
  const gun = { '2026-11-22': { hata: 9, avci: 9 }, '2026-11-23': { hata: 3, bulmaca: 2 }, '2026-11-25': { hata: 3, avci: 5, bulmaca: 4 } };
  assert.deepEqual(A.weekWork(gun, {}, now), { hata: 6, avci: 5, bulmaca: 6, mac: 0 });
  assert.deepEqual(A.weekWork({}, {}, now), { hata: 0, avci: 0, bulmaca: 0, mac: 0 });
  const inc = { a: { t: now - 864e5 }, b: { t: now - 20 * 864e5 }, c: {} };
  assert.equal(A.weekWork({}, inc, now).mac, 1);              // old and undated reviews are not counted
}

{ // normBest: Lichess writes castling as king-takes-rook (e8h8); chess.js wants e8g8
  const f = 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
  assert.equal(A.normBest(f, 'e1h1'), 'e1g1');
  assert.equal(A.normBest(f, 'e1a1'), 'e1c1');
  assert.equal(A.normBest('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 0 1', 'e8h8'), 'e8g8');
  assert.equal(A.normBest(f, 'a1a2'), 'a1a2');                 // ordinary move untouched
  assert.equal(A.normBest(f, 'e1f1'), 'e1f1');                 // king step untouched
  assert.equal(A.normBest(f, null), null);
}

// P6: one check sentence, read everywhere; think-time note states facts, no diagnosis
{
  assert.equal(A.KONTROL, 'Hamleni bulunca: Rakip ne yapar? Şah, alma, tehdit.');
  assert.equal(A.KINDS.matIzin.kural, A.KONTROL);
  const sat = A.answer('ŞAT nedir?')[0];
  assert.ok(sat.includes(A.KONTROL), 'ŞAT entry uses KONTROL');
  assert.ok(sat.indexOf('Rakip') < sat.indexOf('Şah çekebilir'), 'ŞAT: opponent first: ' + sat);
  const slow = A.thinkNote({ n: 6, bl: 30, ok: 20 });
  assert.ok(slow.endsWith(A.KONTROL) && /30/.test(slow) && /20/.test(slow), slow);
  assert.doesNotMatch(slow, /acele|iyi|sez/i, 'fact only, no diagnosis');
  const fast = A.thinkNote({ n: 6, bl: 5, ok: 20 });
  assert.ok(fast.endsWith(A.KONTROL), fast); assert.doesNotMatch(fast, /acele/i);   // one routine, one wording
  assert.equal(A.thinkNote({ n: 4, bl: 30, ok: 20 }), '');
  assert.equal(A.thinkNote({ n: 9, bl: 22, ok: 20 }), '');
}
// P12: wrong move told from the opponent's side, never 'olmaz'
for (const [kind, fen, played] of cases) {
  if (kind === 'bedava' || kind === 'matKacti') continue;             // need a best move; wrong answers explain with best = null
  const ex = A.explain(fen, played, null), s = A.rakipGozu('X', ex);
  assert.ok(s.endsWith('Bir de rakip gözüyle bak.'), `${kind}: ${s}`);
  assert.doesNotMatch(s, /olmaz/);
  if (kind !== 'pat') assert.match(s, /^<b>X<\/b> ile rakip .*(yapabiliyor|alabiliyor|saldırabiliyor)\./, `${kind}: ${s}`);
}
assert.equal(A.rakipGozu('X', { kind: 'diger' }), 'Bir de rakip gözüyle bak.');

// E7: opponent shown as "rakip (puan)", never the name
assert.equal(A.oppLabel({ user: { name: 'SomeName' }, rating: 1234 }), 'rakip (1234)');
assert.equal(A.oppLabel({ user: { name: 'SomeName' } }), 'rakip');
assert.equal(A.oppLabel({ aiLevel: 3 }), 'bilgisayar');
// E7: progress backup keeps only whitelisted progress keys
const kv = { stars: { d: 3 }, gun: { d: { hata: 1 } }, mastery: { a: 1 }, srs: { 'g:1': { due: 1 } }, incelenen: { g1: { t: 1 } }, modSayac: { hata: { acilis: 1, bitis: 0 } },
  games: [{ opp: 'x' }], token: 'SECRET', user: { username: 'kid' } };
const packed = A.packProgress(k => kv[k]);
const back = A.unpackProgress(packed);
assert.deepEqual(Object.keys(back).sort(), ['gun', 'incelenen', 'mastery', 'modSayac', 'srs', 'stars']);
assert.deepEqual(back.stars, { d: 3 });
assert.doesNotMatch(packed, /SECRET|kid|games/);
assert.equal(A.unpackProgress('not json'), null);
assert.equal(A.unpackProgress('{"app":"other","data":{}}'), null);
assert.deepEqual(A.unpackProgress(JSON.stringify({ app: 'puhu-koc', v: 1, data: { stars: { d: 1 }, token: 'x', srs: 5 } })), { stars: { d: 1 } });

// P13: per-speed score of the last 30 days, parent note only
{
  const now = 100 * 864e5, mk = (speed, winner, day = 90) => ({ speed, winner, createdAt: day * 864e5, players: { white: { user: { id: 'kid' } }, black: { user: { id: 'x' } } } });
  const gs = [mk('bullet', 'black'), mk('bullet', 'black'), mk('blitz', 'white'), mk('rapid', 'white'), mk('rapid', undefined), mk('rapid', 'black'), mk('rapid', 'white', 10)];
  const sc = A.speedScores(gs, 'kid', now);
  assert.deepEqual(sc.bullet, { n: 2, pct: 0 }); assert.deepEqual(sc.blitz, { n: 1, pct: 100 });
  assert.deepEqual(sc.rapid, { n: 3, pct: 50 });                          // old game (day 10) excluded, draw = half
  const note = A.speedNote(sc);
  assert.match(note, /bullet 2 oyun %0/); assert.match(note, /rapid 3 oyun %50/); assert.match(note, /Önerilen tempo: 15\+10 rapid/);
  assert.equal(A.speedNote(A.speedScores([], 'kid', now)), '');
}

console.log('OK: all brain tests pass');
