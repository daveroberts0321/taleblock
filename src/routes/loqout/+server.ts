// src/routes/logout/+server.ts
import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, platform }) => {
  const token = cookies.get('session');
  
  if (token) {
    await deleteSession(platform.env.DB, token);
    cookies.delete('session', { path: '/' });
  }
  
  throw redirect(303, '/');
};