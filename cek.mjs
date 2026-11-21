// Pull all lichess games of a user into veri/veri.js (loaded by koc.html as a plain script).
// Run again any time: only games newer than the last saved one are downloaded.
// Usage: node cek.mjs <lichess-username>
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const user = (process.argv[2] || '').toLowerCase();
if (!user) { console.error('Usage: node cek.mjs <lichess-username>'); process.exit(1); }
const file = new URL('./veri/veri.js', import.meta.url);
const PREFIX = 'window.LICHESS_VERI = ';

let old = { user: null, games: [] };
if (existsSync(file)) {
  const saved = JSON.parse(readFileSync(file, 'utf8').slice(PREFIX.length).replace(/;\s*$/, ''));
  if (saved.user?.id === user) old = saved;
}
const since = old.games.length ? Math.max(...old.games.map(g => g.createdAt)) + 1 : 0;

const [u, g] = await Promise.all([
  fetch(`https://lichess.org/api/user/${user}`),
  fetch(`https://lichess.org/api/games/user/${user}?evals=true&accuracy=true&opening=true&clocks=true${since ? `&since=${since}` : ''}`,
    { headers: { Accept: 'application/x-ndjson' } }),
]);
if (!u.ok || !g.ok) { console.error(`Lichess error: user ${u.status}, games ${g.status}. Try again in a minute.`); process.exit(1); }

const fresh = (await g.text()).trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
const byId = new Map([...old.games, ...fresh].map(x => [x.id, x]));
const games = [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);

mkdirSync(new URL('./veri/', import.meta.url), { recursive: true });
writeFileSync(file, PREFIX + JSON.stringify({ user: await u.json(), games, updated: Date.now() }) + ';\n');
console.log(`${user}: ${fresh.length} new games, ${games.length} total saved to veri/veri.js`);
