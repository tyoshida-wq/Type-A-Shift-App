-- ユーザー/スタッフマスタテーブル
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_kana TEXT,
  name_en TEXT,
  type TEXT NOT NULL CHECK(type IN ('staff', 'user')),
  phone TEXT,
  email TEXT,
  address TEXT,
  join_date TEXT,
  avatar TEXT,
  work_days TEXT, -- JSON array: [true, false, ...]
  needs_transport INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- スキルテーブル
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER CHECK(level >= 1 AND level <= 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 特性タグテーブル
CREATE TABLE IF NOT EXISTS characteristics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 人間関係（NGペア・推奨ペア）テーブル
CREATE TABLE IF NOT EXISTS relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  related_user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('ng', 'recommended')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- サイトマスタテーブル
CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  min_staff INTEGER DEFAULT 1,
  recommended_staff INTEGER DEFAULT 2,
  staff_always_present INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- サイト必須スキルテーブル
CREATE TABLE IF NOT EXISTS site_required_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

-- シフトテーブル
CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  start_time TEXT NOT NULL, -- HH:MM format
  end_time TEXT NOT NULL, -- HH:MM format
  location TEXT,
  transport TEXT,
  status TEXT CHECK(status IN ('confirmed', 'tentative', 'cancelled')) DEFAULT 'tentative',
  is_support INTEGER DEFAULT 0, -- 応援配置フラグ
  is_violation INTEGER DEFAULT 0, -- 配置基準違反フラグ
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- アプリルール設定テーブル
CREATE TABLE IF NOT EXISTS app_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_key TEXT UNIQUE NOT NULL,
  rule_value TEXT NOT NULL,
  rule_type TEXT CHECK(rule_type IN ('number', 'text', 'boolean')) DEFAULT 'text',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_characteristics_user_id ON characteristics(user_id);
CREATE INDEX IF NOT EXISTS idx_relationships_user_id ON relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_user_id ON shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_site_skills_site_id ON site_required_skills(site_id);
