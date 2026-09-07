import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
const engine = await readFile(new URL('../feature-engine.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('custom artwork is cleared whenever a built-in selection replaces it', () => {
  assert.match(script, /refs\.hero\.addEventListener\("change"[\s\S]*?state\.artworkDataUrl = ""/);
  assert.match(script, /function randomizeProfile\(\)[\s\S]*?state\.artworkDataUrl = ""/);
  assert.match(script, /function applyPreset\(name\)[\s\S]*?state\.artworkDataUrl = ""/);
});

test('saved presets retain media when possible and persist holographic strength', () => {
  assert.match(engine, /F\.makeConfig=\(includeMedia=false\)[\s\S]*holoStrength/);
  assert.match(engine, /savePresetBtn[\s\S]*F\.makeConfig\(true\)/);
  assert.match(engine, /exportPresetBtn[\s\S]*F\.makeConfig\(true\)/);
  assert.match(engine, /F\.applyConfig[\s\S]*p\.engine\?\.holoStrength/);
});

test('animated exports are validated, serialized, and protected from duplicate clicks', () => {
  assert.match(engine, /function animationParams\(\)/);
  assert.match(engine, /let exportBusy = false/);
  assert.match(engine, /buttonIds\.map/);
  assert.match(engine, /clamp\(Number\(\$\('animDuration'\)/);
  assert.match(engine, /clamp\(Number\(\$\('animFps'\)/);
  assert.match(engine, /F\.exportAnimatedGIF=async\(\)=>runExport/);
  assert.match(engine, /async function exportAnimatedWebM/);
});

test('Glow beam selector targets the actual effect layer', () => {
  assert.equal(css.includes('\n.effect-glow .effect-glow{'), false);
  assert.match(css, /\.effect-glow::after\{/);
});

test('responsive and reduced-motion hardening is present', () => {
  assert.match(css, /@media \(max-width:980px\) and \(min-width:721px\)/);
  assert.match(css, /\.identity-block\{[\s\S]*padding-right:144px/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(css, /\.profile-card \.effect-glow::after/);
});

test('modals expose accessible dialog semantics', () => {
  assert.match(html, /id="modal" class="modal hidden" role="dialog" aria-modal="true" aria-hidden="true"/);
  assert.match(html, /id="cropModal" class="modal hidden" role="dialog" aria-modal="true" aria-hidden="true"/);
  assert.match(script, /setupModalAccessibility\(/);
  assert.match(script, /event\.key === "Escape"/);
});

test('image uploads have type, size, and resolution guards', () => {
  assert.match(script, /const MAX_UPLOAD_BYTES = 10 \* 1024 \* 1024/);
  assert.match(script, /MAX_IMAGE_DIMENSION = 12000/);
  assert.match(script, /startsWith\("image\/"\)/);
});
