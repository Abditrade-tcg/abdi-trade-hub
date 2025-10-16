import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponse {
  error: string;
  message?: string;
}

interface SuccessResponse {
  success: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  const { guildId } = req.query;

  if (!guildId || typeof guildId !== 'string') {
    return res.status(400).json({ error: 'Invalid guild ID' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Get authenticated user from session
    // Example: const session = await getServerSession(req, res, authOptions);
    // if (!session) return res.status(401).json({ error: 'Unauthorized' });

    // TODO: Replace with actual database operation
    // Example:
    // await db.guildMembers.delete({
    //   where: {
    //     userId_guildId: {
    //       userId: session.user.id,
    //       guildId: guildId,
    //     }
    //   }
    // });
    
    // Also decrement the guild member count
    // await db.guilds.update({
    //   where: { id: guildId },
    //   data: { members: { decrement: 1 } }
    // });

    return res.status(200).json({
      success: true,
      message: 'Successfully left guild',
    });
  } catch (error) {
    console.error('Error leaving guild:', error);
    return res.status(500).json({
      error: 'Failed to leave guild',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
