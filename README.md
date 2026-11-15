# NearMet app v1 — PWA + new look (Phase 1)

## Copy into your project
src/App.jsx          -> src/App.jsx          (now imports ./theme.css; colours use CSS tokens; People "browse strip")
src/AuthPage.jsx     -> src/AuthPage.jsx     (colours use tokens)
src/theme.css        -> src/theme.css        (NEW: prototype palette, fonts, mobile bottom tab bar)
src/lib/supabase.js  -> src/lib/supabase.js
src/lib/pinEngine.js -> src/lib/pinEngine.js
public/*.png         -> public/              (placeholder PWA icons — swap in your real logo later)

## PWA setup (3 steps)
1. npm i -D vite-plugin-pwa
2. Merge vite.config.pwa-snippet.js into your vite.config.js
3. Apply index.html.snippet.txt to index.html
Then: npm run build && npm run preview, open on your phone (or Chrome > Install app).

## Undo the new look
Delete the `import "./theme.css"` line in App.jsx. Everything else keeps working.
