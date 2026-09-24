-- PostgreSQL Schema for GitHub Repository Intelligence Module

CREATE TABLE IF NOT EXISTS github_repositories (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL DEFAULT 'usr_default',
  owner VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(512) NOT NULL,
  branch VARCHAR(255) NOT NULL DEFAULT 'main',
  description TEXT,
  language VARCHAR(100),
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  size INTEGER DEFAULT 0,
  default_branch VARCHAR(255) DEFAULT 'main',
  latest_commit_sha VARCHAR(64),
  latest_commit_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_github_repo_owner_name ON github_repositories (owner, name);
CREATE INDEX IF NOT EXISTS idx_github_repo_url ON github_repositories (url);

CREATE TABLE IF NOT EXISTS repository_files (
  id VARCHAR(64) PRIMARY KEY,
  repository_id VARCHAR(64) NOT NULL REFERENCES github_repositories(id) ON DELETE CASCADE,
  path VARCHAR(1024) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  language VARCHAR(64),
  size INTEGER DEFAULT 0,
  content TEXT,
  sha VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_repo_files_repo_id ON repository_files (repository_id);
CREATE INDEX IF NOT EXISTS idx_repo_files_path ON repository_files (path);

CREATE TABLE IF NOT EXISTS repository_analysis (
  id VARCHAR(64) PRIMARY KEY,
  repository_id VARCHAR(64) NOT NULL UNIQUE REFERENCES github_repositories(id) ON DELETE CASCADE,
  technology_stack JSONB NOT NULL DEFAULT '[]',
  frameworks JSONB NOT NULL DEFAULT '[]',
  database JSONB NOT NULL DEFAULT '{}',
  api_count INTEGER DEFAULT 0,
  component_count INTEGER DEFAULT 0,
  summary JSONB NOT NULL DEFAULT '{}',
  architecture JSONB NOT NULL DEFAULT '{}',
  health JSONB NOT NULL DEFAULT '{}',
  user_journeys JSONB NOT NULL DEFAULT '[]',
  component_graph JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_repo_analysis_repo_id ON repository_analysis (repository_id);

CREATE TABLE IF NOT EXISTS code_explanations (
  id VARCHAR(64) PRIMARY KEY,
  repository_id VARCHAR(64) NOT NULL REFERENCES github_repositories(id) ON DELETE CASCADE,
  file_id VARCHAR(64) NOT NULL REFERENCES repository_files(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  purpose TEXT NOT NULL,
  functions JSONB NOT NULL DEFAULT '[]',
  dependencies JSONB NOT NULL DEFAULT '[]',
  api_info JSONB NOT NULL DEFAULT '[]',
  database_info TEXT,
  security_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_code_explanations_file_id ON code_explanations (file_id);
