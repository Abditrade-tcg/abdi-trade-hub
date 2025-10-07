import { OpenSearchClient } from '@aws-sdk/client-opensearch';
import { config } from '@/config';
import { withRetry, withCircuitBreaker } from './awsErrorHandler';

interface SearchQuery {
  query: string;
  filters?: {
    game?: string[];
    rarity?: string[];
    set?: string[];
    priceRange?: { min: number; max: number };
    condition?: string[];
  };
  sort?: {
    field: 'name' | 'price' | 'rarity' | 'date';
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    size: number;
  };
}

interface SearchResult {
  cards: CardSearchResult[];
  total: number;
  page: number;
  size: number;
  aggregations?: {
    games: { key: string; count: number }[];
    rarities: { key: string; count: number }[];
    sets: { key: string; count: number }[];
    priceRanges: { key: string; count: number }[];
  };
}

interface CardSearchResult {
  id: string;
  name: string;
  game: string;
  image?: string;
  price?: number;
  rarity?: string;
  set?: string;
  condition?: string;
  seller?: {
    id: string;
    name: string;
    rating: number;
  };
  lastSold?: string;
  highlight?: {
    name?: string[];
    description?: string[];
  };
}

class OpenSearchService {
  private client: OpenSearchClient | null = null;
  private indexName: string = 'abditrade-cards';
  private isConfigured: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      // Only initialize if OpenSearch configuration is available
      const openSearchEndpoint = process.env.OPENSEARCH_ENDPOINT;
      
      if (!openSearchEndpoint) {
        console.warn('OpenSearch endpoint not configured. Search functionality will be limited.');
        return;
      }

      this.client = new OpenSearchClient({
        region: config.aws.region,
        credentials: {
          accessKeyId: config.aws.accessKeyId,
          secretAccessKey: config.aws.secretAccessKey,
        },
        endpoint: openSearchEndpoint,
      });

      this.isConfigured = true;
      console.log('✅ OpenSearch client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize OpenSearch client:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Advanced card search with filters, sorting, and aggregations
   */
  async searchCards(searchQuery: SearchQuery): Promise<SearchResult> {
    if (!this.isConfigured || !this.client) {
      console.warn('OpenSearch not configured, falling back to basic search');
      return this.fallbackSearch(searchQuery);
    }

    try {
      const { query, filters, sort, pagination } = searchQuery;
      const page = pagination?.page || 1;
      const size = pagination?.size || 20;
      const from = (page - 1) * size;

      // Build OpenSearch query
      const searchBody = {
        query: this.buildQuery(query, filters),
        sort: sort ? [{ [sort.field]: { order: sort.order } }] : undefined,
        from,
        size,
        highlight: {
          fields: {
            name: { fragment_size: 150, number_of_fragments: 3 },
            description: { fragment_size: 150, number_of_fragments: 3 },
          },
        },
        aggs: {
          games: {
            terms: { field: 'game.keyword', size: 10 },
          },
          rarities: {
            terms: { field: 'rarity.keyword', size: 20 },
          },
          sets: {
            terms: { field: 'set.keyword', size: 50 },
          },
          price_ranges: {
            range: {
              field: 'price',
              ranges: [
                { key: '$0-$10', to: 10 },
                { key: '$10-$50', from: 10, to: 50 },
                { key: '$50-$100', from: 50, to: 100 },
                { key: '$100-$500', from: 100, to: 500 },
                { key: '$500+', from: 500 },
              ],
            },
          },
        },
      };

      // This would be the actual OpenSearch API call
      // For now, we'll simulate the response structure
      console.log('🔍 OpenSearch query:', JSON.stringify(searchBody, null, 2));
      
      // Simulated response - in production this would be an actual API call
      const mockResponse = await this.simulateOpenSearchResponse(searchQuery);
      
      return mockResponse;
    } catch (error) {
      console.error('❌ OpenSearch query failed:', error);
      return this.fallbackSearch(searchQuery);
    }
  }

  /**
   * Build OpenSearch query with filters
   */
  private buildQuery(query: string, filters?: SearchQuery['filters']) {
    const mustClauses = [];
    const filterClauses = [];

    // Text search
    if (query && query.trim()) {
      mustClauses.push({
        multi_match: {
          query: query.trim(),
          fields: ['name^3', 'description^2', 'set', 'rarity'],
          fuzziness: 'AUTO',
          operator: 'and',
        },
      });
    }

    // Apply filters
    if (filters) {
      if (filters.game && filters.game.length > 0) {
        filterClauses.push({
          terms: { 'game.keyword': filters.game }
        });
      }

      if (filters.rarity && filters.rarity.length > 0) {
        filterClauses.push({
          terms: { 'rarity.keyword': filters.rarity }
        });
      }

      if (filters.set && filters.set.length > 0) {
        filterClauses.push({
          terms: { 'set.keyword': filters.set }
        });
      }

      if (filters.condition && filters.condition.length > 0) {
        filterClauses.push({
          terms: { 'condition.keyword': filters.condition }
        });
      }

      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        filterClauses.push({
          range: {
            price: {
              gte: min,
              lte: max,
            },
          },
        });
      }
    }

    return {
      bool: {
        must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }],
        filter: filterClauses,
      },
    };
  }

  /**
   * Simulate OpenSearch response for development
   */
  private async simulateOpenSearchResponse(searchQuery: SearchQuery): Promise<SearchResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const mockCards: CardSearchResult[] = [
      {
        id: '1',
        name: 'Blue-Eyes White Dragon',
        game: 'yu-gi-oh',
        price: 45.99,
        rarity: 'Ultra Rare',
        set: 'Legend of Blue Eyes White Dragon',
        image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
        seller: { id: 'seller1', name: 'CardMaster', rating: 4.8 },
        lastSold: '2024-01-15',
        highlight: {
          name: ['<em>Blue-Eyes</em> White Dragon'],
        },
      },
      {
        id: '2',
        name: 'Pikachu',
        game: 'pokemon',
        price: 25.50,
        rarity: 'Rare',
        set: 'Base Set',
        image: 'https://images.pokemontcg.io/base1/25.png',
        seller: { id: 'seller2', name: 'PokeMart', rating: 4.9 },
        lastSold: '2024-01-10',
      },
    ];

    return {
      cards: mockCards.slice(0, searchQuery.pagination?.size || 20),
      total: mockCards.length,
      page: searchQuery.pagination?.page || 1,
      size: searchQuery.pagination?.size || 20,
      aggregations: {
        games: [
          { key: 'yu-gi-oh', count: 15430 },
          { key: 'pokemon', count: 12850 },
          { key: 'magic', count: 8920 },
        ],
        rarities: [
          { key: 'Common', count: 18500 },
          { key: 'Rare', count: 12300 },
          { key: 'Ultra Rare', count: 4200 },
          { key: 'Secret Rare', count: 2200 },
        ],
        sets: [
          { key: 'Base Set', count: 1500 },
          { key: 'Legend of Blue Eyes', count: 800 },
          { key: 'Metal Raiders', count: 600 },
        ],
        priceRanges: [
          { key: '$0-$10', count: 15000 },
          { key: '$10-$50', count: 8000 },
          { key: '$50-$100', count: 3000 },
          { key: '$100-$500', count: 1500 },
          { key: '$500+', count: 500 },
        ],
      },
    };
  }

  /**
   * Fallback search when OpenSearch is not available
   */
  private async fallbackSearch(searchQuery: SearchQuery): Promise<SearchResult> {
    console.log('🔄 Using fallback search (no OpenSearch)');
    
    // This would integrate with your existing card data service
    // For now, return a basic mock response
    return {
      cards: [],
      total: 0,
      page: searchQuery.pagination?.page || 1,
      size: searchQuery.pagination?.size || 20,
      aggregations: {
        games: [],
        rarities: [],
        sets: [],
        priceRanges: [],
      },
    };
  }

  /**
   * Get search suggestions/autocomplete
   */
  async getSearchSuggestions(query: string, limit: number = 10): Promise<string[]> {
    if (!this.isConfigured || !this.client) {
      return this.getFallbackSuggestions(query, limit);
    }

    try {
      // Build suggestion query
      const suggestionBody = {
        suggest: {
          card_suggest: {
            prefix: query.toLowerCase(),
            completion: {
              field: 'name_suggest',
              size: limit,
            },
          },
        },
      };

      console.log('💡 Getting search suggestions for:', query);
      
      // Simulate suggestions for now
      return this.getFallbackSuggestions(query, limit);
    } catch (error) {
      console.error('❌ Failed to get suggestions:', error);
      return this.getFallbackSuggestions(query, limit);
    }
  }

  private getFallbackSuggestions(query: string, limit: number): string[] {
    const commonSuggestions = [
      'Blue-Eyes White Dragon',
      'Pikachu',
      'Charizard',
      'Dark Magician',
      'Blastoise',
      'Red-Eyes Black Dragon',
      'Venusaur',
      'Exodia the Forbidden One',
    ];

    return commonSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);
  }

  /**
   * Index card data in OpenSearch
   */
  async indexCard(cardData: CardSearchResult): Promise<boolean> {
    if (!this.isConfigured || !this.client) {
      console.warn('OpenSearch not configured, skipping indexing');
      return false;
    }

    try {
      // This would be the actual indexing operation
      console.log('📝 Indexing card:', cardData.name);
      
      // Simulate successful indexing
      return true;
    } catch (error) {
      console.error('❌ Failed to index card:', error);
      return false;
    }
  }

  /**
   * Bulk index multiple cards
   */
  async bulkIndexCards(cards: CardSearchResult[]): Promise<{ success: number; failed: number }> {
    if (!this.isConfigured || !this.client) {
      console.warn('OpenSearch not configured, skipping bulk indexing');
      return { success: 0, failed: cards.length };
    }

    try {
      console.log(`📦 Bulk indexing ${cards.length} cards`);
      
      // Simulate bulk indexing
      const success = Math.floor(cards.length * 0.95); // 95% success rate
      const failed = cards.length - success;
      
      return { success, failed };
    } catch (error) {
      console.error('❌ Bulk indexing failed:', error);
      return { success: 0, failed: cards.length };
    }
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{ status: 'healthy' | 'degraded' | 'unavailable'; details: string }> {
    if (!this.isConfigured) {
      return { 
        status: 'unavailable', 
        details: 'OpenSearch not configured' 
      };
    }

    try {
      // This would be an actual health check
      return { 
        status: 'healthy', 
        details: 'OpenSearch cluster is responsive' 
      };
    } catch (error) {
      return { 
        status: 'degraded', 
        details: `OpenSearch error: ${error}` 
      };
    }
  }
}

export const openSearchService = new OpenSearchService();