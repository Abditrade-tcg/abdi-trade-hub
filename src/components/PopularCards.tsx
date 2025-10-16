"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { staticCardDataService } from "@/services/staticCardDataService";
import { DisplayCard } from "@/types/card";
import CardImage from "./CardImage";

const PopularCards = () => {
  const [cards, setCards] = useState<DisplayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaticCards = () => {
      try {
        console.log('🎯 PopularCards: Loading from static data service (instant performance)');
        
        // Get diverse cards from static service - instant loading!
        const staticCards = staticCardDataService.getRandomCards(8);
        
        // Convert to DisplayCard format
        const displayCards = staticCards.map(card => ({
          id: card.id,
          name: card.name,
          game: card.game,
          gameShort: card.gameShort,
          rarity: card.rarity,
          price: card.price,
          trend: card.trend,
          image: card.image,
          set: card.set,
          condition: card.condition
        }));
        
        console.log(`✅ PopularCards: Loaded ${displayCards.length} cards instantly from static data`);
        setCards(displayCards);
        setError(null);
      } catch (error) {
        console.error('❌ PopularCards: Failed to load static cards:', error);
        setError('Failed to load cards');
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    loadStaticCards();
  }, []);

  const refetch = () => {
    setLoading(true);
    const staticCards = staticCardDataService.getRandomCards(8);
    const displayCards = staticCards.map(card => ({
      id: card.id,
      name: card.name,
      game: card.game,
      gameShort: card.gameShort,
      rarity: card.rarity,
      price: card.price,
      trend: card.trend,
      image: card.image,
      set: card.set,
      condition: card.condition
    }));
    setCards(displayCards);
    setLoading(false);
  };
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-[hsl(45,93%,47%)] to-[hsl(45,93%,55%)] bg-clip-text text-transparent">
              Trading Cards
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore cards from Pokémon, Yu-Gi-Oh!, Magic: The Gathering, One Piece, Dragon Ball, Digimon, Union Arena, Gundam, and Star Wars
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center mb-8">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <p className="text-destructive mb-4">Failed to load cards: {error}</p>
              <Button 
                onClick={refetch} 
                variant="outline" 
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
              <span className="text-muted-foreground">Loading featured cards...</span>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[2/3] w-full">
                {card.image && card.image !== '' ? (
                  <CardImage
                    src={card.image}
                    alt={`${card.name} from ${card.game}`}
                    width={400}
                    height={600}
                    className="w-full h-full object-contain p-4"
                    game={card.game}
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
          ))}
        </div>

        {/* Actions */}
        <div className="text-center flex gap-4 justify-center">
          <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
            View All Cards
          </Button>
          <Button 
            onClick={refetch} 
            size="lg" 
            variant="ghost" 
            className="hover:bg-secondary transition-colors"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Cards
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularCards;
