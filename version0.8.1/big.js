
/* sanitize fetched HTML — strips ads, trackers, and ad stylesheet links.
   All patterns that match closing script tags use <\/script> so the HTML
   parser does not terminate this block early (backslash before / is ignored
   by the JS engine but prevents the HTML tokeniser from seeing the end tag). */
function sanitizeHTML(html){

  /* 1. GTM async loader + inline gtag config */
  html = html.replace(/<script[^>]*googletagmanager[^>]*>[\s\S]*?<\/script>/gi,"");
  html = html.replace(/<script[^>]*>[\s\S]*?window\.dataLayer[\s\S]*?<\/script>/gi,"");
  html = html.replace(/<script[^>]*>[\s\S]*?gtag\([\s\S]*?<\/script>/gi,"");

  /* 2. Sidebar ad divs */
  html = html.replace(/<div[^>]*id=["']sidebarad[12]["'][^>]*>[\s\S]*?<\/div>/gi,"");

  /* 3. Ad-related CSS rules: sidebarad selectors, sidebar-close, sidebar-frame */
  html = html.replace(/#sidebarad1\s*,[\s\S]{0,20}#sidebarad2\s*\{[\s\S]*?\}/gi,"");
  html = html.replace(/#sidebarad1\s*\{[\s\S]*?\}/gi,"");
  html = html.replace(/#sidebarad2\s*\{[\s\S]*?\}/gi,"");
  html = html.replace(/\.sidebar-close\s*\{[\s\S]*?\}/gi,"");
  html = html.replace(/\.sidebar-frame\s*\{[\s\S]*?\}/gi,"");

  /* 4. Obfuscated self-invoking ad injector (_0x fingerprint) */
  html = html.replace(/<script>\s*\(function\s*\(_0x[\s\S]*?<\/script>/gi,"");

  /* 5. Generic self-invoking function scripts */
  html = html.replace(/<script>\s*\(function\s*\(\s*\)[\s\S]*?<\/script>/gi,"");

  /* 6. External ad/analytics/tracker scripts by src */
  html = html.replace(/<script[^>]*src=["'][^"']*(ads|analytics|tracker|doubleclick|adsbygoogle|pagead)[^"']*["'][^>]*><\/script>/gi,"");

  /* 7. Ad iframes */
  html = html.replace(/<iframe[^>]*ads?[^>]*>[\s\S]*?<\/iframe>/gi,"");

  /* 8. Ad stylesheet link tags — both attribute orders */
  html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*(ads|adservice|doubleclick|pagead|analytics)[^"']*["'][^>]*\/?>/gi,"");
  html = html.replace(/<link[^>]*href=["'][^"']*(ads|adservice|doubleclick|pagead|analytics)[^"']*["'][^>]*rel=["']stylesheet["'][^>]*\/?>/gi,"");

  return html;
}

// Apply theme-specific loading.gif immediately (before DOMContentLoaded)
(function() {
  var theme = (localStorage.getItem("selectedTheme") || "root").trim();
  // Per-theme loading gif overrides (empty string = use root)
  var THEME_LOADING = {
    root: "", redux: "",
    classic: "", light: "", dark: "", slackerish: "",
    graduation: "", "flower-boy": "", igor: "", "i-am-music": ""
  };
  var override = THEME_LOADING[theme];
  if (override) {
    var img = document.querySelector("#containerLoader img");
    if (img) img.src = override;
  }
})();
</script>




<!-- External Widgets -->
<script async defer src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"></script>
<script>
window.addEventListener("load", () => {
  if (typeof Crate !== "undefined") {
    new Crate({
      server: "1451796462517096642",
      channel: "1451796463368667218"
    });
  }
});
</script>

<!-- Core JS -->
const images=[
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/bleh.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/catcher.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/clown.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/clowninabox.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/dream.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/eye.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/eyes.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/glitched.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/me.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/purpleu.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/sleeppy.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/smile.png",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/starry.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/starwalk.jpeg",
"https://cdn.jsdelivr.net/gh/mcmattyobriore/yogurtyooo.github.io@main/system/images/profile/yum.jpeg"
];
window.addEventListener("DOMContentLoaded",()=>{
  const pfpEl = document.getElementById("pfp");
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) {
    pfpEl.src = savedPic;
  } else {
    pfpEl.src = images[Math.floor(Math.random()*images.length)];
  }
  // Apply saved nickname to dashboard menu
  const savedName = localStorage.getItem("nickname");
  const dashNick = document.getElementById("dashNickname");
  if (dashNick && savedName) dashNick.textContent = savedName;
});

/**
 * system/js/settings.js
 * Unified logic for handling Settings (Theme, Cloak, Panic, Password)
 */

// ============================================================
// TOAST (non-blocking small alert)
// ============================================================
function showToast(message, timeout = 2200) {
  const t = document.createElement("div");
  t.textContent = message;
  Object.assign(t.style, {
    position: "fixed",
    bottom: "28px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.8)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontFamily: "monospace",
    zIndex: 99999,
    opacity: "0",
    transition: "opacity 220ms ease",
    pointerEvents: "none",
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => (t.style.opacity = "1"));
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 300);
  }, timeout);
}

// ============================================================
// GLOBAL HELPERS
// ============================================================
function setFavicon(url) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url && url.startsWith("http") ? url : (url ? `system/${url}` : "");
}

// ============================================================
// AUTO-APPLY CLOAK ON LOAD
// ============================================================
(function applyGlobalCloak() {
  const savedTitle = localStorage.getItem("cloakTitle");
  const savedIcon = localStorage.getItem("cloakIcon");
  if (savedTitle) document.title = savedTitle;
  if (savedIcon) setFavicon(savedIcon);
})();

// ============================================================
// APPLY SAVED THEME ON LOAD
// ============================================================
(function applyGlobalTheme() {
  const saved = localStorage.getItem("selectedTheme") || "redux";
  document.documentElement.setAttribute("theme", saved);
  // Re-apply custom CSS vars if custom theme was active
  if (saved === "custom") {
    try {
      const vars = JSON.parse(localStorage.getItem("customTheme") || "{}");
      Object.entries(vars).forEach(([k, v]) =>
        document.documentElement.style.setProperty(k, v)
      );
    } catch (_) {}
  }
})();

// Sync theme + cloak changes from settings tab
window.addEventListener("storage", (e) => {
  if (e.key === "cloakTitle" && e.newValue) document.title = e.newValue;
  if (e.key === "cloakIcon"  && e.newValue) setFavicon(e.newValue);
  if (e.key === "selectedTheme") {
    const t = e.newValue || "redux";
    document.documentElement.setAttribute("theme", t);
    if (t !== "custom") document.documentElement.style.cssText = "";
  }
  if (e.key === "customTheme" && e.newValue) {
    try {
      const vars = JSON.parse(e.newValue);
      Object.entries(vars).forEach(([k, v]) =>
        document.documentElement.style.setProperty(k, v)
      );
    } catch (_) {}
  }
});

// ============================================================
// SETTINGS PAGE LOGIC
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const settingsPage = document.querySelector(".settings-page");
  if (!settingsPage) return;

  // --- Cached Elements ---
  const webnameInput = document.getElementById("webname");
  const webiconInput = document.getElementById("webicon");
  const presetCloaksSelect = document.getElementById("presetCloaks");
  const panicInput = document.getElementById("panicURL");
  const passInput = document.getElementById("pass");

  // --- Initialize Saved Values ---
  if (webnameInput) webnameInput.value = localStorage.getItem("cloakTitle") || "";
  if (webiconInput) webiconInput.value = localStorage.getItem("cloakIcon") || "";
  if (panicInput) panicInput.value = localStorage.getItem("panicURL") || "";

  // ============================================================
  // CLOAK CONTROLS
  // ============================================================
  const CLOAK_PRESETS = {
    google: { title: "Google", icon: "icons/google.png" },
    drive: { title: "My Drive - Google Drive", icon: "icons/drive.png" },
    classroom: { title: "Classes", icon: "icons/classroom.png" },
    newtab: { title: "New Tab", icon: "icons/newtab.png" },
    docs: { title: "Untitled document - Google Docs", icon: "icons/docs.png" },
    schoology: { title: "Schoology", icon: "icons/schoology.png" },
  };

  presetCloaksSelect?.addEventListener("change", () => {
    const preset = CLOAK_PRESETS[presetCloaksSelect.value];
    if (preset) {
      if (webnameInput) webnameInput.value = preset.title;
      if (webiconInput) webiconInput.value = preset.icon;
    }
  });

  window.setCloakCookie = function (e) {
    e?.preventDefault();
    if (webnameInput) localStorage.setItem("cloakTitle", webnameInput.value.trim());
    if (webiconInput) localStorage.setItem("cloakIcon", webiconInput.value.trim());
    if (webnameInput?.value) document.title = webnameInput.value;
    if (webiconInput?.value) setFavicon(webiconInput.value);
    showToast("Tab cloak set!");
  };

  window.clearCloak = function () {
    localStorage.removeItem("cloakTitle");
    localStorage.removeItem("cloakIcon");
    document.title = "WannaSmile";
    setFavicon("https://raw.githubusercontent.com/mcmattyobriore/yogurtyooo.github.io/main/system/images/favicons/logo.png");
    if (webnameInput) webnameInput.value = "";
    if (webiconInput) webiconInput.value = "";
    showToast("Cloak cleared!");
  };

  // ============================================================
  // PANIC & PASSWORD
  // ============================================================
  window.setPanicMode = function (e) {
    e?.preventDefault();
    if (panicInput && panicInput.value.trim()) {
      localStorage.setItem("panicURL", panicInput.value.trim());
      showToast("Panic URL saved!");
    }
  };

  window.setPassword = function (e) {
    e?.preventDefault();
    const pw = passInput?.value.trim();
    if (!pw) return showToast("Enter a password first.");
    localStorage.setItem("accessPassword", pw);
    showToast("Access password set!");
  };

  window.delPassword = function () {
    localStorage.removeItem("accessPassword");
    if (passInput) passInput.value = "";
    showToast("Password cleared!");
  };
});

// ============================================================
// SORT MODE TOGGLE (Sheet Order / Alphabetical)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const sheetOrderBtn = document.getElementById("sheetOrderBtn");
  const alphabeticalBtn = document.getElementById("alphabeticalBtn");

  if (!sheetOrderBtn || !alphabeticalBtn) return;

  const savedMode = localStorage.getItem("sortMode") || "sheet";
  updateSortModeButtons(savedMode);

  sheetOrderBtn.addEventListener("click", () => {
    setSortMode("sheet");
  });

  alphabeticalBtn.addEventListener("click", () => {
    setSortMode("alphabetical");
  });

  function setSortMode(mode) {
    localStorage.setItem("sortMode", mode);
    updateSortModeButtons(mode);
    showToast(`Sort mode set to: ${mode === "sheet" ? "Sheet Order" : "Alphabetical"}`);
    document.dispatchEvent(new CustomEvent("sortModeChanged", { detail: mode }));
  }

  function updateSortModeButtons(mode) {
    sheetOrderBtn.classList.toggle("active", mode === "sheet");
    alphabeticalBtn.classList.toggle("active", mode === "alphabetical");
  }
});

// ============================================================
// GLOBAL PANIC ESCAPE (Esc key)
// ============================================================
document.addEventListener("keydown", (e) => {
  // Don't fire shortcuts when typing in inputs
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  if (e.key === "Escape") {
    const panicURL = localStorage.getItem("panicURL");
    if (panicURL) window.location.href = panicURL;
  }

  // R — Re-fetch all assets from sheet then rebuild every card
  if (e.key === "r" || e.key === "R") {
    if (typeof window.reloadAssets === "function") {
      const now = Date.now();
      if (window._reloading) {
        showToast("Already refreshing, idoit...");
      } else if (now < (window._reloadCooldownUntil || 0)) {
        const secs = Math.ceil((window._reloadCooldownUntil - now) / 1000);
        showToast(`Cooldown: ${secs}s remaining`);
      } else {
        showToast("Re-fetching assets...");
        // Hide all current cards immediately so the loader is unobstructed.
        // Use the cached index if available — avoids a live DOM scan.
        const _toHide = window._allCards?.length ? window._allCards
          : [...document.querySelectorAll(".asset-card")];
        _toHide.forEach(c => { c.style.display = "none"; });
        const _savedScrollY = window.scrollY;
        window.reloadAssets()
          .then(ok => {
            if (ok) showToast("Assets reloaded!");
            window.scrollTo({ top: _savedScrollY, behavior: "instant" });
          })
          .catch(() => showToast("Reload failed — check connection."));
      }
    }
  }

  // T — Toggle incognito mode cycle: off → about → blob → off
  if (e.key === "t" || e.key === "T") {
    const modes = ["off", "about", "blob"];
    const current = localStorage.getItem("incognitoMode") || "off";
    const next = modes[(modes.indexOf(current) + 1) % modes.length];
    localStorage.setItem("incognitoMode", next);

    const indicator = document.getElementById("incognitoIndicator");
    if (next === "off") {
      showToast("Normal mode — standard new tab");
      if (indicator) indicator.classList.remove("show");
    } else if (next === "about") {
      showToast("Incognito: about:blank mode");
      if (indicator) { indicator.textContent = "about:blank mode"; indicator.classList.add("show"); }
    } else if (next === "blob") {
      showToast("Incognito: blob:null mode — switched mode: blobNull system");
      if (indicator) { indicator.textContent = "blob:null mode"; indicator.classList.add("show"); }
    }
  }
});

// ---- index.js ----
// Handles update popup, dashboard toggle, scroll-to-top, and profile picture

document.addEventListener("DOMContentLoaded", () => {
  // --- Cached DOM elements ---
  const popup = document.getElementById("updatePopup");
  const video = document.getElementById("updateVideo");
  const closeBtn = document.getElementById("closeUpdateBtn");
  const viewUpdateBtn = document.getElementById("viewUpdateBtn");
  const viewInfoBtn = document.getElementById("viewUpdateInfoBtn");
  const dontShowBtn = document.getElementById("dontShowBtn");
  const dashboardMenu = document.getElementById("dashboardMenu");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const toTopBtn = document.getElementById("toTopBtn");
  const pfp = document.getElementById("pfp");

  // --- UPDATE POPUP BUTTON WIRING ---
  // (Popup visibility is managed by initUpdatePopup in the main IIFE)
  function stopVideo() {
    if (!video) return;
    const src = video.src;
    video.src = "";
    video.src = src;
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove("show");
    sessionStorage.setItem("updatePopupClosed", "true");
    stopVideo();
  }

  if (popup) {
    closeBtn?.addEventListener("click", closePopup);
    dontShowBtn?.addEventListener("click", () => {
      const version = document.getElementById("footerVersion")?.textContent?.replace("Version ", "").trim() || "v0.8";
      localStorage.setItem("dismissedUpdateVersion", version);
      closePopup();
    });

    viewUpdateBtn?.addEventListener("click", () =>
      window.open("system/pages/updates.html", "_blank")
    );
    viewInfoBtn?.addEventListener("click", () =>
      window.open("system/pages/update-info.html", "_blank")
    );
  }

  // --- DASHBOARD TOGGLE ---
  if (dashboardBtn && dashboardMenu) {
    dashboardMenu.style.display = "none";
    dashboardMenu.style.opacity = 0;
    dashboardMenu.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    const toggleDashboard = (e) => {
      e.stopPropagation();
      const isVisible = dashboardMenu.style.display === "block";
      if (isVisible) {
        dashboardMenu.style.opacity = 0;
        dashboardBtn.setAttribute("aria-expanded", "false");
        dashboardMenu.setAttribute("aria-hidden", "true");
        setTimeout(() => (dashboardMenu.style.display = "none"), 300);
      } else {
        dashboardMenu.style.display = "block";
        dashboardBtn.setAttribute("aria-expanded", "true");
        dashboardMenu.setAttribute("aria-hidden", "false");
        setTimeout(() => (dashboardMenu.style.opacity = 1), 10);
      }
    };

    dashboardBtn.addEventListener("click", toggleDashboard);
    document.addEventListener("click", (e) => {
      const isOpen = dashboardMenu.style.display === "block";
      const clickedOutside = !dashboardMenu.contains(e.target) && e.target !== dashboardBtn;
      if (isOpen && clickedOutside) toggleDashboard(e);
    });
  }

  // --- SCROLL TO TOP BUTTON ---
  if (toTopBtn) {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const handleScroll = () => {
      const scrollY = document.body.scrollTop || document.documentElement.scrollTop;
      toTopBtn.style.display = scrollY > 200 ? "block" : "none";
    };

    window.addEventListener("scroll", handleScroll);
    toTopBtn.addEventListener("click", scrollToTop);
    toTopBtn.addEventListener("dblclick", scrollToTop);

    handleScroll(); // initialize state
  }

  // --- PROFILE PICTURE LOADER ---
  if (pfp) {
    const savedPic = localStorage.getItem("profilePic");
    if (savedPic) pfp.src = savedPic;
  }
});

/* ==========================================================
   WannaSmile | Unified JS Loader & UI Logic
   Preloader-Free Rewrite
   ========================================================== */
(() => {
  "use strict";

  /* ---------------------------
     Utilities
  --------------------------- */
  const clamp = (v, a = 0, b = 100) => Math.min(b, Math.max(a, v));
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const safeStr = (v) => (v == null ? "" : String(v));
  const rafAsync = () => new Promise((r) => requestAnimationFrame(r));
  const debounce = (fn, ms = 150) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  /* ---------------------------
     Sort Mode Control
  --------------------------- */
  const getSortMode = () => localStorage.getItem("sortMode") || "sheet";

  // One Collator instance reused for all title comparisons — far cheaper than
  // constructing a new one per localeCompare call inside a sort loop.
  const _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  const fastCompare = (a, b) => _collator.compare(a, b);

  document.addEventListener("sortModeChanged", () => {
    if (window.assetsData && typeof window.refreshCards === "function") {
      window.refreshCards();
    }
  });

  /* ---------------------------
     DOM & Config Initialization
  --------------------------- */
  function initElements() {
    const $ = (sel) => {
      try {
        if (!sel) return null;
        if (/^[A-Za-z0-9\-_]+$/.test(sel)) return document.getElementById(sel);
        return document.querySelector(sel) || null;
      } catch {
        return null;
      }
    };

    window.dom = {
      container: $("#container"),
      pageIndicator: $(".page-indicator") || $("#page-indicator"),
      searchInput: $("#searchInputHeader"),
      searchBtn: $("#searchBtnHeader"),
      updatePopup: $("#updatePopup"),
      updatePopupContent: $(".update-popup-content"),
      viewUpdateBtn: $("#viewUpdateBtn"),
      viewUpdateInfoBtn: $("#viewUpdateInfoBtn"),
      closeUpdateBtn: $("#closeUpdateBtn"),
      dontShowBtn: $("#dontShowBtn"),
      updateVideo: $("#updateVideo"),
    };

    window.config = {
         fallbackImage:"https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/404_blank.png",
         fallbackLink:"https://01110010-00110101.github.io./source/dino/",
         gifBase:"https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/GIF/",
         sheetUrl:"https://script.google.com/macros/s/AKfycbyRGROJ70xwLEBLiWAw_7iSX42VkJSxg671wOmjfYo_cvvaDSs9mbXpK6S1EKa9oYQByA/exec", 
       //devBuildUrl:"https://script.google.com/macros/s/AKfycbzYEREHz2GuCYaHQzpvvHnUvvsRhIC8EbyhbCbrfQXkSu6gkP7kb5iIL5LY4WAF3rfFow/exec",
         updateTrailerSrc:"",
         updateLink:"system/pages/version-log.html",
         quotesJson:"https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/json/quotes.json",
    };
  }

  /* ---------------------------
     Favorites System
  --------------------------- */
  function initFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      window.favorites = new Set(stored.map((s) => safeStr(s).toLowerCase()));
    } catch {
      window.favorites = new Set();
    }

    window.saveFavorites = () =>
      localStorage.setItem("favorites", JSON.stringify([...window.favorites]));

    window.refreshCards = () => {
      if (!window.assetsData || typeof createAssetCards !== "function") return [];
      const _savedScrollY = window.scrollY;
      const promises = createAssetCards(window.assetsData);
      if (typeof renderPage === "function") renderPage();
      if (typeof startPlaceholderCycle === "function") startPlaceholderCycle();
      Promise.all(promises.map(p => p.promise ?? p).filter(Boolean))
        .finally(() => window.scrollTo({ top: _savedScrollY, behavior: "instant" }));
      return promises;
    };
  }

  /* ---------------------------
     Shared: parse GIF frame delays from binary to get total duration in ms.
     Cached after first fetch so containerLoader doesn't re-fetch.
  --------------------------- */
  let _loadedGifDurationCache = null;

  const LOADED_GIF = "https://raw.githubusercontent.com/mcmattyobriore/yogurtyooo.github.io/main/system/images/GIF/loaded.gif";

  function getLoadedGifDuration() {
    // Always fetch the root loaded.gif for duration — theme overrides use the
    // same duration cache since custom gifs should match timing, or we fall back.
    if (_loadedGifDurationCache !== null) return Promise.resolve(_loadedGifDurationCache);
    return fetch(LOADED_GIF)
      .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.arrayBuffer(); })
      .then(buf => {
        const b = new Uint8Array(buf);
        let ms = 0, i = 13;
        if (b[10] & 0x80) i += 3 * (1 << ((b[10] & 0x07) + 1));
        while (i < b.length) {
          const block = b[i];
          if (block === 0x3B) break;
          if (block === 0x2C) {
            i += 10;
            if (b[i - 1] & 0x80) i += 3 * (1 << ((b[i - 1] & 0x07) + 1));
            i++;
            while (i < b.length) { const len = b[i++]; if (!len) break; i += len; }
          } else if (block === 0x21) {
            if (b[i + 1] === 0xF9) ms += (b[i + 4] | (b[i + 5] << 8)) * 10;
            i += 2;
            while (i < b.length) { const len = b[i++]; if (!len) break; i += len; }
          } else { i++; }
        }
        _loadedGifDurationCache = ms > 0 ? ms : 2000;
        return _loadedGifDurationCache;
      });
  }

  /* ---------------------------
     playLoadedGifThenHide
     Swaps loaderEl to loaded.gif (plays once — no-loop GIF),
     waits for full playthrough, then fades opacity to 0.
     hideParent=true also hides loaderEl.parentElement after fade.
  --------------------------- */
  /* ---------------------------
     Asset Card Builder
  --------------------------- */
  function createAssetCards(data) {
    const { container } = dom || {};
    if (!container) return [];

    // _versionReady is resolved synchronously before createAssetCards is called
    // (applyVersionUI + _resolveVersionReady run in loadAssets before this).
    // version-pending is no longer needed — ws-loading covers the loading state.

    // Wipe old cards (containerLoader is now outside #container, safe to clear)
    container.innerHTML = "";
    const imagePromises = [];
    const frag = document.createDocumentFragment();
    const sortMode = getSortMode();
    const isFav = (t) => window.favorites.has(safeStr(t).toLowerCase());

    // Debounced renderPage for off-page card onloads — many parallel image
    // fetches coalesce into one renderPage pass instead of firing per image.
    const _debouncedRenderPage = debounce(() => {
      if (typeof window.renderPage === "function") window.renderPage();
    }, 50);

    // ── Determine active page ─────────────────────────────────────────────────
    // Lock it here so both createAssetCards and the batch reveal agree on the
    // same value. Never read window.currentPage again inside this function.
    const activePage = +window.currentPage || +sessionStorage.getItem("currentPage") || 1;

    // Active-page cards are held until ALL their images decode, then revealed
    // together with a clean sequential stagger starting from zero.
    const activePageBatch = [];

    // ── Sort data ─────────────────────────────────────────────────────────────
    // Step 1: apply user sort mode within each page (sheet order = no sort).
    let sorted = Array.isArray(data) ? data.slice() : [];
    if (sortMode === "alphabetical") {
      sorted.sort((a, b) => fastCompare(safeStr(a.title), safeStr(b.title)));
    }

    // Step 2: bucket-sort by page in O(n) — keeps within-page order from step 1.
    // DOM insertion order is always page-ascending so renderPage/getPages are stable.
    // fetchPriority=high is applied to active-page imgs independently below.
    const pageBuckets = new Map();
    for (const asset of sorted) {
      const p = Number(asset.page) || 1;
      const status = safeStr(asset.status).toLowerCase();
      if (status === "hide" || status === "hidden") continue;
      if (!pageBuckets.has(p)) pageBuckets.set(p, []);
      pageBuckets.get(p).push(asset);
    }
    // Build page-ordered array: active page first in fetch order but DOM order
    // must be page-ascending. We'll track fetchPriority per asset separately.
    const pageNums = [...pageBuckets.keys()].sort((a, b) => a - b);
    // Build the final ordered array for DOM — always ascending by page.
    const domOrdered = [];
    for (const p of pageNums) domOrdered.push(...pageBuckets.get(p));

    const badgeMap = {
      featured: "https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/featured-cover.png",
      new:      "https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/new-cover.png",
      fixed:    "https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/fixed-cover.png",
      fix:      "https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/fixing.png",
    };

    // ── Build cards in stable DOM order (page 1 → 2 → 3 …) ──────────────────
    // We set img.fetchPriority based on whether the card belongs to activePage.
    for (const asset of domOrdered) {
      const title       = safeStr(asset.title).trim();
      const author      = safeStr(asset.author).trim();
      const imageSrc    = safeStr(asset.image) || config.fallbackImage;
      const link        = safeStr(asset.link)  || config.fallbackLink;
      const pageNum     = Number(asset.page)   || 1;
      const status      = safeStr(asset.status).toLowerCase();
      const statusField = safeStr(asset.type || asset.status || "").toLowerCase();
      const isActivePage = pageNum === activePage;

      // Skip hidden assets entirely
      if (status === "hide" || status === "hidden") continue;

      const card = document.createElement("div");
      card.className = "asset-card";
      Object.assign(card.dataset, {
        title: title.toLowerCase(), author: author.toLowerCase(),
        page: String(pageNum), filtered: "true",
      });

      const a = document.createElement("a");
      a.href = link;
      a.className = "asset-link";
      a.title = `Click to open "${title || 'this asset'}" in a new tab!`;
      // target/_blank intentionally omitted — the click interceptor handles
      // all navigation: sheet-matched links get the embed wrapper, others
      // get a normal new tab opened programmatically.

      // Click interceptor — sheet-matched links are routed based on extension + incognito mode.
      // .txt / .html.txt → always fetch & inject as sanitized blob embed (URL never exposed).
      // other sheet links → honour the "T" toggle: off=new tab | about=about:blank | blob=blob:null.
      a.addEventListener("click", async (e) => {
        e.preventDefault();

        const incognitoMode = localStorage.getItem("incognitoMode") || "off"; // off | about | blob

        const matched = window.assetsData?.find(
          (row) => safeStr(row.link).trim() === link
        );

        const resolvedLink  = matched ? safeStr(matched.link).trim()  : link;
        const renderTitle   = matched ? safeStr(matched.title).trim() || "Embed" : "Embed";
        const renderFav     = matched ? safeStr(matched.image).trim() || ""      : "";

        // ── .txt / .html.txt injection path ──────────────────────────────────────
        // Fetch content first, stage it through a hidden textarea to normalise
        // encoding, sanitize, then open a blob tab — real URL is never navigated.
        if (resolvedLink.match(/\.html\.txt$/) || resolvedLink.match(/\.txt$/)) {

          let rawHTML = "";
          try {
            const res = await fetch(resolvedLink);
            if (!res.ok) throw new Error("HTTP " + res.status);
            rawHTML = await res.text();
          } catch (err) {
            console.error("[txt loader] fetch failed:", err);
            return;
          }

          // Stage through a hidden textarea — the txt file is raw HTML source,
          // textarea.value reads it back as a plain string with no DOM parsing,
          // giving us a clean copy that sanitizeHTML can strip safely.
          const stage = document.createElement("textarea");
          stage.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
          stage.readOnly = true;
          stage.value = rawHTML;
          document.body.appendChild(stage);
          const staged = stage.value;  // clean string read-back
          document.body.removeChild(stage);

          // Sanitize and open directly as a blob — no embed wrapper, the txt
          // content is already a full HTML page and renders correctly on its own.
          const sanitized = sanitizeHTML(staged);
          const pageBlob  = new Blob([sanitized], { type: "text/html;charset=utf-8" });
          const pageURL   = URL.createObjectURL(pageBlob);
          window.open(pageURL, "_blank");
          // Do NOT revoke — tab must remain accessible/refreshable

          return; // skip incognito toggle logic below
        }

        // ── Normal / incognito toggle path (non-txt links) ───────────────────────
        // Shared embed shell builder for about:blank and blob:null modes
        const buildEmbedShell = (embedSrc) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${renderTitle}</title>
  <link rel="icon" href="${renderFav}" crossorigin="anonymous" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    embed {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      display: block;
    }
    #refreshBtn {
      position: fixed;
      top: 8px; right: 8px;
      z-index: 9999;
      background: rgba(0,0,0,0.6);
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 4px 10px;
      font-family: monospace;
      font-size: 13px;
      cursor: pointer;
      opacity: 0.4;
      transition: opacity 0.2s;
    }
    #refreshBtn:hover { opacity: 1; }
  </style>
</head>
<body>
  <embed id="frame" src="${embedSrc}" />
  <button id="refreshBtn" title="Refresh" onclick="document.getElementById(\'frame\').src=document.getElementById(\'frame\').src">↺</button>
</body>
</html>`;

        if (incognitoMode === "blob" && matched) {
          const html    = buildEmbedShell(resolvedLink);
          const blob    = new Blob([html], { type: "text/html;charset=utf-8" });
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, "_blank");
          // NOTE: blob:null — do NOT revoke so tab stays refreshable/saveable
        } else if (incognitoMode === "about" && matched) {
          const newTab = window.open("about:blank", "_blank");
          if (newTab) {
            newTab.document.write(buildEmbedShell(resolvedLink));
            newTab.document.close();
          }
        } else if (matched) {
          // NORMAL — open the link directly in a new tab
          window.open(resolvedLink, "_blank");
        } else {
          // No sheet match — open the raw link in a normal new tab
          window.open(link, "_blank");
        }
      });

      const wrapper = document.createElement("div");
      wrapper.className = "asset-img-wrapper";
      Object.assign(wrapper.style, { position:"relative", display:"inline-block", borderRadius:"14px" });

      const img = document.createElement("img");
      img.alt = title; img.className = "asset-img";
      // Smart loading: current-page images get high fetch priority so they
      // appear first. Off-page images still load normally (never lazy — they'd
      // stall on display:none cards and never resolve).
      img.fetchPriority = isActivePage ? "high" : "auto";

      // each card reveals itself independently with stagger — EXCEPT active-page
      // cards, which wait for the whole page's images to finish before any of
      // them appear (batch reveal, still staggered).
      const imgPromise = new Promise((resolve) => {
        if (isActivePage) {
          // Collect card — batch reveal fires after all active-page images loaded.
          activePageBatch.push(card);
          img.onload  = () => resolve();
          img.onerror = () => {
            img.src     = config.fallbackImage;
            img.onload  = () => resolve();
            img.onerror = () => resolve();
          };
        } else {
          // Off-page: add .ready when image loads, then immediately enforce
          // page visibility via debounced renderPage so CSS display:flex
          // from .ready doesn't cause cards to appear on the wrong page.
          const offReady = () => {
            card.classList.add("ready");
            _debouncedRenderPage();
            resolve();
          };
          img.onload  = offReady;
          img.onerror = () => { img.src = config.fallbackImage; img.onload = offReady; img.onerror = offReady; };
        }
        img.src = imageSrc;
      });
      imagePromises.push({ promise: imgPromise, page: pageNum });
      wrapper.appendChild(img);

      const addOverlay = (src, alt, cls, fullCover = false) => {
        const o = document.createElement("img");
        o.src = src; o.alt = alt; o.className = `status-overlay ${cls}`;
        Object.assign(o.style, { position:"absolute", top:"0", left:"0", width:"100%", height:"100%",
          objectFit:"cover", pointerEvents:"none", zIndex: fullCover ? "10" : "5" });
        wrapper.appendChild(o);
      };

      if (statusField === "featured") addOverlay(badgeMap.featured, "featured badge", "overlay-featured");
      if (statusField === "new")      addOverlay(badgeMap.new,      "new badge",      "overlay-new");
      if (statusField === "fixed")    addOverlay(badgeMap.fixed,    "fixed badge",    "overlay-fixed");
      if (["new","updated"].includes(status))
        addOverlay(`${config.gifBase}${status}.gif`, `${status} badge`, `status-gif status-${status}`);
      if (status === "fix") { addOverlay(badgeMap.fix, "fixing overlay", "overlay-fix", true); card.classList.add("fix"); }
      if (status === "soon") card.classList.add("soon");
      if (status === "cooked" && (statusField === "dmca" || statusField === "blocked")) {
        img.src = "cooked.png";
        img.style.imageRendering = "pixelated";
        card.classList.add("cooked");
      }
      if (status === "disco") img.classList.add("img-disco");

      // Shiny: add img-shiny to the wrapper div — <img> is a replaced element
      // so ::after is not supported on it in browsers. The wrapper is
      // position:relative so the ::after pseudo sits directly over the img.
      if (status === "shiny") {
        wrapper.classList.add("img-shiny");
      }

      // Animated: randomly swaps image for animated version every 3-60s,
      // shows for 3-8s then reverts. asset.animated holds the mp4/gif URL.
      const animatedSrc = safeStr(asset.animated || "").trim();
      if (status === "animated" && animatedSrc) {
        const isVideo = /[.](mp4|webm|ogg)([?]|$)/i.test(animatedSrc);
        let animEl = null, animTimeout = null, isAnimating = false;

        const scheduleNext = () => {
          animTimeout = setTimeout(playAnim, (3 + Math.random() * 57) * 1000);
        };
        const playAnim = () => {
          if (isAnimating) return;
          isAnimating = true;
          animEl = isVideo ? document.createElement("video") : document.createElement("img");
          animEl.src = animatedSrc;
          if (isVideo) { animEl.autoplay = true; animEl.muted = true; animEl.loop = false; animEl.playsInline = true; }
          animEl.className = "animated-swap";
          wrapper.insertBefore(animEl, wrapper.firstChild);
          setTimeout(() => {
            animEl?.remove(); animEl = null; isAnimating = false; scheduleNext();
          }, (3 + Math.random() * 5) * 1000);
        };

        if (img.complete && img.naturalWidth) scheduleNext();
        else img.addEventListener("load", () => scheduleNext(), { once: true });

        const obs = new MutationObserver(() => {
          if (!document.contains(card)) { clearTimeout(animTimeout); animEl?.remove(); obs.disconnect(); }
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }

      a.appendChild(wrapper);
      const titleEl  = document.createElement("h3"); titleEl.textContent  = title  || "Untitled";
      const authorEl = document.createElement("p");  authorEl.textContent = author || "";

      if (status === "cooked" && (statusField === "dmca" || statusField === "blocked")) {
        a.title = statusField === "dmca" ? "DMCA Takedown — unavailable" : "Blocked — unavailable";
        authorEl.textContent = statusField === "dmca" ? "DMCA TAKEDOWN" : "BLOCKED D:";
      }

      const star = document.createElement("button");
      star.className = "favorite-star"; star.textContent = isFav(title) ? "★" : "☆";
      Object.assign(star.style, { background:"transparent", border:"none", cursor:"pointer" });
      star.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const key = title.toLowerCase();
        if (window.favorites.has(key)) window.favorites.delete(key); else window.favorites.add(key);
        saveFavorites(); star.textContent = window.favorites.has(key) ? "★" : "☆";
      });

      card.append(a, titleEl, authorEl, star);
      frag.appendChild(card);

      // Register in card index for O(1) page lookups — no DOM scan needed.
      if (!window._cardIndex.has(pageNum)) window._cardIndex.set(pageNum, []);
      window._cardIndex.get(pageNum).push(card);
      window._allCards.push(card);
    }

    container.appendChild(frag);

    // ── Active-page batch reveal ──────────────────────────────────────────────
    // All images for the active page must decode before any card shows.
    // imagePromises already carries only active-page entries in activePageBatch.
    const activePromises = imagePromises
      .filter(p => p.page === activePage)
      .map(p => p.promise);

    if (activePromises.length > 0) {
      Promise.all(activePromises).then(() => {
        const last = activePageBatch.length - 1;
        activePageBatch.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add("ready");
            // After the final card gets .ready, run renderPage once so all
            // active-page cards get display:flex and everything else stays none.
            if (i === last && typeof window.renderPage === "function") window.renderPage();
          }, i * 40);
        });
        runLoaderSequence();
      });
    } else {
      runLoaderSequence();
    }
    return imagePromises;
  }

  /* ---------------------------
     Paging + Search + Filter
  --------------------------- */
  function initPaging() {
    const { container, pageIndicator, searchInput, searchBtn } = dom || {};
    if (!container) return;

    // Initialise card index — populated by createAssetCards, consumed here.
    if (!window._cardIndex) window._cardIndex = new Map();
    if (!window._allCards)  window._allCards  = [];

    const quoteWrapper = document.getElementById("quoteWrapper");

let errorGif = document.getElementById("noResultsGif");
if (!errorGif) {
  errorGif = document.createElement("img");
  errorGif.id = "noResultsGif";
  // Use theme-aware searching gif; fall back to root "searching.gif"
  const _searchTheme = document.documentElement.getAttribute("theme") || "root";
  errorGif.src = (typeof getThemeGif === "function")
    ? getThemeGif(_searchTheme, "searching")
    : "searching.gif";
  errorGif.draggable = false;
  Object.assign(errorGif.style, {
    display:         "none",
    position:        "absolute",
    top:             "50%",
    left:            "50%",
    transform:       "translate(-50%, 0)",
    transformOrigin: "50% 0%",
    width:           "128px",
    height:          "128px",
    opacity:         "0",
    transition:      "opacity 0.25s ease",
    pointerEvents:   "auto",
    cursor:          "grab",
    zIndex:          "1000",
    imageRendering:  "pixelated",
  });
  container.parentElement.appendChild(errorGif);
  initGifDrag(errorGif);
}

    // ── Card index — built once, never re-scanned ─────────────────────────────
    // Map<pageNum, Card[]> populated during card creation and exposed on window
    // so renderPage/prevPage/nextPage never need querySelectorAll.
    window._cardIndex = new Map();   // pageNum → [card, ...]
    window._allCards  = [];          // flat list for filter/search

    const getAllCards       = () => window._allCards;
    const getFilteredCards  = () => window._allCards.filter(c => c.dataset.filtered === "true");
    const getPages          = () => [...window._cardIndex.keys()].sort((a, b) => a - b);

    const updateVisibility = () => {
      const visibleCards = getFilteredCards().length;
      if (visibleCards === 0) {
        errorGif.style.display = "block";
        requestAnimationFrame(() => (errorGif.style.opacity = "1"));
      } else {
        errorGif.style.opacity = "0";
        setTimeout(() => {
          if (parseFloat(errorGif.style.opacity) === 0)
            errorGif.style.display = "none";
        }, 250);
      }
    };

    window.renderPage = () => {
      const pages = getPages();
      if (!pages.length) return;

      // Restore saved page once per load cycle.
      if (!window._pageRestored) {
        const saved = +sessionStorage.getItem("currentPage") || pages[0];
        window.currentPage = pages.includes(saved) ? saved : pages[0];
        window._pageRestored = true;
      }

      const cur = +window.currentPage;

      // Only operate on cards that have .ready — unready cards are display:none
      // by CSS and must stay that way until their image loads. Setting display
      // explicitly here wins over the CSS class rule (inline > class specificity).
      for (const [pageNum, cards] of window._cardIndex) {
        const onThisPage = pageNum === cur;
        for (const c of cards) {
          if (!c.classList.contains("ready")) continue;
          const want = (onThisPage && c.dataset.filtered === "true") ? "flex" : "none";
          if (c.style.display !== want) c.style.display = want;
        }
      }

      if (pageIndicator) {
        const idx = pages.indexOf(cur);
        pageIndicator.textContent = `Page ${idx + 1} of ${pages.length}`;
      }

      sessionStorage.setItem("currentPage", cur);
      updateVisibility();
    };

    window.filterAssets = (q) => {
      const query = safeStr(q).toLowerCase().trim();
      const words = query.length ? query.split(/\s+/) : null;
      const isSearching = query.length > 0;

      // Single pass over _allCards — no intermediate arrays.
      for (const c of window._allCards) {
        if (!words) {
          c.dataset.filtered = "true";
          continue;
        }
        const haystack = c.dataset.title + " " + c.dataset.author;
        let hit = haystack.includes(query);
        if (!hit) for (const w of words) if (haystack.includes(w)) { hit = true; break; }
        c.dataset.filtered = hit ? "true" : "false";
      }

      if (isSearching) {
        for (const c of window._allCards) {
          if (!c.classList.contains("ready")) continue;
          c.style.display = c.dataset.filtered === "true" ? "flex" : "none";
        }
        if (pageIndicator) pageIndicator.textContent = "Searching all pages…";
        const pagesAnchor = document.querySelector(".pages-anchor");
        if (pagesAnchor) pagesAnchor.style.visibility = "hidden";
      } else {
        const pagesAnchor = document.querySelector(".pages-anchor");
        if (pagesAnchor) pagesAnchor.style.visibility = "";
        renderPage();
      }

      updateVisibility();
    };

    window.prevPage = () => {
      if (window._reloading) return;
      const pages = getPages();
      const i = pages.indexOf(+window.currentPage);
      window.currentPage = i <= 0 ? pages[pages.length - 1] : pages[i - 1];
      renderPage();
    };

    window.nextPage = () => {
      if (window._reloading) return;
      const pages = getPages();
      const i = pages.indexOf(+window.currentPage);
      window.currentPage = i === -1 || i === pages.length - 1 ? pages[0] : pages[i + 1];
      renderPage();
    };

    searchBtn?.addEventListener("click", () =>
      filterAssets(searchInput.value)
    );
    searchInput?.addEventListener(
      "input",
      debounce(() => filterAssets(searchInput.value), 200)
    );

    window.currentPage = +sessionStorage.getItem("currentPage") || 1;
    renderPage();
  }

  /* ---------------------------
     Placeholder Cycle
  --------------------------- */
  function initPlaceholders() {
    const { searchInput } = dom || {};
    if (!searchInput) return;

    const FADE = 400,
      HOLD = 4000;

    const fadePlaceholder = (input, text, cb) => {
      input.classList.add("fade-out");
      setTimeout(() => {
        input.placeholder = text;
        input.classList.remove("fade-out");
        input.classList.add("fade-in");
        setTimeout(() => {
          input.classList.remove("fade-in");
          cb?.();
        }, FADE);
      }, FADE);
    };

    window.startPlaceholderCycle = () => {
      if (window._placeholderRunning) return;
      window._placeholderRunning = true;
      const loop = async () => {
        const curPageCards = window._cardIndex?.get(+window.currentPage) || [];
        const visible = curPageCards.filter(c => c.dataset.filtered === "true").length;
        await new Promise((r) =>
          fadePlaceholder(searchInput, `${visible} assets on this page`, r)
        );
        await delay(HOLD);
        await new Promise((r) =>
          fadePlaceholder(searchInput, "Search assets...", r)
        );
        await delay(HOLD);
        if (window._placeholderRunning) loop();
      };
      loop();
    };
  }

  /* ---------------------------
     Update Popup
  --------------------------- */
  // Cards wait on this before revealing. Resolved by initUpdatePopup once the
  // version fetch completes (success or failure) — so on refetch it's already
  // settled and cards pop in immediately as their images load.
  let _resolveVersionReady;
  window._versionReady = new Promise(res => { _resolveVersionReady = res; });

  // initUpdatePopup is now inlined into loadAssets — one fetch serves both.
  function applyVersionUI(raw) {
    const p = dom.updatePopup;
    const footerAnchor = document.getElementById("footerVersion");
    try {
      const lastRow = raw.filter((d) => d.version?.toString().trim()).slice(-1)[0];
      const version = lastRow?.version?.toString().trim() || "V0.8";
      const message = lastRow?.message?.toString().trim() || "";
      if (footerAnchor) footerAnchor.textContent = `Version ${version}`;
      if (p) {
        const titleEl = p.querySelector("h2");
        const msgEl = p.querySelector("p");
        if (titleEl) titleEl.textContent = `\u{1F389} Version ${version} Update!`;
        if (msgEl && message) msgEl.textContent = message;
        const dismissed = localStorage.getItem("dismissedUpdateVersion");
        const closed = sessionStorage.getItem("updatePopupClosed");
        if (!closed && dismissed !== version) {
          setTimeout(() => p.classList.add("show"), 600);
        }
      }
    } catch (e) {
      if (footerAnchor) footerAnchor.textContent = "Version V0.8";
    }
  }

  /* ---------------------------
     Asset Loader — single fetch for both version info and card data.
     Returns true on success, throws on failure so callers can react.
  --------------------------- */
  async function loadAssets() {
    let raw;
    try {
      const res = await fetch(config.sheetUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      raw = await res.json();
    } catch (err) {
      console.error("[loadAssets] fetch failed:", err);
      _resolveVersionReady();
      runCrashSequence();
      throw err;
    }

    // Populate version UI and unblock cards — all from the same payload.
    applyVersionUI(raw);
    _resolveVersionReady();

    const data = raw.filter((i) => Object.values(i).some((v) => safeStr(v).trim()));
    window.assetsData = data;

    // Lock the current page BEFORE building cards so createAssetCards and
    // renderPage agree on the same activePage. _pageRestored=true prevents
    // renderPage from overwriting it with a stale sessionStorage value.
    const savedPage = +sessionStorage.getItem("currentPage") || 1;
    window.currentPage = savedPage;
    window._pageRestored = true;

    // Show the target page immediately in the indicator so the user knows
    // which page is loading — total pages are filled in once cards are built.
    const _earlyIndicator = window.dom?.pageIndicator;
    if (_earlyIndicator) _earlyIndicator.textContent = `Page ${savedPage}`;

    const isFavPage = location.pathname.toLowerCase().includes("favorites.html");
    const filtered  = isFavPage
      ? data.filter((a) => window.favorites.has(safeStr(a.title).toLowerCase()))
      : data;

    // Pre-fetch loaded.gif duration now so it's cached by the time first card loads
    getLoadedGifDuration().catch(() => {});

    createAssetCards(filtered || []);
    // renderPage is called by the batch reveal after .ready is added to cards —
    // calling it here would run before any image has loaded (all cards still
    // display:none by CSS) and is a no-op that causes confusion.
    return true;
  }

  // ── runLoaderSequence ────────────────────────────────────────────────────
  // Called by createAssetCards the moment the first card image resolves.
  // Swaps #containerLoader img to loaded.gif, waits one playthrough, removes.
  // Guard prevents double-firing across multiple card onload events.
  window._loaderSequenceRunning = false;

  function runLoaderSequence() {
    if (window._loaderSequenceRunning) return;
    const loader = document.getElementById("containerLoader");
    if (!loader) return;
    window._loaderSequenceRunning = true;

    const img = loader.querySelector("img");
    if (!img) { loader.remove(); return; }

    const theme     = document.documentElement.getAttribute("theme") || "root";
    const loadedSrc = getThemeGif(theme, "loaded");

    function finish() {
      loader.remove();
      // Reveal the card container now that the loader GIF has finished.
      // Cards are already .ready and correctly page-filtered — they appear instantly.
      document.body.classList.remove("ws-loading");
    }

    getLoadedGifDuration()
      .then(ms => { img.src = loadedSrc; setTimeout(finish, ms); })
      .catch(()  => { img.src = loadedSrc; setTimeout(finish, 2000); });
  }

  // ── Per-theme GIF overrides ───────────────────────────────────────────────
  // Each theme can override any of: loading, loaded, searching, crash, ded.
  // "" means "fall back to root/redux defaults".
  // root and redux keep their existing absolute URLs as the canonical defaults.
  const ROOT_GIFS = {
    loading:   "loading.gif",
    loaded:    "https://raw.githubusercontent.com/mcmattyobriore/yogurtyooo.github.io/main/system/images/GIF/loaded.gif",
    searching: "searching.gif",
    crash:     "https://raw.githubusercontent.com/mcmattyobriore/yogurtyooo.github.io/main/system/images/GIF/crash.gif",
    ded:       "https://raw.githubusercontent.com/mcmattyobriore/yogurtyooo.github.io/main/system/images/GIF/ded.gif",
  };
  const REDUX_GIFS = { ...ROOT_GIFS }; // redux is identical to root

  const THEME_GIFS = {
    root:        ROOT_GIFS,
    redux:       REDUX_GIFS,
    classic:     { loading: "", loaded: "", searching: "", crash: "", ded: "" },
    light:       { loading: "", loaded: "", searching: "", crash: "", ded: "" },
    dark:        { loading: "", loaded: "", searching: "", crash: "", ded: "" },
    slackerish:  { loading: "", loaded: "", searching: "", crash: "", ded: "" },
    graduation:  { loading: "", loaded: "", searching: "", crash: "", ded: "" },
    "flower-boy":{ loading: "", loaded: "", searching: "", crash: "", ded: "" },
    igor:        { loading: "", loaded: "", searching: "", crash: "", ded: "" },
    "i-am-music":{ loading: "", loaded: "", searching: "", crash: "", ded: "" },
  };

  // Returns the resolved GIF src for (theme, key), falling back to root if "".
  function getThemeGif(theme, key) {
    const entry = THEME_GIFS[theme] || {};
    const val   = entry[key] || "";
    return val !== "" ? val : ROOT_GIFS[key];
  }

  // Expose so debug hotkeys and external code can call this on theme change.
  // Updates the live #containerLoader img and the searching gif if visible.
  window.applyThemeGifs = function(theme) {
    const t = theme || document.documentElement.getAttribute("theme") || "root";

    // Update loading gif in the live loader (if it's still showing loading state)
    const loaderImg = document.querySelector("#containerLoader img");
    if (loaderImg) {
      const currentSrc = loaderImg.src;
      // Only update if it still looks like a loading gif (not already loaded/crash)
      const isLoading = currentSrc.includes("loading.gif");
      if (isLoading) loaderImg.src = getThemeGif(t, "loading");
    }

    // Update the searching/no-results gif
    const searchGif = document.getElementById("noResultsGif");
    if (searchGif) searchGif.src = getThemeGif(t, "searching");
  };

  // ── runCrashSequence ─────────────────────────────────────────────────────
  // On load failure: swap to crash.gif (plays once), then ded.gif (loops forever).
  // Uses the same _loaderSequenceRunning guard so it never double-fires.
  const CRASH_GIF = ROOT_GIFS.crash;
  const DED_GIF   = ROOT_GIFS.ded;

  function runCrashSequence() {
    if (window._loaderSequenceRunning) return;
    const loader = document.getElementById("containerLoader");
    if (!loader) return;
    window._loaderSequenceRunning = true;

    const img = loader.querySelector("img");
    if (!img) return;

    const theme    = document.documentElement.getAttribute("theme") || "root";
    const crashSrc = getThemeGif(theme, "crash");
    const dedSrc   = getThemeGif(theme, "ded");

    // Crash means loading failed — remove ws-loading so the crash GIF is unobstructed
    // and the user can see the error state (container will be empty anyway).
    document.body.classList.remove("ws-loading");

    // Parse crash.gif duration from binary so we know exactly when to swap to ded.gif
    fetch(crashSrc)
      .then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer(); })
      .then(buf => {
        const b = new Uint8Array(buf);
        let ms = 0, i = 13;
        if (b[10] & 0x80) i += 3 * (1 << ((b[10] & 0x07) + 1));
        while (i < b.length) {
          const block = b[i];
          if (block === 0x3B) break;
          if (block === 0x2C) {
            i += 10;
            if (b[i - 1] & 0x80) i += 3 * (1 << ((b[i - 1] & 0x07) + 1));
            i++;
            while (i < b.length) { const len = b[i++]; if (!len) break; i += len; }
          } else if (block === 0x21) {
            if (b[i + 1] === 0xF9) ms += (b[i + 4] | (b[i + 5] << 8)) * 10;
            i += 2;
            while (i < b.length) { const len = b[i++]; if (!len) break; i += len; }
          } else { i++; }
        }
        return ms > 0 ? ms : 2000;
      })
      .catch(() => 2000)
      .then(ms => {
        img.src = crashSrc;
        setTimeout(() => { img.src = dedSrc; }, ms);
      });
  }

  // ── reloadAssets: public entry point for the R key ──────────────────────
  window._reloading           = false;
  window._reloadCooldownUntil = 0;
  const RELOAD_COOLDOWN_MS    = 15000;

  window.reloadAssets = async function () {
    if (window._reloading) return;
    window._reloading    = true;
    window._pageRestored = false;
    window._placeholderRunning = false;

    // Clear stale card index before the new set is built.
    window._cardIndex = new Map();
    window._allCards  = [];

    // Re-hide cards immediately — ws-loading collapses the container so
    // stale cards from the previous fetch don't flash during the reload.
    document.body.classList.add("ws-loading");

    // Re-inject #containerLoader
    const existingLoader = document.getElementById("containerLoader");
    if (existingLoader) existingLoader.remove();
    const loader = document.createElement("div");
    loader.id = "containerLoader";
    const _reloadTheme   = document.documentElement.getAttribute("theme") || "root";
    const _reloadLoadSrc = getThemeGif(_reloadTheme, "loading");
    loader.innerHTML = `<img src="${_reloadLoadSrc}" alt="" />`;
    document.body.appendChild(loader);
    window._loaderSequenceRunning = false;

    // Reset _versionReady so createAssetCards can gate on it again if needed.
    // On reload version is re-fetched too so we get a fresh gate.
    window._versionReady = Promise.resolve(); // already know version; resolve immediately
    _resolveVersionReady = () => {};           // no-op; promise is already resolved

    try {
      // Version is implicitly resolved (we trust the last fetch); go straight to assets.
      await loadAssets();
      // runLoaderSequence is triggered by the batch reveal inside createAssetCards.
      window._reloadCooldownUntil = Date.now() + RELOAD_COOLDOWN_MS;
      if (typeof window.startPlaceholderCycle === "function") window.startPlaceholderCycle();
      return true;
    } catch {
      throw new Error("reload failed");
    } finally {
      window._reloading = false;
    }
  };

  /* bootstrap — single fetch path:
       loadAssets() fetches the sheet once, extracts version info inline,
       resolves _versionReady, then builds cards. One round-trip total.
  */
  document.addEventListener("DOMContentLoaded", async () => {
    initElements();
    initFavorites();
    initPaging();
    initPlaceholders();

    if (typeof window.applyThemeGifs === "function") {
      window.applyThemeGifs(document.documentElement.getAttribute("theme") || "root");
    }

    await loadAssets().catch(() => {});

    if (typeof window.startPlaceholderCycle === "function") window.startPlaceholderCycle();
    console.log("Ready:)");
  });
})();
/* ==========================================================
   DOWNLOAD BUTTON — saves this HTML file to disk (local only)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const dlBtn = document.getElementById("downloadBtn");
  if (!dlBtn) return;

  dlBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Grab the full HTML source of the current document
    const html = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "wnasmilev08.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke shortly after so memory is freed
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  });
});

// ============================================================
// WELCOME MODAL
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("welcomeOverlay");
  const dismissBtn = document.getElementById("welcomeDismiss");
  const neverBtn = document.getElementById("welcomeNeverShow");
  const indicator = document.getElementById("incognitoIndicator");

  // Restore incognito indicator if mode was previously set
  const savedMode = localStorage.getItem("incognitoMode") || "off";
  if (indicator && savedMode !== "off") {
    indicator.textContent = savedMode === "blob" ? "blob:null mode" : "about:blank mode";
    indicator.classList.add("show");
  }

  const neverShow        = localStorage.getItem("welcomeNeverShow");
  const shownThisSession = sessionStorage.getItem("welcomeShown");
  if (!neverShow && !shownThisSession && overlay) {
    sessionStorage.setItem("welcomeShown", "true");
    const introAlreadyPlayed = sessionStorage.getItem("introPlayed");
    const delay = introAlreadyPlayed ? 300 : 9000;
    setTimeout(() => overlay.classList.add("show"), delay);
  }

  dismissBtn?.addEventListener("click", () => {
    overlay.classList.remove("show");
  });

  neverBtn?.addEventListener("click", () => {
    localStorage.setItem("welcomeNeverShow", "true");
    overlay.classList.remove("show");
  });

  // Also dismiss by clicking the backdrop
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("show");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("quoteWrapper");
  const box = document.getElementById("quoteBox");

  /* ==========================================
     Local Quotes — no network request needed
     ========================================== */
  const LOCAL_QUOTES = [
"VERSION 0.8 OUT NOW!!! :kirby/wake::kirby/wake::kirby/wake:",
"Dont ask me about page 6 and 7, they will be coming later today..",
":miku/joy::miku/joy::miku/joy:",
":miku/swaying.gif: DO YA LIKE THE NEW STUPIDS? :miku/swaying.gif: (the disco and shiny cards, yes?)",
":linux/typing.gif::linux/typing.gif::linux/typing.gif::linux/typing.gif:",
":stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz::stickman/spazz:",
":grad-run: the themes will be added back shortly Mr.West :grad-run:",
":csm/pochita-dance.gif::csm/pochita-dance.gif::csm/pochita-dance.gif:",
":kanye-gaming.jpeg: SOUNDSCAPE V1 COMING SOON! :kanye-gaming.jpeg:",
":miku/swaying.gif: Friday Night Funkin! :miku/swaying.gif:",
":nintendo/dance::nintendo/dance::nintendo/dance::nintendo/dance::nintendo/dance::nintendo/dance:",
"new system, yall were right. it was taking to long to load Xd (now individual loading + hide until rendered fully!)"
  ];

  let quotes = LOCAL_QUOTES;
  let pos = 0;
  let lastTime = null;

  const baseSpeed = 120;
  const slowSpeed = 70;
  const slowerSpeed = 30;

  let currentSpeed = baseSpeed;
  let isHoveringBox = false;
  let isHoveringText = false;
  let isMouseDown = false;

  /* ==========================================
     Quote Image Parser
     Supports:
     :name:
     :folder/name:
     :folder/name.gif:
     ========================================== */
  function parseQuoteWithImages(text) {
    return text.replace(
      /:([a-zA-Z0-9_\-\/]+(?:\.(png|gif|webp|jpg|jpeg))?):/gi,
      (match, path, ext) => {
        // Prevent path traversal
        if (path.includes("..")) return match;

        // Explicit extension → use as-is
        if (ext) {
          return `
            <img
              src="https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/stickers/${path}"
              class="quote-sticker"
              alt="${path}"
              loading="lazy"
            >
          `;
        }

        // No extension → png fallback to gif
        return `
          <img
            src="https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/stickers/${path}.png"
            class="quote-sticker"
            alt="${path}"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://raw.githubusercontent.com/01110010-00110101/01110010-00110101.github.io/main/system/images/stickers/${path}.gif';"
          >
        `;
      }
    );
  }

  function setQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    box.innerHTML = parseQuoteWithImages(quote);

    pos = wrapper.offsetWidth;
    box.style.transform = `translateX(${pos}px)`;
  }

  function updateSpeed() {
    if (isMouseDown) currentSpeed = 0;
    else if (isHoveringText) currentSpeed = slowerSpeed;
    else if (isHoveringBox) currentSpeed = slowSpeed;
    else currentSpeed = baseSpeed;
  }

  function animate(time) {
    if (lastTime !== null) {
      const dt = (time - lastTime) / 1000;
      pos -= currentSpeed * dt;
      box.style.transform = `translateX(${pos}px)`;

      if (pos + box.offsetWidth < 0) {
        setQuote();
      }
    }
    lastTime = time;
    requestAnimationFrame(animate);
  }

  function start() {
    setQuote();
    requestAnimationFrame(animate);
  }

  wrapper.addEventListener("mouseenter", () => {
    isHoveringBox = true;
    updateSpeed();
  });

  wrapper.addEventListener("mouseleave", () => {
    isHoveringBox = false;
    isHoveringText = false;
    updateSpeed();
  });

  box.addEventListener("mouseenter", () => {
    isHoveringText = true;
    updateSpeed();
  });

  box.addEventListener("mouseleave", () => {
    isHoveringText = false;
    updateSpeed();
  });

  wrapper.addEventListener("mousedown", () => {
    isMouseDown = true;
    updateSpeed();
  });

  // Listen on document so releasing the mouse outside the wrapper
  // never leaves isMouseDown stuck as true (which froze the ticker).
  document.addEventListener("mouseup", () => {
    if (!isMouseDown) return;
    isMouseDown = false;
    updateSpeed();
  });

  // Quotes are local — start immediately, no fetch needed.
  start();
});

/* ===============================
   WannaSmile Page Physics Input
   SAFE FOR all.js
   =============================== */

(() => {
  "use strict";

  // ---- CONFIG ----
  const PAGE_ACCEL = 0.9;
  const PAGE_FRICTION = 0.85;
  const PAGE_THRESHOLD = 1;
  const TAP_COOLDOWN = 300;

  // ---- STATE ----
  let velocity = 0;
  let lastFlip = 0;

  const keys = {
    left: false,
    right: false
  };

  // ---- SAFETY CHECK ----
  function canFlip() {
    return typeof window.nextPage === "function"
        && typeof window.prevPage === "function"
        && performance.now() - lastFlip > TAP_COOLDOWN;
  }

  function flipNext() {
    if (!canFlip()) return;
    lastFlip = performance.now();
    window.nextPage();
  }

  function flipPrev() {
    if (!canFlip()) return;
    lastFlip = performance.now();
    window.prevPage();
  }

  // ---- INPUT ----
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowLeft") keys.left = true;

    if (e.repeat) return;

    if (e.key === "ArrowRight") flipNext();
    if (e.key === "ArrowLeft") flipPrev();
  });

  document.addEventListener("keyup", e => {
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowLeft") keys.left = false;
  });

  // ---- PHYSICS LOOP ----
  function loop() {
    if (keys.right) velocity += PAGE_ACCEL;
    if (keys.left) velocity -= PAGE_ACCEL;

    velocity *= PAGE_FRICTION;

    if (velocity > PAGE_THRESHOLD) {
      flipNext();
      velocity = 0;
    }

    if (velocity < -PAGE_THRESHOLD) {
      flipPrev();
      velocity = 0;
    }

    if (Math.abs(velocity) < 0.01) velocity = 0;

    requestAnimationFrame(loop);
  }

  loop();
})();

/* ===============================
   DEBUG — Theme Hotkeys (1–9, 0=root)
   Persists selection to localStorage.
   0=root  1=redux  2=classic  3=light  4=dark
   5=slackerish  6=graduation  7=flower-boy
   8=igor  9=i-am-music
   =============================== */
(() => {
  const DEBUG_THEMES = {
    "0": "root",
    "1": "redux",
    "2": "classic",
    "3": "light",
    "4": "dark",
    "5": "slackerish",
    "6": "graduation",
    "7": "flower-boy",
    "8": "igor",
    "9": "i-am-music"
  };

  const THEME_LABELS = {
    "root":        "Root (default)",
    "redux":       "Redux",
    "classic":     "Classic",
    "light":       "Light",
    "dark":        "Dark",
    "slackerish":  "Slackerish",
    "graduation":  "Graduation",
    "flower-boy":  "Flower Boy",
    "igor":        "IGOR",
    "i-am-music":  "I Am Music"
  };

  // Toast notification
  function showToast(theme) {
    let toast = document.getElementById("__dbg_toast__");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "__dbg_toast__";
      Object.assign(toast.style, {
        position:     "fixed",
        bottom:       "20px",
        left:         "50%",
        transform:    "translateX(-50%)",
        background:   "rgba(0,0,0,0.82)",
        color:        "#fff",
        fontFamily:   "monospace",
        fontSize:     "13px",
        padding:      "7px 18px",
        borderRadius: "8px",
        zIndex:       "99999",
        pointerEvents:"none",
        opacity:      "0",
        transition:   "opacity 0.2s ease"
      });
      document.body.appendChild(toast);
    }

    clearTimeout(toast.__timer);
    toast.textContent = `[DEBUG] Theme → ${THEME_LABELS[theme]}`;
    toast.style.opacity = "1";
    toast.__timer = setTimeout(() => { toast.style.opacity = "0"; }, 1800);
  }

  function applyDebugTheme(key) {
    const theme = DEBUG_THEMES[key];
    if (!theme) return;

    // Set the html[theme] attribute — picked up by CSS selectors
    document.documentElement.setAttribute("theme", theme);

    // Sync window.currentTheme so any live JS that reads it stays consistent
    window.currentTheme = theme;

    // Persist to localStorage so the theme survives page reload
    localStorage.setItem("selectedTheme", theme);

    // Refresh theme-specific gifs immediately
    if (typeof window.applyThemeGifs === "function") window.applyThemeGifs(theme);

    showToast(theme);
    console.log(`[DEBUG] Theme set to "${theme}" via key ${key} — saved to localStorage`);
  }

  document.addEventListener("keydown", e => {
    // Skip if focus is inside a text input so typing isn't hijacked
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (DEBUG_THEMES[e.key] !== undefined) applyDebugTheme(e.key);
  });

  console.log(
    "%c[DEBUG] Theme hotkeys active: 0=Root 1=Redux 2=Classic 3=Light 4=Dark 5=Slackerish 6=Graduation 7=Flower Boy 8=IGOR 9=I Am Music (persisted to localStorage)",
    "color:#0af;font-family:monospace"
  );
})();

/* ===============================
   Grabbable searching.gif
   =============================== */
function initGifDrag(gif) {
  // SRC_IDLE respects per-theme searching gif; held/drop remain local
  const _dragTheme = document.documentElement.getAttribute("theme") || "root";
  const SRC_IDLE = (typeof getThemeGif === "function")
    ? getThemeGif(_dragTheme, "searching")
    : "searching.gif";
  const SRC_HELD = "held.gif";
  const SRC_DROP = "drop.gif";

  const SWAY_STRENGTH = 0.6;
  const RETURN_SPEED  = 0.08;
  const DROP_DURATION = 1600;

  let dragging = false;
  let dropping = false;
  let mouseX = 0, mouseY = 0, lastMouseX = 0;
  let rotation = 0;

  // Re-enable pointer events whenever the gif becomes visible
  new MutationObserver(() => {
    if (gif.style.display !== "none") {
      gif.style.pointerEvents = "auto";
    }
  }).observe(gif, { attributes: true, attributeFilter: ["style"] });

  gif.addEventListener("mousedown", (e) => {
    if (dropping) return;
    dragging = true;
    gif.src = SRC_HELD;
    gif.style.cursor = "grabbing";
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseX = mouseX;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    dropping = true;
    gif.style.cursor = "grab";
    gif.src = SRC_DROP;

    const currentTop = parseFloat(gif.style.top) || 0;
    gif.style.top = (currentTop + 6) + "px";

    setTimeout(() => {
      gif.src = SRC_IDLE;
      dropping = false;
    }, DROP_DURATION);
  });

  (function tick() {
    if (dragging) {
      rotation += (mouseX - lastMouseX) * SWAY_STRENGTH;
      rotation *= 0.9;
      gif.style.left = mouseX + "px";
      gif.style.top  = mouseY + "px";
    } else {
      rotation *= (1 - RETURN_SPEED);
    }
    gif.style.transform = `translate(-50%, 0) rotate(${rotation}deg)`;
    lastMouseX = mouseX;
    requestAnimationFrame(tick);
  })();
}