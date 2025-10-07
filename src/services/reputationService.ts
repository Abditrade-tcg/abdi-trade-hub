import { Badge } from '@/types';

interface ReputationData {
  repScore: number;
  badges: Badge[];
  isVerified: boolean;
}

class ReputationService {
  async getMyReputation(): Promise<ReputationData> {
    // Mock implementation - in production this would call your backend API
    return {
      repScore: 85,
      badges: [
        {
          id: 'verified-seller',
          name: 'Verified Seller',
          description: 'Account verified with official documentation',
          icon: '✓',
          color: 'green',
          rarity: 'common'
        },
        {
          id: 'trusted-trader',
          name: 'Trusted Trader',
          description: 'Completed 50+ successful trades',
          icon: '🤝',
          color: 'blue',
          rarity: 'rare'
        }
      ],
      isVerified: true
    };
  }
}

export const reputationService = new ReputationService();