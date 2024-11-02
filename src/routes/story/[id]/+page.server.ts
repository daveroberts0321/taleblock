// routes/story/[id]/+page.server.ts
import { db } from '$lib/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const story = await db.execute({
    sql: `
      SELECT 
        s.*,
        u.username as author,
        COUNT(f.id) as fork_count
      FROM stories s
      JOIN users u ON s.author_id = u.id
      LEFT JOIN forks f ON s.id = f.story_id
      WHERE s.id = ?
      GROUP BY s.id
    `,
    args: [params.id]
  });

  const forks = await db.execute({
    sql: `
      SELECT s.*, u.username as author
      FROM stories s
      JOIN users u ON s.author_id = u.id
      WHERE s.parent_id = ?
    `,
    args: [params.id]
  });

  return {
    story: story.rows[0],
    forks: forks.rows
  };
}) satisfies PageServerLoad;