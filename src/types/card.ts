// src/types/card.ts
export interface CanonicalCard {
  // Core identifiers
  id: string; // Internal Abditrade ID
  externalId: string; // Provider's ID
  provider: 'pokemon' | 'yugioh' | 'magic' | 'sports' | 'onepiece' | 'dragonball' | 'digimon' | 'gundam' | 'starwars';
  
  // Basic info
  name: string;
  game: string;
  set: string;
  setCode?: string;
  number?: string;
  
  // Card details
  rarity?: string;
  types?: string[];
  subtypes?: string[];
  supertype?: string;
  level?: number;
  attribute?: string;
  
  // Game-specific stats
  hp?: number;
  attack?: number;
  defense?: number;
  retreat?: number;
  
  // Text content
  abilities?: Array<{
    name: string;
    text: string;
    type?: string;
  }>;
  attacks?: Array<{
    name: string;
    cost?: string[];
    damage?: string;
    text?: string;
  }>;
  rules?: string[];
  flavorText?: string;
  
  // Visual
  images: {
    small?: string;
    large?: string;
    cropped?: string;
    local?: string; // Our hosted version
  };
  artist?: string;
  
  // Market data
  pricing?: {
    market?: number;
    low?: number;
    mid?: number;
    high?: number;
    foil?: {
      market?: number;
      low?: number;
      mid?: number;
      high?: number;
    };
    updatedAt?: string;
    currency?: string;
  };
  
  // Metadata
  legalities?: Record<string, string>;
  releaseDate?: string;
  tcgplayerId?: string;
  cardmarketId?: string;
  
  // Abditrade specific
  abditradeSignals?: {
    trending: boolean;
    trendScore: number;
    searchVolume: number;
    listingCount: number;
    avgSalePrice?: number;
    priceChange24h?: number;
    priceChange7d?: number;
  };
  
  // Timestamps
  fetchedAt: string;
  cachedUntil: string;
  updatedAt: string;
}

export interface DisplayCard {
  id: string;
  name: string;
  game: string;
  gameShort: string;
  rarity: string;
  price: string;
  trend: string;
  image: string;
  set?: string;
  condition?: string;
}