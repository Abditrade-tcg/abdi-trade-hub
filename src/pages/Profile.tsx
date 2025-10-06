import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
  Sun,
  Moon,
  TrendingUp,
  Flame,
  Award,
  Sparkles,
  Wallet,
  CreditCard,
  Edit,
  Shield,
  Building2,
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  Settings,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/abditrade-logo.png";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

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

  const walletStats = [
    { label: "Available Balance", value: "$0.00", icon: Wallet, color: "text-green-500" },
    { label: "Pending", value: "$0.00", icon: Clock, color: "text-accent" },
    { label: "Total Earned", value: "$0.00", icon: TrendingUp, color: "text-primary" },
  ];

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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:translate-x-1 group animate-fade-in ${
                item.href === "/profile" ? "bg-primary/10 text-primary" : ""
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
          {/* Profile Header */}
          <Card className="mb-6 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="relative z-10 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-3xl">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">marquise.will...</h2>
                    <p className="text-muted-foreground mb-3">Member since 2024</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Verified User
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        Rep: 0%
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 hover:scale-105 transition-all hover:border-primary/50"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr,380px] gap-6">
            {/* Main Content Area */}
            <div className="space-y-6">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6 mt-6">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="Enter first name" disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Enter last name" disabled={!isEditing} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="your@email.com" className="pl-10" disabled={!isEditing} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="pl-10" disabled={!isEditing} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="address" placeholder="123 Main St, City, State ZIP" className="pl-10" disabled={!isEditing} />
                        </div>
                      </div>
                      {isEditing && (
                        <Button variant="accent" className="w-full gap-2 hover:scale-105 transition-all shadow-lg">
                          Save Changes
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Seller Onboarding */}
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-accent/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-accent" />
                        Start Selling on AbdiTrade
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Join thousands of sellers and turn your card collection into profit. Choose the option that fits you best.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-2 border-border hover:border-primary/50 transition-all cursor-pointer group">
                          <CardContent className="p-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                              <UserCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Individual Seller</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Perfect for collectors selling their personal cards
                            </p>
                            <Button variant="outline" className="w-full group-hover:border-primary/50">
                              Get Started
                            </Button>
                          </CardContent>
                        </Card>
                        <Card className="border-2 border-border hover:border-accent/50 transition-all cursor-pointer group">
                          <CardContent className="p-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4 group-hover:scale-110 transition-transform">
                              <Building2 className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="font-semibold mb-2">Business Seller</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              For LGS and professional dealers
                            </p>
                            <Button variant="accent" className="w-full shadow-lg">
                              Apply Now
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Wallet Tab */}
                <TabsContent value="wallet" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {walletStats.map((stat, index) => (
                      <Card
                        key={index}
                        className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/30"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                          </div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {stat.label}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Transfer Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-green-500" />
                          Standard Transfer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Processing Time</span>
                            <span className="font-medium">1-3 Business Days</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Fee</span>
                            <span className="font-medium text-green-500">Free</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Label htmlFor="standardAmount">Amount to Transfer</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              id="standardAmount"
                              type="number"
                              placeholder="0.00"
                              className="pl-7"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        </div>
                        <Button variant="outline" className="w-full gap-2 hover:border-green-500/50">
                          <ArrowLeftRight className="h-4 w-4" />
                          Initiate Standard Transfer
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-accent/20">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          Express Transfer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Processing Time</span>
                            <span className="font-medium">Within 30 Minutes</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Fee</span>
                            <span className="font-medium text-accent">2% of Amount</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Label htmlFor="expressAmount">Amount to Transfer</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              id="expressAmount"
                              type="number"
                              placeholder="0.00"
                              className="pl-7"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Fee will be calculated at checkout
                          </p>
                        </div>
                        <Button variant="accent" className="w-full gap-2 shadow-lg">
                          <TrendingUp className="h-4 w-4" />
                          Initiate Express Transfer
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Wallet className="h-5 w-5" />
                          Transaction History
                        </CardTitle>
                        <Button variant="outline" className="gap-2 hover:border-primary/50">
                          <Plus className="h-4 w-4" />
                          Add Funds
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No transactions yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Start buying or selling to see your wallet activity
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payments Tab */}
                <TabsContent value="payments" className="space-y-6 mt-6">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Payment Methods
                        </CardTitle>
                        <Button variant="outline" className="gap-2 hover:border-primary/50">
                          <Plus className="h-4 w-4" />
                          Add Payment
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No payment methods added</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add a payment method to make purchases easier
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6 mt-6">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" />
                      </div>
                      <Button variant="accent" className="w-full gap-2 hover:scale-105 transition-all shadow-lg">
                        Update Password
                      </Button>
                      <Separator />
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
                    Updated 11:55:32 PM
                  </div>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cards Listed</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Successful Sales</span>
                    <span className="font-semibold">0</span>
                  </div>
                </CardContent>
              </Card>

              {/* Community Rules */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
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

export default Profile;
