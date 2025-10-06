import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Edit, Trash2, Eye, PlusCircle, TrendingUp, DollarSign, Archive } from "lucide-react";

const Inventory = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const mockListings = [
    {
      id: "1",
      name: "Charizard VMAX",
      set: "Darkness Ablaze",
      price: 299.99,
      quantity: 2,
      condition: "Near Mint",
      status: "active",
      views: 145,
      image: "🔥",
    },
    {
      id: "2",
      name: "Pikachu V",
      set: "Vivid Voltage",
      price: 45.00,
      quantity: 5,
      condition: "Mint",
      status: "active",
      views: 89,
      image: "⚡",
    },
    {
      id: "3",
      name: "Mewtwo GX",
      set: "Shining Legends",
      price: 120.00,
      quantity: 0,
      condition: "Near Mint",
      status: "sold",
      views: 234,
      image: "🌟",
    },
  ];

  const stats = [
    { label: "Active Listings", value: "2", icon: Package, color: "text-primary" },
    { label: "Total Value", value: "$689.98", icon: DollarSign, color: "text-green-500" },
    { label: "Sold This Month", value: "1", icon: TrendingUp, color: "text-accent" },
    { label: "Total Views", value: "234", icon: Eye, color: "text-purple-500" },
  ];

  const filteredListings = mockListings.filter(listing => {
    if (filterStatus === "all") return true;
    return listing.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Package className="h-10 w-10 text-primary" />
                My Inventory
              </h1>
              <p className="text-muted-foreground">Manage your listings and track sales</p>
            </div>
            <Link to="/sell">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Listing
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters & Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Listings</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Listings Table */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="grid" className="w-full">
                <div className="p-6 pb-0">
                  <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="grid" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                      <Card key={listing.id} className="hover:shadow-xl transition-all">
                        <CardContent className="p-0">
                          {/* Image */}
                          <div className="aspect-[2.5/3.5] bg-gradient-to-br from-primary/5 to-accent/5 rounded-t-lg flex items-center justify-center text-6xl border-b border-border relative">
                            {listing.image}
                            {listing.status === "sold" && (
                              <Badge className="absolute top-2 right-2 bg-green-500">Sold</Badge>
                            )}
                            {listing.quantity === 0 && listing.status === "active" && (
                              <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>
                            )}
                          </div>
                          
                          {/* Details */}
                          <div className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{listing.name}</h3>
                              <p className="text-sm text-muted-foreground">{listing.set}</p>
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{listing.condition}</Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>{listing.views}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div>
                                <p className="text-2xl font-bold text-primary">${listing.price}</p>
                                <p className="text-xs text-muted-foreground">Qty: {listing.quantity}</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 gap-1">
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 gap-1">
                                <Archive className="h-3 w-3" />
                                Archive
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="p-6">
                  <div className="space-y-4">
                    {filteredListings.map((listing) => (
                      <Card key={listing.id} className="hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-6">
                            {/* Image */}
                            <div className="w-20 h-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                              {listing.image}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{listing.name}</h3>
                                  <p className="text-sm text-muted-foreground">{listing.set}</p>
                                </div>
                                <p className="text-2xl font-bold text-primary">${listing.price}</p>
                              </div>

                              <div className="flex items-center gap-4 text-sm">
                                <Badge variant="outline">{listing.condition}</Badge>
                                <span className="text-muted-foreground">Qty: {listing.quantity}</span>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  <span>{listing.views} views</span>
                                </div>
                                {listing.status === "sold" && (
                                  <Badge className="bg-green-500">Sold</Badge>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Archive className="h-3 w-3" />
                                Archive
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Empty State (if no listings) */}
          {filteredListings.length === 0 && (
            <Card className="mt-8">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No listings found</h3>
                <p className="text-muted-foreground mb-6">
                  {filterStatus !== "all" 
                    ? "Try adjusting your filters"
                    : "Create your first listing to start selling"
                  }
                </p>
                <Link to="/sell">
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Listing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Inventory;
