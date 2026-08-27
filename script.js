const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "mlbb-flex-profile-studio.local-first.v1";
const rarityOptions = ["Mythic", "Legend", "Collector", "Epic", "Special", "Rare"];
const rankOptions = ["MYTHIC GLORY", "MYTHICAL IMMORTAL", "MYTHIC", "LEGEND", "EPIC", "GRAND MASTER", "MASTER"];
const effectOptions = [
  { id: "none", name: "None" },
  { id: "glow", name: "Glow" },
  { id: "scan", name: "Scan" },
  { id: "particles", name: "Particles" }
];
const presets = {
  mythic: {
    heroId: "gusion",
    skinId: "gusion-cosmic-gleam",
    frameId: "royal",
    backgroundId: "starlight",
    emblemId: "best-carry",
    badgeId: "mvp",
    effect: "glow",
    title: "Mythic Grinder",
    rank: "MYTHIC GLORY",
    stats: { wr: 87, matches: 2431, mvp: 318, savage: 27, legendary: 501, emblemLevel: 60 }
  },
  collector: {
    heroId: "fanny",
    skinId: "fanny-blade-of-kibou",
    frameId: "void",
    backgroundId: "neon",
    emblemId: "best-assassin",
    badgeId: "legendary",
    effect: "particles",
    title: "Collector Hunter",
    rank: "MYTHICAL IMMORTAL",
    stats: { wr: 92, matches: 1732, mvp: 402, savage: 33, legendary: 622, emblemLevel: 60 }
  },
  og: {
    heroId: "ling",
    skinId: "ling-night-shade",
    frameId: "frost",
    backgroundId: "jade",
    emblemId: "best-roamer",
    badgeId: "victory-maker",
    effect: "scan",
    title: "OG Grinder",
    rank: "LEGEND",
    stats: { wr: 74, matches: 5210, mvp: 260, savage: 14, legendary: 844, emblemLevel: 60 }
  },
  whale: {
    heroId: "gusion",
    skinId: "gusion-cosmic-gleam",
    frameId: "royal",
    backgroundId: "ember",
    emblemId: "best-damage-dealer",
    badgeId: "godlike",
    effect: "glow",
    title: "Whale Energy",
    rank: "MYTHICAL IMMORTAL",
    stats: { wr: 96, matches: 3611, mvp: 701, savage: 49, legendary: 1182, emblemLevel: 60 }
  }
};

const refs = {};
const assetCache = new Map();
const state = {
  data: null,
  appConfig: null,
  apiStatus: null,
  heroDataStatus: { source: "local", error: "", count: 0, hasImageUrl: false },
  diagnostics: [],
  filters: { query: "", sort: "az" },
  selections: {},
  custom: {},
  layers: {
    avatar: { x: 0, y: 0, scale: 100, rotate: 0 },
    hero: { x: 0, y: 0, scale: 100, rotate: 0 }
  },
  activeLayer: "avatar",
  avatarDataUrl: "",
  assetRenderToken: 0
};

let uiWired = false;
const cardTiltState = { rotateX: 0, rotateY: 0 };

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hexToRgba(hex, alpha) {
  const value = String(hex || "#ffffff").replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const int = parseInt(normalized, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function hashString(input) {
  let hash = 0;
  for (const char of String(input || "")) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function paletteFromSeed(seed) {
  const hash = hashString(seed);
  const hue = hash % 360;
  return [
    hslToHex(hue, 75, 58),
    hslToHex((hue + 35) % 360, 86, 92),
    hslToHex((hue + 318) % 360, 70, 48)
  ];
}

function createPlaceholderDataUrl(label, toneA = "#173761", toneB = "#0b1321") {
  const safeLabel = String(label || "MLBB").slice(0, 28);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${toneA}"/>
          <stop offset="100%" stop-color="${toneB}"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="64" fill="url(#bg)"/>
      <circle cx="768" cy="220" r="140" fill="rgba(255,255,255,0.12)"/>
      <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#edf3ff" font-family="Trebuchet MS, Segoe UI, sans-serif" font-size="74" font-weight="700">${safeLabel}</text>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="rgba(237,243,255,0.72)" font-family="Trebuchet MS, Segoe UI, sans-serif" font-size="28" letter-spacing="8">LOCAL PLACEHOLDER</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function loadAsset(path, label = "MLBB Asset") {
  const key = path || `placeholder:${label}`;
  if (assetCache.has(key)) {
    return assetCache.get(key);
  }

  const placeholder = Promise.resolve(createPlaceholderDataUrl(label));
  if (!path) {
    assetCache.set(key, placeholder);
    return placeholder;
  }

  const promise = new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(path);
    image.onerror = () => resolve(createPlaceholderDataUrl(label));
    image.src = path;
  });
  assetCache.set(key, promise);
  return promise;
}

async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`${path} -> HTTP ${response.status}`);
  }
  return response.json();
}

async function loadLocalDatabase() {
  const heroes = await loadJson("./data/heroes.json");
  const skins = await loadJson("./data/skins.json");
  const emblems = await loadJson("./data/emblems.json");
  const roles = await loadJson("./data/roles.json");
  const badges = await loadJson("./data/badges.json");
  const frames = await loadJson("./data/frames.json");
  const backgrounds = await loadJson("./data/backgrounds.json");

  return {
    heroes,
    skins,
    emblems,
    roles,
    badges,
    frames,
    backgrounds
  };
}

async function loadAppConfig() {
  try {
    return await loadJson("./manifest.json");
  } catch (_error) {
    return { api: { enabled: false, providers: [] } };
  }
}

async function loadRemoteHeroes() {
  const apiConfig = state.appConfig?.api;
  if (!apiConfig?.enabled) {
    throw new Error("Hero API is disabled in manifest.json.");
  }

  const provider = (Array.isArray(apiConfig.providers) ? apiConfig.providers : [])
    .find((item) => item && item.enabled !== false);
  if (!provider) {
    throw new Error("No enabled hero API provider is configured.");
  }

  if (!window.MLBBApi?.fetchHeroes || !window.MLBBApi?.normalizeHeroList) {
    throw new Error("MLBBApi hero helpers are unavailable.");
  }

  const payload = await window.MLBBApi.fetchHeroes(provider, apiConfig.timeoutMs);
  const normalizedHeroes = window.MLBBApi.normalizeHeroList(payload);
  console.log("[MLBB API] heroes:", normalizedHeroes.length);
  console.log("[MLBB API] sample hero:", normalizedHeroes[0]);

  if (!normalizedHeroes.length) {
    throw new Error("Remote hero API returned zero heroes.");
  }

  return normalizedHeroes;
}

function buildTitles(roles) {
  const generated = roles.map((role) => `${role.name} ${role.title}`);
  return [
    ...generated,
    "Mythic Grinder",
    "Collector Hunter",
    "OG Grinder",
    "Whale Energy",
    "Rank Demon",
    "Savage Farmer"
  ];
}

function enrichDatabase(raw) {
  const roles = raw.roles.roles.map((role) => ({
    ...role,
    slug: slugify(role.name)
  }));
  const roleMap = new Map(roles.map((role) => [role.name, role]));
  const roleSlugMap = new Map(roles.map((role) => [role.slug, role]));
  const skinGroups = new Map();

  raw.skins.skins.forEach((skin) => {
    const enriched = {
      ...skin,
      colors: skin.colors?.length ? skin.colors : paletteFromSeed(skin.id || skin.name),
      style: skin.style || "",
      sortName: skin.name.toLowerCase()
    };
    const list = skinGroups.get(enriched.heroId) || [];
    list.push(enriched);
    skinGroups.set(enriched.heroId, list);
  });

  const heroes = raw.heroes.heroes.map((hero) => {
    const heroSkins = (skinGroups.get(hero.id) || []).sort((a, b) => a.sortName.localeCompare(b.sortName));
    const enrichedRoles = hero.roles
      .map((name) => roleMap.get(name) || roleSlugMap.get(slugify(name)) || { id: slugify(name), name, title: "Flex" });
    return {
      ...hero,
      roles: enrichedRoles.map((role) => role.name),
      roleMeta: enrichedRoles,
      primaryRole: enrichedRoles[0]?.name || "Assassin",
      roleTitle: enrichedRoles[0]?.title || "Flex",
      specialty: hero.specialty?.length ? hero.specialty : ["Utility"],
      skins: heroSkins.length ? heroSkins : [{
        id: `${hero.id}-default-skin`,
        heroId: hero.id,
        name: "Default Skin",
        rarity: "Special",
        artwork: `assets/skins/${hero.id}/default-skin.webp`,
        icon: `assets/skins/${hero.id}/default-skin-icon.webp`,
        colors: paletteFromSeed(hero.id)
      }],
      placeholderStyle: [
        `radial-gradient(circle at 56% 42%, ${hexToRgba(paletteFromSeed(hero.id)[0], 0.9)}, transparent 34%)`,
        "linear-gradient(135deg,transparent 20%,rgba(255,255,255,.24) 43%,transparent 56%)",
        "linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,0) 34%)"
      ].join(","),
      searchIndex: [
        hero.name,
        ...(hero.roles || []),
        ...(hero.specialty || [])
      ].join(" ").toLowerCase()
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  return {
    heroes,
    heroMap: new Map(heroes.map((hero) => [hero.id, hero])),
    roles,
    roleMap,
    emblems: raw.emblems.emblems,
    badges: raw.badges.badges,
    frames: raw.frames.frames,
    backgrounds: raw.backgrounds.backgrounds,
    titles: buildTitles(roles)
  };
}

function createDefaultSelections() {
  const hero = state.data.heroMap.get("gusion") || state.data.heroes[0];
  const skin = hero.skins.find((item) => item.id === "gusion-cosmic-gleam") || hero.skins[0];
  const frame = state.data.frames[0];
  const background = state.data.backgrounds[0];
  const emblem = state.data.emblems[0];
  const badge = state.data.badges[0];
  const roleMeta = state.data.roleMap.get(hero.primaryRole);
  const title = roleMeta ? `${roleMeta.name} ${roleMeta.title}` : "Assassin Hunter";

  state.selections = {
    heroId: hero.id,
    skinId: skin.id,
    role: hero.primaryRole,
    title,
    rank: rankOptions[0],
    rarity: skin.rarity || "Special",
    backgroundId: background.id,
    frameId: frame.id,
    frameStyle: frame.styleType || "solid",
    emblemId: emblem.id,
    badgeId: badge.id,
    effect: "none",
    mode: "story"
  };
  state.custom = {
    skinPrimary: skin.colors[0],
    skinSecondary: skin.colors[1],
    skinGlow: skin.colors[2],
    bgPrimary: background.colors?.[0] || "#173761",
    bgSecondary: background.colors?.[1] || "#0b1321",
    bgAccent: background.colors?.[2] || "#613117",
    framePrimary: frame.primary || "#f3c969",
    frameSecondary: frame.secondary || frame.primary || "#f3c969"
  };
  state.layers = {
    avatar: { x: 0, y: 0, scale: 100, rotate: 0 },
    hero: { x: 0, y: 0, scale: 100, rotate: 0 }
  };
  state.activeLayer = "avatar";
  state.filters = { query: "", sort: "az" };
  state.avatarDataUrl = "";
}

function cacheRefs() {
  [
    "ign", "pid", "server", "bio", "title", "rank", "photo", "role", "hero", "skin", "rarity", "backgrounds",
    "frames", "activeLayer", "layerScale", "layerRotate", "accent", "mode", "wr", "matches", "mvp",
    "savage", "legendary", "emblemLevel", "resetLayout", "presetBtn", "randomBtn", "resetProfileBtn",
    "copyBtn", "exportBtn", "closeModal", "modal", "card", "backgroundLayer", "heroArt", "avatarImg", "frameOut",
    "badgeOut", "ignOut", "pidOut", "serverOut", "bioOut", "titleOut", "rankOut", "heroOut", "skinOut",
    "rarityOut", "emblemOut", "wrOut", "matchesOut", "mvpOut", "savageOut", "legendaryOut", "emblemLevelOut",
    "modeOut", "dragHint", "heroLayer", "avatarLayer", "apiBadge", "apiStatusText", "apiSourceText",
    "refreshApiBtn", "skinColorPrimary", "skinColorSecondary", "skinColorGlow", "bgColorPrimary",
    "bgColorSecondary", "bgColorAccent", "frameStyle", "frameColorPrimary", "frameColorSecondary",
    "emblem", "badge", "effect", "heroSearch", "heroSort", "apiDiagnosticsList", "apiDiagnostics"
  ].forEach((id) => {
    refs[id] = $(id);
  });
}

function fillSelect(select, values, valueGetter = (item) => item, labelGetter = (item) => item) {
  select.innerHTML = "";
  values.forEach((item) => {
    const option = document.createElement("option");
    option.value = valueGetter(item);
    option.textContent = labelGetter(item);
    select.appendChild(option);
  });
}

function getHero() {
  return state.data.heroMap.get(state.selections.heroId) || state.data.heroes[0];
}

function getHeroById(id) {
  return state.data.heroMap.get(id) || state.data.heroes[0];
}

function getAvailableSkins(heroId = state.selections.heroId) {
  return getHeroById(heroId).skins;
}

function getSkin() {
  const skins = getAvailableSkins();
  return skins.find((skin) => skin.id === state.selections.skinId) || skins[0];
}

function getItem(listName, id) {
  return state.data[listName].find((item) => item.id === id) || state.data[listName][0];
}

function getSelectedBackground() {
  return state.selections.backgroundId === "custom"
    ? {
        id: "custom",
        name: "Custom Blend",
        asset: "",
        accent: refs.accent.value,
        colors: [state.custom.bgPrimary, state.custom.bgSecondary, state.custom.bgAccent]
      }
    : getItem("backgrounds", state.selections.backgroundId);
}

function getSelectedFrame() {
  return state.selections.frameId === "custom"
    ? {
        id: "custom",
        name: "Custom Frame",
        styleType: state.selections.frameStyle,
        primary: state.custom.framePrimary,
        secondary: state.custom.frameSecondary
      }
    : getItem("frames", state.selections.frameId);
}

function getFilteredHeroes() {
  const query = state.filters.query.trim().toLowerCase();
  const selectedHero = getHero();
  let heroes = [...state.data.heroes];

  if (query) {
    heroes = heroes.filter((hero) => hero.searchIndex.includes(query));
  }

  heroes.sort((a, b) => {
    switch (state.filters.sort) {
      case "za":
        return b.name.localeCompare(a.name);
      case "role":
        return `${a.primaryRole}-${a.name}`.localeCompare(`${b.primaryRole}-${b.name}`);
      case "recent":
        return new Date(b.addedAt || 0) - new Date(a.addedAt || 0) || a.name.localeCompare(b.name);
      case "az":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (selectedHero && !heroes.some((hero) => hero.id === selectedHero.id)) {
    heroes.unshift(selectedHero);
  }

  return heroes;
}

function syncSkinCustomizationFromSelection() {
  const skin = getSkin();
  const colors = skin.colors?.length ? skin.colors : paletteFromSeed(skin.id || skin.name);
  state.selections.rarity = skin.rarity || "Special";
  state.custom.skinPrimary = colors[0];
  state.custom.skinSecondary = colors[1];
  state.custom.skinGlow = colors[2];
  refs.skinColorPrimary.value = state.custom.skinPrimary;
  refs.skinColorSecondary.value = state.custom.skinSecondary;
  refs.skinColorGlow.value = state.custom.skinGlow;
  refs.rarity.value = state.selections.rarity;
}

function syncBackgroundCustomization(backgroundId = state.selections.backgroundId) {
  if (backgroundId === "custom") {
    return;
  }
  const background = getItem("backgrounds", backgroundId);
  const colors = background.colors || ["#173761", "#0b1321", "#613117"];
  state.custom.bgPrimary = colors[0];
  state.custom.bgSecondary = colors[1];
  state.custom.bgAccent = colors[2];
  refs.bgColorPrimary.value = state.custom.bgPrimary;
  refs.bgColorSecondary.value = state.custom.bgSecondary;
  refs.bgColorAccent.value = state.custom.bgAccent;
}

function syncFrameCustomization(frameId = state.selections.frameId) {
  if (frameId === "custom") {
    return;
  }
  const frame = getItem("frames", frameId);
  state.selections.frameStyle = frame.styleType || "solid";
  state.custom.framePrimary = frame.primary || "#f3c969";
  state.custom.frameSecondary = frame.secondary || frame.primary || "#f3c969";
  refs.frameStyle.value = state.selections.frameStyle;
  refs.frameColorPrimary.value = state.custom.framePrimary;
  refs.frameColorSecondary.value = state.custom.frameSecondary;
}

function ensureSelectionsValid() {
  if (!state.data.heroMap.has(state.selections.heroId)) {
    state.selections.heroId = state.data.heroes[0].id;
  }
  if (!getAvailableSkins().some((skin) => skin.id === state.selections.skinId)) {
    state.selections.skinId = getAvailableSkins()[0].id;
  }
  if (!getHero().roles.includes(state.selections.role)) {
    state.selections.role = getHero().primaryRole;
  }
  if (!state.data.frames.some((item) => item.id === state.selections.frameId) && state.selections.frameId !== "custom") {
    state.selections.frameId = state.data.frames[0].id;
  }
  if (!state.data.backgrounds.some((item) => item.id === state.selections.backgroundId) && state.selections.backgroundId !== "custom") {
    state.selections.backgroundId = state.data.backgrounds[0].id;
  }
  if (!state.data.emblems.some((item) => item.id === state.selections.emblemId)) {
    state.selections.emblemId = state.data.emblems[0].id;
  }
  if (!state.data.badges.some((item) => item.id === state.selections.badgeId)) {
    state.selections.badgeId = state.data.badges[0].id;
  }
  if (!effectOptions.some((item) => item.id === state.selections.effect)) {
    state.selections.effect = "none";
  }
  if (!rankOptions.includes(state.selections.rank)) {
    state.selections.rank = rankOptions[0];
  }
  if (!rarityOptions.includes(state.selections.rarity)) {
    state.selections.rarity = getSkin().rarity || "Special";
  }
}

function normalizeFrame(frame) {
  return {
    ...frame,
    styleType: frame.styleType || "solid",
    primary: frame.primary || "#f3c969",
    secondary: frame.secondary || frame.primary || "#f3c969"
  };
}

function buildFrameCss(frame) {
  const normalized = normalizeFrame(frame);
  return {
    fill: normalized.styleType === "gradient"
      ? `linear-gradient(135deg, ${normalized.primary}, ${normalized.secondary})`
      : normalized.primary,
    shadow: normalized.styleType === "gradient" ? normalized.secondary : normalized.primary
  };
}

function buildBackgroundStyle(background, assetUrl) {
  const style = background.style || [
    `radial-gradient(circle at 72% 18%, ${hexToRgba(state.custom.bgAccent, 0.42)}, transparent 22%)`,
    `linear-gradient(145deg, ${state.custom.bgPrimary} 0%, ${state.custom.bgSecondary} 52%, ${state.custom.bgAccent} 100%)`
  ].join(",");
  return assetUrl
    ? `linear-gradient(180deg, rgba(4,8,18,.3), rgba(4,8,18,.3)), url(${assetUrl}) center/cover no-repeat, ${style}`
    : style;
}

function buildHeroArtStyle(assetUrl) {
  return [
    `linear-gradient(180deg, rgba(8,16,28,.14), rgba(8,16,28,.14))`,
    `linear-gradient(125deg, transparent 18%, ${hexToRgba(state.custom.skinSecondary, 0.28)} 43%, transparent 56%)`,
    `radial-gradient(circle at 54% 48%, ${hexToRgba(state.custom.skinGlow, 0.78)}, transparent 34%)`,
    `url(${assetUrl}) center/cover no-repeat`,
    getHero().placeholderStyle
  ].join(",");
}

function getBackgroundOptions() {
  return [...state.data.backgrounds, { id: "custom", name: "Custom Blend", accent: refs.accent.value }];
}

function getFrameOptions() {
  return [...state.data.frames, { id: "custom", name: "Custom Frame", styleType: state.selections.frameStyle, primary: state.custom.framePrimary, secondary: state.custom.frameSecondary }];
}

function paintSwatches(containerId, items, selectedId, onPick, painter) {
  const container = refs[containerId];
  container.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = `swatch${item.id === selectedId ? " active" : ""}`;
    button.type = "button";
    painter(button, item);
    button.addEventListener("click", () => onPick(item));
    container.appendChild(button);
  });
}

function paintSkinSelect() {
  fillSelect(refs.skin, getAvailableSkins(), (item) => item.id, (item) => item.name);
  refs.skin.value = state.selections.skinId;
}

function paintControls() {
  fillSelect(refs.title, state.data.titles);
  fillSelect(refs.rank, rankOptions);
  fillSelect(refs.role, getHero().roles);
  fillSelect(refs.hero, getFilteredHeroes(), (item) => item.id, (item) => item.name);
  fillSelect(refs.rarity, rarityOptions);
  fillSelect(refs.emblem, state.data.emblems, (item) => item.id, (item) => item.name);
  fillSelect(refs.badge, state.data.badges, (item) => item.id, (item) => item.name);
  fillSelect(refs.effect, effectOptions, (item) => item.id, (item) => item.name);

  refs.title.value = state.selections.title;
  refs.rank.value = state.selections.rank;
  refs.role.value = state.selections.role;
  refs.hero.value = state.selections.heroId;
  refs.rarity.value = state.selections.rarity;
  refs.emblem.value = state.selections.emblemId;
  refs.badge.value = state.selections.badgeId;
  refs.effect.value = state.selections.effect;
  refs.frameStyle.value = state.selections.frameStyle;
  refs.heroSearch.value = state.filters.query;
  refs.heroSort.value = state.filters.sort;

  paintSkinSelect();

  paintSwatches("backgrounds", getBackgroundOptions(), state.selections.backgroundId, (item) => {
    state.selections.backgroundId = item.id;
    syncBackgroundCustomization(item.id);
    refs.accent.value = item.accent || refs.accent.value;
    render();
    paintControls();
    persistState();
  }, (button, item) => {
    const style = item.id === "custom"
      ? buildBackgroundStyle(item)
      : item.style;
    button.style.background = style;
    button.innerHTML = `<span>${item.name}</span>`;
  });

  paintSwatches("frames", getFrameOptions(), state.selections.frameId, (item) => {
    state.selections.frameId = item.id;
    syncFrameCustomization(item.id);
    render();
    paintControls();
    persistState();
  }, (button, item) => {
    const frame = item.id === "custom" ? item : normalizeFrame(item);
    const fill = frame.styleType === "gradient"
      ? `linear-gradient(135deg, ${frame.primary}, ${frame.secondary})`
      : frame.primary;
    button.style.background = `radial-gradient(circle,#0f1726 38%, transparent 39%), ${fill}`;
    button.innerHTML = `<span>${item.name}</span>`;
  });
}

function applyLayerTransform(layerName) {
  const layer = state.layers[layerName];
  const element = layerName === "hero" ? refs.heroLayer : refs.avatarLayer;
  element.style.transform = `translate(${layer.x}px, ${layer.y}px) scale(${layer.scale / 100}) rotate(${layer.rotate}deg)`;
}

function syncLayerControls() {
  const active = state.layers[state.activeLayer];
  refs.activeLayer.value = state.activeLayer;
  refs.layerScale.value = active.scale;
  refs.layerRotate.value = active.rotate;
  refs.dragHint.textContent = `Layer: ${state.activeLayer === "avatar" ? "Avatar" : "Hero Artwork"}`;
  [refs.avatarLayer, refs.heroLayer].forEach((element) => {
    element.classList.toggle("active-layer", element.dataset.layer === state.activeLayer);
  });
}

function syncFormValuesFromState() {
  refs.title.value = state.selections.title;
  refs.rank.value = state.selections.rank;
  refs.accent.value = getSelectedBackground().accent || refs.accent.value || "#f3c969";
  refs.mode.value = state.selections.mode;
  refs.skinColorPrimary.value = state.custom.skinPrimary;
  refs.skinColorSecondary.value = state.custom.skinSecondary;
  refs.skinColorGlow.value = state.custom.skinGlow;
  refs.bgColorPrimary.value = state.custom.bgPrimary;
  refs.bgColorSecondary.value = state.custom.bgSecondary;
  refs.bgColorAccent.value = state.custom.bgAccent;
  refs.frameStyle.value = state.selections.frameStyle;
  refs.frameColorPrimary.value = state.custom.framePrimary;
  refs.frameColorSecondary.value = state.custom.frameSecondary;
}

async function renderAssets() {
  const token = ++state.assetRenderToken;
  const hero = getHero();
  const skin = getSkin();
  const background = getSelectedBackground();

  const [heroAsset, portraitAsset, backgroundAsset] = await Promise.all([
    loadAsset(skin.artwork || hero.artwork, `${hero.name} Art`),
    loadAsset(state.avatarDataUrl || hero.portrait, `${hero.name} Portrait`),
    background.id === "custom" ? Promise.resolve("") : loadAsset(background.asset, background.name)
  ]);

  if (token !== state.assetRenderToken) {
    return;
  }

  refs.heroArt.style.background = buildHeroArtStyle(heroAsset);
  refs.avatarImg.style.background = `url(${portraitAsset}) center/cover no-repeat`;
  refs.backgroundLayer.style.background = buildBackgroundStyle(background, backgroundAsset);
}

function render() {
  const background = getSelectedBackground();
  const frame = getSelectedFrame();
  const frameCss = buildFrameCss(frame);
  const emblem = getItem("emblems", state.selections.emblemId);
  const badge = getItem("badges", state.selections.badgeId);
  const hero = getHero();

  refs.card.style.setProperty("--accent", refs.accent.value);
  refs.card.style.setProperty("--frame", frameCss.shadow);
  refs.card.className = `profile-card ratio-${state.selections.mode} effect-${state.selections.effect}`;
  refs.avatarLayer.style.isolation = "isolate";
  refs.avatarImg.style.zIndex = "1";
  refs.frameOut.style.zIndex = "2";
  refs.badgeOut.style.zIndex = "3";
  refs.frameOut.style.border = "4px solid transparent";
  refs.frameOut.style.background = `linear-gradient(#09111d,#09111d) padding-box, ${frameCss.fill} border-box`;
  refs.frameOut.style.boxShadow = [
    "0 0 0 2px rgba(255,255,255,.18) inset",
    `0 0 30px ${hexToRgba(frameCss.shadow, 0.45)}`,
    state.selections.effect === "glow" ? `0 0 18px ${hexToRgba(refs.accent.value, 0.4)}` : ""
  ].filter(Boolean).join(", ");
  refs.badgeOut.textContent = badge.name;
  refs.badgeOut.style.background = `linear-gradient(135deg, ${badge.accent || frameCss.shadow}, ${refs.accent.value})`;
  refs.emblemOut.textContent = emblem.token || emblem.name;

  refs.ignOut.textContent = refs.ign.value || "PLAYER";
  refs.pidOut.textContent = refs.pid.value || "00000000";
  refs.serverOut.textContent = refs.server.value || "0000";
  refs.bioOut.textContent = refs.bio.value || "No status.";
  refs.titleOut.textContent = refs.title.value || `${hero.primaryRole} ${hero.roleTitle}`;
  refs.rankOut.textContent = refs.rank.value || rankOptions[0];
  refs.heroOut.textContent = hero.name.toUpperCase();
  refs.skinOut.textContent = refs.skin.options[refs.skin.selectedIndex]?.textContent || "Default Skin";
  refs.rarityOut.textContent = String(state.selections.rarity || "Special").toUpperCase();
  refs.rarity.value = state.selections.rarity;

  refs.wrOut.textContent = `${Number(refs.wr.value || 0)}%`;
  refs.matchesOut.textContent = Number(refs.matches.value || 0).toLocaleString("en-US");
  refs.mvpOut.textContent = Number(refs.mvp.value || 0).toLocaleString("en-US");
  refs.savageOut.textContent = Number(refs.savage.value || 0).toLocaleString("en-US");
  refs.legendaryOut.textContent = Number(refs.legendary.value || 0).toLocaleString("en-US");
  refs.emblemLevelOut.textContent = refs.emblemLevel.value || "0";

  refs.modeOut.textContent = {
    story: "1080 x 1920",
    feed: "1080 x 1350",
    card: "900 x 1200"
  }[state.selections.mode];

  applyLayerTransform("avatar");
  applyLayerTransform("hero");
  renderAssets();
}

function createSnapshot() {
  return {
    selections: state.selections,
    custom: state.custom,
    layers: state.layers,
    activeLayer: state.activeLayer,
    filters: state.filters,
    avatarDataUrl: state.avatarDataUrl,
    form: {
      ign: refs.ign.value,
      pid: refs.pid.value,
      server: refs.server.value,
      bio: refs.bio.value,
      title: refs.title.value,
      rank: refs.rank.value,
      accent: refs.accent.value,
      mode: refs.mode.value,
      wr: refs.wr.value,
      matches: refs.matches.value,
      mvp: refs.mvp.value,
      savage: refs.savage.value,
      legendary: refs.legendary.value,
      emblemLevel: refs.emblemLevel.value
    }
  };
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(createSnapshot()));
  } catch (_error) {
    // Ignore quota errors so the editor never blocks.
  }
}

function restoreSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    const snapshot = JSON.parse(raw);
    if (snapshot.selections) {
      state.selections = { ...state.selections, ...snapshot.selections };
    }
    if (snapshot.custom) {
      state.custom = { ...state.custom, ...snapshot.custom };
    }
    if (snapshot.layers) {
      state.layers = {
        avatar: { ...state.layers.avatar, ...snapshot.layers.avatar },
        hero: { ...state.layers.hero, ...snapshot.layers.hero }
      };
    }
    state.activeLayer = snapshot.activeLayer || state.activeLayer;
    state.filters = { ...state.filters, ...(snapshot.filters || {}) };
    state.avatarDataUrl = snapshot.avatarDataUrl || "";

    const form = snapshot.form || {};
    refs.ign.value = form.ign || refs.ign.value;
    refs.pid.value = form.pid || refs.pid.value;
    refs.server.value = form.server || refs.server.value;
    refs.bio.value = form.bio || refs.bio.value;
    refs.wr.value = form.wr || refs.wr.value;
    refs.matches.value = form.matches || refs.matches.value;
    refs.mvp.value = form.mvp || refs.mvp.value;
    refs.savage.value = form.savage || refs.savage.value;
    refs.legendary.value = form.legendary || refs.legendary.value;
    refs.emblemLevel.value = form.emblemLevel || refs.emblemLevel.value;
    if (form.title) {
      state.selections.title = form.title;
    }
    if (form.rank) {
      state.selections.rank = form.rank;
    }
    if (form.accent) {
      refs.accent.value = form.accent;
    }
    if (form.mode) {
      state.selections.mode = form.mode;
    }
  } catch (_error) {
    // Ignore corrupted storage and continue with defaults.
  }
}

function updateApiStatus(result) {
  state.apiStatus = result;
  state.diagnostics = result.diagnostics || [];

  const badgeClass = {
    local: "api-disabled",
    remote: "api-online",
    partial: "api-online",
    offline: "api-fallback"
  }[result.mode] || "api-idle";

  refs.apiBadge.className = `api-pill ${badgeClass}`;
  refs.apiBadge.textContent = result.badge || "LOCAL DATABASE";
  refs.apiStatusText.textContent = state.heroDataStatus.source === "remote"
    ? "REMOTE HERO DATA LOADED"
    : `LOCAL HERO FALLBACK${state.heroDataStatus.error ? ` (${state.heroDataStatus.error})` : ""}`;
  refs.apiSourceText.textContent = state.heroDataStatus.source === "remote"
    ? "Source: heroes=remote api, other data=local database"
    : "Source: heroes=local fallback, other data=local database";

  refs.apiDiagnosticsList.innerHTML = state.diagnostics.length
    ? state.diagnostics.map((item) => `
        <article class="diagnostic-item">
          <b>${item.provider}</b>
          <span>HTTP: ${item.httpStatus}</span>
          <span>Latency: ${item.latencyMs} ms</span>
          <span>Heroes: ${item.heroCount}</span>
          <span>Emblems: ${item.emblemCount}</span>
          <span>Last update: ${new Date(item.lastCheckedAt).toLocaleString("en-GB")}</span>
          <span>Error: ${item.error || "None"}</span>
        </article>
      `).join("")
    : `<article class="diagnostic-item"><b>Local Database</b><span>Remote diagnostics tidak aktif.</span></article>`;
}

async function refreshApiStatus() {
  refs.refreshApiBtn.disabled = true;
  refs.refreshApiBtn.textContent = "Refreshing...";
  refs.apiBadge.className = "api-pill api-idle";
  refs.apiBadge.textContent = "CHECKING...";
  refs.apiStatusText.textContent = state.heroDataStatus.source === "remote"
    ? "REMOTE HERO DATA LOADED"
    : "LOCAL HERO FALLBACK";
  refs.apiSourceText.textContent = state.heroDataStatus.source === "remote"
    ? "Source: heroes=remote api, other data=local database"
    : "Source: heroes=local fallback, other data=local database";

  const fallback = {
    mode: "local",
    badge: "LOCAL DATABASE",
    message: "Local database aktif. Remote check tidak tersedia.",
    diagnostics: []
  };

  const result = window.MLBBApi?.probeProviders
    ? await window.MLBBApi.probeProviders(state.appConfig?.api || {})
    : fallback;

  updateApiStatus(result);
  refs.refreshApiBtn.disabled = false;
  refs.refreshApiBtn.textContent = "Refresh API";
}

function updateCardTilt(clientX, clientY) {
  const rect = refs.card.getBoundingClientRect();
  const relativeX = (clientX - rect.left) / rect.width;
  const relativeY = (clientY - rect.top) / rect.height;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const centeredX = clamp((relativeX - 0.5) * 2, -1, 1);
  const centeredY = clamp((relativeY - 0.5) * 2, -1, 1);

  cardTiltState.rotateY = centeredX * 8;
  cardTiltState.rotateX = centeredY * -8;
  refs.card.style.setProperty("--card-rotate-x", `${cardTiltState.rotateX.toFixed(2)}deg`);
  refs.card.style.setProperty("--card-rotate-y", `${cardTiltState.rotateY.toFixed(2)}deg`);
}

function resetCardTilt() {
  cardTiltState.rotateX = 0;
  cardTiltState.rotateY = 0;
  refs.card.style.setProperty("--card-rotate-x", "0deg");
  refs.card.style.setProperty("--card-rotate-y", "0deg");
}

function applyHeroSelection(heroId, preferredSkinId) {
  const hero = getHeroById(heroId);
  const skins = hero.skins;
  const skin = skins.find((item) => item.id === preferredSkinId) || skins[0];

  state.selections.heroId = hero.id;
  state.selections.skinId = skin.id;
  state.selections.role = hero.primaryRole;
  state.selections.rarity = skin.rarity || "Special";
  syncSkinCustomizationFromSelection();
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) {
    return;
  }

  applyHeroSelection(preset.heroId, preset.skinId);
  state.selections.frameId = preset.frameId;
  state.selections.backgroundId = preset.backgroundId;
  state.selections.emblemId = preset.emblemId;
  state.selections.badgeId = preset.badgeId;
  state.selections.effect = preset.effect;
  state.selections.title = preset.title;
  state.selections.rank = preset.rank;
  syncBackgroundCustomization(preset.backgroundId);
  syncFrameCustomization(preset.frameId);
  refs.accent.value = getSelectedBackground().accent || refs.accent.value;

  refs.title.value = preset.title;
  refs.rank.value = preset.rank;
  refs.wr.value = preset.stats.wr;
  refs.matches.value = preset.stats.matches;
  refs.mvp.value = preset.stats.mvp;
  refs.savage.value = preset.stats.savage;
  refs.legendary.value = preset.stats.legendary;
  refs.emblemLevel.value = preset.stats.emblemLevel;

  ensureSelectionsValid();
  paintControls();
  render();
  persistState();
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomizeProfile() {
  const hero = randomItem(state.data.heroes);
  const skin = randomItem(hero.skins);
  const frame = randomItem(state.data.frames);
  const background = randomItem(state.data.backgrounds);
  const emblem = randomItem(state.data.emblems);
  const badge = randomItem(state.data.badges);

  applyHeroSelection(hero.id, skin.id);
  state.selections.frameId = frame.id;
  state.selections.backgroundId = background.id;
  state.selections.frameStyle = frame.styleType || "solid";
  state.selections.emblemId = emblem.id;
  state.selections.badgeId = badge.id;
  state.selections.effect = randomItem(effectOptions).id;
  state.selections.rank = randomItem(rankOptions);
  state.selections.title = `${hero.primaryRole} ${hero.roleTitle}`;

  refs.title.value = state.selections.title;
  refs.rank.value = state.selections.rank;
  refs.wr.value = Math.floor(Math.random() * 35) + 60;
  refs.matches.value = Math.floor(Math.random() * 4500) + 500;
  refs.mvp.value = Math.floor(Math.random() * 700) + 80;
  refs.savage.value = Math.floor(Math.random() * 60) + 4;
  refs.legendary.value = Math.floor(Math.random() * 1200) + 80;
  refs.emblemLevel.value = Math.floor(Math.random() * 40) + 20;

  syncBackgroundCustomization(background.id);
  syncFrameCustomization(frame.id);
  refs.accent.value = background.accent || refs.accent.value;
  paintControls();
  render();
  persistState();
}

function resetProfile() {
  localStorage.removeItem(STORAGE_KEY);
  refs.photo.value = "";
  refs.ign.value = "MIKASA";
  refs.pid.value = "88888888";
  refs.server.value = "9999";
  refs.bio.value = "Never stop climbing.";
  refs.wr.value = 87;
  refs.matches.value = 2431;
  refs.mvp.value = 318;
  refs.savage.value = 27;
  refs.legendary.value = 501;
  refs.emblemLevel.value = 60;
  createDefaultSelections();
  syncFormValuesFromState();
  paintControls();
  syncLayerControls();
  render();
  persistState();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function enableDragging(element, layerName) {
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let dragging = false;

  const move = (event) => {
    if (!dragging) {
      return;
    }
    const point = event.touches ? event.touches[0] : event;
    state.layers[layerName].x = originX + point.clientX - startX;
    state.layers[layerName].y = originY + point.clientY - startY;
    applyLayerTransform(layerName);
  };

  const stop = () => {
    dragging = false;
    element.style.cursor = "grab";
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", stop);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", stop);
    persistState();
  };

  const start = (event) => {
    const point = event.touches ? event.touches[0] : event;
    dragging = true;
    state.activeLayer = layerName;
    syncLayerControls();
    startX = point.clientX;
    startY = point.clientY;
    originX = state.layers[layerName].x;
    originY = state.layers[layerName].y;
    element.style.cursor = "grabbing";
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", stop);
  };

  element.addEventListener("mousedown", start);
  element.addEventListener("touchstart", start, { passive: true });
}

async function copyConfig() {
  const payload = {
    savedAt: new Date().toISOString(),
    selections: state.selections,
    custom: state.custom,
    filters: state.filters,
    stats: {
      ign: refs.ign.value,
      playerId: refs.pid.value,
      server: refs.server.value,
      bio: refs.bio.value,
      wr: Number(refs.wr.value || 0),
      matches: Number(refs.matches.value || 0),
      mvp: Number(refs.mvp.value || 0),
      savage: Number(refs.savage.value || 0),
      legendary: Number(refs.legendary.value || 0),
      emblemLevel: Number(refs.emblemLevel.value || 0)
    },
    layers: state.layers,
    apiStatus: state.apiStatus
  };

  try {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    refs.copyBtn.textContent = "Copied";
    setTimeout(() => {
      refs.copyBtn.textContent = "Copy Config";
    }, 1200);
  } catch (_error) {
    window.prompt("Copy config manually:", JSON.stringify(payload, null, 2));
  }
}

async function exportPNG() {
  refs.exportBtn.disabled = true;
  refs.exportBtn.textContent = "Exporting...";
  try {
    const dataUrl = await elementToPng(refs.card, state.selections.mode);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `mlbb-flex-${state.selections.mode}.png`;
    link.click();
  } catch (error) {
    window.alert(`Export gagal: ${error.message}`);
  } finally {
    refs.exportBtn.disabled = false;
    refs.exportBtn.textContent = "Export PNG";
  }
}

async function elementToPng(element, mode) {
  const size = {
    story: { width: 1080, height: 1920 },
    feed: { width: 1080, height: 1350 },
    card: { width: 900, height: 1200 }
  }[mode];

  const clone = element.cloneNode(true);
  clone.style.width = `${size.width}px`;
  clone.style.height = `${size.height}px`;
  clone.style.margin = "0";
  clone.style.transform = "none";
  inlineStyles(element, clone);

  const serializer = new XMLSerializer();
  const html = serializer.serializeToString(clone);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
      </foreignObject>
    </svg>
  `;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const image = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, size.width, size.height);
  return canvas.toDataURL("image/png", 1);
}

function inlineStyles(source, target) {
  const sourceNodes = [source, ...source.querySelectorAll("*")];
  const targetNodes = [target, ...target.querySelectorAll("*")];
  sourceNodes.forEach((node, index) => {
    const computed = window.getComputedStyle(node);
    targetNodes[index].setAttribute(
      "style",
      computed.cssText || Array.from(computed).map((prop) => `${prop}:${computed.getPropertyValue(prop)};`).join("")
    );
  });
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Browser menolak render foreignObject untuk export."));
    image.src = url;
  });
}

function wireEvents() {
  if (uiWired) {
    return;
  }
  uiWired = true;

  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab, .tabpage").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      $(button.dataset.tab).classList.add("active");
    });
  });

  ["ign", "pid", "server", "bio", "title", "rank", "wr", "matches", "mvp", "savage", "legendary", "emblemLevel", "accent"].forEach((id) => {
    refs[id].addEventListener("input", () => {
      if (id === "title") {
        state.selections.title = refs.title.value;
      }
      if (id === "rank") {
        state.selections.rank = refs.rank.value;
      }
      render();
      persistState();
    });
  });

  refs.heroSearch.addEventListener("input", () => {
    state.filters.query = refs.heroSearch.value;
    paintControls();
    persistState();
  });

  refs.heroSort.addEventListener("change", () => {
    state.filters.sort = refs.heroSort.value;
    paintControls();
    persistState();
  });

  refs.role.addEventListener("change", () => {
    state.selections.role = refs.role.value;
    persistState();
  });

  refs.hero.addEventListener("change", () => {
    applyHeroSelection(refs.hero.value);
    paintControls();
    render();
    persistState();
  });

  refs.skin.addEventListener("change", () => {
    state.selections.skinId = refs.skin.value;
    syncSkinCustomizationFromSelection();
    render();
    persistState();
  });

  refs.rarity.addEventListener("change", () => {
    state.selections.rarity = refs.rarity.value;
    render();
    persistState();
  });

  refs.emblem.addEventListener("change", () => {
    state.selections.emblemId = refs.emblem.value;
    render();
    persistState();
  });

  refs.badge.addEventListener("change", () => {
    state.selections.badgeId = refs.badge.value;
    render();
    persistState();
  });

  refs.effect.addEventListener("change", () => {
    state.selections.effect = refs.effect.value;
    render();
    persistState();
  });

  refs.skinColorPrimary.addEventListener("input", () => {
    state.custom.skinPrimary = refs.skinColorPrimary.value;
    render();
    persistState();
  });
  refs.skinColorSecondary.addEventListener("input", () => {
    state.custom.skinSecondary = refs.skinColorSecondary.value;
    render();
    persistState();
  });
  refs.skinColorGlow.addEventListener("input", () => {
    state.custom.skinGlow = refs.skinColorGlow.value;
    render();
    persistState();
  });

  ["bgColorPrimary", "bgColorSecondary", "bgColorAccent"].forEach((id) => {
    refs[id].addEventListener("input", () => {
      state.custom.bgPrimary = refs.bgColorPrimary.value;
      state.custom.bgSecondary = refs.bgColorSecondary.value;
      state.custom.bgAccent = refs.bgColorAccent.value;
      state.selections.backgroundId = "custom";
      paintControls();
      render();
      persistState();
    });
  });

  refs.frameStyle.addEventListener("change", () => {
    state.selections.frameStyle = refs.frameStyle.value;
    state.selections.frameId = "custom";
    paintControls();
    render();
    persistState();
  });

  refs.frameColorPrimary.addEventListener("input", () => {
    state.custom.framePrimary = refs.frameColorPrimary.value;
    state.selections.frameId = "custom";
    paintControls();
    render();
    persistState();
  });
  refs.frameColorSecondary.addEventListener("input", () => {
    state.custom.frameSecondary = refs.frameColorSecondary.value;
    state.selections.frameId = "custom";
    paintControls();
    render();
    persistState();
  });

  refs.activeLayer.addEventListener("change", () => {
    state.activeLayer = refs.activeLayer.value;
    syncLayerControls();
    persistState();
  });

  refs.layerScale.addEventListener("input", () => {
    state.layers[state.activeLayer].scale = Number(refs.layerScale.value);
    applyLayerTransform(state.activeLayer);
    persistState();
  });

  refs.layerRotate.addEventListener("input", () => {
    state.layers[state.activeLayer].rotate = Number(refs.layerRotate.value);
    applyLayerTransform(state.activeLayer);
    persistState();
  });

  refs.mode.addEventListener("change", () => {
    state.selections.mode = refs.mode.value;
    render();
    persistState();
  });

  refs.resetLayout.addEventListener("click", () => {
    state.layers.avatar = { x: 0, y: 0, scale: 100, rotate: 0 };
    state.layers.hero = { x: 0, y: 0, scale: 100, rotate: 0 };
    syncLayerControls();
    render();
    persistState();
  });

  refs.photo.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      state.avatarDataUrl = "";
      render();
      persistState();
      return;
    }
    state.avatarDataUrl = await readFileAsDataUrl(file);
    render();
    persistState();
  });

  refs.presetBtn.addEventListener("click", () => refs.modal.classList.remove("hidden"));
  refs.closeModal.addEventListener("click", () => refs.modal.classList.add("hidden"));
  refs.modal.addEventListener("click", (event) => {
    if (event.target === refs.modal) {
      refs.modal.classList.add("hidden");
    }
  });

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.preset);
      refs.modal.classList.add("hidden");
    });
  });

  refs.randomBtn.addEventListener("click", randomizeProfile);
  refs.resetProfileBtn.addEventListener("click", resetProfile);
  refs.copyBtn.addEventListener("click", copyConfig);
  refs.exportBtn.addEventListener("click", exportPNG);
  refs.refreshApiBtn.addEventListener("click", refreshApiStatus);
  refs.card.addEventListener("mousemove", (event) => updateCardTilt(event.clientX, event.clientY));
  refs.card.addEventListener("mouseleave", resetCardTilt);
  refs.card.addEventListener("touchmove", (event) => {
    const touch = event.touches?.[0];
    if (touch) {
      updateCardTilt(touch.clientX, touch.clientY);
    }
  }, { passive: true });
  refs.card.addEventListener("touchend", resetCardTilt);
  refs.card.addEventListener("touchcancel", resetCardTilt);

  enableDragging(refs.avatarLayer, "avatar");
  enableDragging(refs.heroLayer, "hero");
}

async function init() {
  cacheRefs();
  wireEvents();

  const [db, appConfig] = await Promise.all([
    loadLocalDatabase(),
    loadAppConfig()
  ]);

  state.appConfig = appConfig;
  try {
    const remoteHeroes = await loadRemoteHeroes();
    db.heroes = {
      ...db.heroes,
      heroes: remoteHeroes
    };
    state.heroDataStatus = {
      source: "remote",
      error: "",
      count: remoteHeroes.length,
      hasImageUrl: remoteHeroes.some((hero) => Boolean(hero.artwork || hero.portrait))
    };
  } catch (error) {
    state.heroDataStatus = {
      source: "local",
      error: error.message || "Remote hero API failed.",
      count: Array.isArray(db.heroes?.heroes) ? db.heroes.heroes.length : 0,
      hasImageUrl: Array.isArray(db.heroes?.heroes) ? db.heroes.heroes.some((hero) => Boolean(hero.artwork || hero.portrait)) : false
    };
  }

  state.data = enrichDatabase(db);
  createDefaultSelections();
  restoreSavedState();
  ensureSelectionsValid();
  syncSkinCustomizationFromSelection();
  syncBackgroundCustomization(state.selections.backgroundId);
  syncFrameCustomization(state.selections.frameId);
  syncFormValuesFromState();
  paintControls();
  syncLayerControls();
  render();
  updateApiStatus({
    mode: state.heroDataStatus.source === "remote" ? "remote" : "local",
    badge: state.heroDataStatus.source === "remote" ? "REMOTE AVAILABLE" : "LOCAL DATABASE",
    message: state.heroDataStatus.source === "remote" ? "REMOTE HERO DATA LOADED" : "LOCAL HERO FALLBACK",
    diagnostics: []
  });
  await refreshApiStatus();
}

init().catch((error) => {
  const fallbackText = `Gagal memuat local database: ${error.message}`;
  document.body.innerHTML = `<main style="padding:32px;color:#edf3ff;background:#07111d;font-family:Trebuchet MS,Segoe UI,sans-serif"><h1>MLBB Flex Profile Studio</h1><p>${fallbackText}</p><p>Pastikan file di folder <code>data/</code> tersedia dan jalankan project lewat local server atau <code>npm run dev</code>.</p></main>`;
});
