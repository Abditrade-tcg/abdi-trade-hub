# S3 Card Data & Image Caching Implementation Plan

## 🗃️ S3 Bucket Structure
```
abditrade-card-cache/
├── card-data/
│   ├── pokemon/
│   │   ├── metadata.json (last_updated, total_cards, etc.)
│   │   ├── batch_1.json (cards 1-1000)
│   │   ├── batch_2.json (cards 1001-2000)
│   │   └── ...
│   ├── magic/
│   ├── yugioh/
│   ├── one_piece/
│   ├── digimon/
│   └── ...
└── card-images/
    ├── pokemon/
    │   ├── {card-id}.webp
    │   └── thumbnails/{card-id}.webp (200x280)
    ├── magic/
    ├── yugioh/
    └── ...
```

## 🔄 Caching Workflow

### Phase 1: Background Data Sync
1. **Scheduled Lambda Function** (runs daily at 3 AM UTC)
   - Fetches fresh data from all APIs
   - Stores paginated JSON files in S3
   - Downloads and optimizes images to WebP format
   - Updates metadata with sync timestamps

### Phase 2: API Route Enhancement
1. **S3-First Strategy**: Check S3 cache before external APIs
2. **Fallback Chain**: S3 → Memory Cache → External API → Update S3
3. **Image Proxy**: Serve images from S3 with CloudFront CDN

### Phase 3: Image Optimization
1. **Format Conversion**: Convert all images to WebP (60-80% smaller)
2. **Multiple Sizes**: Generate thumbnails (200x280) and full size (400x560)
3. **CloudFront CDN**: Global distribution for sub-100ms image loading

## 🛠️ Implementation Components

### 1. S3 Cache Service
```typescript
// src/services/s3CacheService.ts
export class S3CacheService {
  async getCards(game: string, limit: number): Promise<CardData[]>
  async updateCards(game: string, cards: CardData[]): Promise<void>
  async getImageUrl(cardId: string, game: string, size: 'thumb' | 'full'): string
  async isCacheValid(game: string): Promise<boolean>
}
```

### 2. Enhanced API Route
```typescript
// src/pages/api/cards.ts - Enhanced with S3 caching
async function fetchCardsWithCache(game: string, limit: number): Promise<CardData[]> {
  // 1. Check S3 cache first (sub-second response)
  const cached = await s3Cache.getCards(game, limit);
  if (cached.length > 0 && await s3Cache.isCacheValid(game)) {
    return cached;
  }
  
  // 2. Fallback to external API (for fresh data or cache miss)
  const fresh = await fetchFromExternalAPI(game, limit);
  
  // 3. Update S3 cache in background (don't block response)
  s3Cache.updateCards(game, fresh).catch(console.error);
  
  return fresh;
}
```

### 3. Background Sync Lambda
```typescript
// lambda/cardDataSync.ts
export async function handler() {
  const games = ['pokemon', 'magic', 'yugioh', 'onepiece', 'digimon', ...];
  
  for (const game of games) {
    // Fetch all cards for this game
    const cards = await fetchAllCardsForGame(game);
    
    // Store in S3 with batching
    await s3Cache.storeCardBatch(game, cards);
    
    // Download and optimize images
    await downloadAndOptimizeImages(cards);
  }
}
```

## 📊 Expected Performance Improvements

### Response Times
- **Current**: 3-25+ seconds (depending on API)
- **With S3 Cache**: 100-300ms (S3 retrieval + JSON parsing)
- **Image Loading**: 50-150ms (CloudFront CDN vs 1-3s external)

### User Experience
- **Instant Search Results**: Cards appear immediately from S3
- **Progressive Image Loading**: Thumbnails → Full resolution
- **Offline Resilience**: S3 cache works even if external APIs are down
- **Global Performance**: CloudFront ensures fast access worldwide

## 🚀 Implementation Phases

### Phase 1: S3 Data Caching (Week 1)
- [ ] Create S3 bucket with proper IAM policies
- [ ] Implement S3CacheService class
- [ ] Modify API routes to check S3 first
- [ ] Add cache invalidation logic

### Phase 2: Image Caching & CDN (Week 2)
- [ ] Set up CloudFront distribution
- [ ] Implement image download/optimization pipeline
- [ ] Create image proxy API routes
- [ ] Update CardImage component to use CDN URLs

### Phase 3: Background Sync (Week 3)
- [ ] Create Lambda function for scheduled sync
- [ ] Implement incremental updates (only changed cards)
- [ ] Add monitoring and alerts for sync failures
- [ ] Implement cache warming strategies

### Phase 4: Advanced Features (Week 4)
- [ ] Search indexing in S3 (ElasticSearch integration)
- [ ] Predictive cache warming based on user behavior
- [ ] Image compression optimization
- [ ] Analytics and cache hit rate monitoring

## 💰 Cost Estimation (Monthly)

### S3 Storage
- **Card Data**: ~500MB JSON files = $0.01
- **Images**: ~50GB optimized images = $1.15
- **Total Storage**: ~$1.20/month

### Data Transfer
- **S3 → CloudFront**: Free (first 1TB)
- **CloudFront → Users**: $0.085/GB after free tier
- **Estimated**: $5-15/month depending on traffic

### Lambda
- **Sync Function**: 1 execution/day × 30 days = $0.20/month
- **Total**: Under $20/month for significant performance gains

## 🔧 Configuration Required

### AWS Resources
1. **S3 Bucket**: `abditrade-card-cache`
2. **CloudFront Distribution**: Global CDN
3. **Lambda Function**: Scheduled sync
4. **IAM Roles**: S3 read/write permissions

### Environment Variables
```env
S3_CACHE_BUCKET=abditrade-card-cache
CLOUDFRONT_DOMAIN=d123456789.cloudfront.net
CACHE_TTL_HOURS=24
IMAGE_OPTIMIZATION_QUALITY=80
```

## 🎯 Success Metrics
- **Page Load Time**: Target <2s for card grids
- **Image Load Time**: Target <200ms per image
- **Cache Hit Rate**: Target >90% for repeat visitors
- **API Cost Reduction**: Target 80% fewer external API calls
- **User Bounce Rate**: Target 30% reduction on card pages

Would you like me to start implementing Phase 1 of this caching strategy?