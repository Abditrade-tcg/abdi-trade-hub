import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeftRight, TrendingUp, Star, Package } from "lucide-react";
import { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";
import { TradeModal } from "./TradeModal";

interface CardDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: {
    name: string;
    set: string;
    rarity: string;
    price: number;
    avgPrice: number;
    condition: string;
    cardNumber: string;
    image?: string;
    description?: string;
    seller: {
      name: string;
      reputation: number;
    };
    availableForTrade?: boolean;
  };
}

export const CardDetailModal = ({ open, onOpenChange, card }: CardDetailModalProps) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

  const handleBuyNow = () => {
    onOpenChange(false);
    setShowCheckout(true);
  };

  const handleTrade = () => {
    onOpenChange(false);
    setShowTrade(true);
  };

  const priceComparison = ((card.price - card.avgPrice) / card.avgPrice) * 100;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{card.name}</DialogTitle>
            <DialogDescription>
              {card.set} • #{card.cardNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Image */}
            <div className="space-y-4">
              <div className="aspect-[2.5/3.5] bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border flex items-center justify-center">
                {card.image ? (
                  <img src={card.image} alt={card.name} className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Package className="h-24 w-24 text-muted-foreground" />
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Condition</p>
                    <p className="text-sm font-semibold">{card.condition}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Rarity</p>
                    <Badge>{card.rarity}</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-6">
              {/* Pricing */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                  <p className="text-4xl font-bold text-primary">${card.price.toFixed(2)}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Average Market Price</p>
                    <p className="text-lg font-semibold">${card.avgPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">vs. Market</p>
                    <p className={`text-lg font-semibold flex items-center gap-1 ${
                      priceComparison > 0 ? "text-red-500" : "text-green-500"
                    }`}>
                      <TrendingUp className={`h-4 w-4 ${priceComparison > 0 ? "rotate-180" : ""}`} />
                      {Math.abs(priceComparison).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Card Information */}
              <div className="space-y-3">
                <h3 className="font-semibold">Card Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Set:</span>
                    <span className="font-medium">{card.set}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card Number:</span>
                    <span className="font-medium">#{card.cardNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rarity:</span>
                    <span className="font-medium">{card.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="font-medium">{card.condition}</span>
                  </div>
                </div>

                {card.description && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              {/* Seller Information */}
              <Card className="bg-secondary/30">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Seller Information</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{card.seller.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        <span className="text-sm font-medium">{card.seller.reputation}</span>
                        <span className="text-xs text-muted-foreground">rating</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleBuyNow}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now - ${card.price.toFixed(2)}
                </Button>
                
                {card.availableForTrade && (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleTrade}
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                    Propose Trade
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Secure transactions powered by AbdiTrade • Buyer protection included
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        items={[{ name: card.name, price: card.price, quantity: 1 }]}
        shippingOption="standard"
      />

      <TradeModal
        open={showTrade}
        onOpenChange={setShowTrade}
        otherUser={{
          name: card.seller.name,
          reputation: card.seller.reputation,
          items: [
            { 
              id: "1", 
              name: card.name, 
              condition: card.condition, 
              value: card.price 
            }
          ]
        }}
        currentUserItems={[
          { id: "1", name: "Sample Card 1", condition: "Near Mint", value: 50 },
          { id: "2", name: "Sample Card 2", condition: "Mint", value: 75 },
          { id: "3", name: "Sample Card 3", condition: "Lightly Played", value: 30 },
        ]}
      />
    </>
  );
};
