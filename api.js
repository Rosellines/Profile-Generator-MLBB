(function () {
  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function coerceArray(payload) {
    if (Array.isArray(payload)) {
      return payload;
    }
    if (!payload || typeof payload !== "object") {
      return [];
    }
    const candidates = [
      payload.data,
      payload.heroes,
      payload.hero,
      payload.results,
      payload.result,
      payload.items,
      payload.emblems,
      payload.emblem
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
      if (candidate && Array.isArray(candidate.data)) {
        return candidate.data;
      }
    }
    return [];
  }

  function joinUrl(baseUrl, endpoint) {
    if (!endpoint) {
      return "";
    }
    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }
    return `${String(baseUrl || "").replace(/\/$/, "")}/${String(endpoint).replace(/^\//, "")}`;
  }

  async function fetchJson(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs || 5000);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function fallbackHeroStyle(index) {
    const palettes = [
      "radial-gradient(circle at 56% 45%,rgba(116,86,255,.95),transparent 34%)",
      "radial-gradient(circle at 56% 45%,rgba(105,241,255,.95),transparent 34%)",
      "radial-gradient(circle at 56% 45%,rgba(255,138,193,.95),transparent 34%)",
      "radial-gradient(circle at 56% 45%,rgba(255,122,122,.95),transparent 34%)",
      "radial-gradient(circle at 56% 45%,rgba(197,223,255,.95),transparent 34%)"
    ];
    return `${palettes[index % palettes.length]},linear-gradient(135deg,transparent 20%,rgba(255,255,255,.28) 43%,transparent 56%),linear-gradient(160deg,rgba(255,255,255,.15),rgba(255,255,255,0) 34%)`;
  }

  function fallbackSkinStyle(index) {
    const palettes = [
      "radial-gradient(circle at 58% 42%,rgba(158,137,255,1),transparent 34%)",
      "radial-gradient(circle at 58% 42%,rgba(124,211,255,1),transparent 34%)",
      "radial-gradient(circle at 58% 42%,rgba(87,255,160,1),transparent 34%)",
      "radial-gradient(circle at 58% 42%,rgba(255,201,120,1),transparent 34%)",
      "radial-gradient(circle at 58% 42%,rgba(255,145,183,1),transparent 34%)"
    ];
    return `${palettes[index % palettes.length]},linear-gradient(125deg,transparent 18%,rgba(255,255,255,.34) 43%,transparent 56%)`;
  }

  function normalizeSkin(skin, index, heroName) {
    if (typeof skin === "string") {
      return {
        id: slugify(skin),
        name: skin,
        rarity: "Unknown",
        style: fallbackSkinStyle(index),
        asset: `assets/skins/${slugify(heroName)}/${slugify(skin)}.webp`
      };
    }

    const name = skin.name || skin.skin_name || skin.title || skin.label || `Skin ${index + 1}`;
    return {
      id: slugify(skin.id || skin.skin_id || name),
      name,
      rarity: skin.rarity || skin.type || skin.tier || "Unknown",
      style: skin.style || fallbackSkinStyle(index),
      asset: skin.asset || skin.image || skin.icon || `assets/skins/${slugify(heroName)}/${slugify(name)}.webp`
    };
  }

  function normalizeHero(hero, index, localHero) {
    const name = hero.name || hero.hero_name || hero.title || hero.label || localHero?.name || `Hero ${index + 1}`;
    const remoteSkins = coerceArray(hero.skins || hero.skin || hero.cosmetics || hero.appearances);
    const localSkins = Array.isArray(localHero?.skins) ? localHero.skins : [];
    const skinsSource = remoteSkins.length ? remoteSkins : localSkins.length ? localSkins : [{ name: "Core", rarity: "Base" }];
    const skins = skinsSource.map((skin, skinIndex) => normalizeSkin(skin, skinIndex, name));

    return {
      id: slugify(hero.id || hero.hero_id || hero.key || name),
      name,
      style: hero.style || localHero?.style || fallbackHeroStyle(index),
      asset: hero.asset || hero.image || hero.portrait || localHero?.asset || `assets/heroes/${slugify(name)}/base.webp`,
      skins
    };
  }

  function normalizeEmblem(emblem, index, localEmblem) {
    const name = emblem.name || emblem.emblem_name || emblem.title || localEmblem?.name || `Emblem ${index + 1}`;
    return {
      id: slugify(emblem.id || emblem.emblem_id || emblem.key || name),
      name,
      token: emblem.token || emblem.short_name || emblem.short || localEmblem?.token || name,
      asset: emblem.asset || emblem.icon || localEmblem?.asset || `assets/emblems/${slugify(name)}.webp`
    };
  }

  function dedupeById(items) {
    const map = new Map();
    items.forEach((item) => {
      if (item && item.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return [...map.values()];
  }

  async function tryProvider(provider, baseManifest, timeoutMs) {
    const heroUrl = joinUrl(provider.baseUrl, provider.heroesEndpoint || provider.heroesUrl);
    const emblemUrl = joinUrl(provider.baseUrl, provider.emblemsEndpoint || provider.emblemsUrl);

    if (!heroUrl) {
      throw new Error("Provider tidak punya heroes endpoint.");
    }

    const localHeroMap = new Map((baseManifest.heroes || []).map((hero) => [slugify(hero.id || hero.name), hero]));
    const localEmblemMap = new Map((baseManifest.emblems || []).map((emblem) => [slugify(emblem.id || emblem.name), emblem]));

    const remoteHeroesPayload = await fetchJson(heroUrl, timeoutMs);
    const remoteHeroRecords = coerceArray(remoteHeroesPayload);
    if (!remoteHeroRecords.length) {
      throw new Error("Heroes payload kosong.");
    }

    let remoteEmblems = [];
    let emblemError = null;
    if (emblemUrl) {
      try {
        const remoteEmblemsPayload = await fetchJson(emblemUrl, timeoutMs);
        remoteEmblems = coerceArray(remoteEmblemsPayload);
      } catch (error) {
        emblemError = error;
      }
    }

    const normalizedHeroes = remoteHeroRecords.map((hero, index) => {
      const heroId = slugify(hero.id || hero.hero_id || hero.key || hero.name || hero.hero_name || `hero-${index + 1}`);
      return normalizeHero(hero, index, localHeroMap.get(heroId));
    });

    const normalizedEmblems = remoteEmblems.length
      ? remoteEmblems.map((emblem, index) => {
          const emblemId = slugify(emblem.id || emblem.emblem_id || emblem.key || emblem.name || `emblem-${index + 1}`);
          return normalizeEmblem(emblem, index, localEmblemMap.get(emblemId));
        })
      : baseManifest.emblems || [];

    const localHeroRemainder = (baseManifest.heroes || []).filter((hero) => !normalizedHeroes.some((item) => item.id === hero.id));
    const localEmblemRemainder = (baseManifest.emblems || []).filter((emblem) => !normalizedEmblems.some((item) => item.id === emblem.id));

    return {
      manifest: {
        ...baseManifest,
        heroes: dedupeById([...normalizedHeroes, ...localHeroRemainder]),
        emblems: dedupeById([...normalizedEmblems, ...localEmblemRemainder])
      },
      status: {
        mode: emblemError ? "partial" : "online",
        provider: provider.name || provider.id || "Remote API",
        sourceId: provider.id || "remote",
        heroCount: normalizedHeroes.length,
        emblemCount: normalizedEmblems.length,
        message: emblemError
          ? "Hero remote berhasil, emblem fallback lokal."
          : "Hero dan emblem berhasil dimuat dari remote.",
        checkedAt: new Date().toISOString()
      }
    };
  }

  async function enrichManifest(baseManifest) {
    const manifest = JSON.parse(JSON.stringify(baseManifest || {}));
    const apiConfig = manifest.api || {};
    const providers = Array.isArray(apiConfig.providers) ? apiConfig.providers : [];
    const timeoutMs = apiConfig.timeoutMs || 5000;

    if (!apiConfig.enabled || !providers.length) {
      return {
        manifest,
        status: {
          mode: "disabled",
          provider: "Local manifest",
          sourceId: "local",
          heroCount: (manifest.heroes || []).length,
          emblemCount: (manifest.emblems || []).length,
          message: "API dimatikan di manifest, pakai data lokal.",
          checkedAt: new Date().toISOString()
        }
      };
    }

    const errors = [];
    for (const provider of providers) {
      try {
        return await tryProvider(provider, manifest, timeoutMs);
      } catch (error) {
        errors.push(`${provider.name || provider.id || "provider"}: ${error.message}`);
      }
    }

    return {
      manifest,
      status: {
        mode: "fallback",
        provider: "Local fallback",
        sourceId: "local",
        heroCount: (manifest.heroes || []).length,
        emblemCount: (manifest.emblems || []).length,
        message: errors.length ? `Remote gagal. ${errors.join(" | ")}` : "Remote gagal, pakai data lokal.",
        checkedAt: new Date().toISOString()
      }
    };
  }

  window.MLBBApi = {
    enrichManifest,
    slugify
  };
})();
