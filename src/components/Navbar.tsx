import { Button } from "@/components/ui/button";
import { Menu, Search, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(38,92%,50%)] bg-clip-text text-transparent">
              AbdiTrade
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Browse</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Auctions</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Community</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Pricing</a>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost">Sign In</Button>
            <Button variant="accent">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Browse</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Auctions</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Community</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Pricing</a>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="flex-1">Sign In</Button>
                <Button variant="accent" className="flex-1">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
