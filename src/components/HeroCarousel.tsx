"use client";

import { Card } from "@/components/ui/card";
import CardImage from "./CardImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CanonicalCard } from "@/types";

export const HeroCarousel = () => {
  // Hardcoded featured cards - one from each game
  const cards: CanonicalCard[] = [
    {
      id: 'hero-001',
      name: 'Charizard ex',
      game: 'pokemon',
      price: 4599,
      rarity: 'Ultra Rare',
      image: 'https://images.pokemontcg.io/base1/4_hires.png',
      condition: 'mint'
    },
    {
      id: 'hero-002',
      name: 'Black Lotus',
      game: 'magic',
      price: 28000,
      rarity: 'Rare',
      image: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
      condition: 'mint'
    },
    {
      id: 'hero-003',
      name: 'Blue-Eyes White Dragon',
      game: 'yu-gi-oh',
      price: 8500,
      rarity: 'Ultra Rare',
      image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
      condition: 'mint'
    },
    {
      id: 'hero-004',
      name: 'Monkey D. Luffy',
      game: 'one_piece',
      price: 3499,
      rarity: 'Secret Rare',
      image: 'https://limitlesstcg.nyc3.digitaloceanspaces.com/one-piece/OP01/OP01-003_p1_EN.webp',
      condition: 'mint'
    },
    {
      id: 'hero-005',
      name: 'Son Goku',
      game: 'dragon_ball_fusion',
      price: 2999,
      rarity: 'Super Rare',
      image: 'https://images.pokemontcg.io/base1/4_hires.png', // Placeholder - Dragon Ball images not publicly available
      condition: 'mint'
    },
    {
      id: 'hero-006',
      name: 'Omnimon',
      game: 'digimon',
      price: 4599,
      rarity: 'Secret Rare',
      image: 'https://images.digimoncard.io/images/cards/BT1-084.jpg',
      condition: 'mint'
    },
    {
      id: 'hero-007',
      name: 'Himeno',
      game: 'union_arena',
      price: 1999,
      rarity: 'Special Rare',
      image: 'https://images.pokemontcg.io/base1/4_hires.png', // Placeholder - Union Arena images not publicly available
      condition: 'mint'
    },
    {
      id: 'hero-008',
      name: 'RX-78-2 Gundam',
      game: 'gundam',
      price: 3299,
      rarity: 'Special Rare',
      image: 'https://images.pokemontcg.io/base1/4_hires.png', // Placeholder - Gundam images not publicly available
      condition: 'mint'
    },
    {
      id: 'hero-009',
      name: 'Darth Vader',
      game: 'star_wars',
      price: 5999,
      rarity: 'Legendary',
      image: 'https://images.pokemontcg.io/base1/4_hires.png', // Placeholder - Star Wars images not publicly available via S3
      condition: 'mint'
    },
    {
      id: 'hero-010',
      name: 'Pikachu VMAX',
      game: 'pokemon',
      price: 8950,
      rarity: 'Secret Rare',
      image: 'https://images.pokemontcg.io/swsh4/188_hires.png',
      condition: 'mint'
    }
  ];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full max-w-lg mx-auto"
    >
      <CarouselContent>
        {cards.map((card) => (
          <CarouselItem key={card.id}>
            <div className="p-1">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative aspect-[2/3] w-full max-h-[500px]">
                  {card.image && card.image !== '' ? (
                    <CardImage
                      src={card.image}
                      alt={`${card.name} from ${card.game}`}
                      width={400}
                      height={600}
                      className="w-full h-full object-contain p-4"
                      priority={true}
                      game={card.game}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center p-4">
                      <div className="text-center text-muted-foreground">
                        <div className="text-4xl mb-2">🎴</div>
                        <p className="text-sm">Card Image</p>
                        <p className="text-xs mt-1 opacity-75">{card.name}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground capitalize">{card.game?.replace('_', ' ')}</p>
                      <h3 className="text-lg font-bold text-foreground">{card.name}</h3>
                      <p className="text-sm text-accent">{card.rarity || 'Common'}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
