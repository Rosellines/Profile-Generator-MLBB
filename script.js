const $ = (id) => document.getElementById(id);

const fallbackManifest = {
  version: 3,
  titles: ["Assassin Main", "Mythic Grinder", "Collector Hunter", "Rank Demon", "Savage Farmer"],
  ranks: ["MYTHIC GLORY", "MYTHICAL IMMORTAL", "MYTHIC", "LEGEND", "EPIC"],
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
    }
  ],
  frames: [
    { id: "royal", name: "Royal Gold", color: "#f3c969" },
    { id: "frost", name: "Frost", color: "#9cd9ff" },
    { id: "void", name: "Void", color: "#ca95ff" },
    { id: "crimson", name: "Crimson", color: "#ff8b8b" },
    { id: "emerald", name: "Emerald", color: "#82f1b8" },
    { id: "pearl", name: "Pearl", color: "#f4f5ff" }
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
  og: { rank: "LEGEND", title: "OG", wr: 74, matches: 5210, mvp: 260, savage: 14, legendary: 844, effect: "scan", background: "jade", frame: "frost", badge: "og", emblem: "marksman" },
  whale: { rank: "MYTHICAL IMMORTAL", title: "Whale Energy", wr: 96, matches: 3611, mvp: 701, savage: 49, legendary: 1182, effect: "glow", background: "ember", frame: "royal", badge: "goat", emblem: "mage" }
};

const state = {
  manifest: fallbackManifest,
  apiStatus: null,
  selections: {
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
  activeLayer: "avatar"
};

const refs = {};
let uiWired = false;

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

function cacheRefs() {
  [
    "ign", "pid", "server", "bio", "title", "rank", "photo", "hero", "skin", "rarity", "backgrounds",
    "frames", "emblems", "badges", "activeLayer", "layerScale", "layerRotate", "accent", "mode",
    "wr", "matches", "mvp", "savage", "legendary", "emblemLevel", "resetLayout", "presetBtn", "randomBtn",
    "copyBtn", "exportBtn", "closeModal", "modal", "card", "backgroundLayer", "heroArt", "avatarImg",
    "frameOut", "badgeOut", "ignOut", "pidOut", "serverOut", "bioOut", "titleOut", "rankOut", "heroOut",
    "skinOut", "rarityOut", "emblemOut", "wrOut", "matchesOut", "mvpOut", "savageOut", "legendaryOut",
    "emblemLevelOut", "modeOut", "dragHint", "heroLayer", "avatarLayer", "apiBadge", "apiStatusText",
    "apiSourceText", "refreshApiBtn"
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

  if (!state.manifest.heroes.some((hero) => hero.id === state.selections.heroId)) {
    state.selections.heroId = state.manifest.heroes[0].id;
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

function paintControls() {
  fillSelect(refs.title, state.manifest.titles);
  fillSelect(refs.rank, state.manifest.ranks);
  fillSelect(refs.hero, state.manifest.heroes, (hero) => hero.id, (hero) => hero.name);

  refs.title.value = state.selections.title;
  refs.rank.value = state.selections.rank;
  refs.hero.value = state.selections.heroId;
  paintSkinSelect();
  paintSwatches("backgrounds", state.manifest.backgrounds, state.selections.backgroundId, (item) => {
    state.selections.backgroundId = item.id;
    refs.accent.value = item.accent || refs.accent.value;
    render();
  }, (button, item) => {
    button.style.background = item.style;
    button.innerHTML = `<span>${item.name}</span>`;
  });
  paintSwatches("frames", state.manifest.frames, state.selections.frameId, (item) => {
    state.selections.frameId = item.id;
    render();
  }, (button, item) => {
    button.style.background = `radial-gradient(circle,#0f1726 40%,${item.color} 44%,transparent 58%), linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))`;
    button.innerHTML = `<span>${item.name}</span>`;
  });
  paintTokens("emblems", state.manifest.emblems, state.selections.emblemId, (item) => {
    state.selections.emblemId = item.id;
    render();
  }, (item) => item.token);
  paintTokens("badges", state.manifest.badges, state.selections.badgeId, (item) => {
    state.selections.badgeId = item.id;
    render();
  }, (item) => item.name);
}

function paintSkinSelect() {
  const hero = getHero();
  fillSelect(refs.skin, hero.skins, (skin) => skin.id, (skin) => skin.name);
  refs.skin.value = state.selections.skinId;
  refs.rarity.value = getSkin().rarity || "Unknown";
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
  refs.apiSourceText.textContent = `Source: ${status?.provider || "-"} | Heroes ${status?.heroCount || 0} | Emblems ${status?.emblemCount || 0}`;
}

function render() {
  const background = getItem("backgrounds", state.selections.backgroundId);
  const frame = getItem("frames", state.selections.frameId);
  const emblem = getItem("emblems", state.selections.emblemId);
  const badge = getItem("badges", state.selections.badgeId);
  const hero = getHero();
  const skin = getSkin();

  refs.backgroundLayer.style.background = background.style;
  refs.card.style.setProperty("--accent", refs.accent.value);
  refs.card.style.setProperty("--frame", frame.color);
  refs.card.className = `profile-card ratio-${state.selections.mode} effect-${state.selections.effect}`;
  refs.heroArt.style.background = `${skin.style || ""}, ${hero.style || ""}`;
  refs.frameOut.style.borderColor = frame.color;
  refs.frameOut.style.boxShadow = `0 0 0 2px rgba(255,255,255,.18) inset, 0 0 30px ${frame.color}55`;
  refs.badgeOut.textContent = badge.name;
  refs.badgeOut.style.background = `linear-gradient(135deg, ${frame.color}, ${refs.accent.value})`;
  refs.emblemOut.textContent = emblem.token || emblem.name;

  refs.ignOut.textContent = refs.ign.value || "PLAYER";
  refs.pidOut.textContent = refs.pid.value || "00000000";
  refs.serverOut.textContent = refs.server.value || "0000";
  refs.bioOut.textContent = refs.bio.value || "No status.";
  refs.titleOut.textContent = refs.title.value;
  refs.rankOut.textContent = refs.rank.value;
  refs.heroOut.textContent = hero.name.toUpperCase();
  refs.skinOut.textContent = skin.name;
  refs.rarityOut.textContent = String(skin.rarity || "Unknown").toUpperCase();
  refs.rarity.value = skin.rarity || "Unknown";

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

  refs.hero.addEventListener("change", () => {
    state.selections.heroId = refs.hero.value;
    ensureSelectionsValid();
    paintSkinSelect();
    render();
  });

  refs.skin.addEventListener("change", () => {
    state.selections.skinId = refs.skin.value;
    render();
  });

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
  updateApiStatus(apiResult.status);
  refs.accent.value = getItem("backgrounds", state.selections.backgroundId).accent || refs.accent.value;
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
