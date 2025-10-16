// Static card data service to improve performance and eliminate API delays
export interface StaticCard {
  id: string;
  name: string;
  game: string;
  gameShort: string;
  rarity: string;
  price: string;
  trend: string;
  image: string;
  set?: string;
  condition: string;
}

// Pre-defined static card pools for each game to ensure variety
const staticCardPools = {
  pokemon: [
    {
      id: 'pkmn-001',
      name: 'Charizard ex',
      game: 'Pokemon',
      gameShort: 'PKMN',
      rarity: 'Ultra Rare',
      price: '$45.99',
      trend: '+12.5%',
      image: 'https://images.pokemontcg.io/base1/4_hires.png',
      set: 'Base Set',
      condition: 'Near Mint'
    },
    {
      id: 'pkmn-002',
      name: 'Pikachu VMAX',
      game: 'Pokemon',
      gameShort: 'PKMN', 
      rarity: 'Secret Rare',
      price: '$89.50',
      trend: '+8.3%',
      image: 'https://images.pokemontcg.io/swsh4/188_hires.png',
      set: 'Vivid Voltage',
      condition: 'Near Mint'
    },
    {
      id: 'pkmn-003',
      name: 'Rayquaza VMAX',
      game: 'Pokemon',
      gameShort: 'PKMN',
      rarity: 'Secret Rare',
      price: '$67.25',
      trend: '+15.2%',
      image: 'https://images.pokemontcg.io/swsh7/218_hires.png',
      set: 'Evolving Skies',
      condition: 'Near Mint'
    },
    {
      id: 'pkmn-004',
      name: 'Umbreon VMAX',
      game: 'Pokemon',
      gameShort: 'PKMN',
      rarity: 'Secret Rare',
      price: '$124.99',
      trend: '+22.1%',
      image: 'https://images.pokemontcg.io/swsh7/215_hires.png',
      set: 'Evolving Skies',
      condition: 'Near Mint'
    }
  ],
  
  magic: [
    {
      id: 'mtg-001',
      name: 'Ragavan, Nimble Pilferer',
      game: 'Magic',
      gameShort: 'MTG',
      rarity: 'Mythic Rare',
      price: '$78.99',
      trend: '+5.7%',
      image: 'https://cards.scryfall.io/large/front/a/9/a9738cda-adb1-47fb-9f4c-ecd930228c4d.jpg',
      set: 'Modern Horizons 2',
      condition: 'Near Mint'
    },
    {
      id: 'mtg-002', 
      name: 'Teferi, Hero of Dominaria',
      game: 'Magic',
      gameShort: 'MTG',
      rarity: 'Mythic Rare',
      price: '$34.50',
      trend: '+3.1%',
      image: 'https://cards.scryfall.io/large/front/5/d/5d10b752-d9cb-419d-a5c4-d4ee1acb655e.jpg',
      set: 'Dominaria',
      condition: 'Near Mint'
    },
    {
      id: 'mtg-003',
      name: 'The One Ring',
      game: 'Magic',
      gameShort: 'MTG',
      rarity: 'Mythic Rare',
      price: '$156.75',
      trend: '+18.9%',
      image: 'https://via.placeholder.com/300x420/8B4513/FFD700?text=The+One+Ring+MTG',
      set: 'The Lord of the Rings',
      condition: 'Near Mint'
    }
  ],
  
  yugioh: [
    {
      id: 'ygo-001',
      name: 'Blue-Eyes White Dragon',
      game: 'Yu-Gi-Oh',
      gameShort: 'YGO',
      rarity: 'Ultra Rare',
      price: '$29.99',
      trend: '+7.2%',
      image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
      set: 'LOB',
      condition: 'Near Mint'
    },
    {
      id: 'ygo-002',
      name: 'Dark Magician',
      game: 'Yu-Gi-Oh',
      gameShort: 'YGO',
      rarity: 'Ultra Rare',
      price: '$22.50',
      trend: '+4.8%',
      image: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
      set: 'LOB',
      condition: 'Near Mint'
    },
    {
      id: 'ygo-003',
      name: 'Exodia the Forbidden One',
      game: 'Yu-Gi-Oh',
      gameShort: 'YGO',
      rarity: 'Ultra Rare',
      price: '$45.75',
      trend: '+11.3%',
      image: 'https://images.ygoprodeck.com/images/cards/33396948.jpg',
      set: 'LOB',
      condition: 'Near Mint'
    }
  ],
  
  onepiece: [
    {
      id: 'op-001',
      name: 'Monkey D. Luffy',
      game: 'One Piece',
      gameShort: 'OP',
      rarity: 'Super Rare',
      price: '$19.99',
      trend: '+9.4%',
      image: 'https://en.onepiece-cardgame.com/images/cardlist/card/OP01-024.png',
      set: 'Romance Dawn',
      condition: 'Near Mint'
    },
    {
      id: 'op-002',
      name: 'Roronoa Zoro',
      game: 'One Piece',
      gameShort: 'OP',
      rarity: 'Super Rare',
      price: '$16.50',
      trend: '+6.2%',
      image: 'https://en.onepiece-cardgame.com/images/cardlist/card/OP01-001.png',
      set: 'Romance Dawn',
      condition: 'Near Mint'
    }
  ],
  
  dragonball: [
    {
      id: 'dbz-001',
      name: 'Son Goku',
      game: 'Dragon Ball Fusion',
      gameShort: 'DBZ',
      rarity: 'Super Rare',
      price: '$24.99',
      trend: '+13.7%',
      image: 'https://via.placeholder.com/300x420/FFD700/000000?text=Son+Goku+DBZ',
      set: 'Galactic Battle',
      condition: 'Near Mint'
    },
    {
      id: 'dbz-002',
      name: 'Vegeta',
      game: 'Dragon Ball Fusion',
      gameShort: 'DBZ',
      rarity: 'Super Rare',
      price: '$21.75',
      trend: '+8.9%',
      image: 'https://via.placeholder.com/300x420/FF6347/FFFFFF?text=Vegeta+DBZ',
      set: 'Galactic Battle',
      condition: 'Near Mint'
    }
  ],
  
  digimon: [
    {
      id: 'dig-001',
      name: 'WarGreymon',
      game: 'Digimon',
      gameShort: 'DIG',
      rarity: 'Secret Rare',
      price: '$35.99',
      trend: '+14.5%',
      image: 'https://images.digimoncard.io/images/cards/BT1-011.jpg',
      set: 'Release Special',
      condition: 'Near Mint'
    },
    {
      id: 'dig-002',
      name: 'MetalGarurumon',
      game: 'Digimon',
      gameShort: 'DIG',
      rarity: 'Secret Rare',
      price: '$32.50',
      trend: '+10.2%',
      image: 'https://images.digimoncard.io/images/cards/BT1-009.jpg',
      set: 'Release Special',
      condition: 'Near Mint'
    }
  ],
  
  gundam: [
    {
      id: 'gun-001',
      name: 'RX-78-2 Gundam',
      game: 'Gundam',
      gameShort: 'GUN',
      rarity: 'Rare',
      price: '$18.99',
      trend: '+7.1%',
      image: 'https://www.gundam-gcg.com/images/cards/GU-01_01-001.jpg',
      set: 'Operation V',
      condition: 'Near Mint'
    }
  ],
  
  unionarena: [
    {
      id: 'ua-001',
      name: 'Hunter x Hunter Gon',
      game: 'Union Arena',
      gameShort: 'UA',
      rarity: 'Super Rare',
      price: '$26.99',
      trend: '+12.8%',
      image: 'https://www.unionarena-tcg.com/images/cards/UA25BT-HXH-1-001-RR_sample.png',
      set: 'Hunter x Hunter',
      condition: 'Near Mint'
    }
  ],
  
  starwars: [
    {
      id: 'sw-001',
      name: 'Luke Skywalker',
      game: 'Star Wars',
      gameShort: 'SW',
      rarity: 'Legendary',
      price: '$42.99',
      trend: '+16.3%',
      image: 'https://cdn.starwarsunlimited.com/images/cards/SOR_001_EN.png',
      set: 'Spark of Rebellion',
      condition: 'Near Mint'
    }
  ]
};

// Featured cards for carousel - high value showcase cards
export const featuredCards = [
  {
    id: 'featured-001',
    name: 'Charizard Base Set 1st Edition',
    price: 15000,
    rarity: 'Holo Rare',
    set: 'Base Set',
    image: 'https://images.pokemontcg.io/base1/4_hires.png'
  },
  {
    id: 'featured-002',
    name: 'Black Lotus Alpha',
    price: 28000,
    rarity: 'Rare',
    set: 'Alpha',
    image: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg'
  },
  {
    id: 'featured-003',
    name: 'Blue-Eyes White Dragon LOB 1st Ed',
    price: 8500,
    rarity: 'Ultra Rare',
    set: 'LOB',
    image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg'
  },
  {
    id: 'featured-004',
    name: 'Pikachu Illustrator Promo',
    price: 42000,
    rarity: 'Promo',
    set: 'Promo',
    image: 'https://images.pokemontcg.io/base1/25_hires.png'
  },
  {
    id: 'featured-005',
    name: 'The One Ring Serialized',
    price: 85000,
    rarity: 'Mythic Rare',
    set: 'The Lord of the Rings',
    image: 'https://cards.scryfall.io/large/front/7/f/7f1ebbe5-f1f2-3e79-bee7-5fb92a68a79f.jpg'
  },
  {
    id: 'featured-006',
    name: 'Shadowless Charizard',
    price: 18500,
    rarity: 'Holo Rare',
    set: 'Base Set Shadowless',
    image: 'https://images.pokemontcg.io/base1/4_hires.png'
  }
];

export class StaticCardDataService {
  private usedCardIds = new Set<string>();
  
  // Get diverse cards from different games without repetition
  getRandomCards(limit: number = 8): StaticCard[] {
    const allCards = Object.values(staticCardPools).flat();
    
    // Reset if we've used too many cards
    if (this.usedCardIds.size >= allCards.length * 0.8) {
      this.usedCardIds.clear();
    }
    
    // Filter out recently used cards
    const availableCards = allCards.filter(card => !this.usedCardIds.has(card.id));
    
    // Shuffle and select cards
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);
    
    // Track used cards
    selected.forEach(card => this.usedCardIds.add(card.id));
    
    return selected;
  }
  
  // Get cards for a specific game
  getGameCards(game: string, limit: number = 4): StaticCard[] {
    const gameKey = game.toLowerCase().replace(/[^a-z]/g, '');
    const cards = staticCardPools[gameKey as keyof typeof staticCardPools] || [];
    return [...cards].sort(() => Math.random() - 0.5).slice(0, limit);
  }
  
  // Get featured cards for carousel
  getFeaturedCards() {
    return [
      {
        id: 'featured-001',
        name: 'Charizard Base Set 1st Edition',
        game: 'pokemon',
        price: 15000,
        rarity: 'Holo Rare',
        set: 'Base Set',
        image: 'https://images.pokemontcg.io/base1/4_hires.png'
      },
      {
        id: 'featured-002',
        name: 'Black Lotus Alpha',
        game: 'magic',
        price: 28000,
        rarity: 'Rare',
        set: 'Alpha',
        image: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg'
      },
      {
        id: 'featured-003',
        name: 'Blue-Eyes White Dragon LOB 1st Ed',
        game: 'yu-gi-oh',
        price: 8500,
        rarity: 'Ultra Rare',
        set: 'LOB',
        image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg'
      },
      {
        id: 'featured-004',
        name: 'Pikachu Illustrator Promo',
        game: 'pokemon',
        price: 42000,
        rarity: 'Promo',
        set: 'Promo',
        image: 'https://images.pokemontcg.io/base1/25_hires.png'
      },
      {
        id: 'featured-005',
        name: 'The One Ring Serialized',
        game: 'magic',
        price: 85000,
        rarity: 'Mythic Rare',
        set: 'The Lord of the Rings',
        image: 'https://images.ygoprodeck.com/images/cards/46986414.jpg'
      },
      {
        id: 'featured-006',
        name: 'Shadowless Charizard',
        game: 'pokemon',
        price: 18500,
        rarity: 'Holo Rare',
        set: 'Base Set Shadowless',
        image: 'https://images.pokemontcg.io/base1/4_hires.png'
      }
    ];
  }
}

export const staticCardDataService = new StaticCardDataService();