// src/routes/story/[id]/+page.server.ts
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, platform }) => {
    if (!platform?.env?.DB) {
        throw error(500, 'Database not available');
    }

    const db = new Database(platform.env.DB);
    const storyId = parseInt(params.id);
    
    if (isNaN(storyId)) {
        throw error(400, 'Invalid story ID');
    }

    const [story, tags, versions] = await Promise.all([
        db.getStoryById(storyId),
        db.getStoryTags(storyId),
        db.getStoryVersions(storyId)
    ]);
    
    if (!story) {
        throw error(404, 'Story not found');
    }

    // Increment reads asynchronously
    db.incrementStoryReads(storyId).catch(console.error);

    return {
        story,
        tags,
        versions
    };
}) satisfies PageServerLoad;