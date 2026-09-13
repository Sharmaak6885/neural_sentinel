const brandConfig = window.SentinelConfig?.branding || {};
const appearanceConfig = brandConfig.appearance || {};
const appearanceStorageKeys = {
  mode: "neural-sentinel-mode",
  palette: "neural-sentinel-palette",
  backdrop: "neural-sentinel-backdrop"
};

function readStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures and continue with the selected appearance for this session.
  }
}

function setText(selector, value) {
  if (!value) {
    return;
  }

  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function setTextAll(selector, value) {
  if (!value) {
    return;
  }

  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function setHTMLList(selector, items) {
  const element = document.querySelector(selector);
  if (!element || !Array.isArray(items) || items.length === 0) {
    return;
  }

  element.innerHTML = items.map((item) => `<span>${item}</span>`).join("");
}

function setLink(selector, label, href) {
  const element = document.querySelector(selector);
  if (!element) {
    return;
  }

  if (label) {
    element.textContent = label;
  }

  if (href) {
    element.setAttribute("href", href);
  }
}

function setMetaDescription(value) {
  if (!value) {
    return;
  }

  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute("content", value);
  }
}

function setThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    return;
  }

  const styles = getComputedStyle(document.documentElement);
  const themeColor = styles.getPropertyValue("--bg").trim() || styles.getPropertyValue("--accent").trim();
  if (themeColor) {
    meta.setAttribute("content", themeColor);
  }
}

function restartMomentaryClass(element, className, duration = 420, timerKey = "feedbackTimer") {
  if (!element) {
    return;
  }

  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  const existingTimer = Number(element.dataset[timerKey] || 0);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  const timer = window.setTimeout(() => {
    element.classList.remove(className);
    delete element.dataset[timerKey];
  }, duration);
  element.dataset[timerKey] = String(timer);
}

function isExternalLink(href) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function buildLinkMarkup(link) {
  const target = isExternalLink(link.href) ? ' target="_blank" rel="noreferrer"' : "";
  return `<a href="${link.href}"${target}>${link.label}</a>`;
}

function setLinkList(selector, links) {
  const element = document.querySelector(selector);
  if (!element || !Array.isArray(links)) {
    return;
  }

  element.innerHTML = links.map(buildLinkMarkup).join("");
}

function applyInlineThemeVars(vars) {
  if (!vars) {
    return;
  }

  const root = document.documentElement;
  Object.entries(vars).forEach(([name, value]) => {
    root.style.setProperty(`--${name}`, value);
  });
}

function currentModeId() {
  return readStoredValue(appearanceStorageKeys.mode) || appearanceConfig.defaultMode || "dark";
}

function currentPaletteId() {
  return (
    readStoredValue(appearanceStorageKeys.palette) ||
    appearanceConfig.defaultPalette ||
    "emerald"
  );
}

function currentBackdropId() {
  return (
    readStoredValue(appearanceStorageKeys.backdrop) ||
    appearanceConfig.defaultBackdrop ||
    "neural"
  );
}

function resolveMode(modeId) {
  return appearanceConfig.modes?.[modeId] || appearanceConfig.modes?.dark || null;
}

function resolvePalette(paletteId) {
  const paletteList = appearanceConfig.palettes || [];
  return paletteList.find((palette) => palette.id === paletteId) || paletteList[0] || null;
}

function resolveBackdrop(backdropId) {
  const backdropList = appearanceConfig.backdrops || [];
  return backdropList.find((backdrop) => backdrop.id === backdropId) || backdropList[0] || null;
}

function paletteOptions() {
  return appearanceConfig.palettes || [];
}

function backdropOptions() {
  return appearanceConfig.backdrops || [];
}

function currentPaletteIndex() {
  const paletteList = paletteOptions();
  const index = paletteList.findIndex((palette) => palette.id === currentPaletteId());
  return index >= 0 ? index : 0;
}

function currentBackdropIndex() {
  const backdropList = backdropOptions();
  const index = backdropList.findIndex((backdrop) => backdrop.id === currentBackdropId());
  return index >= 0 ? index : 0;
}

function resolveBackdropVars(backdrop, modeId) {
  if (!backdrop?.vars) {
    return null;
  }

  if (backdrop.vars[modeId]) {
    return backdrop.vars[modeId];
  }

  return backdrop.vars.dark || backdrop.vars.light || null;
}

function dialAngles(count) {
  if (count <= 1) {
    return [0];
  }

  const start = -120;
  const spread = 240;
  const step = spread / (count - 1);
  return Array.from({ length: count }, (_, index) => start + step * index);
}

function setMode(modeId) {
  writeStoredValue(appearanceStorageKeys.mode, modeId);
  applyAppearance();
}

function setPaletteByIndex(index, feedbackElement = null) {
  const paletteList = paletteOptions();
  if (!paletteList.length) {
    return;
  }

  const normalizedIndex = ((index % paletteList.length) + paletteList.length) % paletteList.length;
  const nextPaletteId = paletteList[normalizedIndex].id;
  if (nextPaletteId === currentPaletteId()) {
    return;
  }

  writeStoredValue(appearanceStorageKeys.palette, nextPaletteId);
  applyAppearance();

  if (feedbackElement) {
    restartMomentaryClass(feedbackElement, "is-feedback", 360, "feedbackTimer");
  }
}

function stepPalette(delta, feedbackElement = null) {
  setPaletteByIndex(currentPaletteIndex() + delta, feedbackElement);
}

function setBackdropByIndex(index, feedbackElement = null) {
  const backdropList = backdropOptions();
  if (!backdropList.length) {
    return;
  }

  const normalizedIndex = ((index % backdropList.length) + backdropList.length) % backdropList.length;
  const nextBackdropId = backdropList[normalizedIndex].id;
  if (nextBackdropId === currentBackdropId()) {
    return;
  }

  writeStoredValue(appearanceStorageKeys.backdrop, nextBackdropId);
  applyAppearance();

  if (feedbackElement) {
    restartMomentaryClass(feedbackElement, "is-feedback", 360, "feedbackTimer");
  }
}

function nearestDialIndex(angle, count) {
  const angles = dialAngles(count);
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  angles.forEach((tickAngle, index) => {
    const distance = Math.abs(angle - tickAngle);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function eventDialAngle(event, element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const angle = (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) / Math.PI + 90;
  if (angle > 180) {
    return angle - 360;
  }
  return angle;
}

function animateLampPull(lampControl) {
  restartMomentaryClass(lampControl, "is-pulled", 620, "pullTimer");
  restartMomentaryClass(lampControl, "is-feedback", 520, "feedbackTimer");
}

let lastAppearanceSignature = "";

function triggerSceneShift() {
  restartMomentaryClass(document.body, "scene-shift", 960, "sceneTimer");
}

function applyAppearance() {
  const modeId = currentModeId();
  const paletteId = currentPaletteId();
  const backdropId = currentBackdropId();
  const mode = resolveMode(modeId);
  const palette = resolvePalette(paletteId);
  const backdrop = resolveBackdrop(backdropId);
  const paletteList = paletteOptions();
  const backdropList = backdropOptions();
  const paletteIndex = currentPaletteIndex();
  const backdropIndex = currentBackdropIndex();
  const rotation = dialAngles(paletteList.length)[paletteIndex] || 0;
  const appearanceSignature = `${modeId}:${paletteId}:${backdropId}`;
  const shouldAnimateScene = lastAppearanceSignature && lastAppearanceSignature !== appearanceSignature;

  if (mode) {
    document.documentElement.dataset.themeMode = modeId;
    applyInlineThemeVars(mode.vars);
  }

  if (backdrop) {
    document.documentElement.dataset.backdrop = backdropId;
    applyInlineThemeVars(resolveBackdropVars(backdrop, modeId));
  }

  if (palette?.colors) {
    document.documentElement.dataset.palette = paletteId;
    applyInlineThemeVars(palette.colors);
  } else if (brandConfig.theme) {
    applyInlineThemeVars({
      accent: brandConfig.theme.accent,
      "accent-2": brandConfig.theme.accent2,
      "accent-3": brandConfig.theme.accent3,
      critical: brandConfig.theme.critical
    });
  }

  document.querySelectorAll(".lamp-control").forEach((lampControl) => {
    lampControl.dataset.mode = modeId;
  });

  document.querySelectorAll(".appearance-mode-text").forEach((label) => {
    label.textContent = modeId === "dark" ? "Dark Mode" : "Light Mode";
  });

  document.querySelectorAll(".lamp-chain-toggle").forEach((toggle) => {
    const nextMode = modeId === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", `Pull lamp chain to switch to ${nextMode} mode`);
    toggle.setAttribute("title", `Switch to ${nextMode} mode`);
  });

  document.querySelectorAll(".dial-value-text").forEach((label) => {
    label.textContent = palette?.label || "Preset";
  });

  document.querySelectorAll(".backdrop-value-text").forEach((label) => {
    label.textContent = backdrop?.label || "Backdrop";
  });

  document.querySelectorAll(".preset-dial").forEach((dial) => {
    dial.style.setProperty("--dial-rotation", `${rotation}deg`);
    dial.setAttribute("aria-valuemin", "1");
    dial.setAttribute("aria-valuemax", String(Math.max(paletteList.length, 1)));
    dial.setAttribute("aria-valuenow", String(paletteIndex + 1));
    dial.setAttribute("aria-valuetext", palette?.label || "Preset");
  });

  document.querySelectorAll(".dial-tick").forEach((tick) => {
    tick.classList.toggle("active", Number(tick.dataset.index) === paletteIndex);
  });

  document.querySelectorAll(".preset-preview-dot").forEach((dot) => {
    const isActive = Number(dot.dataset.index) === paletteIndex;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll(".backdrop-preview-dot").forEach((dot) => {
    dot.classList.toggle("active", Number(dot.dataset.index) === backdropIndex);
    const activeBackdrop = backdropList[Number(dot.dataset.index)];
    dot.setAttribute("aria-pressed", String(Number(dot.dataset.index) === backdropIndex));
    if (activeBackdrop?.label) {
      dot.setAttribute("title", activeBackdrop.label);
    }
  });

  setThemeColor();

  if (shouldAnimateScene) {
    triggerSceneShift();
  }
  lastAppearanceSignature = appearanceSignature;
}

function bindNavigationToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks || menuToggle.dataset.navBound === "true") {
    return;
  }

  menuToggle.dataset.navBound = "true";
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });
}

function renderAppearanceControls() {
  document.querySelectorAll(".topbar").forEach((topbar) => {
    if (topbar.querySelector(".appearance-tools")) {
      return;
    }

    const palettes = paletteOptions();
    const controls = document.createElement("div");
    controls.className = "appearance-tools";
    controls.setAttribute("aria-label", "Appearance controls");

    const lampControl = document.createElement("div");
    lampControl.className = "lamp-control";
    lampControl.innerHTML = `
      <div class="lamp-rig">
        <span class="lamp-canopy"></span>
        <span class="lamp-cord"></span>
        <span class="lamp-shade"></span>
        <span class="lamp-bulb"></span>
        <span class="lamp-glow"></span>
        <button type="button" class="lamp-chain-toggle">
          <span class="lamp-chain-line"></span>
          <span class="lamp-pull"></span>
        </button>
      </div>
      <div class="appearance-copy">
        <span class="appearance-kicker">Lamp Switch</span>
        <strong class="appearance-mode-text">Dark Mode</strong>
      </div>
    `;

    const lampToggle = lampControl.querySelector(".lamp-chain-toggle");
    lampToggle.addEventListener("click", () => {
      animateLampPull(lampControl);
      setMode(currentModeId() === "dark" ? "light" : "dark");
    });

    const presetControl = document.createElement("div");
    presetControl.className = "preset-control";

    const dial = document.createElement("div");
    dial.className = "preset-dial";
    dial.tabIndex = 0;
    dial.setAttribute("role", "slider");
    dial.setAttribute("aria-label", "Rotate preset dial");

    const dialPlate = document.createElement("div");
    dialPlate.className = "dial-plate";

    palettes.forEach((palette, index) => {
      const tick = document.createElement("span");
      tick.className = "dial-tick";
      tick.dataset.index = String(index);
      tick.style.setProperty("--tick-angle", `${dialAngles(palettes.length)[index] || 0}deg`);
      tick.setAttribute("title", palette.label);
      dialPlate.append(tick);
    });

    dialPlate.innerHTML += `
      <div class="dial-face">
        <span class="dial-pointer"></span>
        <span class="dial-core"></span>
      </div>
    `;
    dial.append(dialPlate);

    const updateDialFromEvent = (event) => {
      if (!palettes.length) {
        return;
      }

      const angle = eventDialAngle(event, dial);
      setPaletteByIndex(nearestDialIndex(angle, palettes.length), presetControl);
    };

    dial.addEventListener("pointerdown", (event) => {
      dial.dataset.dragging = "true";
      if (dial.setPointerCapture) {
        dial.setPointerCapture(event.pointerId);
      }
      updateDialFromEvent(event);
    });

    dial.addEventListener("pointermove", (event) => {
      if (dial.dataset.dragging === "true") {
        updateDialFromEvent(event);
      }
    });

    const stopDialDrag = (event) => {
      if (dial.dataset.dragging !== "true") {
        return;
      }

      dial.dataset.dragging = "false";
      if (dial.releasePointerCapture && dial.hasPointerCapture?.(event.pointerId)) {
        dial.releasePointerCapture(event.pointerId);
      }
    };

    dial.addEventListener("pointerup", stopDialDrag);
    dial.addEventListener("pointercancel", stopDialDrag);
    dial.addEventListener("lostpointercapture", () => {
      dial.dataset.dragging = "false";
    });

    dial.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        stepPalette(event.deltaY > 0 ? 1 : -1, presetControl);
      },
      { passive: false }
    );

    dial.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        stepPalette(1, presetControl);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        stepPalette(-1, presetControl);
      } else if (event.key === "Home") {
        event.preventDefault();
        setPaletteByIndex(0, presetControl);
      } else if (event.key === "End") {
        event.preventDefault();
        setPaletteByIndex(Math.max(palettes.length - 1, 0), presetControl);
      }
    });

    presetControl.append(dial);
    presetControl.insertAdjacentHTML(
      "beforeend",
      `
        <div class="appearance-copy">
          <span class="appearance-kicker">Preset Dial</span>
          <strong class="dial-value-text">Preset</strong>
        </div>
      `
    );

    const paletteDots = document.createElement("div");
    paletteDots.className = "preset-preview-dots";
    palettes.forEach((palette, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "preset-preview-dot";
      dot.dataset.index = String(index);
      dot.setAttribute("aria-label", `Switch to ${palette.label} preset`);
      dot.setAttribute("title", palette.label);
      dot.setAttribute("aria-pressed", "false");
      dot.style.setProperty("--preview-a", palette.colors?.accent || "#ffffff");
      dot.style.setProperty("--preview-b", palette.colors?.["accent-2"] || palette.colors?.accent || "#ffffff");
      dot.style.setProperty("--preview-c", palette.colors?.["accent-3"] || palette.colors?.accent || "#ffffff");
      dot.addEventListener("click", () => {
        setPaletteByIndex(index, presetControl);
      });
      paletteDots.append(dot);
    });
    presetControl.append(paletteDots);

    const backdrops = backdropOptions();
    const backdropControl = document.createElement("div");
    backdropControl.className = "backdrop-control";
    backdropControl.insertAdjacentHTML(
      "beforeend",
      `
        <div class="appearance-copy">
          <span class="appearance-kicker">Background Preset</span>
          <strong class="backdrop-value-text">Backdrop</strong>
        </div>
      `
    );

    const backdropDots = document.createElement("div");
    backdropDots.className = "backdrop-preview-dots";
    backdrops.forEach((backdrop, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "backdrop-preview-dot";
      dot.dataset.index = String(index);
      dot.setAttribute("aria-label", `Switch to ${backdrop.label} background preset`);
      dot.setAttribute("title", backdrop.label);
      dot.setAttribute("aria-pressed", "false");
      dot.style.setProperty("--backdrop-a", backdrop.preview?.[0] || "#0b1220");
      dot.style.setProperty("--backdrop-b", backdrop.preview?.[1] || "#12233a");
      dot.style.setProperty("--backdrop-c", backdrop.preview?.[2] || "#4da6ff");
      dot.addEventListener("click", () => {
        setBackdropByIndex(index, backdropControl);
      });
      backdropDots.append(dot);
    });
    backdropControl.append(backdropDots);

    controls.append(lampControl, presetControl, backdropControl);
    topbar.appendChild(controls);
  });
}

function applyBrandNames() {
  document.querySelectorAll(".brand").forEach((brand) => {
    const textNode = brand.querySelector("span:last-child");
    if (textNode && brandConfig.shortName) {
      textNode.textContent = brandConfig.shortName;
    }
  });

  setTextAll(".footer-brand-title", brandConfig.shortName || brandConfig.siteName);
}

function applyFooterBranding() {
  const footer = brandConfig.footer || {};

  setTextAll(".footer-description", brandConfig.siteDescription);
  setTextAll(".footer-support-title", footer.supportTitle);
  setTextAll(".footer-legal-title", footer.legalTitle);
  setTextAll(".footer-connect-title", footer.connectTitle);
  setLinkList(".footer-support-links", footer.supportLinks || []);
  setLinkList(".footer-legal-links", footer.legalLinks || []);
  setLinkList(".footer-connect-links", footer.connectLinks || []);

  const copyrightTemplate = footer.copyright || "Copyright {year} {siteName}. All rights reserved.";
  const copy = copyrightTemplate
    .replace("{year}", String(new Date().getFullYear()))
    .replace("{siteName}", brandConfig.siteName || "Website");

  setTextAll(".footer-copy", copy);
}

function applyHomeBranding() {
  const home = brandConfig.home || {};
  if (!document.querySelector(".hero-grid")) {
    return;
  }

  document.title = `${brandConfig.siteName || "Website"} | ${home.title || "Home"}`;
  setMetaDescription(home.metaDescription);
  setText(".hero-copy .eyebrow", home.eyebrow);
  setText(".hero-copy h1", home.headline);
  setText(".hero-text", home.description);
  setLink(".hero-actions .button-primary", home.primaryCtaLabel, home.primaryCtaHref);
  setLink(".hero-actions .button-secondary", home.secondaryCtaLabel, home.secondaryCtaHref);
  setHTMLList(".hero-badges", home.badges);
  setText(".hero-panel .panel-header span:first-child", home.panelLabel);
  setText(".hero-panel .panel-status", home.panelStatus);
  setText(".lab-section .section-heading .eyebrow", home.labEyebrow);
  setText(".lab-section .section-heading h2", home.labHeadline);
  setText(".analysis-note", home.labNote);
  setText("#analysisForm .button-primary", home.labButtonLabel);
  setText(".briefings-section .section-heading .eyebrow", home.briefingsEyebrow);
  setText(".briefings-section .section-heading h2", home.briefingsHeadline);
  setText(".briefings-section .button-secondary", home.briefingsButtonLabel);
  setText(".contact-copy .eyebrow", home.contactEyebrow);
  setText(".contact-copy h2", home.contactHeadline);
  setText(".contact-copy p", home.contactDescription);
  setHTMLList(".contact-points", home.contactPoints);
  setTextAll(".footer-description", home.footerDescription || brandConfig.siteDescription);
}

function applyBlogBranding() {
  const blog = brandConfig.blog || {};
  if (!document.querySelector(".blog-layout")) {
    return;
  }

  document.title = `${brandConfig.siteName || "Website"} | ${blog.title || "Blog"}`;
  setMetaDescription(blog.metaDescription);
  setText(".page-hero .eyebrow", blog.eyebrow);
  setText(".page-hero h1", blog.headline);
  setText(".page-hero .muted-copy", blog.description);
  setText(".stack-card .card-header span:first-child", blog.searchLabel);

  const searchInput = document.querySelector('#blogSearchForm input[name="query"]');
  if (searchInput && blog.searchPlaceholder) {
    searchInput.setAttribute("placeholder", blog.searchPlaceholder);
  }

  setText("#blogSearchForm .button-primary", blog.searchButtonLabel);
  setText("#blogDetail .eyebrow", blog.articleEyebrow);
  setText("#blogDetail h2", blog.articleHeadline);
  setText("#blogDetail .muted-copy", blog.articleDescription);
}

function applyAdminBranding() {
  const admin = brandConfig.admin || {};
  if (!document.querySelector("#loginView")) {
    return;
  }

  document.title = `${brandConfig.siteName || "Website"} | ${admin.title || "Admin"}`;
  setMetaDescription(admin.metaDescription);
  setText(".page-hero .eyebrow", admin.eyebrow);
  setText(".page-hero h1", admin.headline);
  setText(".page-hero .muted-copy", admin.description);
  setText("#loginView .card-header span:first-child", admin.loginHeading);
  setText("#loginView .card-header span:last-child", admin.loginHint);
  setText("#loginForm .button-primary", admin.loginButtonLabel);
  setText("#loginView .muted-copy", admin.loginDescription);
  setText(".admin-sidebar .eyebrow", admin.sessionEyebrow);
  setText("#logoutButton", admin.logoutLabel);
  setText(".post-editor .card-header span:first-child", admin.publishHeading);
  setText("#editorState", admin.publishNewLabel);
}

renderAppearanceControls();
applyAppearance();
bindNavigationToggle();
applyBrandNames();
applyFooterBranding();
applyHomeBranding();
applyBlogBranding();
applyAdminBranding();
