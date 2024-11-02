// src/routes/register/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { createUser, createSession } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request, platform, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    const confirmPassword = data.get('confirmPassword')?.toString();

    if (!username || !email || !password || !confirmPassword) {
      return fail(400, { 
        error: 'All fields are required',
        username,
        email
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match',
        username,
        email
      });
    }

    if (password.length < 8) {
      return fail(400, {
        error: 'Password must be at least 8 characters',
        username,
        email
      });
    }

    const result = await createUser(
      platform.env.DB,
      username,
      email,
      password
    );

    if (!result.success) {
      return fail(400, {
        error: result.error,
        username,
        email
      });
    }

    // Get the user id to create a session
    const { results: [user] } = await platform.env.DB
      .prepare('SELECT id FROM users WHERE username = ?')
      .bind(username.toLowerCase())
      .all();

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