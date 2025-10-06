import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  ArrowLeftRight, 
  Star, 
  Shield, 
  TrendingUp, 
  Package,
  Flag,
  Heart,
  Share2,
  MapPin,
  Truck,
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import { CardDetailModal } from "@/components/modals/CardDetailModal";
import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { TradeModal } from "@/components/modals/TradeModal";

const ListingDetail = () => {
  const { id } = useParams();
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

  // Mock listing data
  const listing = {
    id: id || "1",
    name: "Charizard VMAX",
    set: "Darkness Ablaze",
    cardNumber: "20/189",
    price: 299.99,
    originalPrice: 349.99,
    condition: "Near Mint",
    rarity: "Secret Rare",
    grade: "PSA 9",
    printRun: "1st Edition",
    description: "This is a beautiful Charizard VMAX from the Darkness Ablaze set. The card is in excellent condition with sharp corners and perfect centering. This card has been professionally graded by PSA and received a grade of 9.",
    seller: {
      name: "CardMaster Pro",
      handle: "@cardmaster",
      rating: 4.9,
      totalSales: 1247,
      responseTime: "< 1 hour",
      verified: true,
    },
    shipping: {
      cost: 4.99,
      free: false,
      estimatedDays: "3-5 business days",
    },
    returns: {
      accepted: true,
      period: "30 days",
      condition: "Original condition, unopened package"
    },
    priceHistory: [
      { date: "Jan", price: 320 },
      { date: "Feb", price: 310 },
      { date: "Mar", price: 305 },
      { date: "Apr", price: 299 },
    ],
    images: ["🔥", "📸", "📸", "📸"],
    quantity: 1,
    location: "California, USA",
    game: "Pokemon"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/browse">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left: Images */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="aspect-[2.5/3.5] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center text-9xl cursor-pointer hover:scale-105 transition-transform">
                  {listing.images[0]}
                </div>
              </Card>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1).map((img, idx) => (
                  <Card key={idx} className="cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="aspect-square bg-gradient-to-br from-secondary/50 to-secondary/30 flex items-center justify-center text-2xl">
                      {img}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Title & Badges */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-4xl font-bold">{listing.name}</h1>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Flag className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-4">{listing.set} • #{listing.cardNumber}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">{listing.rarity}</Badge>
                  <Badge variant="outline">{listing.condition}</Badge>
                  {listing.grade && <Badge variant="secondary">{listing.grade}</Badge>}
                  {listing.printRun && <Badge variant="secondary">{listing.printRun}</Badge>}
                </div>
              </div>

              <Separator />

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="text-5xl font-bold text-primary">${listing.price}</p>
                  {listing.originalPrice && (
                    <p className="text-2xl text-muted-foreground line-through">${listing.originalPrice}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">15% below market average</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full gap-2 h-12"
                  onClick={() => setShowCheckout(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now - ${listing.price}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full gap-2 h-12"
                  onClick={() => setShowTrade(true)}
                >
                  <ArrowLeftRight className="h-5 w-5" />
                  Propose Trade
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Package className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Shipping & Returns */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Shipping: ${listing.shipping.cost}</p>
                    <p className="text-sm text-muted-foreground">{listing.shipping.estimatedDays}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{listing.returns.period} returns</p>
                    <p className="text-sm text-muted-foreground">{listing.returns.condition}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Ships from</p>
                    <p className="text-sm text-muted-foreground">{listing.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-primary">Buyer Protection Included</p>
                    <p className="text-sm text-muted-foreground">Secure payment & return guarantee</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seller Card */}
              <Card className="bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                          {listing.seller.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{listing.seller.name}</p>
                          {listing.seller.verified && (
                            <Shield className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{listing.seller.handle}</p>
                      </div>
                    </div>
                    <Link to={`/s/${listing.seller.handle}`}>
                      <Button variant="outline" size="sm">View Store</Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-bold">{listing.seller.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <p className="font-bold mb-1">{listing.seller.totalSales.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Sales</p>
                    </div>
                    <div>
                      <p className="font-bold mb-1">{listing.seller.responseTime}</p>
                      <p className="text-xs text-muted-foreground">Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Card Details</TabsTrigger>
              <TabsTrigger value="price-history">Price History</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed">{listing.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Set:</span>
                      <span className="font-medium">{listing.set}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Card Number:</span>
                      <span className="font-medium">{listing.cardNumber}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Rarity:</span>
                      <span className="font-medium">{listing.rarity}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Condition:</span>
                      <span className="font-medium">{listing.condition}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Grade:</span>
                      <span className="font-medium">{listing.grade}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Print Run:</span>
                      <span className="font-medium">{listing.printRun}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Game:</span>
                      <span className="font-medium">{listing.game}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Quantity Available:</span>
                      <span className="font-medium">{listing.quantity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="price-history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Trend (Last 4 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {listing.priceHistory.map((point, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer rounded-t-lg relative"
                             style={{ height: `${(point.price / 350) * 100}%` }}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                            ${point.price}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{point.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
                    <p className="text-muted-foreground mb-2">Standard Shipping: ${listing.shipping.cost}</p>
                    <p className="text-muted-foreground">Estimated Delivery: {listing.shipping.estimatedDays}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      All items are carefully packaged with protective materials to ensure safe delivery.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Return Policy</h3>
                    <p className="text-muted-foreground mb-2">Returns accepted within {listing.returns.period}</p>
                    <p className="text-sm text-muted-foreground">
                      Conditions: {listing.returns.condition}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Return shipping costs are the responsibility of the buyer unless the item is not as described.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Similar Listings */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Similar Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-[2.5/3.5] bg-gradient-to-br from-secondary/50 to-secondary/30 flex items-center justify-center text-4xl border-b border-border">
                      🎴
                    </div>
                    <div className="p-3">
                      <p className="font-medium mb-1 line-clamp-1">Similar Card {i}</p>
                      <p className="text-lg font-bold text-primary">${(Math.random() * 200 + 100).toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        items={[
          {
            name: listing.name,
            price: listing.price,
            quantity: 1,
          },
        ]}
        shippingOption="standard"
      />

      <TradeModal
        open={showTrade}
        onOpenChange={setShowTrade}
        otherUser={{
          name: listing.seller.name,
          reputation: listing.seller.rating,
          items: [
            {
              id: "1",
              name: listing.name,
              condition: listing.condition,
              value: listing.price,
            },
          ],
        }}
        currentUserItems={[
          { id: "1", name: "Charizard V", condition: "Near Mint", value: 150 },
          { id: "2", name: "Pikachu VMAX", condition: "Mint", value: 75 },
          { id: "3", name: "Mewtwo EX", condition: "Lightly Played", value: 50 },
        ]}
      />

      <Footer />
    </div>
  );
};

export default ListingDetail;
