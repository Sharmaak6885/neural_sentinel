PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS metrics (
  id INTEGER PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  suffix TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS regions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  level TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS feed_sets (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS feed_items (
  id INTEGER PRIMARY KEY,
  set_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  tag TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  FOREIGN KEY (set_id) REFERENCES feed_sets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  tag TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS timeline_steps (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS score_bars (
  id INTEGER PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS case_stories (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS case_story_kpis (
  id INTEGER PRIMARY KEY,
  story_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  FOREIGN KEY (story_id) REFERENCES case_stories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  priority TEXT NOT NULL,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT
);

CREATE TABLE IF NOT EXISTS scan_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requested_url TEXT NOT NULL,
  normalized_url TEXT NOT NULL,
  final_url TEXT NOT NULL,
  keyword TEXT,
  status_code INTEGER,
  title TEXT,
  meta_description TEXT,
  content_type TEXT,
  server_header TEXT,
  security_score INTEGER NOT NULL DEFAULT 0,
  internal_links INTEGER NOT NULL DEFAULT 0,
  external_links INTEGER NOT NULL DEFAULT 0,
  forms_count INTEGER NOT NULL DEFAULT 0,
  keyword_matches INTEGER NOT NULL DEFAULT 0,
  headers_json TEXT NOT NULL,
  findings_json TEXT NOT NULL,
  analyzed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_analyzed_at ON scan_history(analyzed_at DESC);
