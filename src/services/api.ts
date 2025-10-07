// src/services/api.ts
import { CanonicalCard } from '../types/card';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.abditrade.com';

export interface CardSearchParams {
  q?: string;
  game: 'pokemon' | 'yugioh' | 'magic' | 'onepiece' | 'dragonball' | 'digimon' | 'gundam' | 'starwars';
  set?: string;
  rarity?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'release' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface CardSearchResponse {
  cards: CanonicalCard[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface PublicMarketplaceActivity {
  id: string;
  type: 'sale' | 'auction' | 'trade';
  title: string;
  price?: number;
  currentBid?: number;
  tradeValue?: number;
  bidders?: number;
  game: string;
  condition: string;
  timestamp?: string;
  timeLeft?: string;
  status: string;
  sellerRating: number;
  isVerified: boolean;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Search cards from the card catalog
   */
  async searchCards(params: CardSearchParams): Promise<CardSearchResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<CardSearchResponse>(`/v1/cards/search?${searchParams}`);
  }

  /**
   * Get a specific card by ID
   */
  async getCard(cardId: string): Promise<CanonicalCard> {
    return this.request<CanonicalCard>(`/v1/cards/${cardId}`);
  }

  /**
   * Get trending/popular cards for homepage
   */
  async getTrendingCards(limit: number = 8): Promise<CanonicalCard[]> {
    try {
      // Try to get trending cards from multiple games
      const games: CardSearchParams['game'][] = ['pokemon', 'yugioh', 'onepiece', 'dragonball'];
      const promises = games.map(game => 
        this.searchCards({
          game,
          limit: Math.ceil(limit / games.length),
          sortBy: 'popularity',
          sortOrder: 'desc'
        }).catch(err => {
          console.warn(`Failed to fetch ${game} cards:`, err);
          return { cards: [], totalCount: 0, page: 1, totalPages: 0 };
        })
      );

      const results = await Promise.all(promises);
      const allCards = results.flatMap(result => result.cards);
      
      // Shuffle and take requested amount
      const shuffled = allCards.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch trending cards:', error);
      throw error;
    }
  }

  /**
   * Get random cards from specific games
   */
  async getRandomCards(games: CardSearchParams['game'][], limit: number = 8): Promise<CanonicalCard[]> {
    try {
      const cardsPerGame = Math.ceil(limit / games.length);
      const promises = games.map(async (game) => {
        try {
          // Get random page to simulate randomness
          const randomPage = Math.floor(Math.random() * 5) + 1;
          const result = await this.searchCards({
            game,
            page: randomPage,
            limit: cardsPerGame,
          });
          return result.cards;
        } catch (error) {
          console.warn(`Failed to fetch ${game} cards:`, error);
          return [];
        }
      });

      const results = await Promise.all(promises);
      const allCards = results.flatMap(cards => cards);
      
      // Shuffle to mix games
      return allCards.sort(() => Math.random() - 0.5).slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch random cards:', error);
      throw error;
    }
  }

  /**
   * Get public marketplace activity
   */
  async getPublicMarketplaceActivity(limit: number = 20): Promise<PublicMarketplaceActivity[]> {
    const searchParams = new URLSearchParams({ limit: limit.toString() });
    return this.request<PublicMarketplaceActivity[]>(`/public/marketplace-activity?${searchParams}`);
  }

  /**
   * Get featured cards based on market activity
   */
  async getFeaturedCards(limit: number = 8): Promise<CanonicalCard[]> {
    try {
      // First try to get trending cards
      return await this.getTrendingCards(limit);
    } catch (error) {
      console.warn('Trending cards failed, falling back to random cards:', error);
      // Fallback to random cards from popular games
      return await this.getRandomCards(['pokemon', 'yugioh', 'onepiece', 'dragonball'], limit);
    }
  }
}

export const apiService = new ApiService();