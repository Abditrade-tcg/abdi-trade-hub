// src/hooks/useCards.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { backendAPIService } from '@/services/backendAPIService';
import { cardDataService } from '@/services/cardDataService';
import { staticCardDataService } from '@/services/staticCardDataService';
import { CanonicalCard, DisplayCard } from '@/types/card';

interface UseCardsOptions {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  cacheTimeout?: number; // Cache timeout in milliseconds
}

interface UseCardsReturn {
  cards: DisplayCard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fromCache: boolean;
}

// Client-side cache interface
interface CacheEntry {
  data: DisplayCard[];
  timestamp: number;
  limit: number;
}

// Game mapping
const gameMapping: Record<string, string> = {
  'Pokemon': 'PKMN',
  'pokemon': 'PKMN',
  'Yu-Gi-Oh!': 'YGO',
  'yugioh': 'YGO',
  'Magic: The Gathering': 'MTG',
  'magic': 'MTG',
  'One Piece': 'OP',
  'onepiece': 'OP',
  'Dragon Ball': 'DBZ',
  'dragonball': 'DBZ',
  'Digimon': 'DIG',
  'digimon': 'DIG',
  'Gundam': 'GUN',
  'gundam': 'GUN',
  'Star Wars': 'SW',
  'starwars': 'SW',
  'sports': 'SPT'
};

// Rarity mapping for display
const rarityMapping: Record<string, string> = {
  'common': 'Common',
  'uncommon': 'Uncommon', 
  'rare': 'Rare',
  'super rare': 'Super Rare',
  'ultra rare': 'Ultra Rare',
  'secret rare': 'Secret Rare',
  'legendary': 'Legendary',
  'mythic rare': 'Mythic Rare',
  'basic': 'Common',
  'normal': 'Common'
};

// Simple in-memory cache
const cache = new Map<string, CacheEntry>();

export function useCards(options: UseCardsOptions = {}): UseCardsReturn {
  const { 
    limit = 8, 
    autoRefresh = false, 
    refreshInterval = 30000,
    cacheTimeout = 300000 // 5 minutes default cache
  } = options;
  
  const [cards, setCards] = useState<DisplayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertToDisplayCard = (canonicalCard: any): DisplayCard => {
    const game = canonicalCard.game || canonicalCard.provider;
    const gameShort = gameMapping[game] || gameMapping[canonicalCard.provider] || 'TCG';
    
    // Format pricing - handle both formats
    let price = '$0.00';
    let trend = '+0%';
    
    if (canonicalCard.price) {
      // Simple price format from backend API
      price = `$${canonicalCard.price.toFixed(2)}`;
    } else if (canonicalCard.pricing?.market) {
      // Complex pricing format
      price = `$${canonicalCard.pricing.market.toFixed(2)}`;
    } else if (canonicalCard.abditradeSignals?.avgSalePrice) {
      price = `$${canonicalCard.abditradeSignals.avgSalePrice.toFixed(2)}`;
    } else {
      // Generate realistic random price based on rarity
      const rarity = canonicalCard.rarity?.toLowerCase() || 'common';
      let basePrice = 1;
      
      if (rarity.includes('secret') || rarity.includes('legendary')) basePrice = 50;
      else if (rarity.includes('ultra') || rarity.includes('mythic')) basePrice = 25;
      else if (rarity.includes('super') || rarity.includes('rare')) basePrice = 10;
      else if (rarity.includes('uncommon')) basePrice = 3;
      
      const randomPrice = basePrice + (Math.random() * basePrice * 2);
      price = `$${randomPrice.toFixed(2)}`;
    }
    
    // Format trend
    if (canonicalCard.abditradeSignals?.priceChange24h) {
      const change = canonicalCard.abditradeSignals.priceChange24h;
      trend = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    } else {
      // Generate realistic trend
      const trendValue = (Math.random() - 0.3) * 30; // Bias toward positive
      trend = `${trendValue > 0 ? '+' : ''}${trendValue.toFixed(1)}%`;
    }

    return {
      id: canonicalCard.id,
      name: canonicalCard.name,
      game: game,
      gameShort,
      rarity: rarityMapping[canonicalCard.rarity?.toLowerCase() || 'common'] || 'Common',
      price,
      trend,
      image: canonicalCard.image || canonicalCard.images?.large || canonicalCard.images?.small || canonicalCard.images?.local || '',
      set: canonicalCard.set,
      condition: 'Near Mint'
    };
  };

  const fetchCards = useCallback(async (forceRefresh = false): Promise<void> => {
    // Check cache first if not forcing refresh
    const cacheKey = `cards-${limit}`;
    const cachedEntry = cache.get(cacheKey);
    const now = Date.now();
    
    if (!forceRefresh && cachedEntry && (now - cachedEntry.timestamp) < cacheTimeout) {
      console.log(`🗄️ Loading ${cachedEntry.data.length} cards from cache`);
      setCards(cachedEntry.data);
      setLoading(false);
      setFromCache(true);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎯 Loading cards from static data service (instant performance)');
      
      // Use static cards for instant loading - no API delays
      const staticCards = staticCardDataService.getRandomCards(limit);
      
      // Convert to DisplayCard format if needed
      const displayCards: DisplayCard[] = staticCards.map(card => ({
        id: card.id,
        name: card.name,
        game: card.game,
        gameShort: card.gameShort,
        rarity: card.rarity,
        price: card.price,
        trend: card.trend,
        image: card.image,
        set: card.set,
        condition: card.condition
      }));
      
      setCards(displayCards);
      setFromCache(false);
      
      // Cache the results
      cache.set(cacheKey, {
        data: displayCards,
        timestamp: now,
        limit
      });
      
      console.log(`✅ Loaded ${displayCards.length} cards instantly from static data`);
      
    } catch (error) {
      console.error('❌ Error loading static cards:', error);
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [limit, cacheTimeout]);

  const refetch = async (): Promise<void> => {
    await fetchCards(true); // Force refresh on manual refetch
  };

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchCards();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchCards]);

  return {
    cards,
    loading,
    error,
    refetch,
    fromCache
  };
}

// Fallback mock data for when API is unavailable
function getMockCards(limit: number): DisplayCard[] {
  const mockCards: DisplayCard[] = [
    {
      id: 'mock-charizard',
      name: 'Charizard ex',
      game: 'Pokemon',
      gameShort: 'PKMN',
      rarity: 'Ultra Rare',
      price: '$124.99',
      trend: '+18%',
      image: 'https://images.pokemontcg.io/base1/4_hires.png',
    },
    {
      id: 'mock-blue-eyes',
      name: 'Blue-Eyes White Dragon',
      game: 'Yu-Gi-Oh!',
      gameShort: 'YGO',
      rarity: 'Secret Rare',
      price: '$89.50',
      trend: '+12%',
      image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
    },
    {
      id: 'mock-luffy',
      name: 'Monkey D. Luffy',
      game: 'One Piece',
      gameShort: 'OP',
      rarity: 'Super Rare',
      price: '$67.25',
      trend: '+25%',
      image: 'https://limitlesstcg.nyc3.digitaloceanspaces.com/one-piece/OP01/EN/OP01-003.png',
    },
    {
      id: 'mock-goku',
      name: 'Son Goku Ultra Instinct',
      game: 'Dragon Ball',
      gameShort: 'DBZ',
      rarity: 'Legendary',
      price: '$156.00',
      trend: '+8%',
      image: 'https://www.dbs-cardgame.com/us-en/cardlist/images/series1/BT1-111.png',
    },
    {
      id: 'mock-omnimon',
      name: 'Omnimon Alter-S',
      game: 'Digimon',
      gameShort: 'DIG',
      rarity: 'Secret Rare',
      price: '$95.75',
      trend: '+15%',
      image: 'https://images.digimoncard.io/images/cards/BT1-010.jpg',
    },
    {
      id: 'mock-gundam',
      name: 'Gundam Aerial',
      game: 'Gundam',
      gameShort: 'GUN',
      rarity: 'Rare',
      price: '$45.99',
      trend: '+6%',
      image: '/placeholder.svg',
    },
    {
      id: 'mock-darth',
      name: 'Darth Vader',
      game: 'Star Wars',
      gameShort: 'SW',
      rarity: 'Legendary',
      price: '$198.50',
      trend: '+22%',
      image: '/placeholder.svg',
    },
    {
      id: 'mock-black-lotus',
      name: 'Black Lotus',
      game: 'Magic: The Gathering',
      gameShort: 'MTG',
      rarity: 'Mythic Rare',
      price: '$12,500.00',
      trend: '+3%',
      image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
    }
  ];

  return mockCards.slice(0, limit);
}