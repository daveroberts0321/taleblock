// src/lib/server/auth.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { redirect } from '@sveltejs/kit';
import type { D1Database } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';

interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export async function createUser(
  db: D1Database,
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await db
      .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
      .bind(username.toLowerCase(), email.toLowerCase(), hashedPassword)
      .run();
    
    return { success: true };
  } catch (e: any) {
    if (e.message.includes('UNIQUE constraint')) {
      return { 
        success: false, 
        error: 'Username or email already exists' 
      };
    }
    throw e;
  }
}

export async function createSession(
  db: D1Database,
  userId: number
): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days

  await db
    .prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(token, userId, expires)
    .run();

  return token;
}

export async function validateSession(
  db: D1Database,
  token: string
): Promise<AuthUser | null> {
  const { results } = await db
    .prepare(`
      SELECT u.id, u.username, u.email
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
      AND s.expires_at > unixepoch()
    `)
    .bind(token)
    .all();

  return results[0] as AuthUser || null;
}

export async function deleteSession(
  db: D1Database,
  token: string
): Promise<void> {
  await db
    .prepare('DELETE FROM sessions WHERE token = ?')
    .bind(token)
    .run();
}

export async function requireAuth(event: RequestEvent) {
  if (!event.locals.user) {
    throw redirect(303, '/login');
  }
  return event.locals.user;
}

