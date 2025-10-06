import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-20 animate-float" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent rounded-full blur-[100px] opacity-20 animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Start{" "}
            <span className="bg-gradient-to-r from-[hsl(263,70%,50%)] via-[hsl(280,65%,45%)] to-[hsl(38,92%,50%)] bg-clip-text text-transparent">
              Trading?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of collectors who trust AbdiTrade for their trading card needs. Create your account today and discover your next favorite card.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="accent" className="group text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free to join • Start trading instantly
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
