// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { createSession } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request, platform, cookies }) => {
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

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(303, '/');
  }
} satisfies Actions;