// src/hooks/useMarketplaceActivity.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { apiService, PublicMarketplaceActivity } from '@/services/api';

interface UseMarketplaceActivityOptions {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseMarketplaceActivityReturn {
  activities: PublicMarketplaceActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMarketplaceActivity(options: UseMarketplaceActivityOptions = {}): UseMarketplaceActivityReturn {
  const { limit = 20, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [activities, setActivities] = useState<PublicMarketplaceActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const marketplaceActivities = await apiService.getPublicMarketplaceActivity(limit);
      setActivities(marketplaceActivities);
      
    } catch (err) {
      console.error('Failed to fetch marketplace activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch marketplace activity');
      
      // Fallback to mock data
      setActivities(getMockActivities(limit));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refetch = async (): Promise<void> => {
    await fetchActivities();
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchActivities();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch
  };
}

// Fallback mock data for when API is unavailable
function getMockActivities(limit: number): PublicMarketplaceActivity[] {
  const mockActivities: PublicMarketplaceActivity[] = [
    {
      id: 'mock-sale-1',
      type: 'sale',
      title: 'Charizard VMAX',
      price: 125.50,
      game: 'Pokemon',
      condition: 'Near Mint',
      timestamp: '2 minutes ago',
      status: 'completed',
      sellerRating: 4.8,
      isVerified: true
    },
    {
      id: 'mock-auction-1',
      type: 'auction',
      title: 'Blue-Eyes White Dragon',
      currentBid: 89.99,
      bidders: 7,
      game: 'Yu-Gi-Oh!',
      condition: 'Lightly Played',
      timeLeft: '2h 15m',
      status: 'active',
      sellerRating: 4.9,
      isVerified: true
    },
    {
      id: 'mock-trade-1',
      type: 'trade',
      title: 'Monkey D. Luffy Leader',
      tradeValue: 67.25,
      game: 'One Piece',
      condition: 'Near Mint',
      timestamp: '15 minutes ago',
      status: 'completed',
      sellerRating: 4.7,
      isVerified: false
    }
  ];

  return mockActivities.slice(0, limit);
}