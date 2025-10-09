import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { HeroCarousel } from "./HeroCarousel";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Discover New Trading Card Games</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Explore Cards from{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Top TCG Games
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Browse and collect from One Piece, Dragon Ball, Digimon, Union Arena, Gundam, Star Wars, and Riftbound (League of Legends). Buy, sell, and trade with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/auth">
                <Button size="lg" variant="accent" className="group">
                  Start Trading
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline">
                  Browse Cards
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">200K+</div>
                <div className="text-sm text-muted-foreground">Cards Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">$2M+</div>
                <div className="text-sm text-muted-foreground">Monthly Volume</div>
              </div>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl" />
            <div className="relative">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
