window.SentinelConfig = {
  backend: "python",
  branding: {
    siteName: "Neural Sentinel",
    shortName: "Neural Sentinel",
    siteDescription:
      "Full-stack cyber publishing, lead intake, admin operations, and safe public website analysis.",
    appearance: {
      defaultMode: "dark",
      defaultPalette: "emerald",
      defaultBackdrop: "neural",
      modes: {
        dark: {
          label: "Dark",
          vars: {
            "bg-start": "#030816",
            "bg-mid": "#07111f",
            "bg-end": "#0d1831",
            "glow-a": "rgba(72, 163, 255, 0.16)",
            "glow-b": "rgba(0, 230, 167, 0.12)",
            "grid-tint": "rgba(124, 174, 255, 0.05)",
            bg: "#07111f",
            "bg-soft": "#0e1930",
            panel: "rgba(10, 20, 38, 0.82)",
            "panel-strong": "rgba(7, 17, 31, 0.72)",
            line: "rgba(122, 167, 255, 0.16)",
            text: "#ecf3ff",
            muted: "#95a7c6",
            "muted-strong": "#d4dff4",
            "surface-soft": "rgba(255, 255, 255, 0.03)",
            "surface-soft-strong": "rgba(255, 255, 255, 0.04)",
            "surface-border": "rgba(255, 255, 255, 0.06)",
            "surface-border-strong": "rgba(255, 255, 255, 0.08)",
            "secondary-bg": "rgba(255, 255, 255, 0.02)",
            "input-bg": "rgba(255, 255, 255, 0.04)",
            "signal-label": "#b9cbef",
            "timeline-line": "rgba(255, 255, 255, 0.08)",
            "score-track": "rgba(255, 255, 255, 0.07)",
            "footer-line": "rgba(255, 255, 255, 0.08)",
            shadow: "0 24px 70px rgba(0, 0, 0, 0.28)",
            "button-primary-text": "#031116"
          }
        },
        light: {
          label: "Light",
          vars: {
            "bg-start": "#edf4ff",
            "bg-mid": "#f7fbff",
            "bg-end": "#dfeafe",
            "glow-a": "rgba(72, 163, 255, 0.18)",
            "glow-b": "rgba(0, 230, 167, 0.14)",
            "grid-tint": "rgba(42, 84, 140, 0.08)",
            bg: "#f4f8ff",
            "bg-soft": "#e5eefc",
            panel: "rgba(255, 255, 255, 0.9)",
            "panel-strong": "rgba(255, 255, 255, 0.82)",
            line: "rgba(42, 84, 140, 0.16)",
            text: "#0a1322",
            muted: "#546b8e",
            "muted-strong": "#294262",
            "surface-soft": "rgba(255, 255, 255, 0.72)",
            "surface-soft-strong": "rgba(255, 255, 255, 0.86)",
            "surface-border": "rgba(28, 62, 109, 0.1)",
            "surface-border-strong": "rgba(28, 62, 109, 0.14)",
            "secondary-bg": "rgba(255, 255, 255, 0.66)",
            "input-bg": "rgba(255, 255, 255, 0.88)",
            "signal-label": "#456489",
            "timeline-line": "rgba(28, 62, 109, 0.12)",
            "score-track": "rgba(28, 62, 109, 0.12)",
            "footer-line": "rgba(28, 62, 109, 0.12)",
            shadow: "0 24px 70px rgba(24, 49, 93, 0.12)",
            "button-primary-text": "#ffffff"
          }
        }
      },
      palettes: [
        {
          id: "emerald",
          label: "Emerald Grid",
          colors: {
            accent: "#00e6a7",
            "accent-2": "#48a3ff",
            "accent-3": "#ff7a59",
            critical: "#ff4d6d",
            "accent-glow": "rgba(0, 230, 167, 0.18)",
            "accent-shadow": "rgba(0, 230, 167, 0.55)",
            "signal-a": "rgba(72, 163, 255, 0.14)",
            "signal-b": "rgba(255, 122, 89, 0.12)"
          }
        },
        {
          id: "ember",
          label: "Ember Shield",
          colors: {
            accent: "#ff7a00",
            "accent-2": "#ff4f9a",
            "accent-3": "#ffd166",
            critical: "#d62839",
            "accent-glow": "rgba(255, 122, 0, 0.2)",
            "accent-shadow": "rgba(255, 122, 0, 0.5)",
            "signal-a": "rgba(255, 79, 154, 0.16)",
            "signal-b": "rgba(255, 209, 102, 0.16)"
          }
        },
        {
          id: "arctic",
          label: "Arctic Pulse",
          colors: {
            accent: "#2ed6ff",
            "accent-2": "#1e90ff",
            "accent-3": "#7bed9f",
            critical: "#ff4757",
            "accent-glow": "rgba(46, 214, 255, 0.2)",
            "accent-shadow": "rgba(46, 214, 255, 0.55)",
            "signal-a": "rgba(30, 144, 255, 0.15)",
            "signal-b": "rgba(123, 237, 159, 0.15)"
          }
        },
        {
          id: "volt",
          label: "Volt Matrix",
          colors: {
            accent: "#c8ff2d",
            "accent-2": "#00c6ff",
            "accent-3": "#ffd84d",
            critical: "#ff5a5f",
            "accent-glow": "rgba(200, 255, 45, 0.22)",
            "accent-shadow": "rgba(200, 255, 45, 0.5)",
            "signal-a": "rgba(0, 198, 255, 0.16)",
            "signal-b": "rgba(255, 216, 77, 0.16)"
          }
        },
        {
          id: "copper",
          label: "Copper Core",
          colors: {
            accent: "#ff9a52",
            "accent-2": "#ffbe3d",
            "accent-3": "#ff5d5d",
            critical: "#c62828",
            "accent-glow": "rgba(255, 154, 82, 0.22)",
            "accent-shadow": "rgba(255, 154, 82, 0.5)",
            "signal-a": "rgba(255, 190, 61, 0.18)",
            "signal-b": "rgba(255, 93, 93, 0.14)"
          }
        },
        {
          id: "tidal",
          label: "Tidal Mesh",
          colors: {
            accent: "#18c5b7",
            "accent-2": "#0ea5e9",
            "accent-3": "#ff845e",
            critical: "#ef4444",
            "accent-glow": "rgba(24, 197, 183, 0.2)",
            "accent-shadow": "rgba(24, 197, 183, 0.48)",
            "signal-a": "rgba(14, 165, 233, 0.16)",
            "signal-b": "rgba(255, 132, 94, 0.14)"
          }
        }
      ],
      backdrops: [
        {
          id: "neural",
          label: "Neural Fog",
          preview: ["#07111f", "#0d1831", "#48a3ff"],
          vars: {
            dark: {
              "bg-start": "#030816",
              "bg-mid": "#07111f",
              "bg-end": "#0d1831",
              "glow-a": "rgba(72, 163, 255, 0.16)",
              "glow-b": "rgba(0, 230, 167, 0.12)",
              "grid-tint": "rgba(124, 174, 255, 0.05)",
              bg: "#07111f",
              "bg-soft": "#0e1930"
            },
            light: {
              "bg-start": "#edf4ff",
              "bg-mid": "#f7fbff",
              "bg-end": "#dfeafe",
              "glow-a": "rgba(72, 163, 255, 0.18)",
              "glow-b": "rgba(0, 230, 167, 0.14)",
              "grid-tint": "rgba(42, 84, 140, 0.08)",
              bg: "#f4f8ff",
              "bg-soft": "#e5eefc"
            }
          }
        },
        {
          id: "aurora",
          label: "Aurora Veil",
          preview: ["#102638", "#1ddfbf", "#7b61ff"],
          vars: {
            dark: {
              "bg-start": "#031019",
              "bg-mid": "#0a1d2a",
              "bg-end": "#162241",
              "glow-a": "rgba(29, 223, 191, 0.16)",
              "glow-b": "rgba(123, 97, 255, 0.14)",
              "grid-tint": "rgba(84, 170, 210, 0.06)",
              bg: "#0a1b28",
              "bg-soft": "#112535"
            },
            light: {
              "bg-start": "#ecfff9",
              "bg-mid": "#f5fbff",
              "bg-end": "#eceffd",
              "glow-a": "rgba(29, 223, 191, 0.14)",
              "glow-b": "rgba(123, 97, 255, 0.1)",
              "grid-tint": "rgba(63, 113, 168, 0.08)",
              bg: "#f2fcfb",
              "bg-soft": "#e3f0f2"
            }
          }
        },
        {
          id: "ember-night",
          label: "Ember Night",
          preview: ["#24110a", "#ff8a3d", "#ffd166"],
          vars: {
            dark: {
              "bg-start": "#120804",
              "bg-mid": "#20110b",
              "bg-end": "#362018",
              "glow-a": "rgba(255, 138, 61, 0.18)",
              "glow-b": "rgba(255, 209, 102, 0.14)",
              "grid-tint": "rgba(255, 179, 94, 0.05)",
              bg: "#1d100a",
              "bg-soft": "#2a1711"
            },
            light: {
              "bg-start": "#fff5ec",
              "bg-mid": "#fffaf2",
              "bg-end": "#ffe7d3",
              "glow-a": "rgba(255, 138, 61, 0.16)",
              "glow-b": "rgba(255, 209, 102, 0.12)",
              "grid-tint": "rgba(173, 103, 47, 0.08)",
              bg: "#fff6ee",
              "bg-soft": "#fae9d8"
            }
          }
        },
        {
          id: "frost-grid",
          label: "Frost Grid",
          preview: ["#11233a", "#dff6ff", "#7ed4ff"],
          vars: {
            dark: {
              "bg-start": "#05111e",
              "bg-mid": "#0c2033",
              "bg-end": "#16304a",
              "glow-a": "rgba(126, 212, 255, 0.18)",
              "glow-b": "rgba(223, 246, 255, 0.12)",
              "grid-tint": "rgba(145, 203, 235, 0.05)",
              bg: "#0c1b2c",
              "bg-soft": "#132639"
            },
            light: {
              "bg-start": "#f1fbff",
              "bg-mid": "#f8fdff",
              "bg-end": "#ddf1fb",
              "glow-a": "rgba(126, 212, 255, 0.16)",
              "glow-b": "rgba(223, 246, 255, 0.12)",
              "grid-tint": "rgba(54, 102, 145, 0.08)",
              bg: "#f4fbff",
              "bg-soft": "#e2f0f7"
            }
          }
        }
      ]
    },
    theme: {
      accent: "#00e6a7",
      accent2: "#48a3ff",
      accent3: "#ff7a59",
      critical: "#ff4d6d"
    },
    home: {
      title: "Cybersecurity Command Center",
      metaDescription:
        "Neural Sentinel is a full-stack cybersecurity website with live intelligence, admin tools, blog publishing, SQL-backed workflows, and safe public website analysis.",
      eyebrow: "Cyber Defense Platform",
      headline: "Run a cybersecurity website that publishes, analyzes, and responds in real time.",
      description:
        "Neural Sentinel combines a public-facing command site, a dynamic blog, an admin workspace, SQL-backed lead and post management, and a safe public website intelligence workflow.",
      primaryCtaLabel: "Analyze a Website",
      primaryCtaHref: "#lab",
      secondaryCtaLabel: "Read Threat Briefings",
      secondaryCtaHref: "blog.html",
      badges: [
        "24/7 SOC Monitoring",
        "SQL-Backed Operations",
        "Safe Website Analysis",
        "Cloud Incident Response"
      ],
      panelLabel: "Live Defense Matrix",
      panelStatus: "Operational",
      labEyebrow: "Website Intelligence Lab",
      labHeadline: "Search and inspect public websites through a controlled, passive analysis workflow.",
      labNote:
        "Passive public-page analysis only. This checks public metadata, headers, forms, links, and keyword visibility. It does not do exploit testing, brute force, or port scanning.",
      labButtonLabel: "Run Safe Analysis",
      briefingsEyebrow: "Threat Briefings",
      briefingsHeadline: "Dynamic cybersecurity posts and news cards pulled from the backend.",
      briefingsButtonLabel: "Open Full Blog",
      contactEyebrow: "Let's Secure Your Stack",
      contactHeadline: "Capture leads, route inquiries, and push them straight into your SQL-backed workflow.",
      contactDescription:
        "The contact form now stores requests in the database, which means your website is no longer just visual. It is acting like a working cyber business platform.",
      contactPoints: ["Fast incident intake", "Service qualification", "SQL lead storage"],
      footerDescription:
        "Full-stack cyber publishing, lead intake, admin operations, and safe public website analysis."
    },
    blog: {
      title: "Threat Briefings",
      metaDescription:
        "Read dynamic cybersecurity briefings, cloud security insights, identity defense updates, and operational risk commentary from Neural Sentinel.",
      eyebrow: "Threat Briefings",
      headline: "Cybersecurity reporting that updates from your backend, not from hardcoded cards.",
      description:
        "Search published posts, open full briefings, and use this page as the editorial layer for your cybersecurity brand.",
      searchLabel: "Search Briefings",
      searchPlaceholder: "Search identity, cloud, response, vendors",
      searchButtonLabel: "Search",
      articleEyebrow: "Article View",
      articleHeadline: "Select a briefing from the list to read it here.",
      articleDescription:
        "You can also open a direct article URL like blog.html?slug=your-post-slug."
    },
    admin: {
      title: "Operations Dashboard",
      metaDescription:
        "Admin dashboard for Neural Sentinel with contact submissions, scan history, publishing controls, and SQL-backed cybersecurity operations.",
      eyebrow: "Admin Operations",
      headline: "Manage leads, site analysis history, and cybersecurity publishing from one control surface.",
      description:
        "This dashboard is backed by the same SQL database as the public site. Log in to manage posts and review new requests.",
      loginHeading: "Admin Login",
      loginHint: "Seeded account",
      loginButtonLabel: "Sign In",
      loginDescription:
        "Default seeded credentials are shown for local development. Change them before any real deployment.",
      sessionEyebrow: "Session",
      logoutLabel: "Sign Out",
      publishHeading: "Publish Briefing",
      publishNewLabel: "New post"
    },
    footer: {
      supportTitle: "Support",
      supportLinks: [
        { label: "Contact", href: "index.html#contact" },
        { label: "Help", href: "help.html" }
      ],
      legalTitle: "Legal",
      legalLinks: [
        { label: "Privacy Policy", href: "privacy.html" },
        { label: "Terms & Conditions", href: "terms.html" }
      ],
      connectTitle: "Connect",
      connectLinks: [
        { label: "Email", href: "mailto:hello@neuralsentinel.com" },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/neuralsentinel" },
        { label: "GitHub", href: "https://github.com/neuralsentinel" },
        { label: "X", href: "https://x.com/neuralsentinel" }
      ],
      copyright: "Copyright {year} {siteName}. All rights reserved."
    }
  },
  endpoints: {
    python: {
      dashboard: "/api/dashboard",
      contact: "/api/contact",
      posts: "/api/posts",
      postDetailBase: "/api/posts/",
      siteIntelligence: "/api/site-intelligence",
      adminSession: "/api/admin/session",
      adminLogin: "/api/admin/login",
      adminPassword: "/api/admin/password",
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
