import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Star, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const Browse = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");

  const handleAddToCart = (listing: any) => {
    addToCart({
      id: listing.id,
      name: listing.name,
      price: listing.price,
      image: listing.image,
      seller: listing.seller,
      condition: listing.condition,
    });
  };

  const games = ["Pokemon", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece", "Digimon"];
  const conditions = ["Mint", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played"];
  const rarities = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare"];

  const mockListings = [
    {
      id: "1",
      name: "Charizard VMAX",
      set: "Darkness Ablaze",
      price: 299.99,
      condition: "Near Mint",
      rarity: "Secret Rare",
      seller: "CardMaster Pro",
      sellerRating: 4.9,
      image: "🔥",
      game: "Pokemon"
    },
    {
      id: "2",
      name: "Black Lotus",
      set: "Alpha",
      price: 15999.99,
      condition: "Lightly Played",
      rarity: "Rare",
      seller: "Vintage Collector",
      sellerRating: 5.0,
      image: "🌸",
      game: "Magic: The Gathering"
    },
    {
      id: "3",
      name: "Blue-Eyes White Dragon",
      set: "Legend of Blue Eyes",
      price: 450.00,
      condition: "Near Mint",
      rarity: "Ultra Rare",
      seller: "DuelMaster",
      sellerRating: 4.8,
      image: "🐉",
      game: "Yu-Gi-Oh!"
    },
    {
      id: "4",
      name: "Pikachu Illustrator",
      set: "Promo",
      price: 5000.00,
      condition: "Mint",
      rarity: "Promo",
      seller: "Elite Cards",
      sellerRating: 4.9,
      image: "⚡",
      game: "Pokemon"
    },
    {
      id: "5",
      name: "Mox Pearl",
      set: "Unlimited",
      price: 3200.00,
      condition: "Near Mint",
      rarity: "Rare",
      seller: "Power Nine Shop",
      sellerRating: 4.7,
      image: "💎",
      game: "Magic: The Gathering"
    },
    {
      id: "6",
      name: "Dark Magician",
      set: "Starter Deck",
      price: 125.00,
      condition: "Mint",
      rarity: "Ultra Rare",
      seller: "Magic Cards Plus",
      sellerRating: 4.6,
      image: "🔮",
      game: "Yu-Gi-Oh!"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Browse Marketplace</h1>
            <p className="text-muted-foreground">Discover thousands of verified trading cards from trusted sellers</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by card name, set, or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Listings</SheetTitle>
                  <SheetDescription>
                    Refine your search with advanced filters
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Price Range</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}+</span>
                    </div>
                  </div>

                  {/* Game */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Game</Label>
                    <div className="space-y-2">
                      {games.map((game) => (
                        <div key={game} className="flex items-center gap-2">
                          <Checkbox id={`game-${game}`} />
                          <Label htmlFor={`game-${game}`} className="cursor-pointer text-sm">
                            {game}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Condition</Label>
                    <div className="space-y-2">
                      {conditions.map((condition) => (
                        <div key={condition} className="flex items-center gap-2">
                          <Checkbox id={`condition-${condition}`} />
                          <Label htmlFor={`condition-${condition}`} className="cursor-pointer text-sm">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rarity */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Rarity</Label>
                    <div className="space-y-2">
                      {rarities.map((rarity) => (
                        <div key={rarity} className="flex items-center gap-2">
                          <Checkbox id={`rarity-${rarity}`} />
                          <Label htmlFor={`rarity-${rarity}`} className="cursor-pointer text-sm">
                            {rarity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seller Rating */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Minimum Seller Rating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any rating</SelectItem>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                        <SelectItem value="4.8">4.8+ stars</SelectItem>
                        <SelectItem value="4.9">4.9+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Display */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-2">
              <span>All Games</span>
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <span>${priceRange[0]} - ${priceRange[1]}</span>
            </Badge>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockListings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 hover:border-primary/30">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="aspect-[2.5/3.5] bg-gradient-to-br from-primary/5 to-accent/5 rounded-t-lg flex items-center justify-center text-6xl border-b border-border">
                      {listing.image}
                    </div>
                    
                    {/* Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {listing.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{listing.set}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{listing.condition}</Badge>
                        <Badge>{listing.rarity}</Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-2xl font-bold text-primary">${listing.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-accent fill-accent" />
                          <span className="font-medium">{listing.sellerRating}</span>
                        </div>
                        <p className="text-muted-foreground truncate">{listing.seller}</p>
                      </div>

                      <Button 
                        className="w-full gap-2" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(listing);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>

          {/* Empty State (hidden when results exist) */}
          {/* <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button>Clear Filters</Button>
            </CardContent>
          </Card> */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;

