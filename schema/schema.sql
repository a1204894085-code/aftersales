CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'manager',
  manager_name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  price REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS dealers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  manager_id INTEGER NOT NULL,
  dealer_name TEXT NOT NULL,
  card_no TEXT NOT NULL DEFAULT '',
  bank TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT '',
  card_holder TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reg_date TEXT NOT NULL,
  product_name TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  refund_amount REAL NOT NULL DEFAULT 0,
  aftersale_type TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  original_tracking TEXT NOT NULL DEFAULT '',
  return_tracking TEXT NOT NULL DEFAULT '',
  screenshots TEXT NOT NULL DEFAULT '[]',
  dealer TEXT NOT NULL DEFAULT '',
  payee_name TEXT NOT NULL DEFAULT '',
  card_no TEXT NOT NULL DEFAULT '',
  bank TEXT NOT NULL DEFAULT '',
  manager TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_records_reg_date ON records (reg_date);

CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  fields TEXT NOT NULL DEFAULT '[]',
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS template_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_trec_template ON template_records (template_id);

CREATE TABLE IF NOT EXISTS vouchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL,
  record_id INTEGER,
  order_no TEXT NOT NULL,
  file_key TEXT NOT NULL,
  file_name TEXT DEFAULT '',
  name TEXT DEFAULT '',
  card_no TEXT DEFAULT '',
  amount TEXT DEFAULT '',
  status TEXT DEFAULT 'unmatched',
  uploaded_by INTEGER,
  created_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_vch_tpl ON vouchers(template_id);
CREATE INDEX IF NOT EXISTS idx_vch_rec ON vouchers(record_id);
CREATE INDEX IF NOT EXISTS idx_vch_order ON vouchers(order_no);
