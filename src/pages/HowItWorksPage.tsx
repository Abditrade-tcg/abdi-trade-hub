import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ShoppingCart, 
  Package, 
  Star, 
  Upload, 
  DollarSign, 
  Truck, 
  ArrowLeftRight,
  Shield,
  Users,
  TrendingUp,
  MessageSquare,
  CheckCircle
} from "lucide-react";

const HowItWorksPage = () => {
  const buyingSteps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Search our vast marketplace of verified trading cards. Use filters to find exactly what you're looking for by game, set, rarity, condition, and price.",
    },
    {
      icon: ShoppingCart,
      title: "Secure Checkout",
      description: "Add items to your cart and checkout securely with Stripe. Your payment is protected and held until you confirm receipt of your cards.",
    },
    {
      icon: Package,
      title: "Fast Shipping",
      description: "Sellers ship your cards quickly with tracking. Most orders arrive within 3-5 business days with careful packaging.",
    },
    {
      icon: Star,
      title: "Confirm & Review",
      description: "Once you receive your cards, confirm the order and leave feedback. Your payment is then released to the seller.",
    },
  ];

  const sellingSteps = [
    {
      icon: Upload,
      title: "Create Listing",
      description: "Upload high-quality photos and detailed descriptions of your cards. Include condition, grading, and any relevant details.",
    },
    {
      icon: DollarSign,
      title: "Set Your Price",
      description: "Price your cards competitively. Our platform shows market trends to help you price fairly and sell faster.",
    },
    {
      icon: Truck,
      title: "Ship Securely",
      description: "When a buyer purchases your card, you'll be notified immediately. Print your shipping label and send it out promptly.",
    },
    {
      icon: CheckCircle,
      title: "Get Paid",
      description: "Once the buyer confirms receipt, your payment is released. Funds are deposited directly to your connected account.",
    },
  ];

  const tradingSteps = [
    {
      icon: Users,
      title: "Connect with Traders",
      description: "Browse collections and connect with other collectors. Join guilds to find trading partners with similar interests.",
    },
    {
      icon: ArrowLeftRight,
      title: "Propose Trades",
      description: "Select cards from your collection and the other trader's collection. Add cash compensation if needed to balance the trade.",
    },
    {
      icon: MessageSquare,
      title: "Negotiate",
      description: "Chat directly with your trading partner. Make counter-offers until you both agree on fair terms.",
    },
    {
      icon: Shield,
      title: "Secure Exchange",
      description: "Optional verification service ensures both parties ship as agreed. Trade protection keeps everyone safe.",
    },
  ];

  const protectionFeatures = [
    {
      icon: Shield,
      title: "Payment Protection",
      description: "Your payment is held securely until you confirm receipt and satisfaction with your purchase.",
    },
    {
      icon: CheckCircle,
      title: "Verification Service",
      description: "Optional professional verification ensures cards are authentic and as described before finalizing transactions.",
    },
    {
      icon: MessageSquare,
      title: "Dispute Resolution",
      description: "Our Trust & Safety team handles disputes fairly and quickly, protecting both buyers and sellers.",
    },
    {
      icon: TrendingUp,
      title: "Transparent Fees",
      description: "Clear 13% platform fee plus optional verification. No hidden charges or surprise costs.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">How AbdiTrade Works</h1>
            <p className="text-xl text-muted-foreground">
              The trusted marketplace for buying, selling, and trading collectible cards. 
              Safe, simple, and built for collectors.
            </p>
          </div>
        </section>

        {/* Buying Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Buying Cards</h2>
            <p className="text-lg text-muted-foreground">Find and purchase cards from verified sellers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyingSteps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5">
                  {index + 1}
                </div>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/browse">
              <Button size="lg" className="gap-2">
                <Search className="h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </section>

        {/* Selling Section */}
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Selling Cards</h2>
              <p className="text-lg text-muted-foreground">Turn your collection into cash</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellingSteps.map((step, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-accent/5">
                    {index + 1}
                  </div>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <step.icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/sell/onboarding">
                <Button size="lg" variant="accent" className="gap-2">
                  <Upload className="h-5 w-5" />
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trading Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trading Cards</h2>
            <p className="text-lg text-muted-foreground">Connect with collectors and make fair trades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradingSteps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5">
                  {index + 1}
                </div>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/guilds">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Join Trading Communities
              </Button>
            </Link>
          </div>
        </section>

        {/* Protection Features */}
        <section className="bg-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Payment Protection</h2>
              <p className="text-lg text-muted-foreground">
                Every transaction is protected. Your security is our priority.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {protectionFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="pt-6">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of collectors buying, selling, and trading on the most trusted platform for trading cards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="gap-2">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="outline" className="gap-2">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;

