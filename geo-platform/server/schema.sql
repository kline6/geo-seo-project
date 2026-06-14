CREATE TABLE keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  volume INTEGER DEFAULT 0,
  visibility INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  prev_position INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  platform VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  publish_date DATE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE diagnoses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  diagnosis_type VARCHAR(100),
  date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'pending',
  score INTEGER,
  result TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  size VARCHAR(50),
  category VARCHAR(100),
  upload_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_writes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  template VARCHAR(100),
  keywords TEXT,
  tone VARCHAR(50),
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hot_copies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  source VARCHAR(255),
  heat INTEGER DEFAULT 0,
  keywords TEXT,
  url VARCHAR(1000),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE publishes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  platform VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  publish_date DATE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analysis_data (
  id SERIAL PRIMARY KEY,
  day_name VARCHAR(20),
  visibility INTEGER DEFAULT 0,
  traffic INTEGER DEFAULT 0,
  period_type VARCHAR(20) DEFAULT 'weekly',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE platform_analysis (
  id SERIAL PRIMARY KEY,
  platform_name VARCHAR(100) NOT NULL,
  visibility INTEGER DEFAULT 0,
  trend VARCHAR(20),
  is_up BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  icon VARCHAR(50),
  color VARCHAR(20),
  popularity INTEGER DEFAULT 0,
  uses INTEGER DEFAULT 0,
  last_used VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seo_keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  volume INTEGER DEFAULT 0,
  visibility INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  prev_position INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  platform VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trust_factors (
  id SERIAL PRIMARY KEY,
  factor_name VARCHAR(255) NOT NULL,
  score INTEGER DEFAULT 0,
  weight VARCHAR(20),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trust_suggestions (
  id SERIAL PRIMARY KEY,
  suggestion_text TEXT NOT NULL,
  priority VARCHAR(20),
  impact VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE plan_tasks (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  progress INTEGER DEFAULT 0,
  deadline DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE goal_milestones (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);