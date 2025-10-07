import { config } from '@/config';
import { CanonicalCard, MarketplaceActivity } from '@/types';
import { withRetry, withCircuitBreaker } from './awsErrorHandler';

interface BackendAPIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CardSearchFilters {
  game?: string[];
  rarity?: string[];
  set?: string[];
  priceRange?: { min: number; max: number };
  condition?: string[];
  seller?: string;
}

interface BackendSearchParams {
  query?: string;
  filters?: CardSearchFilters;
  sort?: {
    field: 'name' | 'price' | 'rarity' | 'date' | 'popularity';
    order: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}

// =======================================
// ADMIN TYPES
// =======================================

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AdminStats {
  totalRevenue: number;
  activeUsers: number;
  totalListings: number;
  openDisputes: number;
  totalOrders: number;
  monthlyRevenue: number;
  mauCount: number;
  disputeResolutionRate: number;
}

interface AdminActivity {
  id: string;
  type: 'order' | 'dispute' | 'user_signup' | 'listing';
  description: string;
  timestamp: string;
  status?: string;
  amount?: number;
}

interface MAUDashboard {
  currentMonthMAU: number;
  previousMonthMAU: number;
  mauGrowth: number;
  totalRevenue: number;
  revenuePerMAU: number;
  topSellersByMAU: TopSeller[];
  monthlyTrends: MonthlyTrend[];
}

interface TopSeller {
  sellerId: string;
  displayName: string;
  mauContribution: number;
  totalRevenue: number;
}

interface MonthlyTrend {
  month: string;
  mau: number;
  revenue: number;
  growth: number;
}

interface FinancialAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  transactionFees: number;
  listingFees: number;
  sellerFees: number;
  revenueGrowth: number;
  avgTransactionValue: number;
  topRevenueCards: TopRevenueCard[];
}

interface TopRevenueCard {
  cardId: string;
  cardName: string;
  game: string;
  totalRevenue: number;
  transactionCount: number;
}

interface AdminUser {
  userId: string;
  handle: string;
  displayName: string;
  email: string;
  accountType: string;
  status: string;
  reputation: number;
  totalTrades: number;
  createdAt: string;
  kycStatus?: string;
}

interface AdminOrder {
  orderId: string;
  sellerId: string;
  buyerId: string;
  cardId: string;
  cardName: string;
  amount: number;
  status: string;
  createdAt: string;
  hasDispute: boolean;
  disputeId?: string;
}

interface AdminDispute {
  disputeId: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  status: string;
  priority: string;
  reason: string;
  amount: number;
  createdAt: string;
  resolvedAt?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class BackendAPIService {
  private baseURL: string;
  private apiKey: string | null = null;

  constructor() {
    this.baseURL = config.apiUrl;
    
    // Set API key if available
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('api_key');
    }
  }

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Make authenticated API request with centralized error handling and retries
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {},
    retries = 2
  ): Promise<BackendAPIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    return withRetry(async () => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle authentication error
          this.handleAuthError();
          throw new Error('Authentication required');
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    }, 'BackendAPI', `${options.method || 'GET'} ${endpoint}`);
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true; // Network error
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleAuthError(): void {
    // Clear stored authentication and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('api_key');
      localStorage.removeItem('auth_user');
      // You might want to redirect to login page here
      console.warn('Authentication expired, please login again');
    }
  }

  /**
   * Search cards using backend API
   */
  async searchCards(params: BackendSearchParams): Promise<CanonicalCard[]> {
    try {
      console.log('🔍 Searching cards via backend API:', params);
      
      const queryParams = new URLSearchParams();
      
      if (params.query) {
        queryParams.append('q', params.query);
      }
      
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params.sort) {
        queryParams.append('sort', `${params.sort.field}:${params.sort.order}`);
      }

      // Add filters as query parameters
      if (params.filters) {
        if (params.filters.game) {
          params.filters.game.forEach(game => queryParams.append('game', game));
        }
        if (params.filters.rarity) {
          params.filters.rarity.forEach(rarity => queryParams.append('rarity', rarity));
        }
        if (params.filters.set) {
          params.filters.set.forEach(set => queryParams.append('set', set));
        }
        if (params.filters.condition) {
          params.filters.condition.forEach(condition => queryParams.append('condition', condition));
        }
        if (params.filters.priceRange) {
          queryParams.append('price_min', params.filters.priceRange.min.toString());
          queryParams.append('price_max', params.filters.priceRange.max.toString());
        }
        if (params.filters.seller) {
          queryParams.append('seller', params.filters.seller);
        }
      }

      const endpoint = `/v1/cards/search?${queryParams.toString()}`;
      const response = await this.makeRequest<CanonicalCard[]>(endpoint);
      
      return response.data || [];
    } catch (error) {
      console.error('❌ Backend card search failed:', error);
      
      // Return mock data for development/fallback
      return this.getMockCards(params);
    }
  }

  /**
   * Get trending/popular cards
   */
  async getTrendingCards(limit: number = 20): Promise<CanonicalCard[]> {
    try {
      console.log('📈 Getting trending cards from backend');
      
      const endpoint = `/v1/cards/trending?limit=${limit}`;
      const response = await this.makeRequest<CanonicalCard[]>(endpoint);
      
      return response.data || [];
    } catch (error) {
      console.error('❌ Failed to get trending cards:', error);
      return this.getMockCards({ limit });
    }
  }

  /**
   * Get random/featured cards
   */
  async getRandomCards(limit: number = 20): Promise<CanonicalCard[]> {
    try {
      console.log('🎲 Getting random cards from backend');
      
      const endpoint = `/v1/cards/random?limit=${limit}`;
      const response = await this.makeRequest<CanonicalCard[]>(endpoint);
      
      return response.data || [];
    } catch (error) {
      console.error('❌ Failed to get random cards:', error);
      return this.getMockCards({ limit });
    }
  }

  /**
   * Get card by ID
   */
  async getCardById(cardId: string): Promise<CanonicalCard | null> {
    try {
      console.log('🔍 Getting card by ID:', cardId);
      
      const endpoint = `/v1/cards/${cardId}`;
      const response = await this.makeRequest<CanonicalCard>(endpoint);
      
      return response.data || null;
    } catch (error) {
      console.error('❌ Failed to get card by ID:', error);
      return null;
    }
  }

  /**
   * Get marketplace activity/recent trades
   */
  async getMarketplaceActivity(limit: number = 50): Promise<MarketplaceActivity[]> {
    try {
      console.log('📊 Getting marketplace activity from backend');
      
      const endpoint = `/public/marketplace-activity?limit=${limit}`;
      const response = await this.makeRequest<MarketplaceActivity[]>(endpoint);
      
      return response.data || [];
    } catch (error) {
      console.error('❌ Failed to get marketplace activity:', error);
      return this.getMockMarketplaceActivity(limit);
    }
  }

  /**
   * Get card price history
   */
  async getCardPriceHistory(cardId: string, days: number = 30): Promise<Array<{ date: string; price: number }>> {
    try {
      console.log('📈 Getting price history for card:', cardId);
      
      const endpoint = `/v1/cards/${cardId}/price-history?days=${days}`;
      const response = await this.makeRequest<Array<{ date: string; price: number }>>(endpoint);
      
      return response.data || [];
    } catch (error) {
      console.error('❌ Failed to get price history:', error);
      return [];
    }
  }

  /**
   * Get seller information
   */
  async getSellerInfo(sellerId: string): Promise<{ id: string; name: string; rating: number; sales: number } | null> {
    try {
      console.log('👤 Getting seller info:', sellerId);
      
      const endpoint = `/v1/sellers/${sellerId}`;
      const response = await this.makeRequest<{ id: string; name: string; rating: number; sales: number }>(endpoint);
      
      return response.data || null;
    } catch (error) {
      console.error('❌ Failed to get seller info:', error);
      return null;
    }
  }

  /**
   * Submit card listing
   */
  async submitCardListing(listingData: {
    cardId?: string;
    name: string;
    game: string;
    price: number;
    condition: string;
    quantity: number;
    images: string[];
    description?: string;
  }): Promise<{ success: boolean; listingId?: string; message?: string }> {
    try {
      console.log('📝 Submitting card listing');
      
      const endpoint = '/v1/listings';
      const response = await this.makeRequest<{ listingId: string }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(listingData),
      });
      
      return {
        success: response.success,
        listingId: response.data?.listingId,
        message: response.message,
      };
    } catch (error) {
      console.error('❌ Failed to submit listing:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit listing',
      };
    }
  }

  /**
   * Mock data for development/fallback
   */
  private getMockCards(params: BackendSearchParams): CanonicalCard[] {
    const mockCards: CanonicalCard[] = [
      {
        id: 'ygopro-89631139',
        name: 'Blue-Eyes White Dragon',
        game: 'yu-gi-oh',
        price: 45.99,
        image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
        condition: 'near-mint',
        rarity: 'Ultra Rare',
        set: 'Legend of Blue Eyes White Dragon',
        seller: {
          id: 'seller1',
          name: 'CardMaster Pro',
          rating: 4.8,
          sales: 1247,
        },
        lastSold: '2024-01-15T10:30:00Z',
        priceHistory: [
          { date: '2024-01-01', price: 42.50 },
          { date: '2024-01-15', price: 45.99 },
        ],
      },
      {
        id: 'pokemon-base1-25',
        name: 'Pikachu',
        game: 'pokemon',
        price: 125.00,
        image: 'https://images.pokemontcg.io/base1/25.png',
        condition: 'mint',
        rarity: 'Rare',
        set: 'Base Set',
        seller: {
          id: 'seller2',
          name: 'PokeMart Elite',
          rating: 4.9,
          sales: 892,
        },
        lastSold: '2024-01-10T14:20:00Z',
        priceHistory: [
          { date: '2024-01-01', price: 120.00 },
          { date: '2024-01-10', price: 125.00 },
        ],
      },
    ];

    const limit = params.limit || 20;
    return mockCards.slice(0, limit);
  }

  private getMockMarketplaceActivity(limit: number): MarketplaceActivity[] {
    const mockActivity: MarketplaceActivity[] = [
      {
        id: 'activity1',
        type: 'sale',
        cardName: 'Blue-Eyes White Dragon',
        game: 'yu-gi-oh',
        price: 45.99,
        timestamp: '2024-01-15T10:30:00Z',
        seller: 'CardMaster Pro',
        buyer: 'YuGiOhFan2024',
      },
      {
        id: 'activity2',
        type: 'listing',
        cardName: 'Pikachu',
        game: 'pokemon',
        price: 125.00,
        timestamp: '2024-01-15T09:15:00Z',
        seller: 'PokeMart Elite',
      },
    ];

    return mockActivity.slice(0, limit);
  }

  /**
   * Set API key for authenticated requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('api_key', apiKey);
    }
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.apiKey = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('api_key');
    }
  }

  // =======================================
  // ADMIN ENDPOINTS
  // =======================================

  /**
   * Get admin platform statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    const response = await this.makeRequest<AdminStats>('/admin/stats');
    return response.data;
  }

  /**
   * Get recent platform activity for admin dashboard
   */
  async getRecentActivity(): Promise<Array<{
    type: string;
    user: string;
    time: string;
  }>> {
    const response = await this.makeRequest<AdminActivity[]>('/admin/activity/recent');
    
    // Transform AdminActivity[] to match Admin page expectations
    return response.data.map(activity => ({
      type: activity.description || activity.type,
      user: activity.id, // This will need to be mapped to actual user names from the backend
      time: new Date(activity.timestamp).toLocaleTimeString()
    }));
  }

  /**
   * Get MAU Dashboard data (CEO/CFO access)
   */
  async getMAUDashboard(): Promise<MAUDashboard> {
    const response = await this.makeRequest<MAUDashboard>('/admin/analytics/mau/dashboard');
    return response.data;
  }

  /**
   * Get financial analytics (CFO access)
   */
  async getFinancialAnalytics(): Promise<FinancialAnalytics> {
    const response = await this.makeRequest<FinancialAnalytics>('/admin/analytics/financial');
    return response.data;
  }

  /**
   * Get all users with filters (Admin access)
   */
  async getUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    accountType?: string;
    search?: string;
  }): Promise<PaginatedResponse<AdminUser>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.accountType) queryParams.set('accountType', params.accountType);
    if (params?.search) queryParams.set('search', params.search);

    const response = await this.makeRequest<PaginatedResponse<AdminUser>>(`/admin/users?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Get all orders with filters (Admin access)
   */
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    hasDispute?: boolean;
  }): Promise<PaginatedResponse<AdminOrder>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.dateFrom) queryParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.set('dateTo', params.dateTo);
    if (params?.hasDispute !== undefined) queryParams.set('hasDispute', params.hasDispute.toString());

    const response = await this.makeRequest<PaginatedResponse<AdminOrder>>(`/admin/orders?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Get all disputes with filters (Admin access)
   */
  async getDisputes(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<PaginatedResponse<AdminDispute>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.priority) queryParams.set('priority', params.priority);

    const response = await this.makeRequest<PaginatedResponse<AdminDispute>>(`/admin/disputes?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Update user status (Admin access)
   */
  async updateUserStatus(userId: string, status: string, reason?: string): Promise<{ success: boolean }> {
    const response = await this.makeRequest<{ success: boolean }>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
    return response.data;
  }

  /**
   * Resolve dispute (Admin access)
   */
  async resolveDispute(disputeId: string, resolution: {
    outcome: 'buyer_favor' | 'seller_favor' | 'partial_refund';
    refundAmount?: number;
    reason: string;
  }): Promise<{ success: boolean }> {
    const response = await this.makeRequest<{ success: boolean }>(`/admin/disputes/${disputeId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify(resolution),
    });
    return response.data;
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{ status: 'healthy' | 'degraded' | 'unavailable'; details: string }> {
    try {
      const response = await this.makeRequest<{ status: string; timestamp: string }>('/health');
      return {
        status: 'healthy',
        details: `Backend API is healthy (${response.data.status})`,
      };
    } catch (error) {
      return {
        status: 'unavailable',
        details: `Backend API error: ${error}`,
      };
    }
  }
}

export const backendAPIService = new BackendAPIService();