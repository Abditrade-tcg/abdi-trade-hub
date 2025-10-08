import { NextApiRequest, NextApiResponse } from 'next';
import { getSecret } from '@/lib/secrets';

interface CardData {
  id: string;
  name: string;
  game: string;
  image?: string;
  images?: any;
  price?: number;
  rarity?: string;
  set?: string;
}

// Pokemon TCG API integration
async function fetchPokemonCards(query: string, limit: number): Promise<CardData[]> {
  // Get Pokemon API key - prioritize AWS Secrets Manager in production, env vars in development
  let apiKey: string | null = null;
  
  if (process.env.NODE_ENV === 'production') {
    // Production: AWS Secrets Manager first, then env var fallback
    try {
      apiKey = await getSecret('pokemon-tcg-api');
      if (apiKey && apiKey.trim() !== '') {
        console.log('✅ Using Pokemon API key from AWS Secrets Manager');
      } else {
        console.log('❌ AWS Secrets Manager returned empty Pokemon key');
        apiKey = null;
      }
    } catch (error) {
      console.log('❌ AWS Secrets Manager error for Pokemon:', error.message);
      apiKey = null;
    }
    
    if (!apiKey) {
      apiKey = process.env.POKEMON_TCG_API_KEY || null;
      if (apiKey) {
        console.log('✅ Using Pokemon API key from environment variable (fallback)');
      }
    }
  } else {
    // Development: Environment variable first, then AWS fallback
    apiKey = process.env.POKEMON_TCG_API_KEY || null;
    
    if (apiKey) {
      console.log('✅ Using Pokemon API key from environment variable');
    } else {
      try {
        console.log('🔑 Trying AWS Secrets Manager for Pokemon key as fallback');
        apiKey = await getSecret('pokemon-tcg-api');
        if (apiKey && apiKey.trim() !== '') {
          console.log('✅ Retrieved Pokemon API key from AWS Secrets Manager');
        } else {
          console.log('❌ AWS Secrets Manager returned empty Pokemon key');
          apiKey = null;
        }
      } catch (error) {
        console.log('❌ AWS Secrets Manager error for Pokemon:', error.message);
        apiKey = null;
      }
    }
  }

  if (!apiKey) {
    console.warn('⚠️ No Pokemon API key found - using public access (reduced rate limits)');
  }

  // Pokemon TCG API: https://docs.pokemontcg.io/api-reference/cards/get-card
  const baseUrl = 'https://api.pokemontcg.io/v2/cards';
  const searchParams = new URLSearchParams({
    q: query ? `name:${query}*` : '',
    pageSize: limit.toString(),
  });

  const url = `${baseUrl}?${searchParams}`;
  console.log(`🌐 Fetching Pokemon cards: ${url}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['X-Api-Key'] = apiKey;
  }

  // Add timeout and retry logic for production resilience
  const maxRetries = 2;
  const timeoutMs = 10000; // 10 second timeout
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Pokemon API attempt ${attempt}/${maxRetries}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, { 
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status >= 500 && attempt < maxRetries) {
          console.warn(`⚠️ Pokemon API server error ${response.status}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Progressive delay
          continue;
        }
        throw new Error(`Pokemon API error: ${response.status} ${response.statusText}`);
      }
      
      // Success - break out of retry loop
      const data = await response.json();
      return (data.data || []).map((card: any) => ({
        id: card.id,
        name: card.name,
        game: 'pokemon',
        image: card.images?.large || card.images?.small,
        images: { large: card.images?.large, small: card.images?.small },
        price: parseFloat(card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || '0'),
        rarity: card.rarity,
        set: card.set?.name,
      }));
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`⏰ Pokemon API timeout on attempt ${attempt}`);
      } else {
        console.warn(`❌ Pokemon API error on attempt ${attempt}:`, error.message);
      }
      
      if (attempt === maxRetries) {
        // Final attempt failed - return empty array instead of throwing
        console.error(`🚨 Pokemon API failed after ${maxRetries} attempts, returning empty results`);
        return [];
      }
      
      // Wait before retry (progressive backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  // This should never be reached, but just in case
  return [];
}

// Magic: The Gathering API integration via Scryfall
async function fetchMagicCards(query: string, limit: number): Promise<CardData[]> {
  // Scryfall API: https://scryfall.com/docs/api (no API key needed)
  const baseUrl = 'https://api.scryfall.com/cards/search';
  const searchParams = new URLSearchParams({
    q: query || '*',
    unique: 'cards',
    order: 'name',
    dir: 'auto',
    page: '1',
  });

  const url = `${baseUrl}?${searchParams}`;
  console.log(`🌐 Fetching Magic cards: ${url}`);

  // Add timeout for Magic API
  const timeoutMs = 8000; // 8 second timeout
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(url, { signal: controller.signal });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        return []; // No cards found
      }
      console.error(`❌ Scryfall API error: ${response.status} ${response.statusText}`);
      return []; // Return empty instead of throwing
    }
    
    const data = await response.json();
    const cards = (data.data || []).slice(0, limit);
    
    return cards.map((card: any) => ({
      id: card.id,
      name: card.name,
      game: 'magic',
      image: card.image_uris?.normal || card.image_uris?.large,
      images: { large: card.image_uris?.large, small: card.image_uris?.small },
      price: parseFloat(card.prices?.usd || '0'),
      rarity: card.rarity,
      set: card.set_name,
    }));
    
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn(`⏰ Magic API timeout`);
    } else {
      console.warn(`❌ Magic API error:`, error.message);
    }
    return []; // Return empty array instead of throwing
  }
}

// Yu-Gi-Oh API integration
async function fetchYuGiOhCards(query: string, limit: number): Promise<CardData[]> {
  // Yu-Gi-Oh API: https://db.ygoprodeck.com/api-guide/
  const timeoutMs = 8000; // 8 second timeout
  
  if (query) {
    // Search by name if query provided
    const searchParams = new URLSearchParams({
      fname: query,
      num: limit.toString(),
    });
    const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${searchParams}`;
    console.log(`🌐 Fetching Yu-Gi-Oh cards: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, { signal: controller.signal });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 400) {
          console.warn(`⚠️ Yu-Gi-Oh search "${query}" not found, returning empty results`);
          return []; // No cards found
        }
        console.error(`❌ Yu-Gi-Oh API error: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      return (data.data || []).map((card: any) => ({
        id: card.id.toString(),
        name: card.name,
        game: 'yu-gi-oh',
        image: card.card_images?.[0]?.image_url,
        images: { large: card.card_images?.[0]?.image_url, small: card.card_images?.[0]?.image_url_small },
        price: parseFloat(card.card_prices?.[0]?.tcgplayer_price || '0'),
        rarity: card.rarity,
        set: card.card_sets?.[0]?.set_name,
      }));
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`⏰ Yu-Gi-Oh API timeout for query "${query}"`);
      } else {
        console.warn(`❌ Yu-Gi-Oh API error for query "${query}":`, error.message);
      }
      return []; // Return empty array instead of throwing
    }
  } else {
    // Get multiple random cards when no query with improved resilience
    console.log(`🌐 Fetching ${limit} random Yu-Gi-Oh cards`);
    const cards: CardData[] = [];
    const maxAttempts = limit * 2; // Allow more attempts than needed cards
    
    for (let i = 0; i < maxAttempts && cards.length < limit; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout per card
        
        const response = await fetch('https://db.ygoprodeck.com/api/v7/randomcard.php', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`⚠️ Yu-Gi-Oh random card API returned ${response.status}, skipping`);
          continue;
        }
        
        const data = await response.json();
        if (data.data && data.data[0]) {
          const card = data.data[0];
          cards.push({
            id: card.id.toString(),
            name: card.name,
            game: 'yu-gi-oh',
            image: card.card_images?.[0]?.image_url,
            images: { large: card.card_images?.[0]?.image_url, small: card.card_images?.[0]?.image_url_small },
            price: parseFloat(card.card_prices?.[0]?.tcgplayer_price || '0'),
            rarity: card.rarity,
            set: card.card_sets?.[0]?.set_name,
          });
          console.log(`✅ Successfully fetched Yu-Gi-Oh random card ${cards.length}/${limit}: ${card.name}`);
        }
        
        // Add small delay between requests to be respectful to the API
        if (cards.length < limit) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn(`⏰ Yu-Gi-Oh random card ${i + 1} timed out`);
        } else {
          console.warn(`❌ Failed to fetch Yu-Gi-Oh random card ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log(`✅ Successfully fetched ${cards.length} Yu-Gi-Oh cards out of ${limit} requested`);
    return cards;
  }
}

// API TCG integration for multiple games
async function fetchApiTcgCards(game: string, query: string, limit: number): Promise<CardData[]> {
  // Get API TCG key - prioritize AWS Secrets Manager in production, env vars in development
  let apiKey: string | null = null;
  
  if (process.env.NODE_ENV === 'production') {
    // Production: AWS Secrets Manager first, then env var fallback
    try {
      apiKey = await getSecret('api_tcg');
      if (apiKey && apiKey.trim() !== '') {
        console.log('✅ Using API TCG key from AWS Secrets Manager');
      } else {
        console.log('❌ AWS Secrets Manager returned empty API TCG key');
        apiKey = null;
      }
    } catch (error) {
      console.log('❌ AWS Secrets Manager error for API TCG:', error.message);
      apiKey = null;
    }
    
    if (!apiKey) {
      apiKey = process.env.API_TCG_KEY || null;
      if (apiKey) {
        console.log('✅ Using API TCG key from environment variable (fallback)');
      }
    }
  } else {
    // Development: Environment variable first, then AWS fallback
    apiKey = process.env.API_TCG_KEY || null;
    
    if (apiKey) {
      console.log('✅ Using API TCG key from environment variable');
    } else {
      try {
        console.log('🔑 Trying AWS Secrets Manager for API TCG key as fallback');
        apiKey = await getSecret('api_tcg');
        if (apiKey && apiKey.trim() !== '') {
          console.log('✅ Retrieved API TCG key from AWS Secrets Manager');
        } else {
          console.log('❌ AWS Secrets Manager returned empty API TCG key');
          apiKey = null;
        }
      } catch (error) {
        console.log('❌ AWS Secrets Manager error for API TCG:', error.message);
        apiKey = null;
      }
    }
  }

  if (!apiKey) {
    console.error('❌ API_TCG API key not found in environment variables or AWS Secrets Manager');
    throw new Error('API_TCG API key not found');
  }
  
  console.log(`🔑 Using API TCG key: ${apiKey.substring(0, 8)}...`);

  // Game endpoint mappings for API TCG
  const gameEndpoints: Record<string, string> = {
    'one_piece': 'one-piece',
    'dragon_ball_fusion': 'dragon-ball-fusion',
    'digimon': 'digimon',
    'union_arena': 'union-arena',
    'gundam': 'gundam',
    'star_wars': 'star-wars-unlimited',
    'riftbound': 'riftbound'
  };

  const endpoint = gameEndpoints[game];
  if (!endpoint) {
    throw new Error(`Unsupported API TCG game: ${game}`);
  }

  // API TCG: https://docs.apitcg.com/api-reference/cards
  const baseUrl = 'https://www.apitcg.com/api';
  const searchParams = new URLSearchParams({
    limit: limit.toString(),
  });
  
  if (query) {
    searchParams.append('name', query);
  }

  const url = `${baseUrl}/${endpoint}/cards?${searchParams}`;
  console.log(`🌐 Fetching ${game} cards from API TCG: ${url}`);

  // Add timeout and retry logic for production resilience
  const maxRetries = 2;
  const timeoutMs = 8000; // 8 second timeout for API TCG
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API TCG ${game} attempt ${attempt}/${maxRetries}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status >= 500 && attempt < maxRetries) {
          console.warn(`⚠️ API TCG ${game} server error ${response.status}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Progressive delay
          continue;
        }
        // For client errors (4xx) or final server error, return empty instead of throwing
        console.error(`❌ API TCG ${game} error: ${response.status} ${response.statusText}`);
        return [];
      }
      
      // Success - process the response
      const result = await response.json();
      const cards = result.data || result.cards || result || [];
      
      console.log(`✅ API TCG returned ${cards.length} cards for ${game}`);
      
      return cards.map((card: any) => ({
        id: card.id || card.code,
        name: card.name,
        game: game,
        image: card.images?.large || card.images?.small || card.image || card.image_url || card.imageUrl,
        images: { 
          large: card.images?.large || card.image || card.image_url || card.imageUrl, 
          small: card.images?.small || card.images?.large || card.image || card.image_url || card.imageUrl 
        },
        price: parseFloat(card.price || '0'),
        rarity: card.rarity,
        set: card.set?.name || card.set,
      }));
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`⏰ API TCG ${game} timeout on attempt ${attempt}`);
      } else {
        console.warn(`❌ API TCG ${game} error on attempt ${attempt}:`, error.message);
      }
      
      if (attempt === maxRetries) {
        // Final attempt failed - return empty array instead of throwing
        console.error(`🚨 API TCG ${game} failed after ${maxRetries} attempts, returning empty results`);
        return [];
      }
      
      // Wait before retry (progressive backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  // This should never be reached, but just in case
  return [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { game, name = '', limit = '20' } = req.query;

  if (!game) {
    return res.status(400).json({ error: 'Game parameter is required' });
  }

  try {
    console.log(`🔍 API Route handling ${game} cards with query: "${name}", limit: ${limit}`);

    let cards: CardData[] = [];
    const queryLimit = parseInt(limit as string) || 20;

    switch (game) {
      case 'pokemon':
        cards = await fetchPokemonCards(name as string, queryLimit);
        break;
      case 'magic':
        cards = await fetchMagicCards(name as string, queryLimit);
        break;
      case 'yu-gi-oh':
        cards = await fetchYuGiOhCards(name as string, queryLimit);
        break;
      case 'one_piece':
      case 'dragon_ball_fusion':
      case 'digimon':
      case 'union_arena':
      case 'gundam':
      case 'star_wars':
      case 'riftbound':
        cards = await fetchApiTcgCards(game as string, name as string, queryLimit);
        break;
      default:
        return res.status(400).json({ error: `Unsupported game: ${game}` });
    }

    console.log(`✅ Successfully fetched ${cards.length} cards for ${game}`);
    
    // Add caching headers to improve performance
    // Cache for 5 minutes to reduce API calls while keeping content relatively fresh
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('CDN-Cache-Control', 'public, s-maxage=300');
    res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=300');
    
    return res.status(200).json({ 
      cards,
      cached_at: new Date().toISOString(),
      game: game,
      count: cards.length
    });

  } catch (error) {
    console.error(`❌ Error fetching ${game} cards:`, error);
    
    // Don't cache error responses
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return res.status(500).json({
      error: 'Failed to fetch cards',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}