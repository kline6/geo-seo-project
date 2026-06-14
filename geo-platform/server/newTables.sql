CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(100) NOT NULL,
  api_key TEXT DEFAULT '',
  api_url VARCHAR(500) DEFAULT '',
  model VARCHAR(100) DEFAULT '',
  max_tokens INTEGER DEFAULT 4096,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backlinks (
  id SERIAL PRIMARY KEY,
  source_url VARCHAR(1000) NOT NULL,
  target_url VARCHAR(1000) NOT NULL,
  anchor_text VARCHAR(255) DEFAULT '',
  link_type VARCHAR(50) DEFAULT 'dofollow',
  da_score INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  discovered_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS keyword_tracking (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  target_url VARCHAR(1000) DEFAULT '',
  google_rank INTEGER DEFAULT 0,
  geo_visibility INTEGER DEFAULT 0,
  search_volume INTEGER DEFAULT 0,
  competition INTEGER DEFAULT 0,
  cpc DECIMAL(10,2) DEFAULT 0,
  last_check TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  report_type VARCHAR(100) DEFAULT 'general',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_outlets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100) DEFAULT '',
  da_score INTEGER DEFAULT 0,
  monthly_traffic VARCHAR(50) DEFAULT '',
  category VARCHAR(100) DEFAULT 'authority',
  response_time VARCHAR(50) DEFAULT '',
  selected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS press_releases (
  id SERIAL PRIMARY KEY,
  brand_name VARCHAR(255) DEFAULT '',
  language VARCHAR(50) DEFAULT 'zh',
  title VARCHAR(500) DEFAULT '',
  content TEXT DEFAULT '',
  media_ids TEXT DEFAULT '',
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS copy_records (
  id SERIAL PRIMARY KEY,
  original_title VARCHAR(500) DEFAULT '',
  original_content TEXT DEFAULT '',
  rewritten_title VARCHAR(500) DEFAULT '',
  rewritten_content TEXT DEFAULT '',
  model_used VARCHAR(100) DEFAULT '',
  source_type VARCHAR(50) DEFAULT 'paste',
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) DEFAULT '',
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO app_settings (provider, api_url, model, max_tokens, enabled) VALUES
('Google Gemini', 'https://generativelanguage.googleapis.com/v1beta/models/', 'gemini-pro', 4096, false),
('OpenAI', 'https://api.openai.com/v1/chat/completions', 'gpt-4', 4096, false),
('Anthropic Claude', 'https://api.anthropic.com/v1/messages', 'claude-3-opus', 4096, false),
('xAI Grok', 'https://api.x.ai/v1/chat/completions', 'grok-1', 4096, false),
('Mistral', 'https://api.mistral.ai/v1/chat/completions', 'mistral-large', 4096, false),
('XiaoMi MiMo', 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions', 'mimo-v2.5-pro', 32768, true);

INSERT INTO media_outlets (name, region, da_score, monthly_traffic, category, response_time) VALUES
('TechCrunch', 'North America', 95, '50M/mo', 'authority', '24h'),
('Bloomberg', 'North America', 97, '80M/mo', 'authority', '48h'),
('The Wall Street Journal', 'North America', 96, '120M/mo', 'authority', '48h'),
('Forbes', 'North America', 95, '150M/mo', 'authority', '36h'),
('The New York Times', 'North America', 96, '300M/mo', 'authority', '48h'),
('The Washington Post', 'North America', 95, '200M/mo', 'authority', '48h'),
('BBC', 'Europe', 95, '400M/mo', 'authority', '24h'),
('Reuters', 'Global', 96, '350M/mo', 'authority', '12h');

INSERT INTO users (username, password_hash, display_name, role) VALUES
('admin', 'admin123', 'GEO Admin', 'admin');