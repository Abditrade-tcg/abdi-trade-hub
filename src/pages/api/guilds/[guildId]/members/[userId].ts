import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { memberDB } from '@/lib/dynamodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId, userId } = req.query;

  if (typeof guildId !== 'string' || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild or user ID' });
  }

  if (req.method === 'DELETE') {
    // Leave guild / Remove member
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Users can only remove themselves unless they're moderators
      // TODO: Add moderator check for removing other users
      if (userId !== session.userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await memberDB.remove(guildId, userId);

      res.status(200).json({ message: 'Left guild successfully' });
    } catch (error) {
      console.error('Error leaving guild:', error);
      res.status(500).json({ error: 'Failed to leave guild' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
