// src/lib/database.ts
import { D1Database } from '@cloudflare/workers-types';

export interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    created_at?: number;
}

export interface Session {
    token: string;
    user_id: number;
    expires_at: number;
    created_at?: number;
}

export interface Story {
    id?: number;
    title: string;
    content: string;
    excerpt?: string;
    author_id: number;
    parent_id?: number;
    forks: number;
    reads: number;
    coverImage?: string;
    status: 'draft' | 'published' | 'archived';
    created_at?: number;
}

export interface StoryVersion {
    id?: number;
    story_id: number;
    content: string;
    created_at?: number;
}

export interface Tag {
    id?: number;
    name: string;
}

export class Database {
    constructor(private db: D1Database) {}

    // User operations
    async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
        const result = await this.db
            .prepare(`
                INSERT INTO users (username, email, password_hash)
                VALUES (?, ?, ?)
                RETURNING *
            `)
            .bind(user.username, user.email, user.password_hash)
            .first<User>();
        
        if (!result) throw new Error('Failed to create user');
        return result;
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.db
            .prepare('SELECT * FROM users WHERE id = ?')
            .bind(id)
            .first<User>();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.db
            .prepare('SELECT * FROM users WHERE email = ?')
            .bind(email)
            .first<User>();
    }

    // Session operations
    async createSession(session: Session): Promise<Session> {
        const result = await this.db
            .prepare(`
                INSERT INTO sessions (token, user_id, expires_at)
                VALUES (?, ?, ?)
                RETURNING *
            `)
            .bind(session.token, session.user_id, session.expires_at)
            .first<Session>();
        
        if (!result) throw new Error('Failed to create session');
        return result;
    }

    async getSession(token: string): Promise<Session | null> {
        return await this.db
            .prepare('SELECT * FROM sessions WHERE token = ? AND expires_at > unixepoch()')
            .bind(token)
            .first<Session>();
    }

    async deleteSession(token: string): Promise<void> {
        await this.db
            .prepare('DELETE FROM sessions WHERE token = ?')
            .bind(token)
            .run();
    }

    // Story operations
    async createStory(story: Omit<Story, 'id' | 'created_at'>): Promise<Story> {
        const result = await this.db
            .prepare(`
                INSERT INTO stories (
                    title, content, excerpt, author_id, parent_id,
                    forks, reads, coverImage, status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                RETURNING *
            `)
            .bind(
                story.title,
                story.content,
                story.excerpt,
                story.author_id,
                story.parent_id,
                story.forks,
                story.reads,
                story.coverImage,
                story.status
            )
            .first<Story>();
        
        if (!result) throw new Error('Failed to create story');
        return result;
    }

    async getStoryById(id: number): Promise<Story | null> {
        return await this.db
            .prepare('SELECT * FROM stories WHERE id = ?')
            .bind(id)
            .first<Story>();
    }

    async getStoriesByAuthor(authorId: number): Promise<Story[]> {
        const { results } = await this.db
            .prepare('SELECT * FROM stories WHERE author_id = ? ORDER BY created_at DESC')
            .bind(authorId)
            .all<Story>();
        return results;
    }

    async getPublishedStories(limit = 20, offset = 0): Promise<Story[]> {
        const { results } = await this.db
            .prepare(`
                SELECT * FROM stories 
                WHERE status = 'published' 
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `)
            .bind(limit, offset)
            .all<Story>();
        return results;
    }

    async incrementStoryReads(id: number): Promise<void> {
        await this.db
            .prepare('UPDATE stories SET reads = reads + 1 WHERE id = ?')
            .bind(id)
            .run();
    }

    async incrementStoryForks(id: number): Promise<void> {
        await this.db
            .prepare('UPDATE stories SET forks = forks + 1 WHERE id = ?')
            .bind(id)
            .run();
    }

    // Story versions
    async createStoryVersion(version: Omit<StoryVersion, 'id' | 'created_at'>): Promise<StoryVersion> {
        const result = await this.db
            .prepare(`
                INSERT INTO story_versions (story_id, content)
                VALUES (?, ?)
                RETURNING *
            `)
            .bind(version.story_id, version.content)
            .first<StoryVersion>();
        
        if (!result) throw new Error('Failed to create story version');
        return result;
    }

    async getStoryVersions(storyId: number): Promise<StoryVersion[]> {
        const { results } = await this.db
            .prepare('SELECT * FROM story_versions WHERE story_id = ? ORDER BY created_at DESC')
            .bind(storyId)
            .all<StoryVersion>();
        return results;
    }

    // Tags
    async getStoryTags(storyId: number): Promise<Tag[]> {
        const { results } = await this.db
            .prepare(`
                SELECT tags.* FROM tags
                JOIN story_tags ON tags.id = story_tags.tag_id
                WHERE story_tags.story_id = ?
            `)
            .bind(storyId)
            .all<Tag>();
        return results;
    }

    async addTagToStory(storyId: number, tagId: number): Promise<void> {
        await this.db
            .prepare('INSERT OR IGNORE INTO story_tags (story_id, tag_id) VALUES (?, ?)')
            .bind(storyId, tagId)
            .run();
    }

    async removeTagFromStory(storyId: number, tagId: number): Promise<void> {
        await this.db
            .prepare('DELETE FROM story_tags WHERE story_id = ? AND tag_id = ?')
            .bind(storyId, tagId)
            .run();
    }

    async getAllTags(): Promise<Tag[]> {
        const { results } = await this.db
            .prepare('SELECT * FROM tags ORDER BY name')
            .all<Tag>();
        return results;
    }

    async searchStories(query: string): Promise<Story[]> {
        const { results } = await this.db
            .prepare(`
                SELECT DISTINCT stories.* FROM stories
                LEFT JOIN story_tags ON stories.id = story_tags.story_id
                LEFT JOIN tags ON story_tags.tag_id = tags.id
                WHERE stories.status = 'published'
                AND (
                    stories.title LIKE ?
                    OR stories.content LIKE ?
                    OR stories.excerpt LIKE ?
                    OR tags.name LIKE ?
                )
                ORDER BY stories.created_at DESC
            `)
            .bind(
                `%${query}%`,
                `%${query}%`,
                `%${query}%`,
                `%${query}%`
            )
            .all<Story>();
        return results;
    }
}