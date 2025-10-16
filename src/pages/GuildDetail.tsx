import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Search,
  Bell,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import logo from "@/assets/abditrade-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { TradeModal } from "@/components/modals/TradeModal";
import { CardDetailModal } from "@/components/modals/CardDetailModal";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

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
  isPrivate: boolean;
  creatorId?: string;
}

interface Post {
  id: number;
  author: string;
  authorId?: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
  reputation: number;
  userType: string;
  guildOrigin: string;
  postType: string;
  price?: string;
  isLiked?: boolean;
  recentComments?: Array<{ 
    id: number;
    author: string; 
    content: string; 
    avatar: string;
    timeAgo: string;
  }>;
}

interface Comment {
  id: number;
  postId: number;
  author: string;
  authorId: string;
  content: string;
  avatar: string;
  timeAgo: string;
  createdAt: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  joined: string;
}

interface Card {
  id: string;
  name: string;
  game: string;
  set?: string;
  rarity?: string;
  image?: string;
  price?: string;
}

const GuildDetail = () => {
  const router = useRouter();
  const { id: guildId } = router.query;
  const { toast } = useToast();
  const { data: session } = useSession();
  
  const [guild, setGuild] = useState<Guild | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
  const [postComments, setPostComments] = useState<{ [key: number]: Comment[] }>({});
  
  // Enhanced Post Creation States
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState<'Discussion' | 'Trade' | 'Buy' | 'Sell'>('Discussion');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardSearch, setCardSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  
  // Moderation States
  const [showModPanel, setShowModPanel] = useState(false);

  // Check if current user is guild creator/moderator
  const isGuildModerator = guild?.creatorId === session?.userId;

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

  const fetchGuildData = async () => {
    try {
      const response = await fetch(`/api/guilds/${guildId}`);
      if (response.ok) {
        const data = await response.json();
        setGuild(data.guild);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch guild details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching guild:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guild details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/posts`);
      if (response.ok) {
        const data = await response.json();
        // Initialize isLiked property if not set from API
        const postsWithLikeState = (data.posts || []).map((post: Post) => ({
          ...post,
          isLiked: post.isLiked || false, // Ensure isLiked is always a boolean
        }));
        setPosts(postsWithLikeState);
        
        // Fetch comment previews for each post
        postsWithLikeState.forEach((post: Post) => {
          if (post.comments > 0) {
            fetchCommentPreview(post.id);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCommentPreview = async (postId: number) => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/posts/${postId}/comments?limit=3`);
      if (response.ok) {
        const data = await response.json();
        setPostComments(prev => ({ ...prev, [postId]: data.comments || [] }));
      }
    } catch (error) {
      console.error('Error fetching comment preview:', error);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setPostComments(prev => ({ ...prev, [postId]: data.comments || [] }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (guildId) {
      fetchGuildData();
      fetchMembers();
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const postData: {
        content: string;
        postType: string;
        cardData?: Card;
      } = {
        content: newPost,
        postType: postType.toLowerCase(), // Always send postType: "discussion", "trade", "sell", "buy"
      };
      
      if (selectedCard && (postType === 'Trade' || postType === 'Sell' || postType === 'Buy')) {
        postData.cardData = selectedCard;
      }

      const response = await fetch(`/api/guilds/${guildId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setNewPost("");
        setSelectedCard(null);
        setPostType('Discussion');
        setShowPostModal(false);
        fetchPosts(); // Refresh posts
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
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

  // Moderation Functions
  const handlePinPost = async (postId: number) => {
    try {
      const response = await fetch(`/api/guilds/${guildId}/posts/${postId}/pin`, {
        method: 'POST',
      });

      if (response.ok) {
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId ? { ...post, isPinned: !post.isPinned } : post
        ));
        toast({
          title: "Success",
          description: posts.find(p => p.id === postId)?.isPinned ? "Post unpinned" : "Post pinned",
        });
      } else {
        throw new Error('Failed to pin/unpin post');
      }
    } catch (error) {
      console.error('Error pinning post:', error);
      toast({
        title: "Error",
        description: "Failed to pin/unpin post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/guilds/${guildId}/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`/api/guilds/${guildId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
        toast({
          title: "Success",
          description: "Member removed successfully",
        });
      } else {
        throw new Error('Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const handleLikePost = async (postId: number) => {
    // Get the current post state before updating
    const currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;

    const wasLiked = currentPost.isLiked;

    try {
      // Optimistically update the UI first
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: wasLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !wasLiked
          };
        }
        return post;
      }));

      const response = await fetch(`/api/guilds/${guildId}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        // Revert on error
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: wasLiked ? post.likes + 1 : post.likes - 1,
              isLiked: wasLiked
            };
          }
          return post;
        }));
        
        toast({
          title: "Error",
          description: "Failed to like post",
          variant: "destructive",
        });
        return;
      }

      // Create notification for the post author (only when liking, not unliking)
      if (!wasLiked && currentPost.authorId && currentPost.authorId !== session?.user?.id) {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: currentPost.authorId,
            type: 'like',
            message: `${session?.user?.name || 'Someone'} liked your post in ${guild?.name}`,
            link: `/guilds/${guildId}`,
          }),
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      
      // Revert on error
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: wasLiked ? post.likes + 1 : post.likes - 1,
            isLiked: wasLiked
          };
        }
        return post;
      }));
      
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (postId: number) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      const response = await fetch(`/api/guilds/${guildId}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        // Clear input
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        
        // Refresh comments
        await fetchComments(postId);
        
        // Update comment count
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId ? { ...post, comments: post.comments + 1 } : post
        ));

        // Create notification for the post author
        const post = posts.find(p => p.id === postId);
        if (post && post.authorId && post.authorId !== session?.user?.id) {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientId: post.authorId,
              type: 'comment',
              message: `${session?.user?.name || 'Someone'} commented on your post in ${guild?.name}`,
              link: `/guilds/${guildId}`,
            }),
          });
        }

        toast({
          title: "Success",
          description: "Comment added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const toggleComments = async (postId: number) => {
    const isExpanded = expandedComments[postId];
    
    if (!isExpanded && !postComments[postId]) {
      await fetchComments(postId);
    }
    
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading guild...</p>
        </div>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Guild Not Found</h2>
          <p className="text-muted-foreground mb-4">The guild you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/guilds')}>Back to Guilds</Button>
        </div>
      </div>
    );
  }

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
                {session?.user?.username?.[0]?.toUpperCase() || session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.username || session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
              </p>
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
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <Link href="/guilds">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Guilds
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>

              {/* Notifications */}
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center text-destructive-foreground">
                    3
                  </span>
                </Button>
              </Link>

              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Guild Header */}
          <Card className="mb-6 shadow-lg animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{guild.image}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{guild.name}</h1>
                      <p className="text-muted-foreground mb-4">{guild.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{guild.members.toLocaleString()}</span>
                          <span className="text-muted-foreground">members</span>
                        </div>
                        <Badge>{guild.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isGuildModerator && (
                        <Button size="lg" variant="outline" className="gap-2" onClick={() => setShowModPanel(!showModPanel)}>
                          <Pin className="h-4 w-4" />
                          Moderate
                        </Button>
                      )}
                      {guild.isJoined ? (
                        <Button size="lg" className="gap-2" disabled>
                          <Users className="h-4 w-4" />
                          Joined
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          className="gap-2"
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/guilds/${guildId}/members`, {
                                method: 'POST',
                              });
                              if (response.ok) {
                                toast({
                                  title: "Success",
                                  description: "You've joined the guild!",
                                });
                                fetchGuildData();
                                fetchMembers();
                              }
                            } catch (error) {
                              console.error('Error joining guild:', error);
                              toast({
                                title: "Error",
                                description: "Failed to join guild",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Users className="h-4 w-4" />
                          Join Guild
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Panel */}
          {isGuildModerator && showModPanel && (
            <Card className="mb-6 shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pin className="h-5 w-5" />
                  Moderation Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="members">
                  <TabsList>
                    <TabsTrigger value="members">Manage Members</TabsTrigger>
                    <TabsTrigger value="settings">Guild Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="members" className="space-y-3 mt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage guild members and their access
                    </p>
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role} • Joined {member.joined}</p>
                          </div>
                        </div>
                        {member.id !== session?.userId && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-3 mt-4">
                    <p className="text-sm text-muted-foreground">
                      Guild settings coming soon...
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1fr,320px] gap-6">
            {/* Main Feed */}
            <div className="space-y-6">
              {/* Create Post */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {session?.user?.username?.[0]?.toUpperCase() || session?.user?.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPostModal(true)}
                      >
                        Share your thoughts, trades, or questions...
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

              {/* Posts Feed */}
              <Tabs defaultValue="recent" className="w-full">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="pinned">Pinned</TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-4 mt-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        {post.isPinned && (
                          <div className="flex items-center gap-2 mb-4 text-sm text-primary">
                            <Pin className="h-4 w-4" />
                            <span className="font-medium">Pinned by moderators</span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/50">
                              {post.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{post.author}</p>
                                    {/* Post Type Badge */}
                                    {post.postType === "trade" && (
                                      <Badge variant="outline" className="text-xs h-5 border-blue-500 text-blue-600 dark:text-blue-400">
                                        🔄 Trade
                                      </Badge>
                                    )}
                                    {post.postType === "sell" && (
                                      <Badge variant="outline" className="text-xs h-5 border-green-500 text-green-600 dark:text-green-400">
                                        💰 Selling
                                      </Badge>
                                    )}
                                    {post.postType === "buy" && (
                                      <Badge variant="outline" className="text-xs h-5 border-purple-500 text-purple-600 dark:text-purple-400">
                                        🛒 Buying
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-accent fill-accent" />
                                      <span className="text-xs font-medium text-muted-foreground">{post.reputation}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <Badge variant={post.userType === "LGS" ? "default" : "outline"} className="text-xs h-5">
                                      {post.userType}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">{post.guildOrigin}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                                {isGuildModerator && (
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handlePinPost(post.id)}
                                      title={post.isPinned ? "Unpin post" : "Pin post"}
                                    >
                                      <Pin className={`h-4 w-4 ${post.isPinned ? 'fill-current text-primary' : ''}`} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeletePost(post.id)}
                                      title="Delete post"
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                {!isGuildModerator && (
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm mb-4 mt-2">{post.content}</p>
                            
                            {/* Quick Action Buttons */}
                            {post.postType !== "discussion" && (
                              <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    {post.price && (
                                      <p className="text-lg font-bold text-primary">{post.price}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      {post.postType === "trade" && "Open to trade offers"}
                                      {post.postType === "sell" && "Available for purchase"}
                                      {post.postType === "buy" && "Looking to buy"}
                                    </p>
                                  </div>
                                   <div className="flex gap-2">
                                    {post.postType === "trade" && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="gap-2"
                                          onClick={() => {
                                            setSelectedPost(post);
                                            setShowCardDetail(true);
                                          }}
                                        >
                                          View Details
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          className="gap-2"
                                          onClick={() => {
                                            setSelectedPost(post);
                                            setShowTrade(true);
                                          }}
                                        >
                                          <ArrowLeftRight className="h-4 w-4" />
                                          Make Offer
                                        </Button>
                                      </>
                                    )}
                                    {post.postType === "sell" && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="gap-2"
                                          onClick={() => {
                                            setSelectedPost(post);
                                            setShowCardDetail(true);
                                          }}
                                        >
                                          View Details
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          className="gap-2"
                                          onClick={() => {
                                            setSelectedPost(post);
                                            setShowCheckout(true);
                                          }}
                                        >
                                          <ShoppingCart className="h-4 w-4" />
                                          Purchase
                                        </Button>
                                      </>
                                    )}
                                    {post.postType === "buy" && (
                                      <Button 
                                        size="sm" 
                                        className="gap-2"
                                        onClick={() => {
                                          setSelectedPost(post);
                                          setShowTrade(true);
                                        }}
                                      >
                                        <Send className="h-4 w-4" />
                                        Submit Offer
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-4 mb-4">
                              <Button 
                                variant={post.isLiked ? "default" : "ghost"}
                                size="sm" 
                                className="gap-2"
                                onClick={() => handleLikePost(post.id)}
                              >
                                <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                {post.likes}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => toggleComments(post.id)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                {post.comments}
                              </Button>
                            </div>

                            {/* Comment Preview - Always show if there are comments */}
                            {!expandedComments[post.id] && postComments[post.id] && postComments[post.id].length > 0 && (
                              <div className="mt-4 pt-4 border-t border-border space-y-3">
                                {postComments[post.id].slice(0, 3).map((comment) => (
                                  <div key={comment.id} className="flex items-start gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs bg-gradient-to-br from-secondary to-secondary/50">
                                        {comment.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm">
                                        <span className="font-medium">{comment.author}</span>
                                        {' '}
                                        <span className="text-muted-foreground">{comment.content}</span>
                                      </p>
                                      <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                    </div>
                                  </div>
                                ))}
                                {post.comments > 3 && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-muted-foreground hover:text-foreground w-full justify-start pl-8"
                                    onClick={() => toggleComments(post.id)}
                                  >
                                    View all {post.comments} comments
                                  </Button>
                                )}
                              </div>
                            )}

                            {/* Full Comments Section - Show when expanded */}
                            {expandedComments[post.id] && (
                              <div className="mt-4 pt-4 border-t border-border space-y-3">
                                <p className="text-sm font-medium text-foreground mb-3">Comments</p>
                                
                                {/* Comment Input */}
                                <div className="flex items-start gap-2 mb-4">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                      {session?.user?.username?.[0]?.toUpperCase() || session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 flex gap-2">
                                    <Input
                                      placeholder="Write a comment..."
                                      value={commentInputs[post.id] || ''}
                                      onChange={(e) => setCommentInputs(prev => ({ 
                                        ...prev, 
                                        [post.id]: e.target.value 
                                      }))}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          handleAddComment(post.id);
                                        }
                                      }}
                                      className="flex-1"
                                    />
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleAddComment(post.id)}
                                      disabled={!commentInputs[post.id]?.trim()}
                                    >
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Comments List */}
                                {postComments[post.id] && postComments[post.id].length > 0 ? (
                                  <div className="space-y-3">
                                    {postComments[post.id].map((comment) => (
                                      <div key={comment.id} className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                                        <Avatar className="h-7 w-7">
                                          <AvatarFallback className="text-xs bg-gradient-to-br from-secondary to-secondary/50">
                                            {comment.avatar}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{comment.author}</p>
                                            <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                          </div>
                                          <p className="text-sm text-foreground mt-1">{comment.content}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    No comments yet. Be the first to comment!
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="popular" className="space-y-4 mt-6">
                  {posts
                    .sort((a, b) => b.likes - a.likes)
                    .map((post) => (
                      <Card key={post.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/50">
                                {post.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{post.author}</p>
                                      {/* Post Type Badge */}
                                      {post.postType === "trade" && (
                                        <Badge variant="outline" className="text-xs h-5 border-blue-500 text-blue-600 dark:text-blue-400">
                                          🔄 Trade
                                        </Badge>
                                      )}
                                      {post.postType === "sell" && (
                                        <Badge variant="outline" className="text-xs h-5 border-green-500 text-green-600 dark:text-green-400">
                                          💰 Selling
                                        </Badge>
                                      )}
                                      {post.postType === "buy" && (
                                        <Badge variant="outline" className="text-xs h-5 border-purple-500 text-purple-600 dark:text-purple-400">
                                          🛒 Buying
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-accent fill-accent" />
                                        <span className="text-xs font-medium text-muted-foreground">{post.reputation}</span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <Badge variant={post.userType === "LGS" ? "default" : "outline"} className="text-xs h-5">
                                        {post.userType}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <span className="text-xs text-muted-foreground">{post.guildOrigin}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm mb-4 mt-2">{post.content}</p>
                              
                              {/* Quick Action Buttons */}
                              {post.postType !== "discussion" && (
                                <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      {post.price && (
                                        <p className="text-lg font-bold text-primary">{post.price}</p>
                                      )}
                                      <p className="text-xs text-muted-foreground">
                                        {post.postType === "trade" && "Open to trade offers"}
                                        {post.postType === "sell" && "Available for purchase"}
                                        {post.postType === "buy" && "Looking to buy"}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      {post.postType === "trade" && (
                                        <Link href="/trades">
                                          <Button size="sm" className="gap-2">
                                            <ArrowLeftRight className="h-4 w-4" />
                                            Make Offer
                                          </Button>
                                        </Link>
                                      )}
                                      {post.postType === "sell" && (
                                        <Link href="/orders">
                                          <Button size="sm" className="gap-2">
                                            <ShoppingCart className="h-4 w-4" />
                                            Purchase
                                          </Button>
                                        </Link>
                                      )}
                                      {post.postType === "buy" && (
                                        <Link href="/trades">
                                          <Button size="sm" className="gap-2">
                                            <Send className="h-4 w-4" />
                                            Submit Offer
                                          </Button>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 mb-4">
                                <Button 
                                  variant={post.isLiked ? "default" : "ghost"}
                                  size="sm" 
                                  className="gap-2"
                                  onClick={() => handleLikePost(post.id)}
                                >
                                  <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                  {post.likes}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-2"
                                  onClick={() => toggleComments(post.id)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  {post.comments}
                                </Button>
                              </div>

                              {/* Comment Preview */}
                              {!expandedComments[post.id] && postComments[post.id] && postComments[post.id].length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border space-y-3">
                                  {postComments[post.id].slice(0, 3).map((comment) => (
                                    <div key={comment.id} className="flex items-start gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs bg-gradient-to-br from-secondary to-secondary/50">
                                          {comment.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                          <span className="font-medium">{comment.author}</span>
                                          {' '}
                                          <span className="text-muted-foreground">{comment.content}</span>
                                        </p>
                                        <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                      </div>
                                    </div>
                                  ))}
                                  {post.comments > 3 && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-muted-foreground hover:text-foreground w-full justify-start pl-8"
                                      onClick={() => toggleComments(post.id)}
                                    >
                                      View all {post.comments} comments
                                    </Button>
                                  )}
                                </div>
                              )}

                              {/* Full Comments Section */}
                              {expandedComments[post.id] && (
                                <div className="mt-4 pt-4 border-t border-border space-y-3">
                                  <p className="text-sm font-medium text-foreground mb-3">Comments</p>
                                  
                                  {/* Comment Input */}
                                  <div className="flex items-start gap-2 mb-4">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                        {session?.user?.name?.[0] || 'U'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 flex gap-2">
                                      <Input
                                        placeholder="Write a comment..."
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => setCommentInputs(prev => ({ 
                                          ...prev, 
                                          [post.id]: e.target.value 
                                        }))}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment(post.id);
                                          }
                                        }}
                                        className="flex-1"
                                      />
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleAddComment(post.id)}
                                        disabled={!commentInputs[post.id]?.trim()}
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Comments List */}
                                  {postComments[post.id] && postComments[post.id].length > 0 ? (
                                    <div className="space-y-3">
                                      {postComments[post.id].map((comment) => (
                                        <div key={comment.id} className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                                          <Avatar className="h-7 w-7">
                                            <AvatarFallback className="text-xs bg-gradient-to-br from-secondary to-secondary/50">
                                              {comment.avatar}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <p className="text-sm font-medium">{comment.author}</p>
                                              <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                            </div>
                                            <p className="text-sm text-foreground mt-1">{comment.content}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                      No comments yet. Be the first to comment!
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="pinned" className="space-y-4 mt-6">
                  {posts
                    .filter((post) => post.isPinned)
                    .map((post) => (
                      <Card key={post.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-4 text-sm text-primary">
                            <Pin className="h-4 w-4" />
                            <span className="font-medium">Pinned by moderators</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/50">
                                {post.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{post.author}</p>
                                      {/* Post Type Badge */}
                                      {post.postType === "trade" && (
                                        <Badge variant="outline" className="text-xs h-5 border-blue-500 text-blue-600 dark:text-blue-400">
                                          🔄 Trade
                                        </Badge>
                                      )}
                                      {post.postType === "sell" && (
                                        <Badge variant="outline" className="text-xs h-5 border-green-500 text-green-600 dark:text-green-400">
                                          💰 Selling
                                        </Badge>
                                      )}
                                      {post.postType === "buy" && (
                                        <Badge variant="outline" className="text-xs h-5 border-purple-500 text-purple-600 dark:text-purple-400">
                                          🛒 Buying
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-accent fill-accent" />
                                        <span className="text-xs font-medium text-muted-foreground">{post.reputation}</span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <Badge variant={post.userType === "LGS" ? "default" : "outline"} className="text-xs h-5">
                                        {post.userType}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <span className="text-xs text-muted-foreground">{post.guildOrigin}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm mb-4 mt-2">{post.content}</p>
                              
                              {/* Quick Action Buttons */}
                              {post.postType !== "discussion" && (
                                <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      {post.price && (
                                        <p className="text-lg font-bold text-primary">{post.price}</p>
                                      )}
                                      <p className="text-xs text-muted-foreground">
                                        {post.postType === "trade" && "Open to trade offers"}
                                        {post.postType === "sell" && "Available for purchase"}
                                        {post.postType === "buy" && "Looking to buy"}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      {post.postType === "trade" && (
                                        <Link href="/trades">
                                          <Button size="sm" className="gap-2">
                                            <ArrowLeftRight className="h-4 w-4" />
                                            Make Offer
                                          </Button>
                                        </Link>
                                      )}
                                      {post.postType === "sell" && (
                                        <Link href="/orders">
                                          <Button size="sm" className="gap-2">
                                            <ShoppingCart className="h-4 w-4" />
                                            Purchase
                                          </Button>
                                        </Link>
                                      )}
                                      {post.postType === "buy" && (
                                        <Link href="/trades">
                                          <Button size="sm" className="gap-2">
                                            <Send className="h-4 w-4" />
                                            Submit Offer
                                          </Button>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 mb-4">
                                <Button 
                                  variant={post.isLiked ? "default" : "ghost"}
                                  size="sm" 
                                  className="gap-2"
                                  onClick={() => handleLikePost(post.id)}
                                >
                                  <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                  {post.likes}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-2"
                                  onClick={() => toggleComments(post.id)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  {post.comments}
                                </Button>
                              </div>

                              {/* Comment Preview */}
                              {!expandedComments[post.id] && postComments[post.id] && postComments[post.id].length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border space-y-3">
                                  {postComments[post.id].slice(0, 3).map((comment) => (
                                    <div key={comment.id} className="flex items-start gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs bg-gradient-to-br from-secondary to-secondary/50">
                                          {comment.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                          <span className="font-medium">{comment.author}</span>
                                          {' '}
                                          <span className="text-muted-foreground">{comment.content}</span>
                                        </p>
                                        <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                      </div>
                                    </div>
                                  ))}
                                  {post.comments > 3 && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-muted-foreground hover:text-foreground w-full justify-start pl-8"
                                      onClick={() => toggleComments(post.id)}
                                    >
                                      View all {post.comments} comments
                                    </Button>
                                  )}
                                </div>
                              )}

                              {/* Full Comments Section */}
                              {expandedComments[post.id] && (
                                <div className="mt-4 pt-4 border-t border-border space-y-3">
                                  <p className="text-sm font-medium text-foreground mb-3">Comments</p>
                                  
                                  {/* Comment Input */}
                                  <div className="flex items-start gap-2 mb-4">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                        {session?.user?.name?.[0] || 'U'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 flex gap-2">
                                      <Input
                                        placeholder="Write a comment..."
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => setCommentInputs(prev => ({ 
                                          ...prev, 
                                          [post.id]: e.target.value 
                                        }))}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment(post.id);
                                          }
                                        }}
                                        className="flex-1"
                                      />
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleAddComment(post.id)}
                                        disabled={!commentInputs[post.id]?.trim()}
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Comments List */}
                                  {postComments[post.id] && postComments[post.id].length > 0 ? (
                                    <div className="space-y-3">
                                      {postComments[post.id].map((comment) => (
                                        <div key={comment.id} className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                                          <Avatar className="h-7 w-7">
                                            <AvatarFallback className="text-xs bg-gradient-to-br from-secondary to-secondary/50">
                                              {comment.avatar}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <p className="text-sm font-medium">{comment.author}</p>
                                              <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                            </div>
                                            <p className="text-sm text-foreground mt-1">{comment.content}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                      No comments yet. Be the first to comment!
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* About Guild */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{guild.description}</p>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">Jan 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline">{guild.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guild Rules */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Guild Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <p className="font-medium mb-1">1. Be respectful</p>
                    <p className="text-muted-foreground text-xs">Treat all members with respect</p>
                  </div>
                  <Separator />
                  <div className="text-sm">
                    <p className="font-medium mb-1">2. No spam</p>
                    <p className="text-muted-foreground text-xs">Keep content relevant to trading cards</p>
                  </div>
                  <Separator />
                  <div className="text-sm">
                    <p className="font-medium mb-1">3. Verified trades only</p>
                    <p className="text-muted-foreground text-xs">Use platform verification for all trades</p>
                  </div>
                </CardContent>
              </Card>

              {/* Top Members */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Top Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {members.slice(0, 5).map((member, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      {index < members.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedPost && (
        <>
          <CheckoutModal
            open={showCheckout}
            onOpenChange={setShowCheckout}
            items={[
              {
                name: `${selectedPost.content.substring(0, 50)}...`,
                price: parseFloat(selectedPost.price?.replace(/[$,]/g, "") || "0"),
                quantity: 1,
              },
            ]}
            shippingOption="standard"
          />

          <TradeModal
            open={showTrade}
            onOpenChange={setShowTrade}
            otherUser={{
              name: selectedPost.author,
              reputation: selectedPost.reputation,
              items: [
                {
                  id: "1",
                  name: `${selectedPost.content.substring(0, 50)}...`,
                  condition: "Near Mint",
                  value: parseFloat(selectedPost.price?.replace(/[$,]/g, "") || "100"),
                },
              ],
            }}
            currentUserItems={[
              { id: "1", name: "Charizard VMAX", condition: "Near Mint", value: 150 },
              { id: "2", name: "Pikachu V", condition: "Mint", value: 75 },
              { id: "3", name: "Mewtwo EX", condition: "Lightly Played", value: 50 },
              { id: "4", name: "Umbreon VMAX", condition: "Near Mint", value: 200 },
            ]}
          />

          <CardDetailModal
            open={showCardDetail}
            onOpenChange={setShowCardDetail}
            card={{
              name: `${selectedPost.content.substring(0, 40)}`,
              set: "Base Set",
              rarity: "Rare Holo",
              price: parseFloat(selectedPost.price?.replace(/[$,]/g, "") || "100"),
              avgPrice: parseFloat(selectedPost.price?.replace(/[$,]/g, "") || "100") * 0.9,
              condition: "Near Mint",
              cardNumber: "4",
              description: selectedPost.content,
              seller: {
                name: selectedPost.author,
                reputation: selectedPost.reputation,
              },
              availableForTrade: selectedPost.postType === "trade" || selectedPost.postType === "sell",
            }}
          />
        </>
      )}
    </div>
  );
};

export default GuildDetail;

