import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagePlus, Upload, DollarSign, TrendingUp, Package, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Sell = () => {
  const [formData, setFormData] = useState({
    cardName: "",
    game: "",
    set: "",
    cardNumber: "",
    rarity: "",
    condition: "",
    price: "",
    quantity: "1",
    description: "",
  });

  const games = ["Pokemon", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece", "Digimon"];
  const rarities = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare"];
  const conditions = ["Mint", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Listing Created!",
      description: "Your card has been listed for sale in the marketplace.",
    });
    // Reset form
    setFormData({
      cardName: "",
      game: "",
      set: "",
      cardNumber: "",
      rarity: "",
      condition: "",
      price: "",
      quantity: "1",
      description: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <PackagePlus className="h-10 w-10 text-primary" />
              Sell Your Cards
            </h1>
            <p className="text-muted-foreground">List your trading cards and reach thousands of buyers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Listing</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Card Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Card Name *</Label>
                          <Input
                            id="cardName"
                            placeholder="e.g., Charizard VMAX"
                            value={formData.cardName}
                            onChange={(e) => handleChange("cardName", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="game">Game *</Label>
                          <Select value={formData.game} onValueChange={(val) => handleChange("game", val)} required>
                            <SelectTrigger id="game">
                              <SelectValue placeholder="Select game" />
                            </SelectTrigger>
                            <SelectContent>
                              {games.map(game => (
                                <SelectItem key={game} value={game}>{game}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="set">Set Name *</Label>
                          <Input
                            id="set"
                            placeholder="e.g., Darkness Ablaze"
                            value={formData.set}
                            onChange={(e) => handleChange("set", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="e.g., 020/189"
                            value={formData.cardNumber}
                            onChange={(e) => handleChange("cardNumber", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rarity">Rarity *</Label>
                          <Select value={formData.rarity} onValueChange={(val) => handleChange("rarity", val)} required>
                            <SelectTrigger id="rarity">
                              <SelectValue placeholder="Select rarity" />
                            </SelectTrigger>
                            <SelectContent>
                              {rarities.map(rarity => (
                                <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition *</Label>
                          <Select value={formData.condition} onValueChange={(val) => handleChange("condition", val)} required>
                            <SelectTrigger id="condition">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditions.map(condition => (
                                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Pricing & Inventory</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (USD) *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-10"
                              value={formData.price}
                              onChange={(e) => handleChange("price", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity *</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => handleChange("quantity", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Add any additional details about the card's condition, language, edition, etc."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Images</h3>
                      
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium mb-1">Upload card images</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Add up to 5 images (JPG, PNG, or WEBP)
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 gap-2">
                        <PackagePlus className="h-4 w-4" />
                        Create Listing
                      </Button>
                      <Button type="button" variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Seller Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Seller Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Active Listings</span>
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Sales</span>
                    </div>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Avg. Sale Price</span>
                    </div>
                    <span className="font-semibold">$0.00</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Tips */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Pricing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Research recent sales of similar cards to price competitively.</p>
                  <p>Consider the card's condition, edition, and rarity when pricing.</p>
                  <p>Competitive pricing increases your chances of a quick sale.</p>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/inventory">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      View My Inventory
                    </Button>
                  </Link>
                  <Link to="/seller-agreement">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      Seller Agreement
                    </Button>
                  </Link>
                  <Link to="/fees">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      Fee Structure
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
