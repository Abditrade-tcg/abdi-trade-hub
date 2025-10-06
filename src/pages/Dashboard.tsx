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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AbdiTrade" className="h-12" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
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
          <div className="p-3 rounded-lg border border-border">
            <h3 className="text-xs font-semibold mb-2">POPULAR COMMUNITIES</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs">Pokémon Trading Card...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs">Magic The Gathering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-xs">Yu-Gi-Oh!</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cards, sets, or users..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="default">Sign Out</Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Hero Stats Card */}
          <Card className="mb-6 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Discover Rare Finds
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Explore exclusive listings from collectors worldwide
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="gap-2">
                    <Store className="h-4 w-4" />
                    Browse Marketplace
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Gavel className="h-4 w-4" />
                    View Auctions
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border"
                  >
                    <div className="text-2xl font-bold text-primary">
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
              <Card>
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
                    <Button variant="default" className="gap-2">
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
              <Card>
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
              <Card>
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
              <Card>
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
              <Card>
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
