import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ArrowLeft,
  Send,
  ThumbsUp,
  Pin,
  MoreHorizontal,
  Image as ImageIcon,
  Star,
  TrendingUp,
  Package,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import logo from "@/assets/abditrade-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Guild {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  image: string;
  isJoined: boolean;
  trending?: boolean;
  isPrivate?: boolean;
}

interface Post {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
  reputation: number;
  userType: string;
  postType: "discussion" | "trade" | "marketplace";
  imageUrl?: string;
  price?: number;
  cardData?: {
    name: string;
    set: string;
    condition: string;
  };
}

interface CardData {
  id: string;
  name: string;
  game: string;
  set?: string;
  rarity?: string;
  image?: string;
  price?: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timeAgo: string;
  likes: number;
}

const GuildDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  
  const [guild, setGuild] = useState<Guild | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("feed");

  // Enhanced Post Creation States
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState<'Discussion' | 'Trade' | 'Buy' | 'Sell'>('Discussion');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [cardSearch, setCardSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CardData[]>([]);

  // Fetch guild data
  useEffect(() => {
    if (!id) return;
    
    const fetchGuild = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/guilds/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGuild(data.guild);
        } else {
          setError("Guild not found");
        }
      } catch (err) {
        console.error('Error fetching guild:', err);
        setError("Failed to load guild");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuild();
  }, [id]);

  // Fetch guild posts
  useEffect(() => {
    if (!id) return;
    
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/guilds/${id}/posts`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [id]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !id) return;

    try {
      const postData: {
        content: string;
        postType: string;
        cardData?: CardData;
      } = {
        content: newPost,
        postType: postType.toLowerCase(), // Always send postType: "discussion", "trade", "sell", "buy"
      };
      
      if (selectedCard && (postType === 'Trade' || postType === 'Sell' || postType === 'Buy')) {
        postData.cardData = selectedCard;
      }

      const response = await fetch(`/api/guilds/${id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost("");
        setSelectedCard(null);
        setPostType('Discussion');
        setShowPostModal(false);
        toast({
          title: "Post Created",
          description: "Your post has been shared with the guild.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const searchCards = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Use guild's category as the game parameter for backend API
      const gameParam = guild?.category || 'pokemon';
      const response = await fetch(`/api/cards?game=${encodeURIComponent(gameParam)}&q=${encodeURIComponent(query)}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns array directly or { data: [...] }
        setSearchResults(Array.isArray(data) ? data : (data.cards || []));
      } else {
        console.error('Card search failed:', response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching cards:', error);
      setSearchResults([]);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/guilds/${id}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, likes: p.likes + 1 } : p
        ));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleJoinGuild = async () => {
    if (!id || !guild) return;

    try {
      const response = await fetch(`/api/guilds/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setGuild({ ...guild, isJoined: true, members: guild.members + 1 });
        toast({
          title: "Success!",
          description: `You've joined ${guild.name}.`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold">Loading guild...</div>
        </div>
      </div>
    );
  }

  if (error || !guild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Guild Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || "The guild you're looking for doesn't exist."}</p>
            <Link href="/guilds">
              <Button>Back to Guilds</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shadow-lg">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center">
            <img src={logo.src} alt="Abditrade" className="h-12" />
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="font-medium group-hover:text-foreground transition-colors">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Guild Header */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Link href="/guilds">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Guilds
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  {guild.trending && (
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                  <Badge variant="outline">{guild.category}</Badge>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-6xl">{guild.image}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{guild.name}</h1>
                  <p className="text-muted-foreground mb-4">{guild.description}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{guild.members.toLocaleString()}</span>
                      <span className="text-muted-foreground">members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{guild.posts.toLocaleString()}</span>
                      <span className="text-muted-foreground">posts</span>
                    </div>
                  </div>
                </div>
                {!guild.isJoined && (
                  <Button size="lg" onClick={handleJoinGuild} className="gap-2">
                    <Users className="h-4 w-4" />
                    Join Guild
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-6">
              {guild.isJoined && (
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <Button 
                      onClick={() => setShowPostModal(true)}
                      variant="outline"
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Share your thoughts with the guild...
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Post Creation Modal */}
              <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create a Post</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Post Type Selector */}
                    <div className="space-y-2">
                      <Label>Post Type</Label>
                      <Select value={postType} onValueChange={(value: 'Discussion' | 'Trade' | 'Buy' | 'Sell') => setPostType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Discussion">Discussion</SelectItem>
                          <SelectItem value="Trade">Trade</SelectItem>
                          <SelectItem value="Buy">Looking to Buy</SelectItem>
                          <SelectItem value="Sell">Selling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Card Selection for Trade/Buy/Sell */}
                    {(postType === 'Trade' || postType === 'Buy' || postType === 'Sell') && (
                      <div className="space-y-3">
                        <Label>Select Card</Label>
                        
                        {/* Card Search */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search for a card..."
                            value={cardSearch}
                            onChange={(e) => {
                              setCardSearch(e.target.value);
                              searchCards(e.target.value);
                            }}
                            className="flex-1"
                          />
                          {cardSearch && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCardSearch("");
                                setSearchResults([]);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <div className="border rounded-lg max-h-60 overflow-y-auto">
                            {searchResults.map((card) => (
                              <div
                                key={card.id}
                                className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                                onClick={() => {
                                  setSelectedCard(card);
                                  setSearchResults([]);
                                  setCardSearch("");
                                }}
                              >
                                {card.image && (
                                  <img src={card.image} alt={card.name} className="h-16 w-12 object-cover rounded" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{card.name}</p>
                                  <p className="text-sm text-muted-foreground">{card.set}</p>
                                  {card.price && <p className="text-sm text-primary font-medium">{card.price}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Selected Card Display */}
                        {selectedCard && (
                          <div className="border rounded-lg p-4 bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {selectedCard.image && (
                                  <img src={selectedCard.image} alt={selectedCard.name} className="h-20 w-14 object-cover rounded" />
                                )}
                                <div>
                                  <p className="font-medium">{selectedCard.name}</p>
                                  <p className="text-sm text-muted-foreground">{selectedCard.set}</p>
                                  {selectedCard.price && <p className="text-sm text-primary font-medium">{selectedCard.price}</p>}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedCard(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        placeholder={
                          postType === 'Discussion' 
                            ? "What's on your mind?" 
                            : postType === 'Trade'
                            ? "Describe what you're looking to trade..."
                            : postType === 'Buy'
                            ? "Describe what you're looking to buy..."
                            : "Describe your card for sale..."
                        }
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setShowPostModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                  <TabsTrigger value="trades">Trades</TabsTrigger>
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="space-y-4 mt-4">
                  {posts.length === 0 ? (
                    <Card className="shadow-lg">
                      <CardContent className="p-12 text-center">
                        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    posts.filter(p => p.postType === 'discussion').map((post) => (
                      <Card key={post.id} className="shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{post.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{post.author}</span>
                                    <Badge variant="outline" className="text-xs">{post.userType}</Badge>
                                    {post.reputation >= 4.5 && (
                                      <div className="flex items-center gap-1 text-xs text-amber-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        {post.reputation}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                                </div>
                                {post.isPinned && (
                                  <Badge variant="secondary" className="gap-1">
                                    <Pin className="h-3 w-3" />
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              <p className="mb-4">{post.content}</p>
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleLikePost(post.id)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.comments}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="trades" className="space-y-4 mt-4">
                  {posts.filter(p => p.postType === 'trade').length === 0 ? (
                    <Card className="shadow-lg">
                      <CardContent className="p-12 text-center">
                        <ArrowLeftRight className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No trade posts yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    posts.filter(p => p.postType === 'trade').map((post) => (
                      <Card key={post.id} className="shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{post.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{post.author}</span>
                                <Badge variant="default" className="gap-1">
                                  <ArrowLeftRight className="h-3 w-3" />
                                  Trade
                                </Badge>
                              </div>
                              <p className="mb-4">{post.content}</p>
                              <Button size="sm">View Trade Details</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="marketplace" className="space-y-4 mt-4">
                  {posts.filter(p => p.postType === 'marketplace').length === 0 ? (
                    <Card className="shadow-lg">
                      <CardContent className="p-12 text-center">
                        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No marketplace listings yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    posts.filter(p => p.postType === 'marketplace').map((post) => (
                      <Card key={post.id} className="shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{post.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{post.author}</span>
                                  <Badge variant="default" className="gap-1">
                                    <Store className="h-3 w-3" />
                                    For Sale
                                  </Badge>
                                </div>
                                {post.price && (
                                  <span className="text-lg font-bold text-primary">
                                    ${post.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <p className="mb-4">{post.content}</p>
                              <Button size="sm">Buy Now</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Guild Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">1. Be respectful to all members</p>
                  <p className="text-muted-foreground">2. No spam or self-promotion</p>
                  <p className="text-muted-foreground">3. Follow Abditrade's terms of service</p>
                  <p className="text-muted-foreground">4. Keep posts relevant to {guild.category}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Top Contributors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Collector123", "CardMaster", "TradePro"].map((name, i) => (
                    <div key={name} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{name}</span>
                      <Badge variant="secondary" className="ml-auto">#{i + 1}</Badge>
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

export default GuildDetailPage;
