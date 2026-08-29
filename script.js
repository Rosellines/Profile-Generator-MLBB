const $ = (id) => document.getElementById(id);

const roleHeroes = {
  Assassin: ["Aamon", "Alucard", "Arlott", "Benedetta", "Fanny", "Gusion", "Hanzo", "Harley", "Hayabusa", "Helcurt", "Hirara", "Joy", "Julian", "Kadita", "Karina", "Lancelot", "Lesley", "Ling", "Mathilda", "Natalia", "Nolan", "Paquito", "Saber", "Selena", "Sora", "Suyou", "Yi Sun-shin", "Yin", "Zilong"],
  Fighter: ["Aldous", "Alpha", "Alucard", "Arlott", "Aulus", "Badang", "Balmond", "Bane", "Barats", "Chou", "Cici", "Dyrroth", "Fredrinn", "Freya", "Gatotkaca", "Grock", "Guinevere", "Hilda", "Jawhead", "Julian", "Kalea", "Khaleed", "Lapu-Lapu", "Leomord", "Lukas", "Martis", "Masha", "Minsitthar", "Paquito", "Phoveus", "Roger", "Ruby", "Silvanna", "Sora", "Sun", "Suyou", "Terizla", "Thamuz", "X.Borg", "Yin", "Yu Zhong", "Zilong"],
  Mage: ["Alice", "Bane", "Cecilion", "Chang'e", "Cyclops", "Eudora", "Esmeralda", "Faramis", "Gord", "Harley", "Harith", "Kadita", "Kagura", "Kimmy", "Lunox", "Luo Yi", "Lylia", "Nana", "Novaria", "Odette", "Pharsa", "Selena", "Valentina", "Valir", "Vexana", "Xavier", "Yve", "Zetian", "Zhask", "Zhuxin"],
  Marksman: ["Beatrix", "Brody", "Bruno", "Claude", "Clint", "Edith", "Granger", "Hanabi", "Irithel", "Ixia", "Karrie", "Kimmy", "Layla", "Lesley", "Melissa", "Miya", "Moskov", "Natan", "Obsidia", "Popol and Kupa", "Roger", "Wanwan", "Yi Sun-shin"],
  Jungler: ["Aamon", "Alucard", "Balmond", "Fanny", "Fredrinn", "Hayabusa", "Helcurt", "Joy", "Karina", "Lancelot", "Ling", "Martis", "Nolan", "Saber", "Suyou", "Yi Sun-shin", "Yin"],
  Support: ["Angela", "Carmilla", "Chip", "Diggie", "Estes", "Faramis", "Floryn", "Johnson", "Kaja", "Kalea", "Lolita", "Marcel", "Mathilda", "Minotaur", "Rafaela"],
  Tanker: ["Alice", "Atlas", "Barats", "Baxia", "Belerick", "Carmilla", "Chip", "Edith", "Esmeralda", "Fredrinn", "Franco", "Gatotkaca", "Gloo", "Grock", "Hilda", "Hylos", "Johnson", "Khufra", "Lolita", "Masha", "Minotaur", "Terizla", "Tigreal", "Uranus"]
};

const RANK_ASSETS = {
  "MYTHICAL IMMORTAL": "assets/rank/mythical-immortal.png",
  "MYTHIC GLORY": "assets/rank/mythic-glory.png",
  "MYTHIC HONOR": "assets/rank/mythical-honor.png",
  "MYTHIC": "assets/rank/mythic.png",
  "LEGENDS": "assets/rank/legends.png",
  "EPIC": "assets/rank/epic.png"
};

const rankVisuals = {
  "MYTHICAL IMMORTAL": { className: "rank-mythical-immortal", icon: RANK_ASSETS["MYTHICAL IMMORTAL"] },
  "MYTHIC GLORY": { className: "rank-mythic-glory", icon: RANK_ASSETS["MYTHIC GLORY"] },
  "MYTHIC HONOR": { className: "rank-mythic-honor", icon: RANK_ASSETS["MYTHIC HONOR"] },
  "MYTHIC": { className: "rank-mythic", icon: RANK_ASSETS["MYTHIC"] },
  "LEGENDS": { className: "rank-legends", icon: RANK_ASSETS["LEGENDS"] },
  "EPIC": { className: "rank-epic", icon: RANK_ASSETS["EPIC"] }
};

const rarityOptions = ["Mythic", "Legend", "Collector", "Epic", "Special", "Rare", "Elite", "Basic"];
const emblemOptions = ["Best Carry", "Best Initiator", "Best Finisher", "Best Roamer", "Best Jungler", "Best Laner", "Best Tanker", "Best Damage Dealer", "Best Burst", "Best DPS", "Best Assassin", "Best Duelist", "Best Pusher"];
const badgeOptions = ["MVP", "Legendary", "Savage", "Comeback King", "Victory Maker", "Godlike"];
const heroAliases = {
  hirara: "hiara",
  hiara: "hiara"
};

const fallbackManifest = {
  version: 3,
  titles: ["Assassin Main", "Mythic Grinder", "Collector Hunter", "Rank Demon", "Savage Farmer"],
  ranks: ["MYTHICAL IMMORTAL", "MYTHIC GLORY", "MYTHIC HONOR", "MYTHIC", "LEGENDS", "EPIC"],
  backgrounds: [
    {
      id: "starlight",
      name: "Starlight Rift",
      accent: "#f3c969",
      style: "radial-gradient(circle at 72% 18%,rgba(255,255,255,.26),transparent 20%),linear-gradient(145deg,#173761 0%,#0b1321 52%,#613117 100%)"
    },
    {
      id: "neon",
      name: "Neon District",
      accent: "#ff77c8",
      style: "radial-gradient(circle at 72% 20%,rgba(255,255,255,.28),transparent 18%),linear-gradient(150deg,#401955 0%,#0c1323 55%,#2d6a6d 100%)"
    },
    {
      id: "jade",
      name: "Jade Temple",
      accent: "#74f0b3",
      style: "radial-gradient(circle at 68% 18%,rgba(255,255,255,.24),transparent 22%),linear-gradient(145deg,#173f48 0%,#0b1321 56%,#2c6135 100%)"
    },
    {
      id: "ember",
      name: "Ember Throne",
      accent: "#ff9c67",
      style: "radial-gradient(circle at 74% 20%,rgba(255,255,255,.22),transparent 18%),linear-gradient(145deg,#482719 0%,#0b1321 54%,#6c2222 100%)"
    },
    {
      id: "aurora",
      name: "Aurora Bloom",
      accent: "#9fc8ff",
      style: "radial-gradient(circle at 74% 16%,rgba(244,255,255,.35),transparent 20%),linear-gradient(145deg,#19285d 0%,#142445 48%,#7d4c91 100%)"
    },
    {
      id: "obsidian",
      name: "Obsidian Pulse",
      accent: "#ff4d81",
      style: "radial-gradient(circle at 72% 18%,rgba(255,255,255,.18),transparent 18%),linear-gradient(145deg,#2a1022 0%,#11111e 52%,#252045 100%)"
    },
    {
      id: "ocean",
      name: "Ocean Current",
      accent: "#69e6e8",
      style: "radial-gradient(circle at 70% 16%,rgba(202,255,255,.28),transparent 19%),linear-gradient(145deg,#0c3d5a 0%,#0b182b 52%,#14545c 100%)"
    },
    {
      id: "solar",
      name: "Solar Crown",
      accent: "#ffd76b",
      style: "radial-gradient(circle at 72% 18%,rgba(255,248,214,.34),transparent 20%),linear-gradient(145deg,#51330f 0%,#22140b 48%,#8d4d10 100%)"
    },
    {
      id: "rose",
      name: "Rose Nebula",
      accent: "#ff86b5",
      style: "radial-gradient(circle at 74% 18%,rgba(255,223,236,.28),transparent 19%),linear-gradient(145deg,#441530 0%,#161225 52%,#5d244b 100%)"
    },
    {
      id: "forest",
      name: "Forest Relic",
      accent: "#89f0a7",
      style: "radial-gradient(circle at 71% 16%,rgba(229,255,233,.25),transparent 18%),linear-gradient(145deg,#0f3424 0%,#0f171e 52%,#35592d 100%)"
    },
    {
      id: "midnight",
      name: "Midnight Prism",
      accent: "#7da2ff",
      style: "radial-gradient(circle at 70% 18%,rgba(255,255,255,.2),transparent 17%),linear-gradient(145deg,#151a3f 0%,#0a1020 50%,#30205a 100%)"
    }
  ],
  frames: [
    { id: "royal", name: "Royal Gold", color: "#f3c969", altColor: "#ff9f5b", style: "linear-gradient(135deg,#f8db81 0%,#f3c969 45%,#ff9f5b 100%)" },
    { id: "frost", name: "Frost", color: "#9cd9ff", altColor: "#e8f6ff", style: "linear-gradient(135deg,#e8f6ff 0%,#9cd9ff 50%,#6db3ff 100%)" },
    { id: "void", name: "Void", color: "#ca95ff", altColor: "#7d63ff", style: "linear-gradient(135deg,#f0d7ff 0%,#ca95ff 48%,#7d63ff 100%)" },
    { id: "crimson", name: "Crimson", color: "#ff8b8b", altColor: "#ffb56b", style: "linear-gradient(135deg,#ffd1cf 0%,#ff8b8b 45%,#ffb56b 100%)" },
    { id: "emerald", name: "Emerald", color: "#82f1b8", altColor: "#2ebd89", style: "linear-gradient(135deg,#dcffe8 0%,#82f1b8 48%,#2ebd89 100%)" },
    { id: "pearl", name: "Pearl", color: "#f4f5ff", altColor: "#d8dcff", style: "linear-gradient(135deg,#ffffff 0%,#f4f5ff 50%,#d8dcff 100%)" },
    { id: "sunfire", name: "Sunfire", color: "#ffb347", altColor: "#ff5f6d", style: "linear-gradient(135deg,#ffe39c 0%,#ffb347 42%,#ff5f6d 100%)" },
    { id: "nebula", name: "Nebula", color: "#7f7fd5", altColor: "#86a8e7", style: "linear-gradient(135deg,#c8c7ff 0%,#7f7fd5 42%,#86a8e7 72%,#91eae4 100%)" },
    { id: "tidal", name: "Tidal", color: "#4facfe", altColor: "#00f2fe", style: "linear-gradient(135deg,#b8ecff 0%,#4facfe 44%,#00f2fe 100%)" },
    { id: "blossom", name: "Blossom", color: "#f093fb", altColor: "#f5576c", style: "linear-gradient(135deg,#ffd7f6 0%,#f093fb 44%,#f5576c 100%)" }
  ],
  emblems: [
    { id: "burst", name: "Burst", token: "Burst" },
    { id: "assassin", name: "Assassin", token: "Assassin" },
    { id: "mage", name: "Mage", token: "Mage" },
    { id: "marksman", name: "Marksman", token: "MM" },
    { id: "tank", name: "Tank", token: "Tank" },
    { id: "support", name: "Support", token: "Support" }
  ],
  badges: [
    { id: "mvp", name: "MVP" },
    { id: "savage", name: "Savage" },
    { id: "legend", name: "Legend" },
    { id: "goat", name: "GOAT" },
    { id: "clutch", name: "Clutch" },
    { id: "og", name: "OG" }
  ],
  heroes: [
    {
      id: "gusion",
      name: "Gusion",
      style: "radial-gradient(circle at 56% 45%,rgba(116,86,255,.95),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.32) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)",
      skins: [
        { id: "cosmic-gleam", name: "Cosmic Gleam", rarity: "Legend", style: "radial-gradient(circle at 58% 42%,rgba(158,137,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.36) 43%,transparent 56%)" },
        { id: "deaths-scythe", name: "Death's Scythe", rarity: "Epic", style: "radial-gradient(circle at 58% 42%,rgba(124,211,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.34) 43%,transparent 56%)" },
        { id: "venom", name: "Venom", rarity: "Special", style: "radial-gradient(circle at 58% 42%,rgba(87,255,160,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.3) 43%,transparent 56%)" }
      ]
    },
    {
      id: "fanny",
      name: "Fanny",
      style: "radial-gradient(circle at 56% 45%,rgba(105,241,255,.95),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.28) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)",
      skins: [
        { id: "galactic-starhawk", name: "Galactic Starhawk", rarity: "Epic", style: "radial-gradient(circle at 58% 42%,rgba(120,235,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.38) 43%,transparent 56%)" },
        { id: "blade-of-kibou", name: "Blade of Kibou", rarity: "Collector", style: "radial-gradient(circle at 58% 42%,rgba(255,201,120,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.35) 43%,transparent 56%)" }
      ]
    },
    {
      id: "ling",
      name: "Ling",
      style: "radial-gradient(circle at 56% 45%,rgba(197,223,255,.95),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.3) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)",
      skins: [
        { id: "night-shade", name: "Night Shade", rarity: "Epic", style: "radial-gradient(circle at 58% 42%,rgba(223,230,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.33) 43%,transparent 56%)" },
        { id: "lord-shen", name: "Lord Shen", rarity: "Collector", style: "radial-gradient(circle at 58% 42%,rgba(255,196,111,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.36) 43%,transparent 56%)" }
      ]
    }
  ]
};

const presets = {
  mythic: { rank: "MYTHIC GLORY", title: "Mythic Grinder", wr: 87, matches: 2431, mvp: 318, savage: 27, legendary: 501, effect: "glow", background: "starlight", frame: "royal", badge: "mvp", emblem: "burst" },
  collector: { rank: "MYTHICAL IMMORTAL", title: "Collector Hunter", wr: 92, matches: 1732, mvp: 402, savage: 33, legendary: 622, effect: "particles", background: "neon", frame: "void", badge: "legend", emblem: "assassin" },
  og: { rank: "LEGENDS", title: "OG", wr: 74, matches: 5210, mvp: 260, savage: 14, legendary: 844, effect: "scan", background: "jade", frame: "frost", badge: "og", emblem: "marksman" },
  whale: { rank: "MYTHICAL IMMORTAL", title: "Whale Energy", wr: 96, matches: 3611, mvp: 701, savage: 49, legendary: 1182, effect: "glow", background: "ember", frame: "royal", badge: "goat", emblem: "mage" }
};

const state = {
  manifest: fallbackManifest,
  apiStatus: null,
  selections: {
    role: "All",
    heroId: fallbackManifest.heroes[0].id,
    skinId: fallbackManifest.heroes[0].skins[0].id,
    backgroundId: fallbackManifest.backgrounds[0].id,
    frameId: fallbackManifest.frames[0].id,
    emblemId: fallbackManifest.emblems[0].id,
    badgeId: fallbackManifest.badges[0].id,
    effect: "none",
    title: fallbackManifest.titles[0],
    rank: fallbackManifest.ranks[0],
    mode: "story"
  },
  layers: {
    avatar: { x: 0, y: 0, scale: 100, rotate: 0 },
    hero: { x: 0, y: 0, scale: 100, rotate: 0 }
  },
  activeLayer: "avatar",
  customBackground: false,
  customFrame: false,
  avatarDataUrl: "",
  artworkDataUrl: ""
};

const refs = {};
let uiWired = false;

const STORAGE_KEYS = {
  catalog: "mlbb-flex:catalog:v9",
  heroes: "mlbb-flex:heroes:v9",
  skinsByHero: "mlbb-flex:skins-by-hero:v9",
  manifest: "mlbb-flex:manifest:v9",
  state: "mlbb-flex:state:v9"
};

const CATALOG_VERSION = 9;

function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // Ignore quota/private-mode failures; the app still works without cache.
  }
}

function cloneData(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function seedEmbeddedCatalogToStorage() {
  const embedded = window.MLBB_LOCAL_CATALOG;
  if (!embedded?.heroes?.length) return null;

  const cached = readStorage(STORAGE_KEYS.catalog);
  const validCache = cached?.version === CATALOG_VERSION && Array.isArray(cached.heroes) && cached.heroes.length >= embedded.heroes.length;
  if (!validCache) {
    const catalog = cloneData(embedded);
    writeStorage(STORAGE_KEYS.catalog, catalog);
    writeStorage(STORAGE_KEYS.heroes, catalog.heroes.map(({ id, name, roles }) => ({ id, name, roles })));
    const skinsByHero = Object.fromEntries(catalog.heroes.map((hero) => [hero.id, hero.skins || []]));
    writeStorage(STORAGE_KEYS.skinsByHero, skinsByHero);
    writeStorage(STORAGE_KEYS.manifest, catalog);
    return catalog;
  }
  return cached;
}

function saveUserState() {
  writeStorage(STORAGE_KEYS.state, {
    selections: state.selections,
    layers: state.layers,
    activeLayer: state.activeLayer,
    customBackground: state.customBackground,
    customFrame: state.customFrame,
    avatarDataUrl: state.avatarDataUrl,
    artworkDataUrl: state.artworkDataUrl
  });
}

function restoreUserState() {
  const cached = readStorage(STORAGE_KEYS.state);
  if (!cached) return;
  state.selections = { ...state.selections, ...(cached.selections || {}) };
  state.layers = { ...state.layers, ...(cached.layers || {}) };
  state.activeLayer = cached.activeLayer || state.activeLayer;
  state.customBackground = Boolean(cached.customBackground);
  state.customFrame = Boolean(cached.customFrame);
  state.avatarDataUrl = cached.avatarDataUrl || "";
  state.artworkDataUrl = cached.artworkDataUrl || "";
}


async function fetchLocalManifest() {
  try {
    const response = await fetch("manifest.json", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    return fallbackManifest;
  }
}

async function fetchLocalSkinCatalog() {
  try {
    const response = await fetch("skins-live.json", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    return null;
  }
}

function cacheRefs() {
  [
    "ign", "pid", "server", "bio", "title", "rank", "photo", "artwork", "role", "hero", "skin", "rarity", "backgrounds",
    "frames", "emblems", "badges", "skinColor1", "skinColor2", "rarityColor", "backgroundColor1", "backgroundColor2", "backgroundColor3",
    "frameMode", "frameColor1", "frameColor2", "activeLayer", "layerScale", "layerRotate", "accent", "mode",
    "wr", "matches", "mvp", "savage", "legendary", "emblemLevel", "resetLayout", "presetBtn", "randomBtn",
    "copyBtn", "exportBtn", "closeModal", "modal", "cropModal", "cropTitle", "cropViewport", "cropImage", "cropZoom", "cropX", "cropY", "cropCancel", "cropApply", "card", "backgroundLayer", "heroArt", "avatarImg",
    "frameOut", "badgeOut", "ignOut", "pidOut", "serverOut", "bioOut", "titleOut", "rankOut", "heroOut",
    "skinOut", "rarityOut", "emblemOut", "rankIconOut", "wrOut", "matchesOut", "mvpOut", "savageOut", "legendaryOut",
    "emblemLevelOut", "modeOut", "dragHint", "heroLayer", "avatarLayer", "apiBadge", "apiStatusText",
    "apiSourceText", "refreshApiBtn"
  ].forEach((id) => {
    refs[id] = $(id);
  });
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeHeroKey(value) {
  return heroAliases[slugify(value)] || slugify(value);
}

function roleForHero(name) {
  const normalizedName = normalizeHeroKey(name);
  return Object.keys(roleHeroes).filter((role) => roleHeroes[role].some((heroName) => normalizeHeroKey(heroName) === normalizedName));
}

function applyHeroCatalog(manifest) {
  const existingById = new Map((manifest.heroes || []).map((hero) => [normalizeHeroKey(hero.id || hero.name), hero]));
  const names = [...new Set(Object.values(roleHeroes).flat())];

  names.forEach((name, index) => {
    const id = normalizeHeroKey(name);
    const existing = existingById.get(id);
    if (existing) {
      existing.id = normalizeHeroKey(existing.id || existing.name);
      existing.roles = [...new Set([...(existing.roles || []), ...roleForHero(name)])];
      return;
    }
    manifest.heroes.push({
      id,
      name,
      roles: roleForHero(name),
      style: `radial-gradient(circle at 56% 45%,hsla(${(index * 37) % 360},82%,68%,.94),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.28) 43%,transparent 56%)`,
      skins: [{ id: "custom", name: "Custom Skin", rarity: "Rare", style: "" }]
    });
  });
  manifest.heroes.forEach((hero) => {
    hero.id = normalizeHeroKey(hero.id || hero.name);
    hero.roles = hero.roles?.length ? hero.roles : roleForHero(hero.name);
  });
  return manifest;
}

function buildSmoothGradient(color1, color2, angle = 135) {
  // Avoid color-mix() here: it can produce visible banding/fallbacks in canvas/foreignObject rendering.
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color1} 28%, ${color2} 72%, ${color2} 100%)`;
}

function mergeSkinCatalog(manifest, skinCatalog) {
  if (!skinCatalog?.heroes?.length) {
    return manifest;
  }

  const heroMap = new Map((manifest.heroes || []).map((hero) => [normalizeHeroKey(hero.id || hero.name), hero]));

  skinCatalog.heroes.forEach((remoteHero, heroIndex) => {
    const heroKey = normalizeHeroKey(remoteHero.id || remoteHero.name);
    const existingHero = heroMap.get(heroKey);
    const targetHero = existingHero || {
      id: heroKey,
      name: remoteHero.name,
      roles: roleForHero(remoteHero.name),
      style: `radial-gradient(circle at 56% 45%,hsla(${(heroIndex * 37) % 360},82%,68%,.94),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.28) 43%,transparent 56%)`,
      skins: []
    };

    const localSkinMap = new Map((targetHero.skins || []).map((skin) => [slugify(skin.id || skin.name), skin]));
    const mergedSkins = (remoteHero.skins || []).map((skin, skinIndex) => {
      const skinKey = slugify(skin.id || skin.name);
      const localSkin = localSkinMap.get(skinKey);
      return {
        id: skinKey,
        name: skin.name,
        rarity: localSkin?.rarity || "Rare",
        asset: skin.asset || localSkin?.asset || `assets/skins/${heroKey}/${skinKey}.webp`,
        style: localSkin?.style || fallbackSkinStyle(skinIndex)
      };
    });

    const localOnlySkins = (targetHero.skins || []).filter((skin) => !mergedSkins.some((item) => item.id === slugify(skin.id || skin.name)));
    targetHero.id = heroKey;
    targetHero.name = targetHero.name || remoteHero.name;
    targetHero.roles = targetHero.roles?.length ? targetHero.roles : roleForHero(targetHero.name);
    targetHero.skins = [...mergedSkins, ...localOnlySkins];

    if (!existingHero) {
      manifest.heroes.push(targetHero);
      heroMap.set(heroKey, targetHero);
    }
  });

  return manifest;
}

function countSkins(manifest) {
  return (manifest.heroes || []).reduce((sum, hero) => sum + (hero.skins?.length || 0), 0);
}

function getRoleHeroes() {
  const heroes = Array.isArray(state.manifest.heroes) ? state.manifest.heroes : [];
  if (!state.selections.role || state.selections.role === "All") return heroes;
  const filtered = heroes.filter((hero) => hero.roles?.includes(state.selections.role));
  return filtered.length ? filtered : heroes;
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
  return state.manifest.heroes.find((hero) => hero.id === state.selections.heroId) || state.manifest.heroes[0];
}

function getSkin() {
  const hero = getHero();
  return hero.skins.find((skin) => skin.id === state.selections.skinId) || hero.skins[0];
}

function getItem(listName, id) {
  return state.manifest[listName].find((item) => item.id === id) || state.manifest[listName][0];
}

function ensureSelectionsValid() {
  if (!state.manifest.heroes.length) {
    state.manifest.heroes = fallbackManifest.heroes;
  }
  if (!state.manifest.backgrounds?.length) {
    state.manifest.backgrounds = fallbackManifest.backgrounds;
  }
  if (!state.manifest.frames?.length) {
    state.manifest.frames = fallbackManifest.frames;
  }
  if (!state.manifest.emblems?.length) {
    state.manifest.emblems = fallbackManifest.emblems;
  }
  if (!state.manifest.badges?.length) {
    state.manifest.badges = fallbackManifest.badges;
  }
  if (!state.manifest.titles?.length) {
    state.manifest.titles = fallbackManifest.titles;
  }
  if (!state.manifest.ranks?.length) {
    state.manifest.ranks = fallbackManifest.ranks;
  }
  if (!(state.selections.role === "All" || Object.hasOwn(roleHeroes, state.selections.role))) {
    state.selections.role = "All";
  }

  const availableHeroes = getRoleHeroes();
  if (!availableHeroes.some((hero) => hero.id === state.selections.heroId)) {
    state.selections.heroId = availableHeroes[0]?.id || state.manifest.heroes[0].id;
  }

  const hero = getHero();
  if (!hero.skins.length) {
    hero.skins = [{ id: "core", name: "Core", rarity: "Base", style: fallbackManifest.heroes[0].skins[0].style }];
  }
  if (!hero.skins.some((skin) => skin.id === state.selections.skinId)) {
    state.selections.skinId = hero.skins[0].id;
  }

  ["backgrounds", "frames", "emblems", "badges"].forEach((listName) => {
    const key = `${listName.slice(0, -1)}Id`;
    if (!state.manifest[listName].some((item) => item.id === state.selections[key])) {
      state.selections[key] = state.manifest[listName][0].id;
    }
  });

  if (!state.manifest.titles.includes(state.selections.title)) {
    state.selections.title = state.manifest.titles[0];
  }
  if (!state.manifest.ranks.includes(state.selections.rank)) {
    state.selections.rank = state.manifest.ranks[0];
  }
}

function syncStyleInputsFromSelections() {
  const background = getItem("backgrounds", state.selections.backgroundId);
  const frame = getItem("frames", state.selections.frameId);
  if (background) {
    const colors = extractGradientColors(background.style);
    refs.backgroundColor1.value = colors[0] || refs.backgroundColor1.value;
    refs.backgroundColor2.value = colors[1] || refs.backgroundColor2.value;
    refs.backgroundColor3.value = colors[2] || refs.backgroundColor3.value;
    refs.accent.value = background.accent || refs.accent.value;
  }
  if (frame) {
    refs.frameColor1.value = frame.color || refs.frameColor1.value;
    refs.frameColor2.value = frame.altColor || refs.frameColor2.value;
  }
}

function extractGradientColors(style = "") {
  const hexes = String(style).match(/#[0-9a-f]{6}/gi) || [];
  return [...new Set(hexes)].slice(0, 3);
}

function paintControls() {
  const selectedEmblem = refs.emblems.value || emblemOptions[0];
  const selectedBadge = refs.badges.value || badgeOptions[0];
  fillSelect(refs.title, state.manifest.titles);
  fillSelect(refs.rank, state.manifest.ranks);
  fillSelect(refs.role, ["All", ...Object.keys(roleHeroes)]);
  fillSelect(refs.hero, getRoleHeroes(), (hero) => hero.id, (hero) => hero.name);
  fillSelect(refs.rarity, rarityOptions);
  fillSelect(refs.emblems, emblemOptions);
  fillSelect(refs.badges, badgeOptions);

  refs.title.value = state.selections.title;
  refs.rank.value = state.selections.rank;
  refs.role.value = state.selections.role;
  refs.hero.value = state.selections.heroId;
  refs.emblems.value = emblemOptions.includes(selectedEmblem) ? selectedEmblem : emblemOptions[0];
  refs.badges.value = badgeOptions.includes(selectedBadge) ? selectedBadge : badgeOptions[0];
  paintSkinSelect();
  paintSwatches("backgrounds", state.manifest.backgrounds, state.selections.backgroundId, (item) => {
    state.selections.backgroundId = item.id;
    state.customBackground = false;
    syncStyleInputsFromSelections();
    render();
  }, (button, item) => {
    button.classList.add("swatch-orb");
    button.title = item.name;
    button.setAttribute("aria-label", item.name);
    button.style.background = item.style;
  });
  paintSwatches("frames", state.manifest.frames, state.selections.frameId, (item) => {
    state.selections.frameId = item.id;
    state.customFrame = false;
    syncStyleInputsFromSelections();
    render();
  }, (button, item) => {
    button.classList.add("swatch-orb");
    button.title = item.name;
    button.setAttribute("aria-label", item.name);
    button.style.background = item.style || item.color;
  });
}

function paintSkinSelect() {
  const hero = getHero();
  fillSelect(refs.skin, hero.skins, (skin) => skin.id, (skin) => skin.name);
  refs.skin.value = state.selections.skinId;
  refs.rarity.value = rarityOptions.includes(getSkin().rarity) ? getSkin().rarity : "Rare";
}

function paintSwatches(containerId, items, selectedId, onPick, painter) {
  const container = refs[containerId];
  container.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = `swatch${item.id === selectedId ? " active" : ""}`;
    button.type = "button";
    painter(button, item);
    button.addEventListener("click", () => {
      onPick(item);
      paintControls();
    });
    container.appendChild(button);
  });
}

function paintTokens(containerId, items, selectedId, onPick, labelFn) {
  const container = refs[containerId];
  container.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = `token${item.id === selectedId ? " active" : ""}`;
    button.type = "button";
    button.textContent = labelFn(item);
    button.addEventListener("click", () => {
      onPick(item);
      paintControls();
    });
    container.appendChild(button);
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

function updateApiStatus(status) {
  state.apiStatus = status;
  const badgeClass = {
    online: "api-online",
    partial: "api-online",
    fallback: "api-fallback",
    disabled: "api-disabled"
  }[status?.mode] || "api-idle";

  refs.apiBadge.className = `api-pill ${badgeClass}`;
  refs.apiBadge.textContent = `API: ${String(status?.mode || "idle").toUpperCase()}`;
  refs.apiStatusText.textContent = status?.message || "Status API belum tersedia.";
  refs.apiSourceText.textContent = `Source: ${status?.provider || "-"} | Heroes ${status?.heroCount || 0} | Skins ${status?.skinCount || 0} | Emblems ${status?.emblemCount || 0}`;
}

function render() {
  const background = getItem("backgrounds", state.selections.backgroundId);
  const frame = getItem("frames", state.selections.frameId);
  const hero = getHero();
  const skin = getSkin();
  const skinStyle = `radial-gradient(circle at 58% 42%,${refs.skinColor1.value},transparent 34%),linear-gradient(125deg,transparent 18%,${refs.skinColor2.value}66 43%,transparent 56%)`;
  const customBackground = `radial-gradient(circle at 72% 18%,${refs.backgroundColor3.value}88,transparent 20%),linear-gradient(145deg,${refs.backgroundColor1.value} 0%,${refs.backgroundColor2.value} 54%,${refs.backgroundColor3.value} 100%)`;
  const presetFrameFill = frame.style || frame.color;
  const presetFrameSecondary = frame.altColor || frame.color;
  const customFrameFill = refs.frameMode.value === "gradient"
    ? buildSmoothGradient(refs.frameColor1.value, refs.frameColor2.value)
    : refs.frameColor1.value;
  const frameFill = state.customFrame ? customFrameFill : presetFrameFill;
  const frameColor = state.customFrame ? refs.frameColor1.value : frame.color;
  const frameAltColor = state.customFrame ? refs.frameColor2.value : presetFrameSecondary;
  refs.backgroundLayer.style.background = state.customBackground ? customBackground : background.style;
  refs.card.style.setProperty("--accent", refs.accent.value);
  refs.card.style.setProperty("--frame", frameColor);
  refs.card.style.setProperty("--frame-alt", frameAltColor);
  refs.card.style.setProperty("--frame-fill", frameFill);
  refs.card.style.setProperty("--glow-primary", frameColor);
  refs.card.style.setProperty("--glow-secondary", frameAltColor);
  refs.card.style.setProperty("--rarity", refs.rarityColor.value);
  refs.card.className = `profile-card ratio-${state.selections.mode} effect-${state.selections.effect}${refs.card.classList.contains("is-hovering") ? " is-hovering" : ""}`;
  const heroAsset = state.artworkDataUrl || skin.asset || hero.asset || "";
  const artLayers = [
    heroAsset ? `url("${heroAsset}") center/cover no-repeat` : "",
    skinStyle,
    skin.style || "",
    hero.style || ""
  ].filter(Boolean);
  refs.heroArt.style.background = artLayers.join(", ");
  if (state.avatarDataUrl) refs.avatarImg.style.background = `url(${state.avatarDataUrl}) center/cover`;
  refs.frameOut.style.borderColor = "transparent";
  refs.frameOut.style.background = frameFill;
  refs.frameOut.style.boxShadow = `0 0 0 2px rgba(255,255,255,.18) inset, 0 0 26px ${frameColor}88`;

  refs.badgeOut.textContent = refs.badges.value;
  refs.badgeOut.style.background = buildSmoothGradient(frameColor, refs.accent.value, 140);
  refs.emblemOut.textContent = refs.emblems.value;

  refs.ignOut.textContent = refs.ign.value || "PLAYER";
  refs.pidOut.textContent = refs.pid.value || "00000000";
  refs.serverOut.textContent = refs.server.value || "0000";
  refs.bioOut.textContent = refs.bio.value || "No status.";
  refs.titleOut.textContent = refs.title.value;
  const rankVisual = rankVisuals[refs.rank.value] || rankVisuals["MYTHIC GLORY"];
  refs.rankOut.textContent = refs.rank.value;
  refs.rankOut.className = `rank-label ${rankVisual.className}`;
  refs.rankIconOut.src = rankVisual.icon;
  refs.rankIconOut.alt = `${refs.rank.value} rank icon`;
  refs.heroOut.textContent = hero.name.toUpperCase();
  refs.skinOut.textContent = skin.name;
  refs.rarityOut.textContent = refs.rarity.value.toUpperCase();

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
  saveUserState();
}


const cropState = { fileKind: "avatar", source: null, image: null, baseScale: 1, zoom: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0, startCropX: 0, startCropY: 0 };

function openCrop(file, kind) {
  const reader = new FileReader();
  reader.onload = () => {
    cropState.fileKind = kind;
    cropState.source = reader.result;
    cropState.image = new Image();
    cropState.image.onload = () => {
      refs.cropTitle.textContent = kind === "avatar" ? "Crop Profile Photo" : "Crop Hero Artwork";
      refs.cropViewport.classList.toggle("artwork", kind === "artwork");
      refs.cropZoom.value = 100;
      refs.cropX.value = 0;
      refs.cropY.value = 0;
      cropState.zoom = 1; cropState.x = 0; cropState.y = 0;
      refs.cropImage.src = cropState.source;
      refs.cropModal.classList.remove("hidden");
      requestAnimationFrame(updateCropPreview);
    };
    cropState.image.src = cropState.source;
  };
  reader.readAsDataURL(file);
}

function cropBoxSize() {
  const rect = refs.cropViewport.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function updateCropPreview() {
  if (!cropState.image?.naturalWidth) return;
  const box = cropBoxSize();
  const coverScale = Math.max(box.width / cropState.image.naturalWidth, box.height / cropState.image.naturalHeight);
  cropState.baseScale = coverScale;
  const scale = coverScale * cropState.zoom;
  const width = cropState.image.naturalWidth * scale;
  const height = cropState.image.naturalHeight * scale;
  refs.cropImage.style.width = `${width}px`;
  refs.cropImage.style.height = `${height}px`;
  refs.cropImage.style.left = `calc(50% + ${cropState.x}px)`;
  refs.cropImage.style.top = `calc(50% + ${cropState.y}px)`;
  refs.cropImage.style.transform = "translate(-50%,-50%)";
}

function applyCrop() {
  if (!cropState.image?.naturalWidth) return;
  const box = cropBoxSize();
  const scale = cropState.baseScale * cropState.zoom;
  const imageW = cropState.image.naturalWidth * scale;
  const imageH = cropState.image.naturalHeight * scale;
  const left = (box.width - imageW) / 2 + cropState.x;
  const top = (box.height - imageH) / 2 + cropState.y;
  const sx = Math.max(0, Math.min(cropState.image.naturalWidth - box.width / scale, -left / scale));
  const sy = Math.max(0, Math.min(cropState.image.naturalHeight - box.height / scale, -top / scale));
  const sw = Math.min(cropState.image.naturalWidth, box.width / scale);
  const sh = Math.min(cropState.image.naturalHeight, box.height / scale);
  // Export the crop at SOURCE resolution, not at the small on-screen
  // crop viewport resolution. The old implementation rendered a ~420px
  // crop and then enlarged it to the 1080x1920 card, which made avatars
  // and artwork visibly soft/blurry.
  const outputW = Math.max(1, Math.round(sw));
  const outputH = Math.max(1, Math.round(sh));
  const canvas = document.createElement("canvas");
  canvas.width = outputW;
  canvas.height = outputH;
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(cropState.image, sx, sy, sw, sh, 0, 0, outputW, outputH);
  // Keep the original crop resolution. Do NOT resize this data URL to the
  // 420px preview size; the card renderer will scale the high-resolution
  // asset when necessary.
  const dataUrl = canvas.toDataURL("image/png");
  if (cropState.fileKind === "avatar") {
    state.avatarDataUrl = dataUrl;
    state.layers.avatar = { x: 0, y: 0, scale: 100, rotate: 0 };
  } else {
    state.artworkDataUrl = dataUrl;
    state.layers.hero = { x: 0, y: 0, scale: 100, rotate: 0 };
  }
  refs.cropModal.classList.add("hidden");
  syncLayerControls();
  render();
}

function wireCropEvents() {
  refs.cropZoom.addEventListener("input", () => { cropState.zoom = Number(refs.cropZoom.value) / 100; updateCropPreview(); });
  refs.cropX.addEventListener("input", () => { cropState.x = Number(refs.cropX.value) * 2; updateCropPreview(); });
  refs.cropY.addEventListener("input", () => { cropState.y = Number(refs.cropY.value) * 2; updateCropPreview(); });
  refs.cropApply.addEventListener("click", applyCrop);
  refs.cropCancel.addEventListener("click", () => refs.cropModal.classList.add("hidden"));
  refs.cropModal.addEventListener("click", (event) => { if (event.target === refs.cropModal) refs.cropModal.classList.add("hidden"); });
  refs.cropViewport.addEventListener("pointerdown", (event) => {
    cropState.dragging = true; cropState.startX = event.clientX; cropState.startY = event.clientY; cropState.startCropX = cropState.x; cropState.startCropY = cropState.y; refs.cropViewport.classList.add("dragging"); refs.cropViewport.setPointerCapture(event.pointerId);
  });
  refs.cropViewport.addEventListener("pointermove", (event) => {
    if (!cropState.dragging) return;
    cropState.x = cropState.startCropX + (event.clientX - cropState.startX);
    cropState.y = cropState.startCropY + (event.clientY - cropState.startY);
    refs.cropX.value = Math.max(-100, Math.min(100, cropState.x / 2));
    refs.cropY.value = Math.max(-100, Math.min(100, cropState.y / 2));
    updateCropPreview();
  });
  const stop = () => { cropState.dragging = false; refs.cropViewport.classList.remove("dragging"); };
  refs.cropViewport.addEventListener("pointerup", stop); refs.cropViewport.addEventListener("pointercancel", stop);
}

function wireEvents() {
  if (uiWired) {
    return;
  }
  uiWired = true;
  wireCropEvents();

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
    });
  });

  refs.hero.addEventListener("change", () => {
    state.selections.heroId = refs.hero.value;
    ensureSelectionsValid();
    paintSkinSelect();
    render();
  });

  refs.role.addEventListener("change", () => {
    state.selections.role = refs.role.value;
    ensureSelectionsValid();
    paintControls();
    render();
  });

  refs.skin.addEventListener("change", () => {
    state.selections.skinId = refs.skin.value;

    // A manually uploaded Hero Artwork is a temporary override. When the
    // user explicitly selects another skin, the preview must immediately
    // switch back to that skin's artwork instead of continuing to use the
    // previous uploaded image. This also prevents stale artwork from
    // surviving through LocalStorage until the cache is cleared.
    state.artworkDataUrl = "";
    state.layers.hero = { x: 0, y: 0, scale: 100, rotate: 0 };

    refs.rarity.value = rarityOptions.includes(getSkin().rarity) ? getSkin().rarity : "Rare";
    render();
    saveUserState();
  });

  refs.rarity.addEventListener("change", () => render());
  ["skinColor1", "skinColor2", "rarityColor"].forEach((id) => refs[id].addEventListener("input", render));
  ["backgroundColor1", "backgroundColor2", "backgroundColor3"].forEach((id) => {
    refs[id].addEventListener("input", () => {
      state.customBackground = true;
      render();
    });
  });
  ["frameMode", "frameColor1", "frameColor2"].forEach((id) => {
    refs[id].addEventListener("input", () => {
      state.customFrame = true;
      render();
    });
    refs[id].addEventListener("change", () => {
      state.customFrame = true;
      render();
    });
  });
  refs.emblems.addEventListener("change", render);
  refs.badges.addEventListener("change", render);

  document.querySelectorAll(".effect-row button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".effect-row button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.selections.effect = button.dataset.effect;
      render();
    });
  });

  refs.activeLayer.addEventListener("change", () => {
    state.activeLayer = refs.activeLayer.value;
    syncLayerControls();
  });

  refs.layerScale.addEventListener("input", () => {
    state.layers[state.activeLayer].scale = Number(refs.layerScale.value);
    applyLayerTransform(state.activeLayer);
  });

  refs.layerRotate.addEventListener("input", () => {
    state.layers[state.activeLayer].rotate = Number(refs.layerRotate.value);
    applyLayerTransform(state.activeLayer);
  });

  refs.mode.addEventListener("change", () => {
    state.selections.mode = refs.mode.value;
    render();
  });

  refs.resetLayout.addEventListener("click", () => {
    state.layers.avatar = { x: 0, y: 0, scale: 100, rotate: 0 };
    state.layers.hero = { x: 0, y: 0, scale: 100, rotate: 0 };
    syncLayerControls();
    render();
  });

  refs.photo.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    openCrop(file, "avatar");
    event.target.value = "";
  });

  refs.artwork.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    openCrop(file, "artwork");
    event.target.value = "";
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
  refs.copyBtn.addEventListener("click", copyConfig);
  refs.exportBtn.addEventListener("click", exportPNG);
  refs.refreshApiBtn.addEventListener("click", refreshApiData);

  enableDragging(refs.avatarLayer, "avatar");
  enableDragging(refs.heroLayer, "hero");
  enableCardHover();
}

function enableCardHover() {
  const reset = () => {
    refs.card.classList.remove("is-hovering");
    refs.card.style.setProperty("--tilt-x", "0deg");
    refs.card.style.setProperty("--tilt-y", "0deg");
  };

  refs.card.addEventListener("pointermove", (event) => {
    const box = refs.card.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    const y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
    const maxTilt = 8;
    refs.card.classList.add("is-hovering");
    refs.card.style.setProperty("--cursor-x", `${x * 100}%`);
    refs.card.style.setProperty("--cursor-y", `${y * 100}%`);
    refs.card.style.setProperty("--tilt-x", `${(0.5 - y) * maxTilt * 2}deg`);
    refs.card.style.setProperty("--tilt-y", `${(x - 0.5) * maxTilt * 2}deg`);
  });
  refs.card.addEventListener("pointerleave", reset);
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) {
    return;
  }
  refs.rank.value = preset.rank;
  refs.title.value = preset.title;
  refs.wr.value = preset.wr;
  refs.matches.value = preset.matches;
  refs.mvp.value = preset.mvp;
  refs.savage.value = preset.savage;
  refs.legendary.value = preset.legendary;

  state.selections.rank = preset.rank;
  state.selections.title = preset.title;
  state.selections.effect = preset.effect;
  state.selections.backgroundId = preset.background;
  state.selections.frameId = preset.frame;
  state.selections.badgeId = preset.badge;
  state.selections.emblemId = preset.emblem;

  refs.accent.value = getItem("backgrounds", preset.background).accent || refs.accent.value;
  document.querySelectorAll(".effect-row button").forEach((button) => {
    button.classList.toggle("active", button.dataset.effect === preset.effect);
  });
  paintControls();
  render();
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomizeProfile() {
  const hero = randomItem(state.manifest.heroes);
  state.selections.heroId = hero.id;
  state.selections.role = hero.roles?.[0] || "Assassin";
  state.selections.skinId = randomItem(hero.skins).id;
  state.selections.backgroundId = randomItem(state.manifest.backgrounds).id;
  state.selections.frameId = randomItem(state.manifest.frames).id;
  state.selections.emblemId = randomItem(state.manifest.emblems).id;
  state.selections.badgeId = randomItem(state.manifest.badges).id;
  state.selections.effect = randomItem(["none", "glow", "scan", "particles"]);
  state.selections.title = randomItem(state.manifest.titles);
  state.selections.rank = randomItem(state.manifest.ranks);

  refs.title.value = state.selections.title;
  refs.rank.value = state.selections.rank;
  refs.wr.value = Math.floor(Math.random() * 35) + 60;
  refs.matches.value = Math.floor(Math.random() * 4500) + 500;
  refs.mvp.value = Math.floor(Math.random() * 700) + 80;
  refs.savage.value = Math.floor(Math.random() * 60) + 4;
  refs.legendary.value = Math.floor(Math.random() * 1200) + 80;
  refs.emblemLevel.value = Math.floor(Math.random() * 40) + 20;
  refs.accent.value = getItem("backgrounds", state.selections.backgroundId).accent || refs.accent.value;

  document.querySelectorAll(".effect-row button").forEach((button) => {
    button.classList.toggle("active", button.dataset.effect === state.selections.effect);
  });

  paintControls();
  render();
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
    identity: {
      ign: refs.ign.value,
      playerId: refs.pid.value,
      server: refs.server.value,
      bio: refs.bio.value,
      title: refs.title.value,
      rank: refs.rank.value
    },
    selections: state.selections,
    stats: {
      wr: Number(refs.wr.value || 0),
      matches: Number(refs.matches.value || 0),
      mvp: Number(refs.mvp.value || 0),
      savage: Number(refs.savage.value || 0),
      legendary: Number(refs.legendary.value || 0),
      emblemLevel: Number(refs.emblemLevel.value || 0)
    },
    layers: state.layers,
    api: state.apiStatus
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
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    window.alert(`Export gagal: ${error.message}`);
  } finally {
    refs.exportBtn.disabled = false;
    refs.exportBtn.textContent = "Export PNG";
  }
}

async function elementToPng(element, mode) {
  // Make sure the same web fonts used by the live preview are ready before
  // measuring/serializing. This prevents export-only font fallback and text wrapping.
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (_error) {}
  }

  const outputSize = {
    story: { width: 1080, height: 1920 },
    feed: { width: 1080, height: 1350 },
    card: { width: 900, height: 1200 }
  }[mode] || { width: 1080, height: 1920 };

  // Export from the exact live-preview geometry, then rasterize directly
  // at the final PNG resolution. Never export a screenshot-sized bitmap.
  const rect = element.getBoundingClientRect();
  const sourceW = Math.max(1, Math.round(element.clientWidth || rect.width));
  const sourceH = Math.max(1, Math.round(element.clientHeight || rect.height));

  const clone = element.cloneNode(true);
  clone.style.width = `${sourceW}px`;
  clone.style.height = `${sourceH}px`;
  clone.style.aspectRatio = "auto";
  clone.style.margin = "0";
  clone.style.position = "relative";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.setProperty("--look-y", "0deg");
  clone.style.transform = "none";
  clone.style.transition = "none";
  clone.style.animation = "none";
  clone.style.overflow = "hidden";
  clone.style.boxSizing = "border-box";
  clone.classList.remove("is-hovering");

  // Copy the rendered styles so the exported card matches the live preview.
  inlineStyles(element, clone);

  // Re-apply export-safe root geometry after computed styles are copied.
  clone.style.width = `${sourceW}px`;
  clone.style.height = `${sourceH}px`;
  clone.style.position = "relative";
  clone.style.margin = "0";
  clone.style.setProperty("--look-y", "0deg");
  clone.style.transform = "none";
  clone.style.transition = "none";
  clone.style.animation = "none";
  clone.style.overflow = "hidden";
  clone.style.boxSizing = "border-box";
  clone.style.borderRadius = getComputedStyle(element).borderRadius || "34px";

  // Keep the text geometry identical to the live preview. Chromium's
  // foreignObject renderer can otherwise reflow long labels differently.
  const nowrapSelectors = [
    ".rank-label",
    ".top-line > #titleOut",
    ".hero-copy-line",
    ".hero-copy-line > #skinOut",
    ".hero-copy-line > #rarityOut",
    ".card-footer .footer-brand span"
  ];
  nowrapSelectors.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((node) => {
      node.style.whiteSpace = "nowrap";
      node.style.wordBreak = "normal";
      node.style.overflowWrap = "normal";
      node.style.flexWrap = "nowrap";
    });
  });
  const exportedHeroLine = clone.querySelector(".hero-copy-line");
  if (exportedHeroLine) {
    exportedHeroLine.style.display = "flex";
    exportedHeroLine.style.flexWrap = "nowrap";
    exportedHeroLine.style.whiteSpace = "nowrap";
  }

  // IMPORTANT: Hero/skin artwork is a CSS background-image, not an <img>.
  // The previous exporter only inlined <img> elements, so remote skin artwork
  // could remain external and disappear inside the SVG foreignObject.
  await inlineImagesAsDataUrls(clone);
  await inlineBackgroundImagesAsDataUrls(clone);

  const serializer = new XMLSerializer();
  const html = serializer.serializeToString(clone);

  // Clip the entire foreignObject to the card's rounded shape. This prevents
  // Chromium from leaving square/transparent corner artifacts around the PNG.
  const radius = 34;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${outputSize.width}" height="${outputSize.height}" viewBox="0 0 ${sourceW} ${sourceH}">
    <defs>
      <clipPath id="cardClip" clipPathUnits="userSpaceOnUse">
        <rect x="0" y="0" width="${sourceW}" height="${sourceH}" rx="${radius}" ry="${radius}"/>
      </clipPath>
    </defs>
    <rect width="${sourceW}" height="${sourceH}" fill="transparent"/>
    <foreignObject x="0" y="0" width="${sourceW}" height="${sourceH}" clip-path="url(#cardClip)">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${sourceW}px;height:${sourceH}px;overflow:hidden;margin:0;padding:0;border-radius:${radius}px;">
        ${html}
      </div>
    </foreignObject>
  </svg>`;

  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const image = await loadImage(url);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;
  const context = canvas.getContext("2d", { alpha: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, canvas.width, canvas.height);

  // SVG viewBox scales the complete card directly to the requested output.
  // Transparent canvas outside the rounded clip remains transparent.
  context.drawImage(image, 0, 0, outputSize.width, outputSize.height);

  return canvas.toDataURL("image/png");
}

async function inlineImagesAsDataUrls(root) {
  const images = [...root.querySelectorAll("img")];
  await Promise.all(images.map(async (img) => {
    const src = img.getAttribute("src");
    if (!src || src.startsWith("data:")) return;
    try {
      const response = await fetch(new URL(src, document.baseURI).href, { mode: "cors" });
      if (!response.ok) return;
      const blob = await response.blob();
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      img.setAttribute("src", dataUrl);
    } catch (_error) {
      // Keep original source; local/data images continue to render normally.
    }
  }));
}

async function inlineBackgroundImagesAsDataUrls(root) {
  // CSS backgrounds are where skin artwork normally lives. Convert every
  // url(...) found in inline/computed background-image declarations to a
  // data URL before serializing the card into SVG.
  const nodes = [root, ...root.querySelectorAll("*")];
  const jobs = [];

  for (const node of nodes) {
    const style = node.getAttribute("style");
    if (!style || !/url\(/i.test(style)) continue;

    const rewritten = await replaceCssUrlsWithDataUrls(style);
    if (rewritten !== style) node.setAttribute("style", rewritten);
  }

  // Some backgrounds are represented only by computed styles. Copy the
  // computed background image into inline style, then inline any URLs.
  for (const node of nodes) {
    const computed = getComputedStyle(node);
    const bg = computed.backgroundImage;
    if (!bg || bg === "none" || !/url\(/i.test(bg)) continue;

    const rewritten = await replaceCssUrlsWithDataUrls(bg);
    if (rewritten !== bg) {
      const current = node.getAttribute("style") || "";
      node.setAttribute("style", `${current};background-image:${rewritten};`);
    }
  }
}

async function replaceCssUrlsWithDataUrls(cssText) {
  const matches = [];
  const regex = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
  let match;
  while ((match = regex.exec(cssText))) {
    const rawUrl = match[2];
    if (!rawUrl || rawUrl.startsWith("data:") || rawUrl.startsWith("blob:")) continue;
    matches.push({ full: match[0], url: rawUrl });
  }

  if (!matches.length) return cssText;

  let result = cssText;
  for (const item of matches) {
    try {
      const absoluteUrl = new URL(item.url, document.baseURI).href;
      const response = await fetch(absoluteUrl, { mode: "cors" });
      if (!response.ok) continue;

      const blob = await response.blob();
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      result = result.split(item.full).join(`url("${dataUrl}")`);
    } catch (_error) {
      // If an asset server does not permit CORS, leave the URL untouched.
      // Same-origin/local assets and GitHub raw assets normally succeed.
    }
  }

  return result;
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

async function loadLocalData() {
  // LocalStorage is authoritative for Hero/Skin catalog. The embedded catalog
  // seeds it synchronously on first run, so the editor never depends on API.
  const seeded = seedEmbeddedCatalogToStorage();
  const cachedCatalog = readStorage(STORAGE_KEYS.catalog) || seeded;

  if (cachedCatalog?.heroes?.length) {
    state.manifest = cloneData(cachedCatalog);
  } else {
    // First-run fallback: fetch the same files used by the original working build.
    const [manifestFromFile, skinCatalogFromFile] = await Promise.all([
      fetchLocalManifest(),
      fetchLocalSkinCatalog()
    ]);
    const merged = applyHeroCatalog(mergeSkinCatalog({
      ...fallbackManifest,
      ...manifestFromFile,
      backgrounds: manifestFromFile?.backgrounds?.length ? manifestFromFile.backgrounds : fallbackManifest.backgrounds,
      frames: manifestFromFile?.frames?.length ? manifestFromFile.frames : fallbackManifest.frames,
      emblems: manifestFromFile?.emblems?.length ? manifestFromFile.emblems : fallbackManifest.emblems,
      badges: manifestFromFile?.badges?.length ? manifestFromFile.badges : fallbackManifest.badges,
      titles: manifestFromFile?.titles?.length ? manifestFromFile.titles : fallbackManifest.titles,
      ranks: manifestFromFile?.ranks?.length ? manifestFromFile.ranks : fallbackManifest.ranks,
      heroes: manifestFromFile?.heroes?.length ? manifestFromFile.heroes : []
    }, skinCatalogFromFile));
    state.manifest = merged;
    writeStorage(STORAGE_KEYS.catalog, merged);
    writeStorage(STORAGE_KEYS.heroes, merged.heroes.map(({ id, name, roles }) => ({ id, name, roles })));
    writeStorage(STORAGE_KEYS.skinsByHero, Object.fromEntries(merged.heroes.map((hero) => [hero.id, hero.skins || []])));
    writeStorage(STORAGE_KEYS.manifest, merged);
  }

  ensureSelectionsValid();
  syncStyleInputsFromSelections();
  paintControls();
  syncLayerControls();
  updateApiStatus({
    mode: "disabled",
    provider: "LocalStorage catalog",
    sourceId: "local-storage",
    heroCount: state.manifest.heroes.length,
    skinCount: countSkins(state.manifest),
    emblemCount: state.manifest.emblems.length,
    message: "Hero & Skin siap dari LocalStorage. Remote API berjalan di background.",
    checkedAt: new Date().toISOString()
  });
  render();
}

async function refreshApiData({ background = true } = {}) {
  refs.refreshApiBtn.disabled = true;
  refs.refreshApiBtn.textContent = "Refreshing...";

  const runRemote = async () => {
    updateApiStatus({
      mode: "idle",
      provider: "Remote API",
      sourceId: "remote",
      heroCount: state.manifest.heroes.length,
      skinCount: countSkins(state.manifest),
      emblemCount: state.manifest.emblems.length,
      message: "Remote API sedang disinkronkan di background...",
      checkedAt: new Date().toISOString()
    });

    const localManifest = state.manifest;
    let apiResult = null;
    try {
      if (window.MLBBApi?.enrichManifest) {
        apiResult = await window.MLBBApi.enrichManifest(localManifest);
      }
    } catch (error) {
      apiResult = {
        manifest: localManifest,
        status: { mode: "fallback", provider: "LocalStorage cache", message: `Remote error: ${error.message}` }
      };
    }

    if (apiResult?.status) {
      // Remote API is enrichment/status only. Never replace the working local
      // Hero/Skin catalog with an incomplete remote response.
      updateApiStatus({
        ...apiResult.status,
        provider: `${apiResult.status.provider || "Remote API"} + LocalStorage`,
        heroCount: state.manifest.heroes.length,
        skinCount: countSkins(state.manifest)
      });
    }

    refs.refreshApiBtn.disabled = false;
    refs.refreshApiBtn.textContent = "Refresh API";
  };

  if (background) {
    void runRemote();
  } else {
    await runRemote();
  }
}

async function init() {
  cacheRefs();
  wireEvents();

  // Seed the full catalog into LocalStorage before restoring user state.
  seedEmbeddedCatalogToStorage();
  const cachedCatalog = readStorage(STORAGE_KEYS.catalog);
  if (cachedCatalog?.heroes?.length) {
    state.manifest = cloneData(cachedCatalog);
  }

  restoreUserState();
  ensureSelectionsValid();
  syncStyleInputsFromSelections();
  paintControls();
  syncLayerControls();
  updateApiStatus({
    mode: "disabled",
    provider: "LocalStorage",
    sourceId: "local-storage",
    heroCount: state.manifest.heroes.length,
    skinCount: countSkins(state.manifest),
    emblemCount: state.manifest.emblems.length,
    message: "Katalog Hero/Skin lokal siap. API remote berjalan di background.",
    checkedAt: new Date().toISOString()
  });
  render();

  // Only the first-ever bootstrap may fetch local JSON files if embedding is missing.
  if (!cachedCatalog?.heroes?.length) {
    void loadLocalData();
  }
  void refreshApiData({ background: true });
}
init();
