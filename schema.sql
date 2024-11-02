-- schema.sql
PRAGMA foreign_keys = ON;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS story_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS story_versions;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- Now create tables
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE stories (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INTEGER NOT NULL,
    parent_id INTEGER,
    forks INTEGER DEFAULT 0,
    reads INTEGER DEFAULT 0,
    coverImage TEXT,
    status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES stories(id) ON DELETE SET NULL
);

CREATE TABLE story_versions (
    id INTEGER PRIMARY KEY,
    story_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE story_tags (
    story_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (story_id, tag_id),
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_stories_author ON stories(author_id);
CREATE INDEX idx_stories_parent ON stories(parent_id);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_story_tags_tag ON story_tags(tag_id);
CREATE INDEX idx_tags_name ON tags(name);

-- Initial tags
INSERT OR IGNORE INTO tags (name) VALUES 
('fantasy'),
('sci-fi'),
('mystery'),
('romance'),
('horror'),
('adventure'),
('historical'),
('literary');