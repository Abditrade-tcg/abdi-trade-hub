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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface ExtendedUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface Guild {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  image: string;
  isJoined: boolean;
  trending: boolean;
  createdAt?: string;
  createdBy?: string;
  isPrivate?: boolean;
}

interface Activity {
  user: string;
  action: string;
  guild: string;
  time: string;
}

interface GuildStats {
  totalGuilds: number;
  activeMembers: number;
  postsToday: number;
}

const Guilds = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState<GuildStats>({ totalGuilds: 0, activeMembers: 0, postsToday: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if user can manage guild
  const canManageGuild = (guild: Guild): boolean => {
    if (!session?.user) return false;
    
    const user = session.user as ExtendedUser;
    
    // Check if user is Trust & Safety team member
    const isTrustAndSafety = user.role === 'trust_and_safety' || 
                             user.role === 'admin' ||
                             user.email?.includes('@abditrade.com');
    
    // Check if user is the guild creator
    const isCreator = guild.createdBy === user.id;
    
    return isTrustAndSafety || isCreator;
  };

  // Fetch guilds from API
  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/guilds');
        if (response.ok) {
          const data = await response.json();
          setGuilds(data.guilds || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load guilds');
        console.error('Error fetching guilds:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuilds();
  }, []);

  // Fetch recent activity
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/guilds/activity');
        if (response.ok) {
          const data = await response.json();
          setRecentActivity(data.activities || []);
        }
      } catch (err) {
        console.error('Error fetching activity:', err);
      }
    };
    fetchActivity();
  }, []);

  // Fetch guild statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/guilds/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats || { totalGuilds: 0, activeMembers: 0, postsToday: 0 });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Handle join/leave guild
  const handleJoinGuild = async (guildId: string) => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/join`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setGuilds(guilds.map(g => 
          g.id === guildId ? { ...g, isJoined: true, members: g.members + 1 } : g
        ));
        toast({
          title: "Success!",
          description: "You've joined the guild.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to join guild. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error joining guild:', err);
      toast({
        title: "Error",
        description: "Failed to join guild. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveGuild = async (guildId: string) => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/leave`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setGuilds(guilds.map(g => 
          g.id === guildId ? { ...g, isJoined: false, members: g.members - 1 } : g
        ));
        toast({
          title: "Left Guild",
          description: "You've left the guild.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to leave guild. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error leaving guild:', err);
      toast({
        title: "Error",
        description: "Failed to leave guild. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle create guild
  const handleCreateGuild = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('/api/guilds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          rules: formData.get('rules'),
          category: formData.get('category'),
          isPrivate: formData.get('privacy') === 'private',
        }),
      });
      
      if (response.ok) {
        const newGuild = await response.json();
        // Add the new guild to the list
        setGuilds([newGuild, ...guilds]);
        // Reset the form before closing dialog
        form.reset();
        // Close the dialog
        setShowCreateDialog(false);
        // Show success toast
        toast({
          title: "Guild Created!",
          description: `${newGuild.name || 'Your guild'} has been created successfully.`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || 'Failed to create guild. Please try again.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error creating guild:', err);
      toast({
        title: "Error",
        description: "Failed to create guild. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle manage guild
  const handleManageGuild = (guild: Guild) => {
    setSelectedGuild(guild);
    setShowManageDialog(true);
  };

  // Handle delete guild
  const handleDeleteGuild = async () => {
    if (!selectedGuild) return;
    
    try {
      const response = await fetch(`/api/guilds/${selectedGuild.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setGuilds(guilds.filter(g => g.id !== selectedGuild.id));
        setShowManageDialog(false);
        setSelectedGuild(null);
        toast({
          title: "Guild Deleted",
          description: "The guild has been permanently deleted.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || 'Failed to delete guild.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error deleting guild:', err);
      toast({
        title: "Error",
        description: "Failed to delete guild. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle toggle privacy
  const handleTogglePrivacy = async () => {
    if (!selectedGuild) return;
    
    try {
      const response = await fetch(`/api/guilds/${selectedGuild.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPrivate: !selectedGuild.isPrivate
        })
      });
      
      if (response.ok) {
        const updatedGuild = await response.json();
        setGuilds(guilds.map(g => g.id === selectedGuild.id ? updatedGuild : g));
        setSelectedGuild(updatedGuild);
        toast({
          title: "Privacy Updated",
          description: `Guild is now ${updatedGuild.isPrivate ? 'private' : 'public'}.`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || 'Failed to update privacy.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error updating privacy:', err);
      toast({
        title: "Error",
        description: "Failed to update privacy. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  // Dynamic data from state
  const featuredGuilds = guilds.filter(g => g.trending);
  const myGuilds = guilds.filter(g => g.isJoined);

  // Apply search and category filters
  const filteredGuilds = guilds.filter(guild => {
    const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guild.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           selectedCategory === "All" || 
                           guild.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFeatured = filteredGuilds.filter(g => g.trending);
  const filteredMyGuilds = filteredGuilds.filter(g => g.isJoined);

  // Calculate dynamic category counts
  const categoryIcons: Record<string, string> = {
    "All": "🎯",
    "Pokemon": "🎴",
    "Magic": "🔮",
    "Yu-Gi-Oh": "⚔️",
    "One Piece": "🏴‍☠️",
    "Digimon": "📱",
    "Dragon Ball": "🐉",
    "Gundam": "🤖",
    "Sports Cards": "⚾",
    "Vintage": "💎",
  };

  const categories = [
    { name: "All", count: guilds.length, icon: categoryIcons["All"] },
    ...Array.from(new Set(guilds.map(g => g.category)))
      .map(cat => ({
        name: cat,
        count: guilds.filter(g => g.category === cat).length,
        icon: categoryIcons[cat] || "🎴"
      }))
      .sort((a, b) => b.count - a.count)
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shadow-lg">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center">
            <img src={logo.src} alt="Abditrade" className="h-12" />
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
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
                  <form onSubmit={handleCreateGuild} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Guild Name</Label>
                      <Input id="name" name="name" placeholder="Pokemon Card Masters" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Tell members what this guild is about..."
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rules">Guild Rules</Label>
                      <Textarea
                        id="rules"
                        name="rules"
                        placeholder="1. Be respectful to all members&#10;2. No spam or self-promotion&#10;3. Keep discussions on-topic&#10;4. Follow community guidelines"
                        rows={4}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Set the rules that all members must follow</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pokemon">Pokemon</SelectItem>
                          <SelectItem value="Magic">Magic: The Gathering</SelectItem>
                          <SelectItem value="Yu-Gi-Oh">Yu-Gi-Oh</SelectItem>
                          <SelectItem value="One Piece">One Piece</SelectItem>
                          <SelectItem value="Digimon">Digimon</SelectItem>
                          <SelectItem value="Dragon Ball">Dragon Ball</SelectItem>
                          <SelectItem value="Gundam">Gundam</SelectItem>
                          <SelectItem value="Sports Cards">Sports Cards</SelectItem>
                          <SelectItem value="Vintage">Vintage</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privacy">Privacy</Label>
                      <Select name="privacy" defaultValue="public">
                        <SelectTrigger>
                          <SelectValue placeholder="Select privacy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can join</SelectItem>
                          <SelectItem value="private">Private - Approval required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Create Guild</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Trading Guilds</h1>
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
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading guilds...</div>
                  ) : error ? (
                    <div className="text-center py-12 text-destructive">Error: {error}</div>
                  ) : filteredFeatured.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No featured guilds found</div>
                  ) : (
                    filteredFeatured.map((guild) => (
                    <Card
                      key={guild.id}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => window.location.href = `/guilds/${guild.id}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{guild.image}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div onClick={(e) => e.stopPropagation()}>
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
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLeaveGuild(guild.id);
                                  }}
                                >
                                  <Shield className="h-3 w-3" />
                                  Joined
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  className="gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinGuild(guild.id);
                                  }}
                                >
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
                    ))
                  )}
                </TabsContent>

                <TabsContent value="my-guilds" className="space-y-4 mt-6">
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading guilds...</div>
                  ) : filteredMyGuilds.length > 0 ? (
                    filteredMyGuilds.map((guild) => (
                      <Card
                        key={guild.id}
                        className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => window.location.href = `/guilds/${guild.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{guild.image}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-bold">{guild.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{guild.description}</p>
                                </div>
                                {canManageGuild(guild) ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleManageGuild(guild);
                                    }}
                                  >
                                    <Settings className="h-3 w-3" />
                                    Manage
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/guilds/${guild.id}`;
                                    }}
                                  >
                                    View Guild
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
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading guilds...</div>
                  ) : filteredFeatured.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No trending guilds found</div>
                  ) : (
                    filteredFeatured.map((guild) => (
                      <Card
                        key={guild.id}
                        className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => window.location.href = `/guilds/${guild.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{guild.image}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div onClick={(e) => e.stopPropagation()}>
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
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLeaveGuild(guild.id);
                                    }}
                                  >
                                    Joined
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleJoinGuild(guild.id);
                                    }}
                                  >
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
                    ))
                  )}
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
                    <span className="font-bold">{stats.totalGuilds}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Members</span>
                    <span className="font-bold">{stats.activeMembers.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posts Today</span>
                    <span className="font-bold">{stats.postsToday.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Plus className="h-4 w-4" />
                        Create Guild
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create a New Guild</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateGuild} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name-sidebar">Guild Name</Label>
                          <Input id="name-sidebar" name="name" placeholder="Pokemon Card Masters" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description-sidebar">Description</Label>
                          <Textarea
                            id="description-sidebar"
                            name="description"
                            placeholder="Tell members what this guild is about..."
                            rows={3}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-sidebar">Category</Label>
                          <Select name="category" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pokemon">Pokemon</SelectItem>
                              <SelectItem value="Magic">Magic: The Gathering</SelectItem>
                              <SelectItem value="Yu-Gi-Oh">Yu-Gi-Oh</SelectItem>
                              <SelectItem value="One Piece">One Piece</SelectItem>
                              <SelectItem value="Digimon">Digimon</SelectItem>
                              <SelectItem value="Dragon Ball">Dragon Ball</SelectItem>
                              <SelectItem value="Gundam">Gundam</SelectItem>
                              <SelectItem value="Sports Cards">Sports Cards</SelectItem>
                              <SelectItem value="Vintage">Vintage</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="privacy-sidebar">Privacy</Label>
                          <Select name="privacy" defaultValue="public">
                            <SelectTrigger>
                              <SelectValue placeholder="Select privacy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public - Anyone can join</SelectItem>
                              <SelectItem value="private">Private - Approval required</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Create Guild</Button>
                      </form>
                    </DialogContent>
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

      {/* Manage Guild Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Guild</DialogTitle>
          </DialogHeader>
          {selectedGuild && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedGuild.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedGuild.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privacy-toggle">Private Guild</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedGuild.isPrivate ? 'Approval required to join' : 'Anyone can join'}
                  </p>
                </div>
                <Switch
                  id="privacy-toggle"
                  checked={selectedGuild.isPrivate || false}
                  onCheckedChange={handleTogglePrivacy}
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Guild
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the guild
                        &quot;{selectedGuild.name}&quot; and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteGuild}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Guild
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Guilds;
