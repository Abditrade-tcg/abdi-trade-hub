import { useState } from "react";
import { Bell, Heart, TrendingDown, TrendingUp, Trash2, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface FollowedSeller {
  id: string;
  name: string;
  avatar: string;
  newListings: number;
  isOnline: boolean;
}

interface PriceAlert {
  id: string;
  cardName: string;
  cardImage: string;
  currentPrice: number;
  targetPrice: number;
  condition: "below" | "above";
  enabled: boolean;
}

const FollowsAndAlerts = () => {
  const [followedSellers, setFollowedSellers] = useState<FollowedSeller[]>([
    {
      id: "1",
      name: "Elite Cards Co.",
      avatar: "",
      newListings: 5,
      isOnline: true
    },
    {
      id: "2",
      name: "CardMaster Pro",
      avatar: "",
      newListings: 0,
      isOnline: false
    },
    {
      id: "3",
      name: "Vintage Vault",
      avatar: "",
      newListings: 12,
      isOnline: true
    }
  ]);

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      cardName: "Charizard VMAX - PSA 10",
      cardImage: "",
      currentPrice: 450.00,
      targetPrice: 400.00,
      condition: "below",
      enabled: true
    },
    {
      id: "2",
      cardName: "Pikachu VMAX - BGS 9.5",
      cardImage: "",
      currentPrice: 180.00,
      targetPrice: 200.00,
      condition: "below",
      enabled: true
    },
    {
      id: "3",
      cardName: "Umbreon VMAX Alt Art - PSA 10",
      cardImage: "",
      currentPrice: 320.00,
      targetPrice: 350.00,
      condition: "above",
      enabled: false
    }
  ]);

  const [newAlertCardName, setNewAlertCardName] = useState("");
  const [newAlertPrice, setNewAlertPrice] = useState("");
  const [newAlertCondition, setNewAlertCondition] = useState<"below" | "above">("below");

  const handleUnfollow = (sellerId: string) => {
    setFollowedSellers(followedSellers.filter(s => s.id !== sellerId));
    toast({
      title: "Unfollowed",
      description: "You've unfollowed this seller.",
    });
  };

  const handleToggleAlert = (alertId: string) => {
    setPriceAlerts(priceAlerts.map(alert => 
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const handleDeleteAlert = (alertId: string) => {
    setPriceAlerts(priceAlerts.filter(a => a.id !== alertId));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed.",
    });
  };

  const handleCreateAlert = () => {
    if (!newAlertCardName || !newAlertPrice) {
      toast({
        title: "Missing Information",
        description: "Please enter both card name and target price.",
        variant: "destructive"
      });
      return;
    }

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      cardName: newAlertCardName,
      cardImage: "",
      currentPrice: 0,
      targetPrice: parseFloat(newAlertPrice),
      condition: newAlertCondition,
      enabled: true
    };

    setPriceAlerts([...priceAlerts, newAlert]);
    setNewAlertCardName("");
    setNewAlertPrice("");
    
    toast({
      title: "Alert Created",
      description: "You'll be notified when the price condition is met.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Follows & Price Alerts</h1>
              <p className="text-muted-foreground">Track your favorite sellers and get price notifications</p>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <Tabs defaultValue="sellers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="sellers">
              Followed Sellers ({followedSellers.length})
            </TabsTrigger>
            <TabsTrigger value="alerts">
              Price Alerts ({priceAlerts.filter(a => a.enabled).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sellers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Followed Sellers</CardTitle>
                <CardDescription>
                  Get notified when your followed sellers list new items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {followedSellers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You're not following any sellers yet</p>
                    <Button variant="link" className="mt-2">Browse Sellers</Button>
                  </div>
                ) : (
                  followedSellers.map((seller) => (
                    <div key={seller.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            {seller.avatar ? (
                              <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full" />
                            ) : (
                              <span className="text-lg font-bold text-primary">
                                {seller.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          {seller.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{seller.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {seller.isOnline ? "Online now" : "Offline"}
                          </p>
                        </div>
                        {seller.newListings > 0 && (
                          <Badge variant="default">
                            {seller.newListings} new listing{seller.newListings !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          View Store
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnfollow(seller.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {/* Create New Alert */}
            <Card>
              <CardHeader>
                <CardTitle>Create Price Alert</CardTitle>
                <CardDescription>
                  Get notified when a card reaches your target price
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Card Name</Label>
                    <Input
                      id="cardName"
                      placeholder="e.g., Charizard VMAX PSA 10"
                      value={newAlertCardName}
                      onChange={(e) => setNewAlertCardName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetPrice">Target Price</Label>
                    <Input
                      id="targetPrice"
                      type="number"
                      placeholder="$0.00"
                      value={newAlertPrice}
                      onChange={(e) => setNewAlertPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <div className="flex gap-2 h-10">
                      <Button
                        variant={newAlertCondition === "below" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setNewAlertCondition("below")}
                      >
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Below
                      </Button>
                      <Button
                        variant={newAlertCondition === "above" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setNewAlertCondition("above")}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Above
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCreateAlert} className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Active Price Alerts</CardTitle>
                <CardDescription>
                  Manage your price alert notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No price alerts set</p>
                  </div>
                ) : (
                  priceAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          {alert.cardImage ? (
                            <img src={alert.cardImage} alt={alert.cardName} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-2xl">🃏</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{alert.cardName}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div>
                              <span>Current: </span>
                              <span className="font-medium text-foreground">
                                ${alert.currentPrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {alert.condition === "below" ? (
                                <TrendingDown className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                              )}
                              <span>Target: </span>
                              <span className="font-medium text-foreground">
                                ${alert.targetPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Switch
                              checked={alert.enabled}
                              onCheckedChange={() => handleToggleAlert(alert.id)}
                            />
                            <span className="text-sm">
                              {alert.enabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default FollowsAndAlerts;