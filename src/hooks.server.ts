// src/hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = sequence(
  async ({ event, resolve }) => {
    const sessionToken = event.cookies.get('session');
    
    if (sessionToken) {
      const { results: [session] } = await event.platform?.env.DB
        .prepare(`
          SELECT u.id, u.username, u.email 
          FROM sessions s
          JOIN users u ON s.user_id = u.id
          WHERE s.token = ? AND s.expires_at > unixepoch()
        `)
        .bind(sessionToken)
        .all();
        
      if (session) {
        event.locals.user = {
          id: session.id,
          username: session.username,
          email: session.email
        };
      }
    }
    
    return resolve(event);
  }
); // Added closing parenthesis here
