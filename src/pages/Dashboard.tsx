import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/abditrade-logo.png";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
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
    { value: "12.4K+", label: "Active Traders" },
    { value: "8.9K", label: "Live Listings" },
    { value: "98.5%", label: "Success Rate" },
    { value: "4.9/5", label: "Avg Rating" },
  ];

  const feedTabs = ["all", "posts", "listings", "trades"];

  const communityRules = [
    "Be respectful to all traders",
    "Use accurate card descriptions",
    "Complete trades promptly",
    "Report suspicious activity",
  ];

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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:translate-x-1 group animate-fade-in"
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
          {/* Hero Stats Card */}
          <Card className="mb-6 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
                    Discover Rare Finds
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Explore exclusive listings from collectors worldwide
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-primary/20">
                    <Store className="h-4 w-4" />
                    Browse Marketplace
                  </Button>
                  <Button variant="outline" className="gap-2 hover:scale-105 transition-all hover:border-primary/50">
                    <Gavel className="h-4 w-4" />
                    View Auctions
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feed Section */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr,380px] gap-6">
            <div className="space-y-6">
              {/* Feed Tabs */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                <CardContent className="p-0">
                  <div className="flex border-b border-border">
                    {feedTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                          activeTab === tab
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Empty State */}
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No posts available yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share something!
                    </p>
                    <Button variant="default" className="gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-primary/20">
                      <MessageSquare className="h-4 w-4" />
                      Create Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Live Activity */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-accent/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 text-accent" />
                    LIVE ACTIVITY
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">Online Now</span>
                    </div>
                    <span className="font-semibold">1</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trading</span>
                    <span className="font-semibold">None</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated 11:14:17 PM
                  </div>
                </CardContent>
              </Card>

              {/* Trending Cards */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Trending Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No trending cards yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check back when more users are active
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Top Traders */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-4 w-4 text-accent" />
                    Top Traders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No active traders yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Trading leaderboard will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Community Rules */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <CardTitle className="text-sm">Community Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {communityRules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="link" className="w-full mt-3 text-xs p-0">
                    View full guidelines →
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

export default Dashboard;
