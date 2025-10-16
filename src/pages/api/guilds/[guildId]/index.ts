import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { guildDB, memberDB } from '@/lib/dynamodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId } = req.query;

  if (typeof guildId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild ID' });
  }

  if (req.method === 'GET') {
    // Get guild details
    try {
      const guild = await guildDB.getById(guildId);

      if (!guild) {
        return res.status(404).json({ error: 'Guild not found' });
      }

      // Check if current user is a member (if authenticated)
      const session = await getServerSession(req, res, authOptions);
      let isJoined = false;
      
      if (session?.userId) {
        isJoined = await memberDB.check(guildId, session.userId);
      }

      res.status(200).json({ 
        guild: {
          ...guild,
          isJoined,
        }
      });
    } catch (error) {
      console.error('Error fetching guild:', error);
      res.status(500).json({ error: 'Failed to fetch guild' });
    }
  } else if (req.method === 'PATCH') {
    // Update guild (e.g., toggle privacy)
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { isPrivate } = req.body;

      // Get guild to check permissions
      const guild = await guildDB.getById(guildId);
      if (!guild) {
        return res.status(404).json({ error: 'Guild not found' });
      }

      // Check if user has permission to update
      if (guild.createdBy !== session.userId) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'Only the guild creator can modify guild settings' 
        });
      }

      // Update guild
      await guildDB.update(guildId, { isPrivate });

      const updatedGuild = await guildDB.getById(guildId);

      res.status(200).json({ guild: updatedGuild });
    } catch (error) {
      console.error('Error updating guild:', error);
      res.status(500).json({ error: 'Failed to update guild' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
