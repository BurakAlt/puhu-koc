# Puhu Koç

A chess coach for kids, built on a child's own Lichess games. Puhu the owl explains *why* a move was a mistake, then turns those mistakes into practice.

- **Hatalarım**: your own blunders come back with spaced repetition.
- **Tehdit avı**: find your piece in danger, or the opponent's free piece.
- **Bulmaca**: Lichess puzzles picked from your weakest theme, plus a stalemate-trap drill.
- **Karnem**: mistake types, thinking time, openings, progress.

Sign-in uses Lichess OAuth (PKCE). There is no server, and the password never reaches this page. Progress is stored in the browser.

## Run locally

Open `index.html`, or double-click `Puhu Koç.bat` to open it in Edge, which has natural Turkish voices. Optional offline data: `node cek.mjs <lichess-username>` writes `veri/veri.js`.

## Tests

```
npm install
node test_akil.mjs   # chess "brain": mistake classifier, spaced repetition, theme picker
node e2e_test.mjs    # full app in installed Chrome (needs veri/veri.js)
```
