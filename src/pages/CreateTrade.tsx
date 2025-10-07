import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, DollarSign, Search, User, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateTrade = () => {
  const router = useRouter();
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [myCards, setMyCards] = useState<any[]>([]);
  const [theirCards, setTheirCards] = useState<any[]>([]);
  const [cashOffer, setCashOffer] = useState("");
  const [message, setMessage] = useState("");
  const [myCardSearch, setMyCardSearch] = useState("");
  const [theirCardSearch, setTheirCardSearch] = useState("");
  const [myCardFilter, setMyCardFilter] = useState("all");
  const [theirCardFilter, setTheirCardFilter] = useState("all");

  // Mock data
  const myInventory = [
    { id: "1", name: "Charizard VMAX", set: "Darkness Ablaze", value: 299.99, image: "🔥" },
    { id: "2", name: "Pikachu V", set: "Vivid Voltage", value: 45.00, image: "⚡" },
    { id: "3", name: "Mewtwo GX", set: "Shining Legends", value: 120.00, image: "🌟" },
  ];

  const mockUsers = [
    { id: "1", username: "CardMaster", rating: 4.9 },
    { id: "2", username: "TradeKing", rating: 4.8 },
  ];

  const theirInventory = [
    { id: "4", name: "Blue-Eyes White Dragon", set: "LOB", value: 450.00, image: "🐉" },
    { id: "5", name: "Dark Magician", set: "SDY", value: 125.00, image: "🔮" },
  ];

  const toggleMyCard = (card: any) => {
    setMyCards(prev => {
      const exists = prev.find(c => c.id === card.id);
      if (exists) return prev.filter(c => c.id !== card.id);
      return [...prev, card];
    });
  };

  const toggleTheirCard = (card: any) => {
    setTheirCards(prev => {
      const exists = prev.find(c => c.id === card.id);
      if (exists) return prev.filter(c => c.id !== card.id);
      return [...prev, card];
    });
  };

  const filteredMyInventory = myInventory.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(myCardSearch.toLowerCase()) ||
                         card.set.toLowerCase().includes(myCardSearch.toLowerCase());
    if (myCardFilter === "all") return matchesSearch;
    return matchesSearch; // Can add more filters later
  });

  const filteredTheirInventory = theirInventory.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(theirCardSearch.toLowerCase()) ||
                         card.set.toLowerCase().includes(theirCardSearch.toLowerCase());
    if (theirCardFilter === "all") return matchesSearch;
    return matchesSearch; // Can add more filters later
  });

  const myTotal = myCards.reduce((sum, c) => sum + c.value, 0);
  const theirTotal = theirCards.reduce((sum, c) => sum + c.value, 0);
  const difference = theirTotal - myTotal;

  const handleSubmit = () => {
    if (!selectedUser) {
      toast({
        title: "Select a user",
        description: "Please select who you want to trade with",
        variant: "destructive",
      });
      return;
    }

    if (myCards.length === 0 || theirCards.length === 0) {
      toast({
        title: "Select cards",
        description: "Both sides must select at least one card",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Trade Proposal Sent!",
      description: `Your trade proposal has been sent to ${selectedUser.username}`,
    });
    navigate("/trades");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/trades">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeftRight className="h-4 w-4" />
                Back to Trades
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <ArrowLeftRight className="h-10 w-10 text-primary" />
              Create Trade Proposal
            </h1>
            <p className="text-muted-foreground">Propose a card trade with another user</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select Trading Partner */}
              <Card>
                <CardHeader>
                  <CardTitle>1. Select Trading Partner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by username..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {searchUser && (
                    <div className="border border-border rounded-lg divide-y">
                      {mockUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                            selectedUser?.id === user.id ? "bg-primary/10" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <User className="h-5 w-5 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-muted-foreground">Rating: {user.rating} ⭐</p>
                              </div>
                            </div>
                            {selectedUser?.id === user.id && (
                              <Badge>Selected</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedUser && !searchUser && (
                    <div className="p-4 border border-border rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedUser.username}</p>
                            <p className="text-sm text-muted-foreground">Rating: {selectedUser.rating} ⭐</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                          Change
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>2. Your Cards</span>
                    <Badge variant="outline">{myCards.length} selected</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search your cards..."
                        value={myCardSearch}
                        onChange={(e) => setMyCardSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={myCardFilter} onValueChange={setMyCardFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cards</SelectItem>
                        <SelectItem value="selected">Selected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cards Grid */}
                  {filteredMyInventory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No cards found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                      {filteredMyInventory.map(card => {
                        const isSelected = myCards.some(c => c.id === card.id);
                        return (
                          <div
                            key={card.id}
                            onClick={() => toggleMyCard(card)}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected 
                                ? "border-primary bg-primary/10 shadow-lg" 
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="aspect-[2.5/3.5] bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center text-4xl mb-3">
                              {card.image}
                            </div>
                            <h4 className="font-medium text-sm mb-1 line-clamp-1">{card.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{card.set}</p>
                            <p className="text-sm font-semibold text-primary">${card.value}</p>
                            {isSelected && (
                              <Badge className="mt-2 w-full justify-center">Selected</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedUser && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>3. {selectedUser.username}'s Cards</span>
                      <Badge variant="outline">{theirCards.length} selected</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search their cards..."
                          value={theirCardSearch}
                          onChange={(e) => setTheirCardSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={theirCardFilter} onValueChange={setTheirCardFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cards</SelectItem>
                          <SelectItem value="selected">Selected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cards Grid */}
                    {filteredTheirInventory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No cards found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {filteredTheirInventory.map(card => {
                          const isSelected = theirCards.some(c => c.id === card.id);
                          return (
                            <div
                              key={card.id}
                              onClick={() => toggleTheirCard(card)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                isSelected 
                                  ? "border-accent bg-accent/10 shadow-lg" 
                                  : "border-border hover:border-accent/50"
                              }`}
                            >
                              <div className="aspect-[2.5/3.5] bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg flex items-center justify-center text-4xl mb-3">
                                {card.image}
                              </div>
                              <h4 className="font-medium text-sm mb-1 line-clamp-1">{card.name}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{card.set}</p>
                              <p className="text-sm font-semibold text-accent">${card.value}</p>
                              {isSelected && (
                                <Badge variant="secondary" className="mt-2 w-full justify-center">Selected</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Additional Options */}
              <Card>
                <CardHeader>
                  <CardTitle>4. Additional Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cash">Cash Compensation (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cash"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10"
                        value={cashOffer}
                        onChange={(e) => setCashOffer(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add cash to balance the trade if needed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Trader</Label>
                    <Textarea
                      id="message"
                      placeholder="Add a message to your trade proposal..."
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trade Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Trade Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">You're offering</p>
                    <div className="space-y-1">
                      {myCards.map(card => (
                        <p key={card.id} className="text-sm flex justify-between">
                          <span className="truncate mr-2">{card.name}</span>
                          <span className="font-medium">${card.value}</span>
                        </p>
                      ))}
                      {myCards.length === 0 && (
                        <p className="text-sm text-muted-foreground">No cards selected</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold mt-2 pt-2 border-t">
                      Total: ${myTotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-center py-2">
                    <ArrowLeftRight className="h-5 w-5 text-muted-foreground mx-auto" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">You're requesting</p>
                    <div className="space-y-1">
                      {theirCards.map(card => (
                        <p key={card.id} className="text-sm flex justify-between">
                          <span className="truncate mr-2">{card.name}</span>
                          <span className="font-medium">${card.value}</span>
                        </p>
                      ))}
                      {theirCards.length === 0 && (
                        <p className="text-sm text-muted-foreground">No cards selected</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold mt-2 pt-2 border-t">
                      Total: ${theirTotal.toFixed(2)}
                    </p>
                  </div>

                  {(myCards.length > 0 || theirCards.length > 0) && (
                    <div className={`p-3 rounded-lg ${
                      difference > 0 
                        ? "bg-green-500/10 border border-green-500/20" 
                        : difference < 0 
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-primary/10 border border-primary/20"
                    }`}>
                      <p className="text-sm text-muted-foreground mb-1">Value Difference</p>
                      <p className="text-xl font-bold">
                        {difference > 0 ? "+" : ""}${difference.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {difference > 0 
                          ? "You're getting more value" 
                          : difference < 0 
                          ? "They're getting more value"
                          : "Even trade"
                        }
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!selectedUser || myCards.length === 0 || theirCards.length === 0}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Send Trade Proposal
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    The other user will be notified and can accept, decline, or counter your offer
                  </p>
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

export default CreateTrade;

