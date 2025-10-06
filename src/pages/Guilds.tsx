import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  TrendingUp,
  Flame,
  Award,
  Sun,
  Moon,
  Plus,
  Calendar,
  Star,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/abditrade-logo.png";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Guilds = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { theme, setTheme } = useTheme();

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

  const stats = [
    { value: "8", label: "Active Guilds" },
    { value: "6,084", label: "Total Members" },
    { value: "8", label: "Active Today" },
    { value: "1", label: "New This Week" },
  ];

  const categories = [
    { id: "all", label: "All Guilds", icon: Users, color: "accent" },
    { id: "pokemon", label: "Pokémon", icon: Flame, color: "red" },
    { id: "mtg", label: "Magic: The Gathering", icon: Sparkles, color: "blue" },
    { id: "yugioh", label: "Yu-Gi-Oh!", icon: Shield, color: "purple" },
    { id: "sports", label: "Sports Cards", icon: Award, color: "green" },
    { id: "vintage", label: "Vintage", icon: Star, color: "amber" },
  ];

  const guilds = [
    {
      id: 1,
      name: "PSA Grading Community",
      game: "pokemon",
      description: "The premier community for psa grading community enthusiasts.",
      members: 1570,
      posts: 190,
      traders: 584,
      rating: 3.7,
      active: true,
      lastActivity: "9/27/2025",
      verified: true,
    },
    {
      id: 2,
      name: "Pokemon Trading Central",
      game: "pokemon",
      description: "The premier community for pokemon trading central enthusiasts.",
      members: 1308,
      posts: 2711,
      traders: 975,
      rating: 4.7,
      active: true,
      lastActivity: "9/28/2025",
      verified: true,
    },
    {
      id: 3,
      name: "Yu-Gi-Oh Duel Academy",
      game: "yugioh",
      description: "The premier community for yu-gi-oh duel academy enthusiasts.",
      members: 1025,
      posts: 1524,
      traders: 374,
      rating: 3.6,
      active: true,
      lastActivity: "9/28/2025",
      verified: false,
    },
    {
      id: 4,
      name: "Vintage Card Vault",
      game: "pokemon",
      description: "The premier community for vintage card vault enthusiasts.",
      members: 814,
      posts: 3505,
      traders: 140,
      rating: 4.6,
      active: true,
      lastActivity: "9/28/2025",
      verified: false,
    },
    {
      id: 5,
      name: "MTG Modern Masters",
      game: "mtg",
      description: "The premier community for mtg modern masters enthusiasts.",
      members: 892,
      posts: 4783,
      traders: 756,
      rating: 3.5,
      active: true,
      lastActivity: "9/27/2025",
      verified: false,
    },
    {
      id: 6,
      name: "Charizard Collectors United",
      game: "pokemon",
      description: "The premier community for charizard collectors unified enthusiasts.",
      members: 655,
      posts: 1678,
      traders: 884,
      rating: 3.9,
      active: true,
      lastActivity: "9/27/2025",
      verified: false,
    },
  ];

  const trendingGuilds = [
    { name: "Sports Card Specialist...", members: "280 members", trend: "up" },
    { name: "Charizard Collector...", members: "356 members", trend: "up" },
    { name: "PSA Grading Comm...", members: "1,570 members", trend: "up" },
    { name: "MTG Modern Masters", members: "892 members", trend: "up" },
    { name: "Vintage Card Vault", members: "814 members", trend: "up" },
  ];

  const filteredGuilds = guilds.filter((guild) => {
    const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guild.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || guild.game === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getGameColor = (game: string) => {
    switch (game) {
      case "pokemon": return "bg-red-500";
      case "mtg": return "bg-blue-500";
      case "yugioh": return "bg-purple-500";
      case "sports": return "bg-green-500";
      case "vintage": return "bg-amber-500";
      default: return "bg-primary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shadow-lg">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AbdiTrade" className="h-12" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:translate-x-1 group animate-fade-in ${
                item.label === "Guilds"
                  ? "bg-primary/10 text-primary font-medium"
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
                M
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">marquise.will...</p>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="p-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <h3 className="text-xs font-semibold mb-3 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              POPULAR COMMUNITIES
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer group">
                <div className="h-2 w-2 rounded-full bg-red-500 group-hover:scale-125 transition-transform" />
                <span className="text-xs group-hover:text-primary transition-colors">Pokémon Trading Card...</span>
              </div>
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer group">
                <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                <span className="text-xs group-hover:text-primary transition-colors">Magic The Gathering</span>
              </div>
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer group">
                <div className="h-2 w-2 rounded-full bg-purple-500 group-hover:scale-125 transition-transform" />
                <span className="text-xs group-hover:text-primary transition-colors">Yu-Gi-Oh!</span>
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
                  placeholder="Search cards, sets, or users..."
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-primary/10 hover:text-primary transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full animate-pulse" />
              </Button>
              <Button variant="default" className="hover:shadow-lg transition-all">Sign Out</Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Header Section */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Trading Guilds
                </h1>
                <p className="text-muted-foreground">
                  Join communities of collectors and traders from around the world
                </p>
              </div>
              <Button className="gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-accent/20 bg-gradient-to-r from-accent to-accent/90">
                <Plus className="h-4 w-4" />
                Create Guild
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center hover:border-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in border-border/50 shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search guilds by name, description, or game..."
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_320px] gap-6">
            {/* Categories Sidebar */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 h-fit sticky top-24 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-sm">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:translate-x-1 group ${
                      selectedCategory === category.id
                        ? "bg-accent text-accent-foreground font-medium shadow-md"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <category.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Guilds Grid */}
            <div className="space-y-4">
              {filteredGuilds.length === 0 ? (
                <Card className="shadow-lg border-border/50">
                  <CardContent className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Guilds Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to create a community for your favorite trading card game!
                    </p>
                    <Button className="gap-2 bg-gradient-to-r from-accent to-accent/90 hover:shadow-lg">
                      <Plus className="h-4 w-4" />
                      Create Guild
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredGuilds.map((guild, index) => (
                  <Card
                    key={guild.id}
                    className="group hover:shadow-2xl hover:border-primary/30 transition-all duration-300 animate-fade-in overflow-hidden relative border-border/50 shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-lg ${getGameColor(guild.game)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                            {guild.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {guild.name}
                              </CardTitle>
                              {guild.verified && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              <Badge
                                variant="secondary"
                                className={guild.active ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                              >
                                {guild.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <CardDescription className="text-sm">
                              {guild.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <div className="text-lg font-bold">{guild.members.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Posts</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <MessageSquare className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <div className="text-lg font-bold">{guild.posts.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Posts</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <ArrowLeftRight className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <div className="text-lg font-bold">{guild.traders}</div>
                          <div className="text-xs text-muted-foreground">Traders</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <Star className="h-4 w-4 mx-auto mb-1 text-accent" />
                          <div className="text-lg font-bold">{guild.rating}</div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Last activity: {guild.lastActivity}
                        </div>
                        <Button className="gap-2 hover:scale-105 transition-all shadow-md hover:shadow-accent/20 bg-gradient-to-r from-accent to-accent/90">
                          Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Trending Guilds */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in sticky top-24" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 text-accent" />
                    Trending Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingGuilds.map((guild, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-sm font-medium text-accent">{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {guild.name}
                          </div>
                          <div className="text-xs text-muted-foreground">{guild.members}</div>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
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
