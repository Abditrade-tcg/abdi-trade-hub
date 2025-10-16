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

  if (req.method === 'DELETE') {
    // Delete a post
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get post to check permissions
      const post = await postDB.getById(guildId, postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if user has permission (post author or guild creator)
      const guild = await guildDB.getById(guildId);
      const isAuthor = post.authorId === session.userId;
      const isModerator = guild?.createdBy === session.userId;

      if (!isAuthor && !isModerator) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You can only delete your own posts or posts in guilds you moderate' 
        });
      }

      // Delete post
      await postDB.delete(post.PK, post.SK);

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
