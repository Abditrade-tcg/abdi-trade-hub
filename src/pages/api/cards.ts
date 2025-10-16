import { NextApiRequest, NextApiResponse } from 'next';

interface CardData {
  id: string;
  name: string;
  game: string;
  image?: string;
  images?: {
    large?: string;
    small?: string;
  };
  price?: number;
  rarity?: string;
  set?: string;
}

/**
 * Cards API - Production-ready with S3 caching via Backend
 * 
 * This endpoint proxies requests to the backend Lambda API which:
 * 1. Caches card images to S3
 * 2. Caches card data to S3
 * 3. Serves from cache on subsequent requests
 * 4. Handles rate limiting and retries
 * 5. Prevents hitting external API rate limits
 * 
 * Backend URL: https://9uy8yseaj4.execute-api.us-east-2.amazonaws.com/prod
 * Backend Service: cardCatalogService.ts with S3Service integration
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CardData[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { game, q, set, rarity, type, page = '1', limit = '20', sortBy, sortOrder } = req.query;

  // Validate required parameters
  if (!game) {
    return res.status(400).json({ error: 'Game parameter is required' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  
  if (!backendUrl) {
    console.error('❌ NEXT_PUBLIC_BACKEND_API_URL not configured in environment');
    return res.status(500).json({ error: 'Backend API not configured' });
  }

  try {
    // Build query parameters for backend API
    // Convert game name to lowercase to match backend expectations
    const params = new URLSearchParams({
      game: (game as string).toLowerCase(),
      ...(q && { q: q as string }),
      ...(set && { set: set as string }),
      ...(rarity && { rarity: rarity as string }),
      ...(type && { type: type as string }),
      page: page as string,
      limit: limit as string,
      ...(sortBy && { sortBy: sortBy as string }),
      ...(sortOrder && { sortOrder: sortOrder as string }),
    });

    const url = `${backendUrl}/v1/search/cards?${params}`;
    console.log(`🔄 Proxying card request to backend (with S3 caching): ${url}`);

    // Call backend API (which has S3 caching built-in via cardCatalogService)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for resilience
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Backend API error: ${response.status} ${response.statusText} - ${errorText}`);
      return res.status(response.status).json({ 
        error: `Backend API error: ${response.statusText}` 
      });
    }

    const data = await response.json();
    
    // Backend returns { success: true, data: [...] } format
    const cards = data.data || data;
    
    console.log(`✅ Retrieved ${Array.isArray(cards) ? cards.length : 0} cards from backend (S3-cached)`);
    return res.status(200).json(cards);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : '';
    
    if (errorName === 'TimeoutError' || errorName === 'AbortError') {
      console.error('⏰ Backend API timeout after 30 seconds');
      return res.status(504).json({ 
        error: 'Backend request timeout - please try again' 
      });
    }
    
    console.error('❌ Card API error:', errorMessage);
    return res.status(500).json({ 
      error: errorMessage || 'Failed to fetch cards from backend' 
    });
  }
}
