const fallbackDashboard = {
  heroSignal: {
    label: "Priority Advisory",
    headline: "Credential-stuffing traffic spike detected in retail sector.",
    linkText: "View response pattern",
    linkTarget: "#stories"
  },
  metrics: [
    { label: "Threats Blocked", value: 1824, suffix: "+" },
    { label: "Critical Assets", value: 96, suffix: "" },
    { label: "Incidents Resolved", value: 248, suffix: "" },
    { label: "Analyst Coverage", value: 24, suffix: "/7" }
  ],
  regions: [
    { name: "North America", sector: "Finance APIs", level: "high" },
    { name: "Europe", sector: "Identity Platforms", level: "medium" },
    { name: "Middle East", sector: "Energy OT", level: "critical" },
    { name: "South Asia", sector: "Cloud Workloads", level: "high" },
    { name: "Southeast Asia", sector: "E-commerce", level: "medium" },
    { name: "Africa", sector: "Mobile Banking", level: "low" },
    { name: "Latin America", sector: "Telecom Edge", level: "medium" },
    { name: "Oceania", sector: "Healthcare Data", level: "low" }
  ],
  feedSets: [
    [
      {
        title: "Phishing kit targeting HR portals",
        text: "Credential harvesting pages are imitating internal SSO experiences across enterprise hiring flows.",
        tag: "Identity Defense"
      },
      {
        title: "Cloud token abuse pattern expanding",
        text: "Short-lived token theft is showing up in misconfigured CI pipelines and exposed staging apps.",
        tag: "Cloud Security"
      },
      {
        title: "Ransomware operators shifting laterally faster",
        text: "Unmanaged endpoints and legacy VPN edges continue to compress attacker dwell time.",
        tag: "Endpoint Response"
      }
    ],
    [
      {
        title: "Retail botnets intensify account takeover attempts",
        text: "Login floods are blending residential proxies with breached credentials to bypass weaker friction controls.",
        tag: "Fraud Monitoring"
      },
      {
        title: "Healthcare vendors seeing third-party risk pressure",
        text: "Attackers are exploiting shared support tooling to pivot into patient-data handling workflows.",
        tag: "Vendor Risk"
      },
      {
        title: "Exposed admin consoles remain a top initial foothold",
        text: "Internet-facing dashboards with incomplete MFA are still creating outsized incident response effort.",
        tag: "Attack Surface"
      }
    ]
  ],
  services: [
    {
      title: "Managed Detection & Response",
      text: "Continuous monitoring, triage, and response workflows for cloud, endpoint, and identity layers.",
      tag: "SOC-as-a-Service"
    },
    {
      title: "Cloud Security Hardening",
      text: "Posture assessments, least-privilege design, and workload protection for AWS, Azure, and hybrid estates.",
      tag: "Cloud Defense"
    },
    {
      title: "Compliance & Risk Advisory",
      text: "Translate controls into business-ready readiness programs for ISO 27001, SOC 2, PCI DSS, and more.",
      tag: "Audit Readiness"
    },
    {
      title: "Incident Response Retainers",
      text: "Rapid containment, forensic guidance, and recovery planning when high-impact events hit production.",
      tag: "IR Readiness"
    },
    {
      title: "Red Team & Validation",
      text: "Adversary emulation and resilience testing to expose blind spots before real attackers do.",
      tag: "Offensive Security"
    },
    {
      title: "Security Awareness Programs",
      text: "Human-focused resilience training backed by phishing simulations and reporting workflows.",
      tag: "People Defense"
    }
  ],
  timeline: [
    {
      title: "Detect",
      text: "Stream alerts across endpoint, identity, and cloud telemetry into a unified monitoring layer."
    },
    {
      title: "Contain",
      text: "Automate isolation, revoke sessions, and remove malicious persistence before blast radius expands."
    },
    {
      title: "Investigate",
      text: "Correlate artifacts, establish attacker pathing, and document impact with evidence-backed analysis."
    },
    {
      title: "Recover",
      text: "Restore services safely, validate remediations, and strengthen controls against repeat compromise."
    }
  ],
  maturity: {
    score: 86,
    label: "Adaptive"
  },
  scoreBars: [
    { label: "Identity Controls", value: 91 },
    { label: "Cloud Posture", value: 84 },
    { label: "Response Readiness", value: 88 },
    { label: "Third-Party Governance", value: 79 }
  ],
  stories: [
    {
      title: "Stopped a multi-region credential abuse campaign",
      text: "A retail client reduced fraudulent logins by tightening adaptive friction, bot detection, and privileged identity controls.",
      kpis: [
        { label: "Attack reduction", value: "67%" },
        { label: "Containment time", value: "18 min" }
      ]
    },
    {
      title: "Cut cloud misconfiguration exposure across 300+ workloads",
      text: "An enterprise platform team used posture baselines and guardrails to eliminate recurring internet-facing risk.",
      kpis: [
        { label: "Critical gaps closed", value: "142" },
        { label: "Coverage increase", value: "3.2x" }
      ]
    },
    {
      title: "Accelerated audit readiness for a fintech launch",
      text: "Compliance mapping, evidence workflows, and policy cleanup moved the program from reactive to board-ready.",
      kpis: [
        { label: "Control maturity", value: "+31%" },
        { label: "Prep time saved", value: "120 hrs" }
      ]
    }
  ],
  featuredPosts: [
    {
      slug: "identity-first-defense-playbook",
      title: "Identity-First Defense Playbook for Modern Teams",
      excerpt: "How security teams can shrink exposure by focusing on identity controls before attackers chain cloud and endpoint access.",
      category: "Identity Security",
      isFeatured: true,
      published_at: "2026-04-05 09:00:00"
    },
    {
      slug: "cloud-misconfiguration-response-patterns",
      title: "Cloud Misconfiguration Response Patterns That Actually Scale",
      excerpt: "A field guide for reducing repeated cloud security issues without drowning engineering teams in noisy alerts.",
      category: "Cloud Security",
      isFeatured: true,
      published_at: "2026-04-07 14:30:00"
    },
    {
      slug: "third-party-risk-in-fast-growth-companies",
      title: "Third-Party Risk in Fast-Growth Companies",
      excerpt: "Why vendor sprawl becomes a security multiplier and how lean teams can get ahead of it before audit season.",
      category: "Risk Management",
      isFeatured: false,
      published_at: "2026-04-09 11:15:00"
    }
  ]
};

const defaultConfig = {
  backend: "python",
  endpoints: {
    python: {
      dashboard: "/api/dashboard",
      contact: "/api/contact",
      posts: "/api/posts",
      postDetailBase: "/api/posts/",
      siteIntelligence: "/api/site-intelligence",
      adminSession: "/api/admin/session",
      adminLogin: "/api/admin/login",
      adminLogout: "/api/admin/logout",
      adminOverview: "/api/admin/overview",
      adminContacts: "/api/admin/contacts",
      adminScans: "/api/admin/scans",
      adminPosts: "/api/admin/posts"
    },
    php: {
      dashboard: "/php-api/dashboard.php",
      contact: "/php-api/contact.php"
    }
  }
};

const runtimeConfig = window.SentinelConfig || defaultConfig;
const activeEndpoints =
  runtimeConfig.endpoints?.[runtimeConfig.backend] || defaultConfig.endpoints.python;

const state = {
  dashboard: fallbackDashboard,
  activeFeed: 0
};

const metricsEl = document.getElementById("metrics");
const mapGridEl = document.getElementById("mapGrid");
const feedListEl = document.getElementById("feedList");
const servicesGridEl = document.getElementById("servicesGrid");
const timelineEl = document.getElementById("timeline");
const scoreBarsEl = document.getElementById("scoreBars");
const storiesGridEl = document.getElementById("storiesGrid");
const watchTimestampEl = document.getElementById("watchTimestamp");
const rotateFeedButton = document.getElementById("rotateFeed");
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const analysisForm = document.getElementById("analysisForm");
const analysisMessage = document.getElementById("analysisMessage");
const analysisResult = document.getElementById("analysisResult");
const briefingsGrid = document.getElementById("briefingsGrid");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const scoreStroke = document.getElementById("scoreStroke");
const scoreValue = document.getElementById("scoreValue");
const maturityLabel = document.getElementById("maturityLabel");
const signalLabel = document.getElementById("signalLabel");
const signalHeadline = document.getElementById("signalHeadline");
const signalLink = document.getElementById("signalLink");
const submitButton = form.querySelector("button[type='submit']");

function getFeedSets() {
  return state.dashboard.feedSets || [];
}

function getCurrentFeed() {
  const feedSets = getFeedSets();

  if (feedSets.length === 0) {
    return [];
  }

  const normalizedIndex = state.activeFeed % feedSets.length;
  return feedSets[normalizedIndex] || [];
}

function renderSignal() {
  const signal = state.dashboard.heroSignal || fallbackDashboard.heroSignal;
  signalLabel.textContent = signal.label;
  signalHeadline.textContent = signal.headline;
  signalLink.textContent = signal.linkText;
  signalLink.setAttribute("href", signal.linkTarget || "#stories");
}

function renderMetrics() {
  const metrics = state.dashboard.metrics || [];

  metricsEl.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric">
          <span>${metric.label}</span>
          <strong data-target="${metric.value}" data-suffix="${metric.suffix || ""}">0${metric.suffix || ""}</strong>
        </article>
      `
    )
    .join("");

  const counters = metricsEl.querySelectorAll("[data-target]");

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 36));

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      counter.textContent = `${current}${suffix}`;
    }, 32);
  });
}

function renderMap() {
  const regions = state.dashboard.regions || [];

  mapGridEl.innerHTML = regions
    .map(
      (region) => `
        <article class="map-node">
          <strong>${region.name}</strong>
          <span>${region.sector}</span>
          <div class="threat-badge threat-${region.level}">${String(region.level).toUpperCase()}</div>
        </article>
      `
    )
    .join("");

  watchTimestampEl.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderFeed() {
  const activeFeed = getCurrentFeed();

  feedListEl.innerHTML = activeFeed
    .map(
      (item) => `
        <article class="feed-item">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <span class="service-tag">${item.tag}</span>
        </article>
      `
    )
    .join("");
}

function renderServices() {
  const services = state.dashboard.services || [];

  servicesGridEl.innerHTML = services
    .map(
      (service) => `
        <article>
          <h3>${service.title}</h3>
          <p>${service.text}</p>
          <span class="service-tag">${service.tag}</span>
        </article>
      `
    )
    .join("");
}

function renderTimeline() {
  const timeline = state.dashboard.timeline || [];

  timelineEl.innerHTML = timeline
    .map(
      (item) => `
        <article class="timeline-item">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function renderScoreBars() {
  const scoreBars = state.dashboard.scoreBars || [];
  const maturity = state.dashboard.maturity || fallbackDashboard.maturity;

  scoreBarsEl.innerHTML = scoreBars
    .map(
      (item) => `
        <div class="bar">
          <div class="bar-header">
            <span>${item.label}</span>
            <span>${item.value}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${item.value}%"></div>
          </div>
        </div>
      `
    )
    .join("");

  const circumference = 2 * Math.PI * 46;
  const score = Number(maturity.score || 0);
  scoreStroke.style.strokeDasharray = String(circumference);
  scoreStroke.style.strokeDashoffset = String(circumference * (1 - score / 100));
  scoreValue.textContent = String(score);
  maturityLabel.textContent = maturity.label || "Adaptive";
}

function renderStories() {
  const stories = state.dashboard.stories || [];

  storiesGridEl.innerHTML = stories
    .map(
      (story) => `
        <article>
          <h3>${story.title}</h3>
          <p>${story.text}</p>
          <div class="story-kpis">
            ${(story.kpis || [])
              .map(
                (kpi) => `
                  <div class="story-kpi">
                    <strong>${kpi.value}</strong>
                    <span>${kpi.label}</span>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function formatPublishedDate(value) {
  if (!value) {
    return "Draft";
  }

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function renderBriefings() {
  const posts = state.dashboard.featuredPosts || [];

  if (!briefingsGrid) {
    return;
  }

  if (posts.length === 0) {
    briefingsGrid.innerHTML = `
      <article class="briefing-card empty-state">
        <h3>No briefings published yet</h3>
        <p>As soon as blog posts are published from the admin dashboard, they will appear here.</p>
      </article>
    `;
    return;
  }

  briefingsGrid.innerHTML = posts
    .map(
      (post) => `
        <article class="briefing-card">
          <div class="briefing-topline">
            <span class="pill">${post.category}</span>
            <span>${formatPublishedDate(post.published_at)}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="briefing-footer">
            <span>${post.isFeatured ? "Featured briefing" : "Published briefing"}</span>
            <a href="blog.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAnalysisResult(result) {
  analysisResult.innerHTML = `
    <div class="analysis-grid">
      <div class="analysis-score">
        <span>Security Score</span>
        <strong>${result.securityScore}</strong>
        <small>/100</small>
      </div>
      <div class="analysis-summary">
        <div class="analysis-header">
          <div>
            <p class="eyebrow">Analysis Result</p>
            <h3>${result.title || result.finalUrl}</h3>
          </div>
          <span class="pill">${result.statusCode || "N/A"}</span>
        </div>
        <p class="muted-copy">${result.metaDescription || result.previewText || "No public description was detected on this page."}</p>
        <div class="analysis-stat-grid">
          <div><span>Final URL</span><strong>${result.finalUrl}</strong></div>
          <div><span>Content Type</span><strong>${result.contentType || "Unknown"}</strong></div>
          <div><span>Links</span><strong>${result.internalLinks} internal / ${result.externalLinks} external</strong></div>
          <div><span>Forms</span><strong>${result.formsCount}</strong></div>
          <div><span>Keyword Matches</span><strong>${result.keywordMatches}</strong></div>
          <div><span>Server</span><strong>${result.serverHeader || "Hidden"}</strong></div>
        </div>
      </div>
    </div>
    <div class="analysis-section">
      <h4>Security Headers</h4>
      <div class="analysis-chip-list">
        ${(result.securityHeaders || [])
          .map(
            (header) => `
              <span class="analysis-chip ${header.present ? "present" : "missing"}">
                ${header.name}: ${header.present ? "present" : "missing"}
              </span>
            `
          )
          .join("")}
      </div>
    </div>
    <div class="analysis-section">
      <h4>Findings</h4>
      <ul class="analysis-finding-list">
        ${(result.findings || []).length
          ? result.findings.map((finding) => `<li>${finding}</li>`).join("")
          : "<li>No obvious public-page issues were detected in this passive review.</li>"}
      </ul>
    </div>
    <div class="analysis-section">
      <h4>Keyword Snippets</h4>
      <div class="analysis-snippets">
        ${result.keywordSnippets && result.keywordSnippets.length
          ? result.keywordSnippets.map((snippet) => `<p>${snippet}</p>`).join("")
          : "<p>No matching snippets found for the requested keyword.</p>"}
      </div>
    </div>
    <div class="analysis-section">
      <h4>Safe Mode</h4>
      <p class="muted-copy">${result.safeMode}</p>
    </div>
  `;
}

function renderAll() {
  renderSignal();
  renderMetrics();
  renderMap();
  renderFeed();
  renderServices();
  renderBriefings();
  renderTimeline();
  renderScoreBars();
  renderStories();
}

async function fetchDashboardData() {
  const response = await fetch(activeEndpoints.dashboard, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Dashboard request failed with ${response.status}`);
  }

  return response.json();
}

async function loadDashboardData() {
  try {
    const data = await fetchDashboardData();
    state.dashboard = data;
  } catch (error) {
    console.warn("Using fallback dashboard data because the backend is unavailable.", error);
    state.dashboard = fallbackDashboard;
  }

  renderAll();
}

function rotateFeed() {
  const feedSets = getFeedSets();

  if (feedSets.length === 0) {
    return;
  }

  state.activeFeed = (state.activeFeed + 1) % feedSets.length;
  renderFeed();
  renderMap();
}

async function submitContactForm(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    company: String(formData.get("company") || "").trim(),
    priority: String(formData.get("priority") || "Threat Monitoring").trim(),
    message: String(formData.get("message") || "").trim()
  };

  if (!payload.name || !payload.email) {
    formMessage.textContent = "Please enter both your name and email.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetch(activeEndpoints.contact, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to submit the form.");
    }

    formMessage.textContent = result.message;
    form.reset();
  } catch (error) {
    formMessage.textContent =
      "The backend is not reachable yet. Start the Python or PHP server to store contact requests in SQL.";
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Request";
  }
}

async function submitAnalysisForm(event) {
  event.preventDefault();

  const formData = new FormData(analysisForm);
  const payload = {
    url: String(formData.get("url") || "").trim(),
    keyword: String(formData.get("keyword") || "").trim()
  };

  if (!payload.url) {
    analysisMessage.textContent = "Please enter a website URL.";
    return;
  }

  analysisMessage.textContent = "Analyzing public website data...";

  try {
    const response = await fetch(activeEndpoints.siteIntelligence || "/api/site-intelligence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to analyze the website.");
    }

    renderAnalysisResult(result);
    analysisMessage.textContent = "Analysis complete.";
  } catch (error) {
    analysisMessage.textContent = error.message || "Analysis failed.";
  }
}

if (rotateFeedButton) {
  rotateFeedButton.addEventListener("click", rotateFeed);
}

if (form) {
  form.addEventListener("submit", submitContactForm);
}

if (analysisForm) {
  analysisForm.addEventListener("submit", submitAnalysisForm);
}

if (menuToggle && navLinks && menuToggle.dataset.navBound !== "true") {
  menuToggle.dataset.navBound = "true";
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });
}

loadDashboardData();

setInterval(renderMap, 30000);
setInterval(rotateFeed, 9000);
setInterval(loadDashboardData, 60000);
