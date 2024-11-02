// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { createSession } from '$lib/server/auth';
import type { Actions } from './$types';

// PBKDF2-based password verification
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const combined = Uint8Array.from(atob(hashedPassword), c => c.charCodeAt(0));
    
    // Extract salt and stored hash
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    // Import password for PBKDF2
    const passwordData = encoder.encode(password);
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Generate hash with same parameters
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

export const actions = {
  default: async ({ request, platform, cookies }) => {
    if (!platform?.env?.DB) {
      return fail(500, { error: 'Database not available' });
    }

    const data = await request.formData();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString();

    if (!username || !password) {
      return fail(400, { 
        error: 'Username and password are required',
        username 
      });
    }

    const { results: [user] } = await platform.env.DB
      .prepare('SELECT * FROM users WHERE username = ?')
      .bind(username.toLowerCase())
      .all();

    if (!user || !await verifyPassword(password, user.password_hash)) {
      return fail(400, { 
        error: 'Invalid username or password',
        username 
      });
    }

    const token = await createSession(platform.env.DB, user.id);
    
    cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true, // Always use secure in Cloudflare environment
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(303, '/');
  }
} satisfies Actions;