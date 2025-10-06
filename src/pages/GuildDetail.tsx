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
  ArrowLeft,
  Send,
  ThumbsUp,
  Share2,
  Pin,
  MoreHorizontal,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import logo from "@/assets/abditrade-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const GuildDetail = () => {
  const { guildId } = useParams();
  const [newPost, setNewPost] = useState("");

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

  // Mock guild data - in real app would fetch based on guildId
  const guild = {
    id: guildId,
    name: "Pokemon Masters",
    description: "Dedicated to Pokemon TCG collectors and traders",
    members: 12453,
    image: "🎴",
    category: "Pokemon",
  };

  const posts = [
    {
      id: 1,
      author: "Collector123",
      avatar: "C",
      timeAgo: "2h ago",
      content: "Just pulled a Charizard VMAX from my latest booster box! The centering looks perfect. What do you all think about grading it?",
      likes: 24,
      comments: 8,
      isPinned: true,
      reputation: 4.8,
      userType: "Individual",
      guildOrigin: "Pokemon Masters",
    },
    {
      id: 2,
      author: "CardMaster",
      avatar: "CM",
      timeAgo: "4h ago",
      content: "Looking to trade my Pikachu Illustrator for multiple high-value cards. Open to offers! Must be mint condition.",
      likes: 18,
      comments: 12,
      reputation: 4.9,
      userType: "LGS",
      guildOrigin: "Pokemon Masters",
    },
    {
      id: 3,
      author: "TCGFan",
      avatar: "T",
      timeAgo: "6h ago",
      content: "What's everyone's opinion on the new set releasing next month? The preview cards look incredible!",
      likes: 45,
      comments: 23,
      reputation: 4.6,
      userType: "Individual",
      guildOrigin: "Pokemon Masters",
    },
  ];

  const members = [
    { name: "Collector123", avatar: "C", role: "Admin", joined: "2y ago" },
    { name: "CardMaster", avatar: "CM", role: "Moderator", joined: "1y ago" },
    { name: "TCGFan", avatar: "T", role: "Member", joined: "6m ago" },
    { name: "PokeFan", avatar: "P", role: "Member", joined: "3m ago" },
    { name: "TradeKing", avatar: "TK", role: "Member", joined: "1m ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shadow-lg">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Abditrade" className="h-12" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 py-4">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
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
            <Link to="/guilds">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Guilds
              </Button>
            </Link>
            <div className="flex items-center gap-3">
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
                    <Button size="lg" className="gap-2">
                      <Users className="h-4 w-4" />
                      Joined
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr,320px] gap-6">
            {/* Main Feed */}
            <div className="space-y-6">
              {/* Create Post */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Share your thoughts, trades, or questions..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Add Image
                        </Button>
                        <Button className="gap-2">
                          <Send className="h-4 w-4" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                                  <p className="font-medium">{post.author}</p>
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
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="gap-2">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                {post.comments}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Share
                              </Button>
                            </div>
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
                                    <p className="font-medium">{post.author}</p>
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
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <ThumbsUp className="h-4 w-4" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </Button>
                              </div>
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
                                    <p className="font-medium">{post.author}</p>
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
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <ThumbsUp className="h-4 w-4" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </Button>
                              </div>
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
    </div>
  );
};

export default GuildDetail;
