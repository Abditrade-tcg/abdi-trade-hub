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
    image: "https://en.onepiece-cardgame.com/images/cardlist/card/OP03-070.png",
    rarity: "Secret Rare",
  },
  {
    name: "Son Goku",
    game: "Dragon Ball Fusion",
    image: "https://www.dbs-cardgame.com/fw/images/cards/card/en/FB01-001_f.webp",
    rarity: "Ultra Rare",
  },
  {
    name: "Agumon",
    game: "Digimon",
    image: "https://world.digimoncard.com/images/cardlist/card/ST7-09.png",
    rarity: "Rare",
  },
  {
    name: "Darth Vader",
    game: "Star Wars",
    image: "https://cdn.starwarsunlimited.com//card_04010006_EN_Darth_Vader_Leader_dacc2c03a2.png",
    rarity: "Legendary",
  },
  {
    name: "Gundam Aerial",
    game: "Gundam",
    image: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001.webp",
    rarity: "Special Rare",
  },
  {
    name: "Yasuo",
    game: "Riftbound",
    image: "https://tcgplayer-cdn.tcgplayer.com/product/653136_400w.jpg",
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
                  <img
                    src={card.image}
                    alt={`${card.name} from ${card.game}`}
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
