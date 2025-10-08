'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { isFeatureEnabled } from '@/config/environmentManager';
import { backendAPIService } from '@/services/backendAPIService';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

interface FeaturedCard {
  id: string;
  name: string;
  price: number;
  image?: string;
  rarity?: string;
  set?: string;
}

export function HeroCarousel() {
  const [featuredCards, setFeaturedCards] = useState<FeaturedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const loadFeaturedCards = async () => {
      try {
        if (isFeatureEnabled('enableBackendAPI')) {
          // Load real featured cards from backend API
          const cards = await backendAPIService.searchCards({
            sort: { field: 'popularity', order: 'desc' },
            limit: 6
          });
          
          if (cards && cards.length > 0) {
            setFeaturedCards(cards.map(card => ({
              id: card.id,
              name: card.name,
              price: card.price || 0,
              image: card.image,
              rarity: card.rarity,
              set: card.set
            })));
          } else {
            // Use fallback if no cards returned
            setFallbackCards();
          }
        } else {
          // Use fallback for development
          setFallbackCards();
        }
      } catch (error) {
        console.error('Error loading featured cards:', error);
        setFallbackCards();
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCards();
  }, []);

  const setFallbackCards = () => {
    setFeaturedCards([
      {
        id: '1',
        name: 'Black Lotus',
        price: 25000,
        rarity: 'Rare',
        set: 'Alpha',
        image: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg'
      },
      {
        id: '2', 
        name: 'Charizard Base Set',
        price: 15000,
        rarity: 'Holo Rare',
        set: 'Base Set',
        image: 'https://images.pokemontcg.io/base1/4_hires.png'
      },
      {
        id: '3',
        name: 'Blue-Eyes White Dragon',
        price: 8000,
        rarity: 'Ultra Rare',
        set: 'LOB',
        image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg'
      },
      {
        id: '4',
        name: 'Pikachu Illustrator',
        price: 35000,
        rarity: 'Promo',
        set: 'Promo',
        image: 'https://images.pokemontcg.io/promo/39_hires.png'
      },
      {
        id: '5',
        name: 'Time Walk',
        price: 12000,
        rarity: 'Rare',
        set: 'Alpha',
        image: 'https://cards.scryfall.io/large/front/7/0/70901356-3266-4bd9-aacc-f06c27271de5.jpg'
      },
      {
        id: '6',
        name: 'Shadowless Charizard',
        price: 18000,
        rarity: 'Holo Rare',
        set: 'Base Set',
        image: 'https://images.pokemontcg.io/base1/4_hires.png'
      }
    ]);
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="bg-muted h-80 rounded-lg mb-4" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Carousel 
        className="w-full"
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: true,
          }),
        ]}
        setApi={setApi}
      >
        <CarouselContent>
          {featuredCards.map((card) => (
            <CarouselItem key={card.id}>
              <div className="relative group">
                {/* Card Image Background */}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                  {card.image ? (
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 ${card.image ? 'hidden' : ''}`}>
                    <div className="flex items-center justify-center h-full text-center p-4">
                      <div>
                        <div className="text-2xl font-bold text-white mb-2">{card.name}</div>
                        <div className="text-sm text-white/80">{card.set}</div>
                        <div className="text-lg font-bold text-white mt-4">${card.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glass overlay for card info */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/20 backdrop-blur-md border-t border-white/10">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-lg mb-1 truncate">{card.name}</h3>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-yellow-400">{card.rarity}</span>
                        <span className="text-white/80">{card.set}</span>
                      </div>
                      <div className="text-xl font-bold text-green-400 mb-3">
                        ${card.price.toLocaleString()}
                      </div>
                      <Button 
                        size="sm"
                        className="w-full bg-primary/80 hover:bg-primary backdrop-blur-sm transition-all duration-300 hover:scale-105 border-white/20"
                        asChild
                      >
                        <Link href={`/marketplace/card/${card.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}