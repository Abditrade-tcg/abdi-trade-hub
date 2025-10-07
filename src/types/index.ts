// User and Authentication Types
export type UserRole = 
  | 'ceo' 
  | 'hr' 
  | 'cfo' 
  | 'trust_safety' 
  | 'store_manager' 
  | 'user';

export type EmployeeRole = 
  | 'ceo' 
  | 'hr' 
  | 'cfo' 
  | 'trust_safety' 
  | 'store_manager';

export type UserStatus = 
  | 'Individual' 
  | 'TCG Store' 
  | 'Buyer' 
  | 'Employee';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  repScore: number;
  badges: Badge[];
  isVerified: boolean;
  joinedAt: string;
  totalTrades: number;
  completionRate: number;
  status: UserStatus;
  employeeRole?: EmployeeRole;
  isEmployee: boolean;
  storeName?: string;
  firstName?: string;
  lastName?: string;
  userType?: 'Individual' | 'TCG Store' | 'Buyer';
  stripeAccountId?: string;
}

export interface CognitoSession {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  userId: string;
  username: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
  expiresAt: number;
}

export interface AuthGuardConfig {
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  redirectTo?: string;
  fallback?: React.ComponentType;
}

// Stripe Types
export interface StripeConnectAccount {
  id: string;
  detailsSubmitted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
    pendingVerification: string[];
  };
  capabilities: {
    card_payments: 'active' | 'inactive' | 'pending';
    transfers: 'active' | 'inactive' | 'pending';
  };
  futureRequirements?: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
    pendingVerification: string[];
  };
}

export interface OnboardingSession {
  accountId: string;
  accountLinkUrl?: string;
  clientSecret?: string;
  expiresAt: number;
  type: 'embedded' | 'hosted';
}

export type StripeConnectStatus = 
  | 'not_connected' 
  | 'pending' 
  | 'restricted' 
  | 'enabled' 
  | 'rejected';

// Card Types (from existing system)
export interface CanonicalCard {
  id: string;
  name: string;
  game: 'yu-gi-oh' | 'pokemon' | 'magic' | 'one_piece' | 'dragon_ball_fusion' | 'digimon' | 'union_arena' | 'gundam' | 'star_wars' | 'riftbound' | 'other';
  price: number;
  image: string;
  condition: 'mint' | 'near-mint' | 'lightly-played' | 'moderately-played' | 'heavily-played' | 'damaged';
  rarity?: string;
  set?: string;
  seller?: {
    id: string;
    name: string;
    rating: number;
    sales: number;
  };
  lastSold?: string;
  priceHistory?: Array<{
    date: string;
    price: number;
  }>;
}

// Feature Flags
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  conditions?: Record<string, unknown>;
  description: string;
}

// Logging Types
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId: string;
  url: string;
  userAgent: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

// Marketplace Activity Types
export interface MarketplaceActivity {
  id: string;
  type: 'sale' | 'listing' | 'bid' | 'offer';
  cardName: string;
  game: 'yu-gi-oh' | 'pokemon' | 'magic' | 'one_piece' | 'dragon_ball_fusion' | 'digimon' | 'union_arena' | 'gundam' | 'star_wars' | 'riftbound' | 'other';
  price: number;
  timestamp: string;
  seller: string;
  buyer?: string;
}

// API TCG Specific Types for each game
export interface ApiTcgCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  set: {
    id?: string;
    name: string;
  };
  game: 'one_piece' | 'dragon_ball_fusion' | 'digimon' | 'union_arena' | 'gundam' | 'star_wars' | 'riftbound';
}

export interface OnePieceCard extends ApiTcgCard {
  code: string;
  rarity: string;
  type: string;
  cost: number;
  attribute?: {
    name: string;
    image: string;
  };
  power?: number;
  counter?: number;
  life?: number;
  effect?: string;
  trigger?: string;
  game: 'one_piece';
}

export interface DragonBallFusionCard extends ApiTcgCard {
  cardNumber: string;
  rarity: string;
  type: string;
  color: string;
  energy?: number;
  power?: number;
  combo?: {
    cost: number;
    power: number;
  };
  skill?: string;
  effect?: string;
  game: 'dragon_ball_fusion';
}

export interface DigimonCard extends ApiTcgCard {
  cardNumber: string;
  rarity: string;
  type: string;
  color: string;
  level?: number;
  playCost?: number;
  evolutionCost?: number;
  dp?: number;
  attribute?: string;
  form?: string;
  digivolveRequirement?: string;
  effect?: string;
  inheritedEffect?: string;
  game: 'digimon';
}

export interface UnionArenaCard extends ApiTcgCard {
  cardNumber: string;
  rarity: string;
  type: string;
  color: string;
  cost?: number;
  bp?: number;
  ap?: number;
  feature?: string[];
  effect?: string;
  flavor?: string;
  game: 'union_arena';
}

export interface GundamCard extends ApiTcgCard {
  cardNumber: string;
  rarity: string;
  type: string;
  color: string;
  cost?: number;
  attack?: number;
  shield?: number;
  pilot?: string;
  ability?: string;
  effect?: string;
  game: 'gundam';
}

export interface StarWarsCard extends ApiTcgCard {
  cardNumber: string;
  rarity: string;
  type: string;
  aspects: string[];
  cost?: number;
  power?: number;
  hp?: number;
  traits?: string[];
  ability?: string;
  effect?: string;
  game: 'star_wars';
}

export interface RiftboundCard extends ApiTcgCard {
  cardNumber: string;
  rarity: string;
  type: string;
  element?: string;
  cost?: number;
  attack?: number;
  defense?: number;
  ability?: string;
  effect?: string;
  game: 'riftbound';
}

// Scryfall Magic: The Gathering Card
export interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity?: string[];
  set: string;
  set_name: string;
  rarity: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    art_crop: string;
    border_crop: string;
  };
  prices?: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    eur_foil?: string;
  };
  game: 'magic';
}

// Re-export common React types for convenience
export type { FC, ReactNode, ComponentProps } from 'react';

// Environment Types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_AWS_REGION: string;
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: string;
  NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: string;
  STRIPE_PUBLISHABLE_KEY: string;
}