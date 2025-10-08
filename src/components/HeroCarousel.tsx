"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
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
        console.log('🎯 Loading featured cards from API_TCG services');
        
        const allCards = [];
        
        // Fetch cards from different games using our API route (handles all games)
        const games = ['pokemon', 'yu-gi-oh', 'magic', 'one_piece', 'dragon_ball_fusion', 'digimon', 'gundam', 'union_arena', 'star_wars'] as const;
        
        // Randomly shuffle games and select 4 for variety (including traditional and modern games)
        const shuffledGames = [...games].sort(() => Math.random() - 0.5);
        
        for (const game of shuffledGames.slice(0, 4)) { // Randomly select 4 games for more variety
          try {
            const response = await fetch(`/api/cards?game=${game}&limit=5`);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch ${game} cards: ${response.status}`);
            }
            
            const data = await response.json();
            const cards = data.cards || [];
            
            // Randomly select 2 cards from the fetched cards
            const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
            allCards.push(...shuffledCards.slice(0, 2));
          } catch (error) {
            console.log(`❌ Failed to fetch ${game} cards:`, error);
          }
        }
        
        if (allCards.length > 0) {
          // Map to our expected format
          const formattedCards = allCards.map((card) => ({
            id: card.id,
            name: card.name,
            game: card.game,
            price: card.price, // Will be 0 from API_TCG, hidden by conditional display
            image: card.image || undefined,
            condition: 'mint' as const,
            rarity: card.rarity || 'Common'
          }));
          setCards(formattedCards);
        } else {
          setCards([]); // No cards available
        }
      } catch (error) {
        console.error('❌ Failed to load featured cards:', error);
        setCards([]);
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
                        {typeof card.price === 'number' && card.price > 0 && (
                          <p className="text-sm font-semibold text-white border border-white/30 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md">{formatPrice(card.price)}</p>
                        )}
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
