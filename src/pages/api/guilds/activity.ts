import type { NextApiRequest, NextApiResponse } from 'next';

interface Activity {
  id: string;
  guildName: string;
  userName: string;
  action: string;
  timestamp: string;
}

interface ActivityResponse {
  activities: Activity[];
  total: number;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivityResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Replace with actual database query
    // Example: const activities = await db.guildActivity.findMany({
    //   orderBy: { createdAt: 'desc' },
    //   take: 20,
    //   include: { user: true, guild: true }
    // });
    
    // For now, return empty array - ready for database integration
    const activities: Activity[] = [];

    return res.status(200).json({
      activities,
      total: activities.length,
    });
  } catch (error) {
    console.error('Error fetching guild activity:', error);
    return res.status(500).json({
      error: 'Failed to fetch guild activity',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
