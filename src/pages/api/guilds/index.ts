import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { guildDB, memberDB } from '@/lib/dynamodb';

interface Guild {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  image: string;
  isJoined: boolean;
  trending: boolean;
  createdAt: string;
  createdBy: string;
  isPrivate: boolean;
  rules?: string;
}

interface GuildsResponse {
  guilds: Guild[];
  total: number;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GuildsResponse | Guild | ErrorResponse>
) {
  // Handle GET - Fetch all guilds
  if (req.method === 'GET') {
    try {
      const session = await getServerSession(req, res, authOptions);
      const guilds = await guildDB.list(100);

      // Transform DynamoDB items to Guild format and check membership
      const transformedGuildsPromises = guilds.map(async (item) => {
        const isJoined = session?.userId 
          ? await memberDB.check(item.id, session.userId)
          : false;

        // Calculate trending status based on members and posts
        // A guild is trending if it has 5+ members OR 3+ posts
        const isTrending = (item.members >= 5) || (item.posts >= 3) || item.trending === true;

        return {
          id: item.id,
          name: item.name,
          description: item.description,
          members: item.members || 0,
          posts: item.posts || 0,
          category: item.category,
          image: item.image || '🎮',
          isJoined,
          trending: isTrending,
          createdAt: item.createdAt,
          createdBy: item.createdBy,
          isPrivate: item.isPrivate || false,
          rules: item.rules,
        };
      });

      const transformedGuilds = await Promise.all(transformedGuildsPromises);

      return res.status(200).json({
        guilds: transformedGuilds,
        total: transformedGuilds.length,
      });
    } catch (error) {
      console.error('Error fetching guilds:', error);
      return res.status(500).json({
        error: 'Failed to fetch guilds',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Handle POST - Create new guild
  if (req.method === 'POST') {
    try {
      // Get authenticated user from session
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, description, category, isPrivate, rules } = req.body;

      // Validate required fields
      if (!name || !description || !category) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Name, description, and category are required',
        });
      }

      // Create guild in DynamoDB
      const newGuild = await guildDB.create({
        name,
        description,
        category,
        isPrivate: isPrivate || false,
        rules: rules || '',
        createdBy: session.userId,
      });

      // Automatically add creator as first member
      await memberDB.add(newGuild.id, session.userId);

      // Increment member count to reflect the creator
      await guildDB.incrementMemberCount(newGuild.id);

      // Transform to response format
      const response: Guild = {
        id: newGuild.id,
        name: newGuild.name,
        description: newGuild.description,
        category: newGuild.category,
        isPrivate: newGuild.isPrivate,
        rules: newGuild.rules,
        members: newGuild.members,
        posts: newGuild.posts,
        image: newGuild.image,
        isJoined: true,
        trending: newGuild.trending,
        createdAt: newGuild.createdAt,
        createdBy: newGuild.createdBy,
      };

      return res.status(201).json(response);
    } catch (error) {
      console.error('Error creating guild:', error);
      return res.status(500).json({
        error: 'Failed to create guild',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
