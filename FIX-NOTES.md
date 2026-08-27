# MLBB Flex Profile Studio — Fix Notes

## Fixed
- Hero and skin catalogs now load from `skins-live.json` immediately through local-first data loading.
- First paint no longer waits for the remote API or the 1,060-skin catalog.
- LocalStorage cache added for manifest, skin catalog, and editor state.
- Primary remote API still runs in the background after the local preview is ready.
- Remote API failures no longer block or blank the editor.
- Hero matching is more tolerant: ID or hero name can match local data.
- More API payload shapes are accepted (`data`, `records`, `items`, `list`, etc.).
- Selected skin splash asset is rendered directly in the hero preview when an asset URL exists.
- Background and frame color inputs are automatically synchronized with the selected preset/swatches by default.
- GLOW effect no longer relies on a huge blur + `color-mix()` combination that could blank the live preview.
- Avatar frame gradient rendering simplified to a stable ring mask.
- Gradient generation avoids `color-mix()` for more consistent browser/export rendering.
- Remote API timeout reduced to 3.5 seconds because it is background-only.

## Asset source
`skins-live.json` already points to the public Sparkies01/Splash collection, which contains 133 heroes and 1,060 original-resolution PNG splash images. The images are intentionally kept as URLs instead of bundling them into this repository: individual files are multi-megabyte and the full collection would make the project unnecessarily huge. The selected asset is fetched only when it is needed by the preview.


## v4 changes
- Embedded 133 heroes / 1060 skins in hero-skin-catalog.js so Hero/Skin lists render from local data immediately.
- Added All role filter.
- Replaced Glow with a compositor-safe diagonal beam moving top-left to bottom-right.
- Added Hero Artwork upload with local persistence and hero-layer drag/scale/rotate.
- Added rank icon below rank text using MLBB wiki asset paths.
