# MLBB Flex Profile Studio V3

Open [index.html](./index.html) in a modern browser.

What V3 adds:
- `api.js` for remote hero/emblem loading with local fallback
- API status badge: `ONLINE`, `PARTIAL`, `FALLBACK`, or `DISABLED`
- `Refresh API` button to retry remote sources
- normalized remote -> local manifest merge, so the editor still uses one data shape
- all V2 editor features: presets, randomize, drag/scale/rotate, live preview, and PNG export

Files:
- `index.html`: editor UI + API status blocks
- `script.js`: editor state, rendering, export, and API refresh flow
- `api.js`: remote provider fetch + normalization + fallback merge
- `manifest.json`: local asset registry plus API provider config

Important notes:
- Official MLBB artwork is still not bundled.
- Remote API support depends on the provider endpoint staying alive and allowing browser requests.
- If you open from `file://`, some browsers may block fetch behavior more aggressively; a tiny local server is the safest path for API mode.
- If the configured API URL changes, edit `manifest.json` under `api.providers`.
