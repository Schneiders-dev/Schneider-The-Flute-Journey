// Banco SQLite embutido no Node (node:sqlite). Arquivo em DATA_DIR (no Railway: volume em /data).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
mkdirSync(join(DATA_DIR, 'uploads'), { recursive: true });

export const db = new DatabaseSync(join(DATA_DIR, 'flute-journey.db'));
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  pass_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'visitor',
  is_student INTEGER NOT NULL DEFAULT 0,
  start_station INTEGER NOT NULL DEFAULT 0,
  max_unlocked INTEGER NOT NULL DEFAULT 0,
  placement_done INTEGER NOT NULL DEFAULT 0,
  placement_score TEXT NOT NULL DEFAULT '',
  consent INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  logins INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL DEFAULT 0,
  last_login_at INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  station INTEGER NOT NULL,
  best_score INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  passed_at INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, station)
);
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  station INTEGER NOT NULL,
  payload TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  finished_at INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT -1
);
CREATE TABLE IF NOT EXISTS visits (
  vid TEXT NOT NULL,
  day TEXT NOT NULL,
  user_id INTEGER,
  first_ts INTEGER NOT NULL,
  last_ts INTEGER NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  pageviews INTEGER NOT NULL DEFAULT 0,
  ref TEXT NOT NULL DEFAULT '',
  mobile INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (vid, day)
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  vid TEXT NOT NULL,
  user_id INTEGER,
  type TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  value INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS events_ts ON events(ts);
CREATE INDEX IF NOT EXISTS visits_day ON visits(day);
CREATE TABLE IF NOT EXISTS content (
  path TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
`);

export const now = () => Date.now();
