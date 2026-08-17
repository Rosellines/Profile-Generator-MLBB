const $ = (id) => document.getElementById(id);

const rarityOptions = ["Mythic", "Legend", "Epic", "Rare", "Collector", "Special"];
const effectOptions = [
  { id: "none", name: "None" },
  { id: "glow", name: "Glow" },
  { id: "scan", name: "Scan" },
  { id: "particles", name: "Particles" }
];
const roleOptions = ["Assassin", "Fighter", "Marksman", "Jungler", "Mage", "Support", "Tank"];
const roleHeroMap = {
  Assassin: ["Aamon", "Alucard", "Arlott", "Benedetta", "Fanny", "Gusion", "Hanzo", "Harley", "Hayabusa", "Helcurt", "Hirara", "Joy", "Julian", "Kadita", "Karina", "Lancelot", "Lesley", "Ling", "Mathilda", "Natalia", "Nolan", "Paquito", "Saber", "Selena", "Sora", "Suyou", "Yi Sun-shin", "Yin", "Zilong"],
  Fighter: ["Aldous", "Alpha", "Alucard", "Arlott", "Aulus", "Badang", "Balmond", "Bane", "Barats", "Chou", "Cici", "Dyrroth", "Fredrinn", "Freya", "Gatotkaca", "Grock", "Guinevere", "Hilda", "Jawhead", "Julian", "Kalea", "Khaleed", "Lapu-Lapu", "Leomord", "Lukas", "Martis", "Masha", "Minsitthar", "Paquito", "Phoveus", "Roger", "Ruby", "Silvanna", "Sora", "Sun", "Suyou", "Terizla", "Thamuz", "X.Borg", "Yin", "Yu Zhong", "Zilong"],
  Marksman: ["Beatrix", "Brody", "Bruno", "Claude", "Clint", "Edith", "Granger", "Hanabi", "Irithel", "Ixia", "Karrie", "Kimmy", "Layla", "Lesley", "Melissa", "Miya", "Moskov", "Natan", "Obsidia", "Popol and Kupa", "Roger", "Wanwan", "Yi Sun-shin"],
  Jungler: ["Aamon", "Alucard", "Balmond", "Fanny", "Fredrinn", "Gusion", "Hanzo", "Harley", "Hayabusa", "Helcurt", "Julian", "Karina", "Lancelot", "Ling", "Nolan", "Paquito", "Roger", "Saber", "Suyou", "Yi Sun-shin", "Yin"],
  Mage: ["Alice", "Bane", "Cecilion", "Chang'e", "Cyclops", "Eudora", "Esmeralda", "Faramis", "Gord", "Harley", "Harith", "Kadita", "Kagura", "Kimmy", "Lunox", "Luo Yi", "Lylia", "Nana", "Novaria", "Odette", "Pharsa", "Selena", "Valentina", "Valir", "Vexana", "Xavier", "Yve", "Zetian", "Zhask", "Zhuxin"],
  Support: ["Angela", "Carmilla", "Chip", "Diggie", "Estes", "Faramis", "Floryn", "Johnson", "Kaja", "Kalea", "Lolita", "Marcel", "Mathilda", "Minotaur", "Rafaela"],
  Tank: ["Alice", "Atlas", "Barats", "Baxia", "Belerick", "Carmilla", "Chip", "Edith", "Esmeralda", "Fredrinn", "Franco", "Gatotkaca", "Gloo", "Grock", "Hilda", "Hylos", "Johnson", "Khufra", "Lolita", "Masha", "Minotaur", "Terizla", "Tigreal", "Uranus"]
};
const defaultSkinTemplate = {
  id: "default-skin",
  name: "Default Skin",
  rarity: "Special",
  colors: ["#9e89ff", "#ffffff", "#7456ff"]
};

const fallbackManifest = {
  version: 3,
  titles: ["Assassin Hunter", "Marksman Sharpshooter", "Fighter Warbringer", "Mage Arcanist", "Tank Juggernaut", "Support Celestial", "Assassin Main", "Fighter Main", "Marksman Main", "Jungler Main", "Mage Main", "Support Main", "Tanker Main"],
  ranks: ["MYTHIC GLORY", "MYTHICAL IMMORTAL", "MYTHIC", "LEGEND", "EPIC", "GRAND MASTER", "MASTER"],
  backgrounds: [
    { id: "starlight", name: "Starlight Rift", accent: "#f3c969", colors: ["#173761", "#0b1321", "#613117"], style: "radial-gradient(circle at 72% 18%,rgba(255,255,255,.26),transparent 20%),linear-gradient(145deg,#173761 0%,#0b1321 52%,#613117 100%)" },
    { id: "neon", name: "Neon District", accent: "#ff77c8", colors: ["#401955", "#0c1323", "#2d6a6d"], style: "radial-gradient(circle at 72% 20%,rgba(255,255,255,.28),transparent 18%),linear-gradient(150deg,#401955 0%,#0c1323 55%,#2d6a6d 100%)" },
    { id: "jade", name: "Jade Temple", accent: "#74f0b3", colors: ["#173f48", "#0b1321", "#2c6135"], style: "radial-gradient(circle at 68% 18%,rgba(255,255,255,.24),transparent 22%),linear-gradient(145deg,#173f48 0%,#0b1321 56%,#2c6135 100%)" },
    { id: "ember", name: "Ember Throne", accent: "#ff9c67", colors: ["#482719", "#0b1321", "#6c2222"], style: "radial-gradient(circle at 74% 20%,rgba(255,255,255,.22),transparent 18%),linear-gradient(145deg,#482719 0%,#0b1321 54%,#6c2222 100%)" },
    { id: "aurora", name: "Aurora Pulse", accent: "#7de3ff", colors: ["#1b3661", "#09131f", "#1b5b74"], style: "radial-gradient(circle at 70% 18%,rgba(255,255,255,.28),transparent 18%),linear-gradient(145deg,#1b3661 0%,#09131f 54%,#1b5b74 100%)" },
    { id: "sunset", name: "Sunset Forge", accent: "#ffb36b", colors: ["#6a2f1d", "#1b1320", "#b6572f"], style: "radial-gradient(circle at 72% 20%,rgba(255,255,255,.24),transparent 18%),linear-gradient(145deg,#6a2f1d 0%,#1b1320 52%,#b6572f 100%)" }
  ],
  frames: [
    { id: "royal", name: "Royal Gold", styleType: "solid", primary: "#f3c969", secondary: "#f3c969" },
    { id: "frost", name: "Frost", styleType: "gradient", primary: "#9cd9ff", secondary: "#e8f8ff" },
    { id: "void", name: "Void", styleType: "gradient", primary: "#ca95ff", secondary: "#7f5cff" },
    { id: "crimson", name: "Crimson", styleType: "gradient", primary: "#ff8b8b", secondary: "#ffb774" },
    { id: "emerald", name: "Emerald", styleType: "gradient", primary: "#82f1b8", secondary: "#3de2ff" },
    { id: "pearl", name: "Pearl", styleType: "solid", primary: "#f4f5ff", secondary: "#f4f5ff" }
  ],
  emblems: [
    { id: "best-carry", name: "Best Carry", token: "Best Carry" },
    { id: "best-initiator", name: "Best Initiator", token: "Best Initiator" },
    { id: "best-finisher", name: "Best Finisher", token: "Best Finisher" },
    { id: "best-roamer", name: "Best Roamer", token: "Best Roamer" },
    { id: "best-jungler", name: "Best Jungler", token: "Best Jungler" },
    { id: "best-laner", name: "Best Laner", token: "Best Laner" },
    { id: "best-tanker", name: "Best Tanker", token: "Best Tanker" },
    { id: "best-damage-dealer", name: "Best Damage Dealer", token: "Best Damage Dealer" },
    { id: "best-burst", name: "Best Burst", token: "Best Burst" },
    { id: "best-dps", name: "Best DPS", token: "Best DPS" },
    { id: "best-assassin", name: "Best Assassin", token: "Best Assassin" },
    { id: "best-duelist", name: "Best Duelist", token: "Best Duelist" },
    { id: "best-pusher", name: "Best Pusher", token: "Best Pusher" }
  ],
  badges: [
    { id: "mvp", name: "MVP" },
    { id: "legendary", name: "Legendary" },
    { id: "savage", name: "Savage" },
    { id: "comeback-king", name: "Comeback King" },
    { id: "victory-maker", name: "Victory Maker" },
    { id: "godlike", name: "Godlike" }
  ],
  heroes: [
    {
      id: "gusion",
      name: "Gusion",
      style: "radial-gradient(circle at 56% 45%,rgba(116,86,255,.95),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.32) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)",
      skins: [
        { id: "cosmic-gleam", name: "Cosmic Gleam", rarity: "Mythic", colors: ["#9e89ff", "#ffffff", "#7456ff"], style: "radial-gradient(circle at 58% 42%,rgba(158,137,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.36) 43%,transparent 56%)" },
        { id: "deaths-scythe", name: "Death's Scythe", rarity: "Epic", colors: ["#7cd3ff", "#ffffff", "#5ca9ff"], style: "radial-gradient(circle at 58% 42%,rgba(124,211,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.34) 43%,transparent 56%)" },
        { id: "venom", name: "Venom", rarity: "Rare", colors: ["#57ffa0", "#effff7", "#2dd47d"], style: "radial-gradient(circle at 58% 42%,rgba(87,255,160,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.3) 43%,transparent 56%)" }
      ]
    },
    {
      id: "fanny",
      name: "Fanny",
      style: "radial-gradient(circle at 56% 45%,rgba(105,241,255,.95),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.28) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)",
      skins: [
        { id: "galactic-starhawk", name: "Galactic Starhawk", rarity: "Epic", colors: ["#78ebff", "#eefeff", "#38c2ff"], style: "radial-gradient(circle at 58% 42%,rgba(120,235,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.38) 43%,transparent 56%)" },
        { id: "blade-of-kibou", name: "Blade of Kibou", rarity: "Mythic", colors: ["#ffc978", "#fff5de", "#ff8a64"], style: "radial-gradient(circle at 58% 42%,rgba(255,201,120,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.35) 43%,transparent 56%)" }
      ]
    },
    {
      id: "ling",
      name: "Ling",
      style: "radial-gradient(circle at 56% 45%,rgba(197,223,255,.95),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.3) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)",
      skins: [
        { id: "night-shade", name: "Night Shade", rarity: "Epic", colors: ["#dfe6ff", "#ffffff", "#8db3ff"], style: "radial-gradient(circle at 58% 42%,rgba(223,230,255,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.33) 43%,transparent 56%)" },
        { id: "lord-shen", name: "Lord Shen", rarity: "Rare", colors: ["#ffc46f", "#fff7ea", "#ff9c42"], style: "radial-gradient(circle at 58% 42%,rgba(255,196,111,1),transparent 34%),linear-gradient(125deg,transparent 18%,rgba(255,255,255,.36) 43%,transparent 56%)" }
      ]
    }
  ]
};

const presets = {
  mythic: { rank: "MYTHIC GLORY", title: "Mythic Grinder", wr: 87, matches: 2431, mvp: 318, savage: 27, legendary: 501, effect: "glow", background: "starlight", frame: "royal", badge: "mvp", emblem: "best-carry" },
  collector: { rank: "MYTHICAL IMMORTAL", title: "Collector Hunter", wr: 92, matches: 1732, mvp: 402, savage: 33, legendary: 622, effect: "particles", background: "neon", frame: "void", badge: "legendary", emblem: "best-assassin" },
  og: { rank: "LEGEND", title: "OG", wr: 74, matches: 5210, mvp: 260, savage: 14, legendary: 844, effect: "scan", background: "jade", frame: "frost", badge: "victory-maker", emblem: "best-roamer" },
  whale: { rank: "MYTHICAL IMMORTAL", title: "Whale Energy", wr: 96, matches: 3611, mvp: 701, savage: 49, legendary: 1182, effect: "glow", background: "ember", frame: "royal", badge: "godlike", emblem: "best-damage-dealer" }
};

const state = {
  manifest: fallbackManifest,
  apiStatus: null,
  selections: {
    role: "Assassin",
    heroId: fallbackManifest.heroes[0].id,
    skinId: fallbackManifest.heroes[0].skins[0].id,
    rarity: fallbackManifest.heroes[0].skins[0].rarity,
    backgroundId: fallbackManifest.backgrounds[0].id,
    frameId: fallbackManifest.frames[0].id,
    frameStyle: fallbackManifest.frames[0].styleType,
    emblemId: fallbackManifest.emblems[0].id,
    badgeId: fallbackManifest.badges[0].id,
    effect: "none",
    title: fallbackManifest.titles[0],
    rank: fallbackManifest.ranks[0],
    mode: "story"
  },
  custom: {
    skinPrimary: fallbackManifest.heroes[0].skins[0].colors[0],
    skinSecondary: fallbackManifest.heroes[0].skins[0].colors[1],
    skinGlow: fallbackManifest.heroes[0].skins[0].colors[2],
    bgPrimary: fallbackManifest.backgrounds[0].colors[0],
    bgSecondary: fallbackManifest.backgrounds[0].colors[1],
    bgAccent: fallbackManifest.backgrounds[0].colors[2],
    framePrimary: fallbackManifest.frames[0].primary,
    frameSecondary: fallbackManifest.frames[0].secondary
  },
  layers: {
    avatar: { x: 0, y: 0, scale: 100, rotate: 0 },
    hero: { x: 0, y: 0, scale: 100, rotate: 0 }
  },
  activeLayer: "avatar"
};

const refs = {};
let uiWired = false;
const cardTiltState = { rotateX: 0, rotateY: 0 };

function getBackgroundOptions() {
  return [...state.manifest.backgrounds, { id: "custom", name: "Custom Blend", accent: refs.accent?.value || "#f3c969" }];
}

function getFrameOptions() {
  return [...state.manifest.frames, { id: "custom", name: "Custom Frame", styleType: state.selections.frameStyle, primary: state.custom.framePrimary, secondary: state.custom.frameSecondary }];
}

async function fetchLocalManifest() {
  try {
    const response = await fetch("manifest.json", { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    return fallbackManifest;
  }
}

function cacheRefs() {
  [
    "ign", "pid", "server", "bio", "title", "rank", "photo", "role", "hero", "skin", "rarity", "backgrounds",
    "frames", "activeLayer", "layerScale", "layerRotate", "accent", "mode", "wr", "matches", "mvp",
    "savage", "legendary", "emblemLevel", "resetLayout", "presetBtn", "randomBtn", "copyBtn", "exportBtn",
    "closeModal", "modal", "card", "backgroundLayer", "heroArt", "avatarImg", "frameOut", "badgeOut", "ignOut",
    "pidOut", "serverOut", "bioOut", "titleOut", "rankOut", "heroOut", "skinOut", "rarityOut", "emblemOut",
    "wrOut", "matchesOut", "mvpOut", "savageOut", "legendaryOut", "emblemLevelOut", "modeOut", "dragHint",
    "heroLayer", "avatarLayer", "apiBadge", "apiStatusText", "apiSourceText", "refreshApiBtn", "skinColorPrimary",
    "skinColorSecondary", "skinColorGlow", "bgColorPrimary", "bgColorSecondary", "bgColorAccent", "frameStyle",
    "frameColorPrimary", "frameColorSecondary", "emblem", "badge", "effect"
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

function slugifyName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getRoleLabel(role) {
  return role === "Tank" ? "Tanker" : role;
}

function buildHeroRoleIndex() {
  const index = {};
  Object.entries(roleHeroMap).forEach(([role, heroes]) => {
    heroes.forEach((heroName) => {
      const key = slugifyName(heroName);
      index[key] = index[key] || [];
      if (!index[key].includes(role)) {
        index[key].push(role);
      }
    });
  });
  return index;
}

const heroRoleIndex = buildHeroRoleIndex();

function createPlaceholderHero(name, roles = []) {
  return {
    id: slugifyName(name),
    name,
    roles,
    style: "radial-gradient(circle at 56% 45%,rgba(116,86,255,.95),transparent 34%),linear-gradient(135deg,transparent 20%,rgba(255,255,255,.32) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)",
    skins: [
      {
        ...defaultSkinTemplate,
        id: `${slugifyName(name)}-default-skin`
      }
    ]
  };
}

function getHeroesForRole(role = state.selections.role) {
  const roleKey = roleOptions.includes(role) ? role : roleOptions[0];
  const heroIds = new Set((roleHeroMap[roleKey] || []).map(slugifyName));
  const heroes = state.manifest.heroes.filter((hero) => heroIds.has(hero.id));
  return heroes.length ? heroes : state.manifest.heroes;
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

function getSelectedFrame() {
  return state.selections.frameId === "custom"
    ? { id: "custom", name: "Custom Frame", styleType: state.selections.frameStyle, primary: state.custom.framePrimary, secondary: state.custom.frameSecondary }
    : getItem("frames", state.selections.frameId);
}

function getSelectedBackground() {
  return state.selections.backgroundId === "custom"
    ? { id: "custom", name: "Custom Blend", accent: refs.accent.value, colors: [state.custom.bgPrimary, state.custom.bgSecondary, state.custom.bgAccent] }
    : getItem("backgrounds", state.selections.backgroundId);
}

function normalizeFrame(frame) {
  return {
    ...frame,
    styleType: frame.styleType || "solid",
    primary: frame.primary || frame.color || "#f3c969",
    secondary: frame.secondary || frame.color || frame.primary || "#f3c969"
  };
}

function normalizeSkin(skin) {
  return {
    ...skin,
    rarity: skin.rarity || "Epic",
    colors: skin.colors?.length ? skin.colors : ["#9e89ff", "#ffffff", "#7456ff"]
  };
}

function ensureSelectionsValid() {
  if (!state.manifest.heroes?.length) {
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

  state.manifest.frames = state.manifest.frames.map(normalizeFrame);
  state.manifest.titles = Array.from(new Set([
    ...state.manifest.titles,
    ...roleOptions.map((role) => `${getRoleLabel(role)} Main`)
  ]));
  state.manifest.heroes = state.manifest.heroes.map((hero) => ({
    ...hero,
    roles: hero.roles?.length ? hero.roles : heroRoleIndex[hero.id] || [],
    skins: (hero.skins?.length ? hero.skins : fallbackManifest.heroes[0].skins).map(normalizeSkin)
  }));

  Object.entries(roleHeroMap).forEach(([role, heroNames]) => {
    heroNames.forEach((heroName) => {
      const heroId = slugifyName(heroName);
      if (!state.manifest.heroes.some((hero) => hero.id === heroId)) {
        state.manifest.heroes.push(createPlaceholderHero(heroName, heroRoleIndex[heroId] || [role]));
      }
    });
  });

  state.manifest.heroes.sort((a, b) => a.name.localeCompare(b.name));

  if (!roleOptions.includes(state.selections.role)) {
    state.selections.role = roleOptions[0];
  }

  const heroesForRole = getHeroesForRole(state.selections.role);

  if (!heroesForRole.some((hero) => hero.id === state.selections.heroId)) {
    state.selections.heroId = heroesForRole[0]?.id || state.manifest.heroes[0].id;
  }

  const hero = getHero();
  if (!hero.skins.some((skin) => skin.id === state.selections.skinId)) {
    state.selections.skinId = hero.skins[0].id;
  }

  if (!getBackgroundOptions().some((item) => item.id === state.selections.backgroundId)) {
    state.selections.backgroundId = state.manifest.backgrounds[0].id;
  }
  if (!getFrameOptions().some((item) => item.id === state.selections.frameId)) {
    state.selections.frameId = state.manifest.frames[0].id;
  }
  if (!state.manifest.emblems.some((item) => item.id === state.selections.emblemId)) {
    state.selections.emblemId = state.manifest.emblems[0].id;
  }
  if (!state.manifest.badges.some((item) => item.id === state.selections.badgeId)) {
    state.selections.badgeId = state.manifest.badges[0].id;
  }
  if (!effectOptions.some((item) => item.id === state.selections.effect)) {
    state.selections.effect = "none";
  }
  if (!state.manifest.titles.includes(state.selections.title)) {
    state.selections.title = state.manifest.titles[0];
  }
  if (!state.manifest.ranks.includes(state.selections.rank)) {
    state.selections.rank = state.manifest.ranks[0];
  }
  if (!rarityOptions.includes(state.selections.rarity)) {
    state.selections.rarity = normalizeSkin(getSkin()).rarity;
  }
}

function syncSkinCustomizationFromSkin() {
  const skin = normalizeSkin(getSkin());
  state.selections.rarity = skin.rarity;
  state.custom.skinPrimary = skin.colors[0];
  state.custom.skinSecondary = skin.colors[1];
  state.custom.skinGlow = skin.colors[2];
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
  if (background.colors?.length) {
    [state.custom.bgPrimary, state.custom.bgSecondary, state.custom.bgAccent] = background.colors;
    refs.bgColorPrimary.value = state.custom.bgPrimary;
    refs.bgColorSecondary.value = state.custom.bgSecondary;
    refs.bgColorAccent.value = state.custom.bgAccent;
  }
}

function syncFrameCustomization(frameId = state.selections.frameId) {
  if (frameId === "custom") {
    return;
  }
  const frame = normalizeFrame(getItem("frames", frameId));
  state.selections.frameStyle = frame.styleType;
  state.custom.framePrimary = frame.primary;
  state.custom.frameSecondary = frame.secondary;
  refs.frameStyle.value = state.selections.frameStyle;
  refs.frameColorPrimary.value = state.custom.framePrimary;
  refs.frameColorSecondary.value = state.custom.frameSecondary;
}

function buildBackgroundStyle(background) {
  if (background.id !== "custom" && background.style) {
    return background.style;
  }
  return [
    `radial-gradient(circle at 72% 18%, ${hexToRgba(state.custom.bgAccent, 0.42)}, transparent 22%)`,
    `linear-gradient(145deg, ${state.custom.bgPrimary} 0%, ${state.custom.bgSecondary} 52%, ${state.custom.bgAccent} 100%)`
  ].join(",");
}

function buildSkinStyle() {
  return [
    `radial-gradient(circle at 58% 42%, ${hexToRgba(state.custom.skinGlow, 1)}, transparent 34%)`,
    `linear-gradient(125deg, transparent 18%, ${hexToRgba(state.custom.skinSecondary, 0.38)} 43%, transparent 56%)`,
    `linear-gradient(160deg, ${hexToRgba(state.custom.skinSecondary, 0.18)}, rgba(255,255,255,0) 34%)`,
    `radial-gradient(circle at 54% 48%, ${hexToRgba(state.custom.skinPrimary, 0.98)}, transparent 36%)`
  ].join(",");
}

function buildFrameCss(frame) {
  const normalized = normalizeFrame(frame);
  const frameFill = normalized.styleType === "gradient"
    ? `linear-gradient(135deg, ${normalized.primary}, ${normalized.secondary})`
    : normalized.primary;
  const frameShadowColor = normalized.styleType === "gradient" ? normalized.secondary : normalized.primary;

  return {
    fill: frameFill,
    shadow: frameShadowColor
  };
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const int = parseInt(normalized, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function paintControls() {
  fillSelect(refs.title, state.manifest.titles);
  fillSelect(refs.rank, state.manifest.ranks);
  fillSelect(refs.role, roleOptions, (role) => role, (role) => getRoleLabel(role));
  fillSelect(refs.hero, getHeroesForRole(), (hero) => hero.id, (hero) => hero.name);
  fillSelect(refs.rarity, rarityOptions);
  fillSelect(refs.emblem, state.manifest.emblems, (item) => item.id, (item) => item.name);
  fillSelect(refs.badge, state.manifest.badges, (item) => item.id, (item) => item.name);
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

  paintSkinSelect();
  paintSwatches("backgrounds", getBackgroundOptions(), state.selections.backgroundId, (item) => {
    state.selections.backgroundId = item.id;
    syncBackgroundCustomization(item.id);
    refs.accent.value = item.accent || refs.accent.value;
    render();
    paintControls();
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
  }, (button, item) => {
    const frame = item.id === "custom" ? item : normalizeFrame(item);
    const fill = frame.styleType === "gradient"
      ? `linear-gradient(135deg, ${frame.primary}, ${frame.secondary})`
      : frame.primary;
    button.style.background = `radial-gradient(circle,#0f1726 38%, transparent 39%), ${fill}`;
    button.innerHTML = `<span>${item.name}</span>`;
  });
}

function paintSkinSelect() {
  const hero = getHero();
  fillSelect(refs.skin, hero.skins, (skin) => skin.id, (skin) => skin.name);
  refs.skin.value = state.selections.skinId;
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
  refs.apiSourceText.textContent = `Source: ${status?.provider || "-"} | Heroes ${status?.heroCount || 0} | Emblems ${status?.emblemCount || 0}`;
}

function render() {
  const background = getSelectedBackground();
  const frame = getSelectedFrame();
  const frameCss = buildFrameCss(frame);
  const emblem = getItem("emblems", state.selections.emblemId);
  const badge = getItem("badges", state.selections.badgeId);
  const hero = getHero();

  refs.backgroundLayer.style.background = buildBackgroundStyle(background);
  refs.card.style.setProperty("--accent", refs.accent.value);
  refs.card.style.setProperty("--frame", frameCss.shadow);
  refs.card.className = `profile-card ratio-${state.selections.mode} effect-${state.selections.effect}`;
  refs.heroArt.style.background = `${buildSkinStyle()}, ${hero.style || ""}`;
  refs.frameOut.style.border = "4px solid transparent";
  refs.frameOut.style.background = `linear-gradient(#09111d,#09111d) padding-box, ${frameCss.fill} border-box`;
  refs.frameOut.style.boxShadow = `0 0 0 2px rgba(255,255,255,.18) inset, 0 0 30px ${hexToRgba(frameCss.shadow, 0.45)}`;
  refs.badgeOut.textContent = badge.name;
  refs.badgeOut.style.background = `linear-gradient(135deg, ${frameCss.shadow}, ${refs.accent.value})`;
  refs.emblemOut.textContent = emblem.token || emblem.name;

  refs.ignOut.textContent = refs.ign.value || "PLAYER";
  refs.pidOut.textContent = refs.pid.value || "00000000";
  refs.serverOut.textContent = refs.server.value || "0000";
  refs.bioOut.textContent = refs.bio.value || "No status.";
  refs.titleOut.textContent = refs.title.value;
  refs.rankOut.textContent = refs.rank.value;
  refs.heroOut.textContent = hero.name.toUpperCase();
  refs.skinOut.textContent = refs.skin.options[refs.skin.selectedIndex]?.textContent || "Custom Skin";
  refs.rarityOut.textContent = String(state.selections.rarity || "Unknown").toUpperCase();
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
    });
  });

  refs.role.addEventListener("change", () => {
    state.selections.role = refs.role.value;
    const heroesForRole = getHeroesForRole();
    state.selections.heroId = heroesForRole[0]?.id || state.manifest.heroes[0].id;
    state.selections.skinId = getHero().skins[0].id;
    syncSkinCustomizationFromSkin();
    paintControls();
    render();
  });

  refs.hero.addEventListener("change", () => {
    state.selections.heroId = refs.hero.value;
    state.selections.role = getHero().roles?.[0] || state.selections.role;
    state.selections.skinId = getHero().skins[0].id;
    syncSkinCustomizationFromSkin();
    paintControls();
    render();
  });

  refs.skin.addEventListener("change", () => {
    state.selections.skinId = refs.skin.value;
    syncSkinCustomizationFromSkin();
    render();
  });

  refs.rarity.addEventListener("change", () => {
    state.selections.rarity = refs.rarity.value;
    render();
  });

  refs.emblem.addEventListener("change", () => {
    state.selections.emblemId = refs.emblem.value;
    render();
  });

  refs.badge.addEventListener("change", () => {
    state.selections.badgeId = refs.badge.value;
    render();
  });

  refs.effect.addEventListener("change", () => {
    state.selections.effect = refs.effect.value;
    render();
  });

  refs.skinColorPrimary.addEventListener("input", () => {
    state.custom.skinPrimary = refs.skinColorPrimary.value;
    render();
  });
  refs.skinColorSecondary.addEventListener("input", () => {
    state.custom.skinSecondary = refs.skinColorSecondary.value;
    render();
  });
  refs.skinColorGlow.addEventListener("input", () => {
    state.custom.skinGlow = refs.skinColorGlow.value;
    render();
  });

  ["bgColorPrimary", "bgColorSecondary", "bgColorAccent"].forEach((id) => {
    refs[id].addEventListener("input", () => {
      state.custom.bgPrimary = refs.bgColorPrimary.value;
      state.custom.bgSecondary = refs.bgColorSecondary.value;
      state.custom.bgAccent = refs.bgColorAccent.value;
      state.selections.backgroundId = "custom";
      paintControls();
      render();
    });
  });

  refs.frameStyle.addEventListener("change", () => {
    state.selections.frameStyle = refs.frameStyle.value;
    state.selections.frameId = "custom";
    paintControls();
    render();
  });

  ["frameColorPrimary", "frameColorSecondary"].forEach((id) => {
    refs[id].addEventListener("input", () => {
      state.custom.framePrimary = refs.frameColorPrimary.value;
      state.custom.frameSecondary = refs.frameColorSecondary.value;
      state.selections.frameId = "custom";
      paintControls();
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

  refs.photo.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    refs.avatarImg.style.background = `url(${dataUrl}) center/cover`;
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

  syncBackgroundCustomization(preset.background);
  syncFrameCustomization(preset.frame);
  state.selections.role = getHero().roles?.[0] || state.selections.role;
  refs.accent.value = getItem("backgrounds", preset.background).accent || refs.accent.value;
  paintControls();
  render();
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomizeProfile() {
  state.selections.role = randomItem(roleOptions);
  const hero = randomItem(getHeroesForRole(state.selections.role));
  const skin = randomItem(hero.skins);
  const background = randomItem(state.manifest.backgrounds);
  const frame = randomItem(state.manifest.frames);

  state.selections.heroId = hero.id;
  state.selections.skinId = skin.id;
  state.selections.rarity = skin.rarity;
  state.selections.backgroundId = background.id;
  state.selections.frameId = frame.id;
  state.selections.frameStyle = normalizeFrame(frame).styleType;
  state.selections.emblemId = randomItem(state.manifest.emblems).id;
  state.selections.badgeId = randomItem(state.manifest.badges).id;
  state.selections.effect = randomItem(effectOptions).id;
  state.selections.title = `${getRoleLabel(state.selections.role)} Main`;
  state.selections.rank = randomItem(state.manifest.ranks);

  refs.title.value = state.selections.title;
  refs.rank.value = state.selections.rank;
  refs.wr.value = Math.floor(Math.random() * 35) + 60;
  refs.matches.value = Math.floor(Math.random() * 4500) + 500;
  refs.mvp.value = Math.floor(Math.random() * 700) + 80;
  refs.savage.value = Math.floor(Math.random() * 60) + 4;
  refs.legendary.value = Math.floor(Math.random() * 1200) + 80;
  refs.emblemLevel.value = Math.floor(Math.random() * 40) + 20;
  refs.accent.value = background.accent || refs.accent.value;

  syncSkinCustomizationFromSkin();
  syncBackgroundCustomization(background.id);
  syncFrameCustomization(frame.id);
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
    custom: state.custom,
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
  context.drawImage(image, 0, 0);
  return canvas.toDataURL("image/png");
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

async function refreshApiData() {
  refs.refreshApiBtn.disabled = true;
  refs.refreshApiBtn.textContent = "Refreshing...";
  refs.apiBadge.className = "api-pill api-idle";
  refs.apiBadge.textContent = "API: Checking";
  refs.apiStatusText.textContent = "Sedang ambil data remote...";
  refs.apiSourceText.textContent = "Source: checking";

  const localManifest = await fetchLocalManifest();
  const mergedLocalManifest = {
    ...fallbackManifest,
    ...localManifest,
    backgrounds: localManifest.backgrounds?.length ? localManifest.backgrounds : fallbackManifest.backgrounds,
    frames: localManifest.frames?.length ? localManifest.frames : fallbackManifest.frames,
    emblems: localManifest.emblems?.length ? localManifest.emblems : fallbackManifest.emblems,
    badges: localManifest.badges?.length ? localManifest.badges : fallbackManifest.badges,
    heroes: localManifest.heroes?.length ? localManifest.heroes : fallbackManifest.heroes,
    titles: localManifest.titles?.length ? localManifest.titles : fallbackManifest.titles,
    ranks: localManifest.ranks?.length ? localManifest.ranks : fallbackManifest.ranks
  };

  let apiResult = {
    manifest: mergedLocalManifest,
    status: {
      mode: "fallback",
      provider: "Local fallback",
      heroCount: mergedLocalManifest.heroes.length,
      emblemCount: mergedLocalManifest.emblems.length,
      message: "API helper tidak tersedia, pakai data lokal.",
      checkedAt: new Date().toISOString()
    }
  };

  if (window.MLBBApi?.enrichManifest) {
    apiResult = await window.MLBBApi.enrichManifest(mergedLocalManifest);
  }

  state.manifest = apiResult.manifest;
  ensureSelectionsValid();
  syncSkinCustomizationFromSkin();
  syncBackgroundCustomization(state.selections.backgroundId);
  syncFrameCustomization(state.selections.frameId);
  updateApiStatus(apiResult.status);
  refs.accent.value = getSelectedBackground().accent || refs.accent.value;
  paintControls();
  syncLayerControls();
  render();

  refs.refreshApiBtn.disabled = false;
  refs.refreshApiBtn.textContent = "Refresh API";
}

async function init() {
  cacheRefs();
  wireEvents();
  await refreshApiData();
}

init();
