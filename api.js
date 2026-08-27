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
      payload.records,
      payload.items,
      payload.data,
      payload.heroes,
      payload.emblems,
      payload.results
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

  function joinUrl(baseUrl, endpoint, query) {
    if (!endpoint) {
      return "";
    }

    const raw = /^https?:\/\//i.test(endpoint)
      ? endpoint
      : `${String(baseUrl || "").replace(/\/$/, "")}/${String(endpoint).replace(/^\//, "")}`;

    const url = new URL(raw);
    Object.entries(query || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
    return url.toString();
  }

  async function fetchJsonWithMeta(url, timeoutMs) {
    const startedAt = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs || 6000);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch (_error) {
        payload = null;
      }

      const latencyMs = Math.round(performance.now() - startedAt);
      return {
        ok: response.ok,
        status: response.status,
        latencyMs,
        payload
      };
    } catch (error) {
      const latencyMs = Math.round(performance.now() - startedAt);
      throw Object.assign(new Error(error.name === "AbortError" ? "Timeout" : error.message || "Failed to fetch"), {
        latencyMs,
        causeName: error.name || "Error"
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async function probeProvider(provider, timeoutMs) {
    const query = {
      size: provider.size || 200,
      index: provider.index || 1,
      order: provider.order || "asc",
      lang: provider.lang || "en"
    };
    const heroUrl = joinUrl(provider.baseUrl, provider.heroesEndpoint || provider.heroesUrl, query);
    const emblemUrl = joinUrl(provider.baseUrl, provider.emblemsEndpoint || provider.emblemsUrl, {
      size: provider.size || 200,
      index: provider.index || 1,
      lang: provider.lang || "en"
    });

    const diagnostic = {
      id: provider.id || slugify(provider.name || "provider"),
      provider: provider.name || provider.id || "Remote Provider",
      baseUrl: provider.baseUrl || "-",
      heroUrl,
      emblemUrl,
      heroStatus: "idle",
      emblemStatus: "idle",
      httpStatus: "-",
      latencyMs: "-",
      heroCount: 0,
      emblemCount: 0,
      lastCheckedAt: new Date().toISOString(),
      error: ""
    };

    try {
      const heroResult = await fetchJsonWithMeta(heroUrl, timeoutMs);
      diagnostic.heroStatus = heroResult.ok ? "ok" : "error";
      diagnostic.httpStatus = heroResult.status;
      diagnostic.latencyMs = heroResult.latencyMs;
      diagnostic.heroCount = coerceArray(heroResult.payload).length;

      if (!heroResult.ok) {
        diagnostic.error = `Heroes HTTP ${heroResult.status}`;
        return diagnostic;
      }

      if (emblemUrl) {
        try {
          const emblemResult = await fetchJsonWithMeta(emblemUrl, timeoutMs);
          diagnostic.emblemStatus = emblemResult.ok ? "ok" : "error";
          diagnostic.emblemCount = coerceArray(emblemResult.payload).length;
          if (emblemResult.ok) {
            diagnostic.httpStatus = `${heroResult.status}/${emblemResult.status}`;
            diagnostic.latencyMs = Math.max(heroResult.latencyMs, emblemResult.latencyMs);
          } else {
            diagnostic.error = `Emblems HTTP ${emblemResult.status}`;
          }
        } catch (error) {
          diagnostic.emblemStatus = "error";
          diagnostic.error = error.message;
        }
      }

      if (!diagnostic.error) {
        diagnostic.error = "";
      }

      return diagnostic;
    } catch (error) {
      diagnostic.heroStatus = "error";
      diagnostic.httpStatus = "network";
      diagnostic.latencyMs = error.latencyMs || "-";
      diagnostic.error = error.message || "Failed to fetch";
      return diagnostic;
    }
  }

  function extractHeroId(value) {
    if (value === undefined || value === null || value === "") {
      return "";
    }
    return String(value);
  }

  function extractNamedEntries(payload, fieldKeys, nestedKeys) {
    return coerceArray(payload)
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        const directValue = fieldKeys
          .map((key) => item?.[key])
          .find((value) => typeof value === "string" && value.trim());
        if (directValue) {
          return directValue.trim();
        }

        const nestedValue = nestedKeys
          .map((path) => path.reduce((current, key) => current?.[key], item))
          .find((value) => typeof value === "string" && value.trim());
        return nestedValue ? nestedValue.trim() : "";
      })
      .filter(Boolean);
  }

  async function fetchHeroes(provider, timeoutMs) {
    const query = {
      size: provider.size || 200,
      index: provider.index || 1,
      order: provider.order || "asc",
      lang: provider.lang || "en"
    };
    const heroUrl = joinUrl(provider.baseUrl, provider.heroesEndpoint || provider.heroesUrl, query);
    const heroResult = await fetchJsonWithMeta(heroUrl, timeoutMs);

    if (!heroResult.ok) {
      throw new Error(`Heroes HTTP ${heroResult.status}`);
    }

    return {
      heroUrl,
      listPayload: heroResult.payload
    };
  }

  async function fetchHeroDetail(provider, heroIdentifier, timeoutMs) {
    const detailEndpointTemplate = provider.heroDetailEndpoint || "/heroes/{hero_identifier}";
    if (!heroIdentifier || !detailEndpointTemplate) {
      throw new Error("Missing hero identifier for detail request.");
    }

    const detailEndpoint = String(detailEndpointTemplate).replace("{hero_identifier}", encodeURIComponent(heroIdentifier));
    const detailUrl = joinUrl(provider.baseUrl, detailEndpoint, {
      size: provider.detailSize || 1,
      index: provider.detailIndex || 1,
      lang: provider.lang || "en"
    });
    const detailResult = await fetchJsonWithMeta(detailUrl, timeoutMs);
    if (!detailResult.ok) {
      throw new Error(`Hero detail HTTP ${detailResult.status}`);
    }
    return detailResult.payload;
  }

  function normalizeHero(raw) {
    const listRecord = raw?.listRecord || raw?.list || raw;
    const detailInput = raw?.detailRecord || raw?.detail || null;
    const detailRecord = Array.isArray(detailInput) ? detailInput[0] : detailInput;
    const listHero = listRecord?.data?.hero?.data || listRecord?.hero?.data || listRecord?.data || listRecord || {};
    const detailRoot = detailRecord?.data || detailRecord || {};
    const detailHero = detailRoot?.hero?.data || detailRoot?.hero || detailRoot || {};

    const heroId = extractHeroId(
      detailHero.heroid ||
      detailHero.hero_id ||
      detailRoot.heroid ||
      detailRoot.hero_id ||
      listHero.hero_id ||
      listHero.heroid ||
      raw?.hero_id ||
      raw?.heroid
    );
    const name = String(detailHero.name || detailRoot.name || listHero.name || raw?.name || heroId).trim();
    const roles = extractNamedEntries(
      detailHero.sortid || detailRoot.sortid,
      ["sort_title", "name", "title"],
      [["data", "sort_title"], ["data", "name"], ["data", "title"]]
    );
    const specialty = extractNamedEntries(
      detailHero.speciality || detailHero.specialty || detailRoot.speciality || detailRoot.specialty,
      ["tagname", "name", "title"],
      [["data", "tagname"], ["data", "name"], ["data", "title"]]
    );

    return {
      id: slugify(name || heroId),
      apiHeroId: heroId,
      name,
      roles,
      specialty,
      portrait: detailRoot.head_big || detailRoot.head || listHero.head || "",
      artwork: detailHero.painting || detailRoot.painting || "",
      addedAt: listRecord?._updatedAt || listRecord?.updatedAt || detailRecord?._updatedAt || detailRecord?.updatedAt || ""
    };
  }

  function normalizeHeroList(payload) {
    const listRecords = coerceArray(payload?.listPayload || payload);

    const seen = new Set();
    return listRecords
      .map((listRecord) => {
        const listHero = listRecord?.data?.hero?.data || listRecord?.hero?.data || listRecord?.data || {};
        return normalizeHero({
          listRecord,
          detailRecord: null
        });
      })
      .filter((hero) => {
        if (!hero.name || seen.has(hero.id)) {
          return false;
        }
        seen.add(hero.id);
        return true;
      });
  }

  async function probeProviders(apiConfig) {
    const providers = Array.isArray(apiConfig?.providers) ? apiConfig.providers : [];
    const timeoutMs = apiConfig?.timeoutMs || 6000;

    if (!apiConfig?.enabled || !providers.length) {
      return {
        mode: "local",
        badge: "LOCAL DATABASE",
        message: "Local database aktif. Remote API dimatikan.",
        diagnostics: []
      };
    }

    const diagnostics = [];
    for (const provider of providers) {
      diagnostics.push(await probeProvider(provider, timeoutMs));
    }

    const hasSuccess = diagnostics.some((item) => item.heroStatus === "ok");
    const hasPartial = diagnostics.some((item) => item.heroStatus === "ok" || item.emblemStatus === "ok");

    if (hasSuccess) {
      return {
        mode: "remote",
        badge: "REMOTE AVAILABLE",
        message: "Local database aktif. Metadata remote tersedia sebagai update opsional.",
        diagnostics
      };
    }

    if (hasPartial) {
      return {
        mode: "partial",
        badge: "REMOTE AVAILABLE",
        message: "Local database aktif. Sebagian endpoint remote merespons.",
        diagnostics
      };
    }

    return {
      mode: "offline",
      badge: "REMOTE OFFLINE",
      message: "Local database aktif. Remote API sedang offline atau diblokir browser.",
      diagnostics
    };
  }

  window.MLBBApi = {
    probeProviders,
    fetchHeroes,
    fetchHeroDetail,
    normalizeHero,
    normalizeHeroList,
    slugify
  };
})();
