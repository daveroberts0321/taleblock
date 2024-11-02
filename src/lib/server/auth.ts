// src/lib/server/auth.ts
import { redirect } from '@sveltejs/kit';
import type { D1Database } from '@cloudflare/workers-types';
import type { RequestEvent } from '@sveltejs/kit';

interface AuthUser {
  id: number;
  username: string;
  email: string;
}

// PBKDF2-based password hashing as a bcrypt alternative
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordData = encoder.encode(password);
  
  // Use PBKDF2 with 100,000 iterations
  const key = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  );
  
  // Combine salt and hash
  const combined = new Uint8Array(salt.length + hash.byteLength);
  combined.set(salt);
  combined.set(new Uint8Array(hash), salt.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const combined = Uint8Array.from(atob(hashedPassword), c => c.charCodeAt(0));
    
    // Extract salt and hash
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    const passwordData = encoder.encode(password);
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const newHash = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      key,
      256
    );
    
    // Compare hashes
    const newHashArray = new Uint8Array(newHash);
    if (storedHash.length !== newHashArray.length) return false;
    
    return storedHash.every((value, index) => value === newHashArray[index]);
  } catch {
    return false;
  }
}

export async function createUser(
  db: D1Database,
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const hashedPassword = await hashPassword(password);

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
  // Generate a secure random token using Web Crypto API
  const tokenBuffer = new Uint8Array(32);
  crypto.getRandomValues(tokenBuffer);
  const token = Array.from(tokenBuffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
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

// Add login helper function
export async function loginUser(
  db: D1Database,
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const user = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first();

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const token = await createSession(db, user.id);
  return { success: true, token };
}

// Add utility function to clean up expired sessions
export async function cleanupExpiredSessions(db: D1Database): Promise<void> {
  await db
    .prepare('DELETE FROM sessions WHERE expires_at < unixepoch()')
    .run();
}

