import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { postDB, guildDB, likeDB } from '@/lib/dynamodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId } = req.query;

  if (typeof guildId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild ID' });
  }

  if (req.method === 'GET') {
    // Get guild posts
    try {
      const session = await getServerSession(req, res, authOptions);
      const posts = await postDB.getByGuild(guildId);

      // Check if user has liked each post
      const formattedPostsPromises = posts.map(async (post) => {
        const isLiked = session?.userId 
          ? await likeDB.check(guildId, post.id, session.userId)
          : false;

        return {
          id: post.id,
          author: post.authorName,
          authorId: post.authorId,
          avatar: post.authorName.substring(0, 2).toUpperCase(),
          timeAgo: formatTimeAgo(post.createdAt),
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          isPinned: post.isPinned,
          isLiked,
          reputation: 4.5, // TODO: Get from user profile
          userType: 'Individual', // TODO: Get from user profile
          postType: post.postType,
          price: post.card?.price,
          cardData: post.card,
        };
      });

      const formattedPosts = await Promise.all(formattedPostsPromises);

      res.status(200).json({ posts: formattedPosts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else if (req.method === 'POST') {
    // Create new post
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { content, postType, price, cardData } = req.body;

      if (!content || !postType) {
        return res.status(400).json({ error: 'Content and postType are required' });
      }

      // Verify guild exists
      const guild = await guildDB.getById(guildId);
      if (!guild) {
        return res.status(404).json({ error: 'Guild not found' });
      }

      // Create post
      const post = await postDB.create({
        guildId,
        authorId: session.userId,
        authorName: session.user?.name || 'Anonymous',
        content,
        postType,
        card: cardData || null,
      });

      // Format response
      const formattedPost = {
        id: post.id,
        author: post.authorName,
        authorId: post.authorId,
        avatar: post.authorName.substring(0, 2).toUpperCase(),
        timeAgo: 'Just now',
        content: post.content,
        likes: 0,
        comments: 0,
        isPinned: false,
        reputation: 4.5,
        userType: 'Individual',
        postType: post.postType,
        price: post.card?.price,
        cardData: post.card,
      };

      res.status(201).json({ post: formattedPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Helper function to format timestamps
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
