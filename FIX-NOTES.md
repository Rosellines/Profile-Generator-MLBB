# v21 Export Fix

Based on Profile-Generator-MLBB-fixed-v20.

## Export fixes
- Waits for `document.fonts.ready` before measuring/serializing the card.
- Forces the same single-line text behavior used by the live preview for rank, title, skin, rarity, and footer labels.
- Prevents flex/text reflow inside the exported SVG foreignObject.
- Keeps skin name → rarity spacing on the same flex row.
- Does not change the live card design or dimensions.
- Existing local artwork/background inlining and rounded-corner clipping remain intact.
