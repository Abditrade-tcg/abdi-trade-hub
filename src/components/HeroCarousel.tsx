"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { backendAPIService } from "@/services/backendAPIService";
import { cardDataService } from "@/services/cardDataService";
import { CanonicalCard } from "@/types";
import { isFeatureEnabled } from "@/config";

export const HeroCarousel = () => {
  const [cards, setCards] = useState<CanonicalCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCards = async () => {
      try {
        console.log('🎯 Loading featured cards from backend API (with S3 cached images)');
        
        // Use backend API which has S3 caching and proper CORS
        const trendingCards = await backendAPIService.getTrendingCards(6);
        
        if (trendingCards.length > 0) {
          setCards(trendingCards);
        } else {
          // Use mock data with actual card images from public URLs (temporary solution)
          console.log('🔄 Using fallback mock cards with images');
          setCards([
            {
              id: '1',
              name: 'Charizard',
              game: 'pokemon',
              price: 299.99,
              image: 'https://images.pokemontcg.io/base1/4_hires.png',
              condition: 'mint',
              rarity: 'Holo Rare'
            },
            {
              id: '2', 
              name: 'Black Lotus',
              game: 'magic',
              price: 1899.99,
              image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
              condition: 'near-mint',
              rarity: 'Mythic Rare'
            },
            {
              id: '3',
              name: 'Blue-Eyes White Dragon',
              game: 'yu-gi-oh',
              price: 189.99,
              image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
              condition: 'mint',
              rarity: 'Ultra Rare'
            },
            {
              id: '4',
              name: 'Monkey D. Luffy',
              game: 'one_piece',
              price: 249.99,
              image: 'https://limitlesstcg.nyc3.digitaloceanspaces.com/one-piece/OP01/EN/OP01-003.png',
              condition: 'mint',
              rarity: 'Secret Rare'
            },
            {
              id: '5',
              name: 'Vegeta',
              game: 'dragon_ball_fusion',
              price: 179.99,
              image: 'https://www.dbs-cardgame.com/us-en/cardlist/images/series1/BT1-111.png',
              condition: 'near-mint',
              rarity: 'Super Rare'
            },
            {
              id: '6',
              name: 'Agumon',
              game: 'digimon',
              price: 89.99,
              image: 'https://images.digimoncard.io/images/cards/BT1-010.jpg',
              condition: 'mint',
              rarity: 'Rare'
            }
          ]);
        }
      } catch (error) {
        console.error('❌ Failed to load featured cards:', error);
        // Use fallback mock data with images
        setCards([
          {
            id: '1',
            name: 'Charizard',
            game: 'pokemon',
            price: 299.99,
            image: 'https://images.pokemontcg.io/base1/4_hires.png',
            condition: 'mint',
            rarity: 'Holo Rare'
          },
          {
            id: '2',
            name: 'Black Lotus',
            game: 'magic',
            price: 1899.99,
            image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
            condition: 'near-mint',
            rarity: 'Mythic Rare'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCards();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-lg mx-auto flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No cards available</p>
      </div>
    );
  }

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
                    <Image
                      src={card.image}
                      alt={`${card.name} from ${card.game}`}
                      width={400}
                      height={600}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center p-4">
                      <div className="text-center text-muted-foreground">
                        <div className="text-4xl mb-2">🎴</div>
                        <p className="text-sm">Card Image</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground capitalize">{card.game?.replace('_', ' ')}</p>
                      <h3 className="text-lg font-bold text-foreground">{card.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-accent">{card.rarity || 'Common'}</p>
                        <p className="text-sm font-semibold text-white border border-white/30 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md">${card.price}</p>
                      </div>
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
