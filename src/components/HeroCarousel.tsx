"use client";

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

const featuredCards = [
  {
    name: "Monkey D. Luffy",
    game: "One Piece",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80",
    rarity: "Secret Rare",
  },
  {
    name: "Son Goku",
    game: "Dragon Ball Fusion",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&q=80",
    rarity: "Ultra Rare",
  },
  {
    name: "Agumon",
    game: "Digimon",
    image: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=500&q=80",
    rarity: "Rare",
  },
  {
    name: "Darth Vader",
    game: "Star Wars",
    image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=500&q=80",
    rarity: "Legendary",
  },
  {
    name: "Gundam Aerial",
    game: "Gundam",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80",
    rarity: "Special Rare",
  },
  {
    name: "Yasuo",
    game: "Riftbound",
    image: "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=500&q=80",
    rarity: "Mythic",
  },
];

export const HeroCarousel = () => {
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
        {featuredCards.map((card, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative aspect-[2/3] w-full max-h-[500px]">
                  <Image
                    src={card.image}
                    alt={`${card.name} from ${card.game}`}
                    width={400}
                    height={600}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{card.game}</p>
                      <h3 className="text-lg font-bold text-foreground">{card.name}</h3>
                      <p className="text-sm text-accent">{card.rarity}</p>
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
