import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp } from "lucide-react";

const cards = [
  {
    name: "Monkey D. Luffy",
    game: "One Piece",
    price: "$85.00",
    trend: "+15%",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80",
  },
  {
    name: "Son Goku Ultra Instinct",
    game: "Dragon Ball",
    price: "$120.00",
    trend: "+22%",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&q=80",
  },
  {
    name: "Omnimon Alter-S",
    game: "Digimon",
    price: "$95.00",
    trend: "+8%",
    image: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=500&q=80",
  },
  {
    name: "Gundam Aerial",
    game: "Gundam",
    price: "$65.00",
    trend: "+12%",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80",
  },
  {
    name: "Darth Vader",
    game: "Star Wars",
    price: "$145.00",
    trend: "+18%",
    image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=500&q=80",
  },
  {
    name: "Yasuo Secret Rare",
    game: "Riftbound (League of Legends)",
    price: "$175.00",
    trend: "+25%",
    image: "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=500&q=80",
  },
  {
    name: "Trafalgar Law",
    game: "One Piece",
    price: "$78.00",
    trend: "+10%",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80",
  },
  {
    name: "Agumon Bond",
    game: "Digimon",
    price: "$55.00",
    trend: "+6%",
    image: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=500&q=80",
  },
];

const PopularCards = () => {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_hsl(263,70%,50%,0.2)] animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-accent font-semibold">{card.trend}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{card.game}</div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{card.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{card.price}</span>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            View All Cards
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularCards;
