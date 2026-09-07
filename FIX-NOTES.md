# V4.0.1 UI/UX Hardening Notes

This build keeps the V4.0.1 security boundary and fixes the reviewed UI/UX issues before the next version bump.

- Custom hero artwork is cleared when changing hero, randomizing, or applying a built-in preset, preventing stale artwork from leaking into a new selection.
- Saved/exported presets include local media when storage allows it; quota fallback strips only media and reports that state in the UI.
- Holographic strength is part of the config and engine settings persist immediately on change.
- PNG Ultra, WebP, WebM, and GIF exports share a busy guard so duplicate/concurrent export clicks are blocked; animation duration/FPS are clamped consistently.
- Image uploads validate image MIME type, file size, and decoded dimensions before cropping.
- The diagonal Glow beam now targets the actual effect layer via a pseudo-element instead of an impossible nested selector.
- Tablet topbar wrapping and mobile identity truncation were hardened to avoid common overflow cases.
- Preset/crop modals now expose dialog semantics, support Escape, keep keyboard focus inside the dialog, and restore focus after close.
- Reduced-motion rules now cover the engine effects and transition animations.
- The Node static server remains localhost-by-default, uses an explicit public surface, rejects symlink escapes, and does not expose arbitrary working-directory files.

No package dependencies were added.
