-- جدول سجلات التدقيق
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(64),
  entity VARCHAR(64),
  entity_id INTEGER,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
-- جدول المخزون
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  branch_id INTEGER REFERENCES branches(id),
  quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (product_id, branch_id)
);
-- جدول الفواتير الإلكترونية ZATCA
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id),
  uuid VARCHAR(64) UNIQUE NOT NULL,
  xml_data TEXT,
  qr_code TEXT,
  digital_signature TEXT,
  status VARCHAR(32),
  created_at TIMESTAMP DEFAULT NOW()
);
-- جدول المبيعات
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id),
  pos_terminal_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  customer_id INTEGER REFERENCES customers(id),
  total NUMERIC(12,2) NOT NULL,
  tax NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(32) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);
-- جدول العملاء
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  email VARCHAR(128),
  created_at TIMESTAMP DEFAULT NOW()
);
-- جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(128) NOT NULL,
  name_ar VARCHAR(128) NOT NULL,
  sku VARCHAR(64) UNIQUE NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
-- إنشاء الجداول الأساسية للمشروع
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) UNIQUE NOT NULL,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- إضافة دور افتراضي (Admin)
INSERT INTO roles (name, permissions) VALUES ('Admin', '{"all": true}') ON CONFLICT DO NOTHING;

-- جدول الفروع
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
