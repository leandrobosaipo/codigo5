CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_user_id TEXT UNIQUE NOT NULL,
  username TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  telegram_user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  mode TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_value TEXT NOT NULL,
  title TEXT,
  slug TEXT,
  segment TEXT,
  service_focus TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_drafts_user_updated_at ON drafts (telegram_user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  seo_title TEXT,
  seo_description TEXT,
  image_url TEXT,
  content_html TEXT NOT NULL,
  categories_json TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  status TEXT NOT NULL,
  canonical_url TEXT,
  published_at TEXT,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS redirects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_path TEXT UNIQUE NOT NULL,
  target_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  reason TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS publish_jobs (
  id TEXT PRIMARY KEY,
  draft_id TEXT,
  post_id TEXT,
  status TEXT NOT NULL,
  log TEXT,
  started_at TEXT,
  finished_at TEXT,
  created_at TEXT NOT NULL
);
