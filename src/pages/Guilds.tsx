import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Users,
  Store,
  Gavel,
  ArrowLeftRight,
  ShoppingCart,
  MessageSquare,
  BookMarked,
  User,
  AlertTriangle,
  Search,
  Bell,
  Plus,
  TrendingUp,
  Flame,
  Star,
  Crown,
  Shield,
  UserPlus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import logo from "@/assets/abditrade-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Guilds = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Users, label: "Guilds", href: "/guilds" },
    { icon: Store, label: "Marketplace", href: "/marketplace" },
    { icon: Gavel, label: "Auctions", href: "/auctions" },
    { icon: ArrowLeftRight, label: "Trades", href: "/trades" },
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: BookMarked, label: "My Collection", href: "/collection" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: AlertTriangle, label: "Disputes", href: "/disputes" },
  ];

  const featuredGuilds = [
    {
      id: 1,
      name: "Pokemon Masters",
      description: "Dedicated to Pokemon TCG collectors and traders",
      members: 12453,
      posts: 5821,
      category: "Pokemon",
      image: "🎴",
      isJoined: true,
      trending: true,
    },
    {
      id: 2,
      name: "Magic: The Gathering Elite",
      description: "For serious MTG collectors and competitive players",
      members: 8932,
      posts: 4123,
      category: "Magic",
      image: "🔮",
      isJoined: false,
      trending: true,
    },
    {
      id: 3,
      name: "Yu-Gi-Oh Duelists",
      description: "Connect with Yu-Gi-Oh enthusiasts worldwide",
      members: 6234,
      posts: 2891,
      category: "Yu-Gi-Oh",
      image: "⚔️",
      isJoined: true,
      trending: false,
    },
    {
      id: 4,
      name: "Vintage Card Collectors",
      description: "Rare and vintage cards from all TCGs",
      members: 4521,
      posts: 1923,
      category: "Vintage",
      image: "💎",
      isJoined: false,
      trending: true,
    },
    {
      id: 5,
      name: "Sports Card Traders",
      description: "Baseball, basketball, football and more",
      members: 3892,
      posts: 1456,
      category: "Sports Cards",
      image: "⚾",
      isJoined: false,
      trending: false,
    },
  ];

  const myGuilds = featuredGuilds.filter(g => g.isJoined);

  const categories = [
    { name: "Pokemon", count: 89, icon: "🎴" },
    { name: "Magic: The Gathering", count: 62, icon: "🔮" },
    { name: "Yu-Gi-Oh", count: 45, icon: "⚔️" },
    { name: "Sports Cards", count: 34, icon: "⚾" },
    { name: "Vintage", count: 17, icon: "💎" },
  ];

  const recentActivity = [
    { guild: "Pokemon Masters", user: "Collector123", action: "posted in", time: "2m ago" },
    { guild: "MTG Elite", user: "CardMage", action: "joined", time: "5m ago" },
    { guild: "Vintage Cards", user: "RetroFan", action: "started discussion", time: "12m ago" },
    { guild: "Yu-Gi-Oh Duelists", user: "DuelMaster", action: "commented on", time: "18m ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shadow-lg">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center">
            <img src={logo} alt="Abditrade" className="h-12" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 py-4">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:translate-x-1 group animate-fade-in ${
                item.label === "Guilds"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-primary/10 hover:text-primary"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <Avatar className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Username</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-accent" />
                <span className="text-xs text-muted-foreground">Level 5</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search guilds, topics, posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full animate-pulse" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 hover:shadow-lg transition-all">
                    <Plus className="h-4 w-4" />
                    Create Guild
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create a New Guild</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guildName">Guild Name</Label>
                      <Input id="guildName" placeholder="Pokemon Card Masters" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell members what this guild is about..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pokemon">Pokemon</SelectItem>
                          <SelectItem value="magic">Magic: The Gathering</SelectItem>
                          <SelectItem value="yugioh">Yu-Gi-Oh</SelectItem>
                          <SelectItem value="sports">Sports Cards</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privacy">Privacy</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select privacy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can join</SelectItem>
                          <SelectItem value="private">Private - Approval required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Create Guild</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Trading Card Guilds</h1>
            <p className="text-muted-foreground">Connect with collectors, share strategies, and grow your collection</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr,320px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Categories */}
              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Browse by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant="outline"
                        className="justify-start gap-2 h-auto py-3 hover:bg-primary/10 hover:border-primary"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <div className="text-left">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-muted-foreground">{category.count} guilds</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="featured" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="featured" className="gap-2">
                    <Flame className="h-4 w-4" />
                    Featured
                  </TabsTrigger>
                  <TabsTrigger value="my-guilds" className="gap-2">
                    <Users className="h-4 w-4" />
                    My Guilds ({myGuilds.length})
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="featured" className="space-y-4 mt-6">
                  {featuredGuilds.map((guild) => (
                    <Link key={guild.id} href={`/guilds/${guild.id}`}>
                      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{guild.image}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-bold flex items-center gap-2">
                                    {guild.name}
                                    {guild.trending && (
                                      <Badge variant="secondary" className="gap-1">
                                        <Flame className="h-3 w-3" />
                                        Trending
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">{guild.description}</p>
                                </div>
                                {guild.isJoined ? (
                                  <Button size="sm" variant="outline" className="gap-2" onClick={(e) => e.preventDefault()}>
                                    <Shield className="h-3 w-3" />
                                    Joined
                                  </Button>
                                ) : (
                                  <Button size="sm" className="gap-2" onClick={(e) => e.preventDefault()}>
                                    <UserPlus className="h-3 w-3" />
                                    Join
                                  </Button>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  {guild.members.toLocaleString()} members
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MessageSquare className="h-4 w-4" />
                                  {guild.posts.toLocaleString()} posts
                                </div>
                                <Badge variant="outline">{guild.category}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </TabsContent>

                <TabsContent value="my-guilds" className="space-y-4 mt-6">
                  {myGuilds.length > 0 ? (
                    myGuilds.map((guild) => (
                      <Link key={guild.id} href={`/guilds/${guild.id}`}>
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="text-4xl">{guild.image}</div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-lg font-bold">{guild.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{guild.description}</p>
                                  </div>
                                  <Button size="sm" variant="outline" className="gap-2" onClick={(e) => e.preventDefault()}>
                                    <Settings className="h-3 w-3" />
                                    Manage
                                  </Button>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    {guild.members.toLocaleString()} members
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MessageSquare className="h-4 w-4" />
                                    {guild.posts.toLocaleString()} posts
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <Card className="shadow-lg">
                      <CardContent className="p-12 text-center">
                        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">You haven't joined any guilds yet</p>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Join Your First Guild
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="trending" className="space-y-4 mt-6">
                  {featuredGuilds
                    .filter((g) => g.trending)
                    .map((guild) => (
                      <Link key={guild.id} href={`/guilds/${guild.id}`}>
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="text-4xl">{guild.image}</div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                      {guild.name}
                                      <Badge variant="secondary" className="gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        Hot
                                      </Badge>
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{guild.description}</p>
                                  </div>
                                  {guild.isJoined ? (
                                    <Button size="sm" variant="outline" onClick={(e) => e.preventDefault()}>Joined</Button>
                                  ) : (
                                    <Button size="sm" className="gap-2" onClick={(e) => e.preventDefault()}>
                                      <UserPlus className="h-3 w-3" />
                                      Join
                                    </Button>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    {guild.members.toLocaleString()} members
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MessageSquare className="h-4 w-4" />
                                    {guild.posts.toLocaleString()} posts
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 text-accent" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index}>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>{" "}
                          <span className="font-medium text-primary">{activity.guild}</span>
                        </p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      {index < recentActivity.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Guild Stats */}
              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-sm">Guild Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Guilds</span>
                    <span className="font-bold">247</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Members</span>
                    <span className="font-bold">32,456</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posts Today</span>
                    <span className="font-bold">1,234</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Plus className="h-4 w-4" />
                        Create Guild
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Search className="h-4 w-4" />
                    Discover Guilds
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Crown className="h-4 w-4" />
                    Guild Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Guilds;

