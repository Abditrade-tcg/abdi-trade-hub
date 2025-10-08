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

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Pokemon API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return (data.data || []).map((card: any) => ({
    id: card.id,
    name: card.name,
    game: 'pokemon',
    image: card.images?.large || card.images?.small,
    images: card.images,
    price: parseFloat(card.cardmarket?.prices?.averageSellPrice || '0'),
    rarity: card.rarity,
    set: card.set?.name,
  }));
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

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      return []; // No cards found
    }
    throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
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
}

// Yu-Gi-Oh API integration
async function fetchYuGiOhCards(query: string, limit: number): Promise<CardData[]> {
  // Yu-Gi-Oh API: https://db.ygoprodeck.com/api-guide/
  
  if (query) {
    // Search by name if query provided
    const searchParams = new URLSearchParams({
      fname: query,
      num: limit.toString(),
    });
    const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${searchParams}`;
    console.log(`🌐 Fetching Yu-Gi-Oh cards: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Yu-Gi-Oh API error: ${response.status} ${response.statusText}`);
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
  } else {
    // Get multiple random cards when no query
    console.log(`🌐 Fetching ${limit} random Yu-Gi-Oh cards`);
    const cards: CardData[] = [];
    
    for (let i = 0; i < limit; i++) {
      try {
        const response = await fetch('https://db.ygoprodeck.com/api/v7/randomcard.php');
        if (!response.ok) continue;
        
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
        }
      } catch (error) {
        console.warn(`Failed to fetch random Yu-Gi-Oh card ${i + 1}:`, error);
      }
    }
    
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

  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API TCG ${game} error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const cards = result.data || result.cards || result || [];
  
  console.log(`✅ API TCG returned ${cards.length} cards for ${game}`);
  
  return cards.map((card: any) => ({
    id: card.id || card.code,
    name: card.name,
    game: game,
    image: card.images?.large || card.images?.small || card.image,
    images: card.images,
    price: parseFloat(card.market_price || '0'),
    rarity: card.rarity,
    set: card.set?.name || card.set,
  }));
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
    return res.status(200).json({ cards });

  } catch (error) {
    console.error(`❌ Error fetching ${game} cards:`, error);
    return res.status(500).json({
      error: 'Failed to fetch cards',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}