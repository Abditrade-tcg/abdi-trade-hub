import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { memberDB, guildDB } from '@/lib/dynamodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId } = req.query;

  if (typeof guildId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild ID' });
  }

  if (req.method === 'GET') {
    // Get guild members
    try {
      const members = await memberDB.getByGuild(guildId);

      // Transform to frontend format
      const transformedMembers = members.map((member) => ({
        id: (member as { userId: string }).userId,
        name: (member as { userId: string }).userId, // TODO: Fetch actual username from user table
        avatar: (member as { userId: string }).userId.charAt(0).toUpperCase(), // First letter of userId as avatar
        role: (member as { role?: string }).role || 'member',
        joined: new Date((member as { joinedAt: string }).joinedAt).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
      }));

      res.status(200).json({ members: transformedMembers });
    } catch (error) {
      console.error('Error fetching members:', error);
      res.status(500).json({ error: 'Failed to fetch members' });
    }
  } else if (req.method === 'POST') {
    // Join guild
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if guild exists
      const guild = await guildDB.getById(guildId);
      if (!guild) {
        return res.status(404).json({ error: 'Guild not found' });
      }

      // Add member
      await memberDB.add(guildId, session.userId);

      // Increment guild member count
      await guildDB.incrementMemberCount(guildId);

      res.status(200).json({ message: 'Joined guild successfully' });
    } catch (error) {
      console.error('Error joining guild:', error);
      res.status(500).json({ error: 'Failed to join guild' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
