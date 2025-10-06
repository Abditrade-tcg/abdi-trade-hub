import { ShoppingCart, Users, Gavel, Shield, TrendingUp, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: ShoppingCart,
    title: "Buy & Sell",
    description: "List your cards for sale or browse thousands of listings. Secure transactions guaranteed.",
  },
  {
    icon: Users,
    title: "Social Trading",
    description: "Connect with fellow collectors, share your collection, and build your trading network.",
  },
  {
    icon: Gavel,
    title: "Live Auctions",
    description: "Participate in exciting auctions for rare and valuable cards. Place bids in real-time.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Every transaction is protected with buyer and seller guarantees for peace of mind.",
  },
  {
    icon: TrendingUp,
    title: "Price Tracking",
    description: "Track card values with real-time market data and price history charts.",
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging",
    description: "Negotiate trades and communicate directly with other collectors safely.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[hsl(221,83%,32%)] to-[hsl(45,93%,47%)] bg-clip-text text-transparent">
              Trade Cards
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete marketplace built for collectors, by collectors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(263,70%,50%,0.2)] group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
