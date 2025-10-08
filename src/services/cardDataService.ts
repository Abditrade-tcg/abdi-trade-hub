import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { config } from '@/config';
import { withRetry, withCircuitBreaker } from './awsErrorHandler';
import { ScryfallCard, ApiTcgCard } from '@/types';

interface ApiTcgResponse extends ApiTcgCard {
  market_price?: number;
  rarity: string;
  code?: string; // Card code from APITCG (e.g., "OP03-070")
}

interface CachedCardData {
  data: CardData[];
  metadata: {
    timestamp: number;
    source: string;
    version: string;
    ttl: number; // Time to live in milliseconds
  };
}

interface CardData {
  id: string;
  name: string;
  game: 'yu-gi-oh' | 'pokemon' | 'magic' | 'one_piece' | 'dragon_ball_fusion' | 'digimon' | 'union_arena' | 'gundam' | 'star_wars' | 'riftbound' | 'other';
  image?: string;
  price?: number;
  rarity?: string;
  set?: string;
  [key: string]: unknown; // Allow additional properties from different APIs
}

interface CardSearchParams {
  game: 'yu-gi-oh' | 'pokemon' | 'magic' | 'one_piece' | 'dragon_ball_fusion' | 'digimon' | 'union_arena' | 'gundam' | 'star_wars' | 'riftbound' | 'other';
  query: string;
  limit?: number;
  offset?: number;
}

class CardDataService {
  private s3Client: S3Client;
  private bucketName: string;
  private cacheTTL: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor() {
    // Initialize S3 client with AWS credentials
    this.s3Client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
    this.bucketName = config.aws.s3.bucket || 'abditrade-card-data';
  }

  /**
   * Generate S3 key for cached card data
   */
  private generateCacheKey(params: CardSearchParams): string {
    const { game, query, limit = 20, offset = 0 } = params;
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${game}/search/${cleanQuery}_${limit}_${offset}.json`;
  }

  /**
   * Generate S3 key for individual card data
   */
  private generateCardKey(game: string, cardId: string): string {
    return `${game}/card/${cardId}.json`;
  }

  /**
   * Check if cached data exists and is still valid
   */
  private async isCacheValid(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      
      const response = await withRetry(
        () => this.s3Client.send(command),
        'S3',
        'HeadObject'
      );
      const lastModified = response.LastModified;
      
      if (!lastModified) return false;
      
      const cacheAge = Date.now() - lastModified.getTime();
      return cacheAge < this.cacheTTL;
    } catch (error) {
      // If object doesn't exist or error occurs, cache is invalid
      return false;
    }
  }

  /**
   * Get cached card data from S3
   */
  private async getCachedData(key: string): Promise<CachedCardData | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      
      const response = await withRetry(
        () => this.s3Client.send(command),
        'S3',
        'GetObject'
      );
      
      if (!response.Body) return null;
      
      const data = await response.Body.transformToString();
      const cachedData: CachedCardData = JSON.parse(data);
      
      // Check if cached data is still valid based on TTL
      const age = Date.now() - cachedData.metadata.timestamp;
      if (age > cachedData.metadata.ttl) {
        return null; // Cache expired
      }
      
      return cachedData;
    } catch (error) {
      console.error('Error getting cached data from S3:', error);
      return null;
    }
  }

  /**
   * Store card data in S3 cache
   */
  private async setCachedData(key: string, data: CardData[], source: string): Promise<void> {
    try {
      const cachedData: CachedCardData = {
        data,
        metadata: {
          timestamp: Date.now(),
          source,
          version: '1.0',
          ttl: this.cacheTTL,
        },
      };

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: JSON.stringify(cachedData),
        ContentType: 'application/json',
        Metadata: {
          'cache-source': source,
          'cache-timestamp': Date.now().toString(),
        },
      });

      await withRetry(
        () => this.s3Client.send(command),
        'S3',
        'PutObject'
      );
      console.log(`✅ Cached ${data.length} cards to S3: ${key}`);
    } catch (error) {
      console.error('Error caching data to S3:', error);
      // Don't throw here - caching failure shouldn't break the API call
    }
  }

  /**
   * Fetch card data from external APIs with caching
   */
  async searchCards(params: CardSearchParams): Promise<CardData[]> {
    const cacheKey = this.generateCacheKey(params);
    
    // Try to get from cache first
    const cachedData = await this.getCachedData(cacheKey);
    if (cachedData) {
      console.log(`📦 Using cached data for ${params.game} search: ${params.query}`);
      return cachedData.data;
    }

    console.log(`🌐 Fetching fresh data for ${params.game} search: ${params.query}`);
    
    // Fetch from external API based on game type
    let apiData: CardData[] = [];
    
    try {
      switch (params.game) {
        case 'yu-gi-oh':
          apiData = await this.fetchYuGiOhCards(params);
          break;
        case 'pokemon':
          apiData = await this.fetchPokemonCards(params);
          break;
        case 'magic':
          apiData = await this.fetchMagicCards(params);
          break;
        case 'one_piece':
        case 'dragon_ball_fusion':
        case 'digimon':
        case 'union_arena':
        case 'gundam':
        case 'star_wars':
        case 'riftbound':
          apiData = await this.fetchApiTcgCards(params);
          break;
        default:
          throw new Error(`Unsupported game type: ${params.game}`);
      }

      // Cache the fetched data
      await this.setCachedData(cacheKey, apiData, `${params.game}-api`);
      
      return apiData;
    } catch (error) {
      console.error(`Error fetching ${params.game} cards:`, error);
      
      // If API fails, try to return stale cache data
      const staleData = await this.getCachedData(cacheKey);
      if (staleData) {
        console.log(`⚠️ Using stale cache data due to API failure`);
        return staleData.data;
      }
      
      throw error;
    }
  }

  /**
   * Fetch individual card data with caching
   */
  async getCardById(game: string, cardId: string): Promise<CardData | null> {
    const cacheKey = this.generateCardKey(game, cardId);
    
    // Try cache first
    const cachedData = await this.getCachedData(cacheKey);
    if (cachedData && cachedData.data.length > 0) {
      console.log(`📦 Using cached card data: ${cardId}`);
      return cachedData.data[0];
    }

    console.log(`🌐 Fetching fresh card data: ${cardId}`);
    
    try {
      let cardData: CardData | null = null;
      
      switch (game) {
        case 'yu-gi-oh':
          cardData = await this.fetchYuGiOhCardById(cardId);
          break;
        case 'pokemon':
          cardData = await this.fetchPokemonCardById(cardId);
          break;
        case 'magic':
          cardData = await this.fetchMagicCardById(cardId);
          break;
        case 'one_piece':
        case 'dragon_ball_fusion':
        case 'digimon':
        case 'union_arena':
        case 'gundam':
        case 'star_wars':
        case 'riftbound':
          cardData = await this.fetchApiTcgCardById(game, cardId);
          break;
        default:
          throw new Error(`Unsupported game type: ${game}`);
      }

      if (cardData) {
        // Cache individual card data
        await this.setCachedData(cacheKey, [cardData], `${game}-api`);
      }
      
      return cardData;
    } catch (error) {
      console.error(`Error fetching ${game} card ${cardId}:`, error);
      
      // Try stale cache
      const staleData = await this.getCachedData(cacheKey);
      if (staleData && staleData.data.length > 0) {
        console.log(`⚠️ Using stale cache data for card ${cardId}`);
        return staleData.data[0];
      }
      
      return null;
    }
  }

  /**
   * Yu-Gi-Oh! API integration
   */
  private async fetchYuGiOhCards(params: CardSearchParams): Promise<CardData[]> {
    const { query, limit = 20, offset = 0 } = params;
    const apiUrl = `${config.cardApis.ygo.baseUrl}/cardinfo.php`;
    
    const searchParams = new URLSearchParams({
      fname: query,
      num: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(`${apiUrl}?${searchParams}`);
    if (!response.ok) {
      throw new Error(`Yu-Gi-Oh API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  private async fetchYuGiOhCardById(cardId: string): Promise<CardData | null> {
    const apiUrl = `${config.cardApis.ygo.baseUrl}/cardinfo.php`;
    const response = await fetch(`${apiUrl}?id=${cardId}`);
    
    if (!response.ok) {
      throw new Error(`Yu-Gi-Oh API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0] || null;
  }

  /**
   * Pokemon API integration
   */
  private async fetchPokemonCards(params: CardSearchParams): Promise<CardData[]> {
    const { query, limit = 20, offset = 0 } = params;
    const apiUrl = `${config.cardApis.pokemon.baseUrl}/cards`;
    
    const searchParams = new URLSearchParams({
      q: `name:${query}*`,
      pageSize: limit.toString(),
      page: Math.floor(offset / limit + 1).toString(),
    });

    const headers: Record<string, string> = {};
    if (config.cardApis.pokemon.apiKey) {
      headers['X-Api-Key'] = config.cardApis.pokemon.apiKey;
    }

    const response = await fetch(`${apiUrl}?${searchParams}`, { headers });
    if (!response.ok) {
      throw new Error(`Pokemon API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  private async fetchPokemonCardById(cardId: string): Promise<CardData | null> {
    const apiUrl = `${config.cardApis.pokemon.baseUrl}/cards/${cardId}`;
    
    const headers: Record<string, string> = {};
    if (config.cardApis.pokemon.apiKey) {
      headers['X-Api-Key'] = config.cardApis.pokemon.apiKey;
    }

    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      throw new Error(`Pokemon API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  }

  /**
   * Magic: The Gathering API integration via Scryfall
   */
  private async fetchMagicCards(params: CardSearchParams): Promise<CardData[]> {
    const { query, limit = 20, offset = 0 } = params;
    const apiUrl = `${config.cardApis.scryfall.baseUrl}/cards/search`;
    
    const searchParams = new URLSearchParams({
      q: query,
      unique: 'cards',
      order: 'name',
      dir: 'auto',
      page: Math.floor(offset / limit + 1).toString(),
    });

    const response = await fetch(`${apiUrl}?${searchParams}`);
    if (!response.ok) {
      if (response.status === 404) {
        return []; // No cards found
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const result = await response.json();
    return result.data?.map((card: ScryfallCard) => ({
      id: card.id,
      name: card.name,
      game: 'magic' as const,
      image: card.image_uris?.normal || card.image_uris?.large,
      price: parseFloat(card.prices?.usd || '0'),
      rarity: card.rarity,
      set: card.set_name,
      ...card
    })) || [];
  }

  private async fetchMagicCardById(cardId: string): Promise<CardData | null> {
    const apiUrl = `${config.cardApis.scryfall.baseUrl}/cards/${cardId}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Card not found
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const card = await response.json();
    return {
      id: card.id,
      name: card.name,
      game: 'magic' as const,
      image:card.image_uris?.normal || card.image_uris?.large,
      price: parseFloat(card.prices?.usd || '0'),
      rarity: card.rarity,
      set: card.set_name,
      ...card
    };
  }

  /**
   * API TCG integration for One Piece, Gundam, Dragon Ball, etc.
   * Updated to match official APITCG documentation format
   */
  private async fetchApiTcgCards(params: CardSearchParams): Promise<CardData[]> {
    const { game, query, limit = 20 } = params;
    
    // Convert game name to API TCG endpoint format
    const gameEndpoint = this.getApiTcgGameEndpoint(game);
    // Use the correct APITCG URL format: https://apitcg.com/api/[tcg]/cards
    const apiUrl = `https://apitcg.com/api/${gameEndpoint}/cards`;
    
    // APITCG uses property-value pairs for searching (e.g., ?name=luffy)
    const searchParams = new URLSearchParams({
      name: query, // Search by name property
    });

    console.log(`🌐 Fetching APITCG cards from: ${apiUrl}?${searchParams}`);
    
    // Add API key header if available
    const headers: Record<string, string> = {};
    if (config.cardApis.apiTcg.apiKey) {
      headers['x-api-key'] = config.cardApis.apiTcg.apiKey;
    }
    
    const response = await fetch(`${apiUrl}?${searchParams}`, { headers });
    if (!response.ok) {
      throw new Error(`APITCG ${gameEndpoint} API error: ${response.status}`);
    }

    const result = await response.json();
    const cards = result.data || [];
    
    console.log(`✅ APITCG returned ${cards.length} cards for ${gameEndpoint}`);
    
    // Apply limit client-side and map to our CardData format
    return cards.slice(0, limit).map((card: ApiTcgResponse) => ({
      id: card.id || card.code,
      name: card.name,
      game: game,
      // Use correct APITCG image field mapping: images.large or images.small
      image: card.images?.large || card.images?.small,
      price: 0, // APITCG doesn't provide market price in standard response
      rarity: card.rarity,
      set: card.set?.name,
      ...card
    }));
  }

  private async fetchApiTcgCardById(game: string, cardId: string): Promise<CardData | null> {
    const gameEndpoint = this.getApiTcgGameEndpoint(game);
    // Use the correct APITCG URL format: https://apitcg.com/api/[tcg]/cards
    const apiUrl = `https://apitcg.com/api/${gameEndpoint}/cards`;
    
    // Search by ID property using APITCG format
    const searchParams = new URLSearchParams({
      id: cardId,
    });

    console.log(`🌐 Fetching APITCG card by ID from: ${apiUrl}?${searchParams}`);

    // Add API key header if available
    const headers: Record<string, string> = {};
    if (config.cardApis.apiTcg.apiKey) {
      headers['x-api-key'] = config.cardApis.apiTcg.apiKey;
    }

    const response = await fetch(`${apiUrl}?${searchParams}`, { headers });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`APITCG ${gameEndpoint} API error: ${response.status}`);
    }

    const result = await response.json();
    const cards = result.data || [];
    // Find the card by ID or code
    const card = cards.find((c: ApiTcgResponse) => c.id === cardId || c.code === cardId);
    
    if (!card) return null;

    console.log(`✅ APITCG found card: ${card.name}`);

    return {
      id: card.id || card.code,
      name: card.name,
      game: game as CardData['game'],
      // Use correct APITCG image field mapping: images.large or images.small
      image: card.images?.large || card.images?.small,
      price: 0, // APITCG doesn't provide market price in standard response
      rarity: card.rarity,
      set: card.set?.name,
      ...card
    };
  }

  /**
   * Convert our game names to API TCG endpoint names
   */
  private getApiTcgGameEndpoint(game: string): string {
    const gameMap: Record<string, string> = {
      'one_piece': 'one-piece',
      'dragon_ball_fusion': 'dragon-ball-fusion',
      'digimon': 'digimon',
      'union_arena': 'union-arena',
      'gundam': 'gundam',
      'star_wars': 'star-wars-unlimited',
      'riftbound': 'riftbound'
    };
    
    return gameMap[game] || game;
  }

  /**
   * Clear cache for specific search or all cache
   */
  async clearCache(pattern?: string): Promise<void> {
    // Implementation would list and delete S3 objects matching pattern
    console.log(`Cache clear requested for pattern: ${pattern || 'all'}`);
    // This would require additional S3 list operations to implement fully
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{ hitRate: number; totalRequests: number }> {
    // This would require tracking cache hits/misses
    // For now, return mock data
    return { hitRate: 0.85, totalRequests: 1000 };
  }
}

export const cardDataService = new CardDataService();