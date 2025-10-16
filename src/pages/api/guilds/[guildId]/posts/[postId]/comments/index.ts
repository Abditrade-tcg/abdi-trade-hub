import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { commentDB, postDB } from '@/lib/dynamodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId, postId } = req.query;

  if (typeof guildId !== 'string' || typeof postId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild or post ID' });
  }

  if (req.method === 'GET') {
    // Get comments for a post
    try {
      const comments = await commentDB.getByPost(guildId, postId);

      // Transform to frontend format
      const formattedComments = comments.map(comment => ({
        id: comment.id,
        author: comment.authorName,
        authorId: comment.authorId,
        avatar: comment.authorName.substring(0, 2).toUpperCase(),
        timeAgo: formatTimeAgo(comment.createdAt),
        content: comment.content,
        likes: comment.likes || 0,
      }));

      res.status(200).json({ comments: formattedComments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else if (req.method === 'POST') {
    // Create a new comment
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Create comment
      const comment = await commentDB.create({
        guildId,
        postId,
        authorId: session.userId,
        authorName: session.user?.name || 'Anonymous',
        content,
      });

      // Increment post comment count
      await postDB.incrementComments(guildId, postId);

      // Format response
      const formattedComment = {
        id: comment.id,
        author: comment.authorName,
        authorId: comment.authorId,
        avatar: comment.authorName.substring(0, 2).toUpperCase(),
        timeAgo: 'Just now',
        content: comment.content,
        likes: 0,
      };

      res.status(201).json({ comment: formattedComment });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Helper function to format timestamps
function formatTimeAgo(timestamp: string | number): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const now = Date.now();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
