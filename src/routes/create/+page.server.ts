// src/routes/create/+page.server.ts
import { requireAuth } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const user = await requireAuth(event);
  return {
    user
  };
};