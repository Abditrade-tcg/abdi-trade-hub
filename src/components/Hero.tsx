import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import heroImage from "@/assets/hero-cards.jpg";

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
              <span className="text-sm text-muted-foreground">Secure Trading Platform</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Trade Your{" "}
              <span className="bg-gradient-to-r from-[hsl(221,83%,32%)] to-[hsl(221,83%,50%)] bg-clip-text text-transparent">
                Favorite Cards
              </span>{" "}
              Securely
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Join the ultimate marketplace for trading card enthusiasts. Buy, sell, and trade with confidence while connecting with a vibrant community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" variant="accent" className="group">
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Browse Cards
              </Button>
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

          {/* Right Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl" />
            <img
              src={heroImage}
              alt="Premium trading cards showcase"
              className="relative rounded-2xl shadow-[0_0_80px_hsl(263,70%,50%,0.3)] w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
