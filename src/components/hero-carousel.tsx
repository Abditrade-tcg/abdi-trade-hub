'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { isFeatureEnabled } from '@/config/environmentManager';
import Link from 'next/link';

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

  useEffect(() => {
    const loadFeaturedCards = async () => {
      try {
        if (isFeatureEnabled('enableBackendAPI')) {
          // TODO: Load real featured cards from backend API
          // For now, use enhanced fallback data
          setFeaturedCards([
            {
              id: '1',
              name: 'Black Lotus',
              price: 25000,
              image: '/placeholder-card.jpg',
              rarity: 'Rare',
              set: 'Alpha'
            },
            {
              id: '2', 
              name: 'Charizard Base Set',
              price: 15000,
              image: '/placeholder-card.jpg',
              rarity: 'Holo Rare',
              set: 'Base Set'
            },
            {
              id: '3',
              name: 'Blue-Eyes White Dragon',
              price: 8000,
              image: '/placeholder-card.jpg',
              rarity: 'Ultra Rare',
              set: 'LOB'
            },
            {
              id: '4',
              name: 'Pikachu Illustrator',
              price: 35000,
              image: '/placeholder-card.jpg',
              rarity: 'Promo',
              set: 'Promo'
            },
            {
              id: '5',
              name: 'Time Walk',
              price: 12000,
              image: '/placeholder-card.jpg',
              rarity: 'Rare',
              set: 'Alpha'
            },
            {
              id: '6',
              name: 'Shadowless Charizard',
              price: 18000,
              image: '/placeholder-card.jpg',
              rarity: 'Holo Rare',
              set: 'Base Set'
            }
          ]);
        } else {
          // Fallback featured cards for development
          setFeaturedCards([
            {
              id: '1',
              name: 'Black Lotus',
              price: 25000,
              image: '/placeholder-card.jpg',
              rarity: 'Rare',
              set: 'Alpha'
            },
            {
              id: '2', 
              name: 'Charizard Base Set',
              price: 15000,
              image: '/placeholder-card.jpg',
              rarity: 'Holo Rare',
              set: 'Base Set'
            },
            {
              id: '3',
              name: 'Blue-Eyes White Dragon',
              price: 8000,
              image: '/placeholder-card.jpg',
              rarity: 'Ultra Rare',
              set: 'LOB'
            },
            {
              id: '4',
              name: 'Pikachu Illustrator',
              price: 35000,
              image: '/placeholder-card.jpg',
              rarity: 'Promo',
              set: 'Promo'
            },
            {
              id: '5',
              name: 'Time Walk',
              price: 12000,
              image: '/placeholder-card.jpg',
              rarity: 'Rare',
              set: 'Alpha'
            },
            {
              id: '6',
              name: 'Shadowless Charizard',
              price: 18000,
              image: '/placeholder-card.jpg',
              rarity: 'Holo Rare',
              set: 'Base Set'
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading featured cards:', error);
        // Use fallback data on error
        setFeaturedCards([
          {
            id: '1',
            name: 'Featured Card',
            price: 1000,
            image: '/placeholder-card.jpg',
            rarity: 'Rare',
            set: 'Premium'
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
      <Carousel className="w-full">
        <CarouselContent>
          {featuredCards.map((card) => (
            <CarouselItem key={card.id}>
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <CardContent className="p-6">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-card.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                        <div className="text-center p-4">
                          <div className="text-2xl font-bold text-primary mb-2">{card.name}</div>
                          <div className="text-sm text-muted-foreground">{card.set}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg truncate">{card.name}</h3>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{card.rarity}</span>
                      <span>{card.set}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${card.price.toLocaleString()}
                    </div>
                    <Button 
                      className="w-full mt-3 transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <Link href={`/marketplace/card/${card.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}