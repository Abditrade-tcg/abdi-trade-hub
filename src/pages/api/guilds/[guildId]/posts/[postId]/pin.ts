import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { postDB, guildDB } from '@/lib/dynamodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId, postId } = req.query;

  if (typeof guildId !== 'string' || typeof postId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild or post ID' });
  }

  if (req.method === 'POST') {
    // Pin/Unpin a post
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user has permission (guild creator)
      const guild = await guildDB.getById(guildId);
      if (!guild) {
        return res.status(404).json({ error: 'Guild not found' });
      }

      if (guild.createdBy !== session.userId) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'Only guild moderators can pin posts' 
        });
      }

      // Get post to check current pin state
      const post = await postDB.getById(guildId, postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Toggle pin
      await postDB.togglePin(post.PK, post.SK, post.isPinned);

      res.status(200).json({ 
        isPinned: !post.isPinned,
        message: post.isPinned ? 'Post unpinned' : 'Post pinned'
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      res.status(500).json({ error: 'Failed to toggle pin' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
