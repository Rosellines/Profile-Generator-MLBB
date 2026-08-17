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
    slugify
  };
})();
