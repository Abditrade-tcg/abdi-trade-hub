"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { useCards } from "@/hooks/useCards";

const PopularCards = () => {
  const { cards, loading, error, refetch } = useCards({ 
    limit: 8, 
    autoRefresh: true,
    refreshInterval: 60000 // Refresh every minute
  });
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
            Explore cards from One Piece, Dragon Ball, Digimon, Union Arena, Gundam, Star Wars, and Riftbound
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
              className="group overflow-hidden bg-card border-border hover:border-primary/50 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/40 hover:ring-2 hover:ring-yellow-400/30 transition-all duration-300 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={card.image || 'https://images.unsplash.com/photo-1606665028317-2b60f23a8cf7?w=500&q=80'}
                  alt={card.name}
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback image on error
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1606665028317-2b60f23a8cf7?w=500&q=80';
                  }}
                />
                {/* Game Identifier Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg">
                  {card.gameShort}
                </div>
                <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-accent font-semibold">{card.trend}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-muted-foreground">{card.game}</div>
                  <div className="text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    {card.rarity}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1" title={card.name}>
                  {card.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{card.price}</span>
                  <Button size="sm" variant="ghost" className="text-xs hover:bg-yellow-400/10 hover:text-yellow-600 transition-colors">
                    View Details
                  </Button>
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
