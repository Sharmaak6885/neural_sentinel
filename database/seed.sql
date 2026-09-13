INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES
  ('priority_advisory_label', 'Priority Advisory'),
  ('priority_advisory_headline', 'Credential-stuffing traffic spike detected in retail sector.'),
  ('priority_advisory_link_text', 'View response pattern'),
  ('priority_advisory_url', '#stories'),
  ('maturity_score', '86'),
  ('maturity_label', 'Adaptive');

INSERT OR IGNORE INTO metrics (id, label, value, suffix, display_order) VALUES
  (1, 'Threats Blocked', 1824, '+', 1),
  (2, 'Critical Assets', 96, '', 2),
  (3, 'Incidents Resolved', 248, '', 3),
  (4, 'Analyst Coverage', 24, '/7', 4);

INSERT OR IGNORE INTO regions (id, name, sector, level, display_order) VALUES
  (1, 'North America', 'Finance APIs', 'high', 1),
  (2, 'Europe', 'Identity Platforms', 'medium', 2),
  (3, 'Middle East', 'Energy OT', 'critical', 3),
  (4, 'South Asia', 'Cloud Workloads', 'high', 4),
  (5, 'Southeast Asia', 'E-commerce', 'medium', 5),
  (6, 'Africa', 'Mobile Banking', 'low', 6),
  (7, 'Latin America', 'Telecom Edge', 'medium', 7),
  (8, 'Oceania', 'Healthcare Data', 'low', 8);

INSERT OR IGNORE INTO feed_sets (id, name, display_order) VALUES
  (1, 'Identity and Cloud', 1),
  (2, 'Retail and Third-Party Risk', 2);

INSERT OR IGNORE INTO feed_items (id, set_id, title, text, tag, display_order) VALUES
  (1, 1, 'Phishing kit targeting HR portals', 'Credential harvesting pages are imitating internal SSO experiences across enterprise hiring flows.', 'Identity Defense', 1),
  (2, 1, 'Cloud token abuse pattern expanding', 'Short-lived token theft is showing up in misconfigured CI pipelines and exposed staging apps.', 'Cloud Security', 2),
  (3, 1, 'Ransomware operators shifting laterally faster', 'Unmanaged endpoints and legacy VPN edges continue to compress attacker dwell time.', 'Endpoint Response', 3),
  (4, 2, 'Retail botnets intensify account takeover attempts', 'Login floods are blending residential proxies with breached credentials to bypass weaker friction controls.', 'Fraud Monitoring', 1),
  (5, 2, 'Healthcare vendors seeing third-party risk pressure', 'Attackers are exploiting shared support tooling to pivot into patient-data handling workflows.', 'Vendor Risk', 2),
  (6, 2, 'Exposed admin consoles remain a top initial foothold', 'Internet-facing dashboards with incomplete MFA are still creating outsized incident response effort.', 'Attack Surface', 3);

INSERT OR IGNORE INTO services (id, title, text, tag, display_order) VALUES
  (1, 'Managed Detection & Response', 'Continuous monitoring, triage, and response workflows for cloud, endpoint, and identity layers.', 'SOC-as-a-Service', 1),
  (2, 'Cloud Security Hardening', 'Posture assessments, least-privilege design, and workload protection for AWS, Azure, and hybrid estates.', 'Cloud Defense', 2),
  (3, 'Compliance & Risk Advisory', 'Translate controls into business-ready readiness programs for ISO 27001, SOC 2, PCI DSS, and more.', 'Audit Readiness', 3),
  (4, 'Incident Response Retainers', 'Rapid containment, forensic guidance, and recovery planning when high-impact events hit production.', 'IR Readiness', 4),
  (5, 'Red Team & Validation', 'Adversary emulation and resilience testing to expose blind spots before real attackers do.', 'Offensive Security', 5),
  (6, 'Security Awareness Programs', 'Human-focused resilience training backed by phishing simulations and reporting workflows.', 'People Defense', 6);

INSERT OR IGNORE INTO timeline_steps (id, title, text, display_order) VALUES
  (1, 'Detect', 'Stream alerts across endpoint, identity, and cloud telemetry into a unified monitoring layer.', 1),
  (2, 'Contain', 'Automate isolation, revoke sessions, and remove malicious persistence before blast radius expands.', 2),
  (3, 'Investigate', 'Correlate artifacts, establish attacker pathing, and document impact with evidence-backed analysis.', 3),
  (4, 'Recover', 'Restore services safely, validate remediations, and strengthen controls against repeat compromise.', 4);

INSERT OR IGNORE INTO score_bars (id, label, value, display_order) VALUES
  (1, 'Identity Controls', 91, 1),
  (2, 'Cloud Posture', 84, 2),
  (3, 'Response Readiness', 88, 3),
  (4, 'Third-Party Governance', 79, 4);

INSERT OR IGNORE INTO case_stories (id, title, text, display_order) VALUES
  (1, 'Stopped a multi-region credential abuse campaign', 'A retail client reduced fraudulent logins by tightening adaptive friction, bot detection, and privileged identity controls.', 1),
  (2, 'Cut cloud misconfiguration exposure across 300+ workloads', 'An enterprise platform team used posture baselines and guardrails to eliminate recurring internet-facing risk.', 2),
  (3, 'Accelerated audit readiness for a fintech launch', 'Compliance mapping, evidence workflows, and policy cleanup moved the program from reactive to board-ready.', 3);

INSERT OR IGNORE INTO case_story_kpis (id, story_id, label, value, display_order) VALUES
  (1, 1, 'Attack reduction', '67%', 1),
  (2, 1, 'Containment time', '18 min', 2),
  (3, 2, 'Critical gaps closed', '142', 1),
  (4, 2, 'Coverage increase', '3.2x', 2),
  (5, 3, 'Control maturity', '+31%', 1),
  (6, 3, 'Prep time saved', '120 hrs', 2);

INSERT OR IGNORE INTO admin_users (id, username, password_hash, password_salt, display_name, role) VALUES
  (1, 'admin', 'd35f3f212a2f37b1b8da66b6ab4e2fc252dcbd4e41195e4241f36e5d9d797f16', '8f3e5b0a7c1d9e2f4a6b8c0d1e2f3a4b', 'Sentinel Admin', 'admin');

INSERT OR IGNORE INTO blog_posts (id, slug, title, excerpt, content, category, status, is_featured, published_at) VALUES
  (
    1,
    'identity-first-defense-playbook',
    'Identity-First Defense Playbook for Modern Teams',
    'How security teams can shrink exposure by focusing on identity controls before attackers chain cloud and endpoint access.',
    'Identity has become the fastest path to meaningful risk reduction. Teams that tighten phishing-resistant MFA, conditional access, privileged session review, and stale-account removal usually improve both security and operational clarity. This playbook outlines a practical sequence: map critical identities, close shared-account patterns, harden admin workflows, and add better sign-in telemetry for investigation.',
    'Identity Security',
    'published',
    1,
    '2026-04-05 09:00:00'
  ),
  (
    2,
    'cloud-misconfiguration-response-patterns',
    'Cloud Misconfiguration Response Patterns That Actually Scale',
    'A field guide for reducing repeated cloud security issues without drowning engineering teams in noisy alerts.',
    'Sustainable cloud defense is less about collecting more findings and more about designing a smaller set of repeatable controls. Strong teams define ownership, normalize risk language, connect posture issues to production context, and automate safe guardrails where possible. This article explains how to turn posture review into a workflow engineers can maintain over time.',
    'Cloud Security',
    'published',
    1,
    '2026-04-07 14:30:00'
  ),
  (
    3,
    'third-party-risk-in-fast-growth-companies',
    'Third-Party Risk in Fast-Growth Companies',
    'Why vendor sprawl becomes a security multiplier and how lean teams can get ahead of it before audit season.',
    'Fast-growing organizations often inherit vendor risk without realizing how deeply those tools touch identity, customer data, and incident response paths. The strongest first move is not a giant review spreadsheet. It is a compact inventory of high-impact vendors, data paths, access levels, and recovery assumptions. From there, teams can layer evidence collection and contract checkpoints more effectively.',
    'Risk Management',
    'published',
    0,
    '2026-04-09 11:15:00'
  );
