import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { likeDB, postDB } from '@/lib/dynamodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId, postId } = req.query;

  if (typeof guildId !== 'string' || typeof postId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild or post ID' });
  }

  if (req.method === 'POST') {
    // Toggle like on a post
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Toggle like
      const result = await likeDB.toggle(guildId, postId, session.userId);

      // Update post like count
      if (result.liked) {
        await postDB.incrementLikes(guildId, postId);
      } else {
        await postDB.decrementLikes(guildId, postId);
      }

      // Get updated post to return new like count
      const post = await postDB.getById(guildId, postId);
      
      res.status(200).json({ 
        liked: result.liked,
        likes: post?.likes || 0,
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ error: 'Failed to toggle like' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
