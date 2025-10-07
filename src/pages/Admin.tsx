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
  Sun,
  Moon,
  TrendingUp,
  Flame,
  Award,
  Sparkles,
  Shield,
  Settings,
  BarChart3,
  DollarSign,
  Package,
  UserCog,
  FileText,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { userManagementService } from "@/services/userManagementService";
import { backendAPIService } from "@/services/backendAPIService";
import { isFeatureEnabled } from "@/config/environmentManager";

const Admin = () => {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    totalListings: 0,
    openDisputes: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Check if user has admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth?callbackUrl=/admin');
        return;
      }

      if (status === 'authenticated' && session?.user?.email) {
        try {
          // Check if user has admin role
          const profile = await userManagementService.getUserProfile(session.user.email);
          const role = profile?.roles?.[0] || null;
          
          if (!role || !['admin', 'hr', 'ceo', 'cfo', 'trust_safety'].includes(role)) {
            // Redirect non-admin users
            router.push('/dashboard');
            return;
          }
          
          setUserRole(role);
          
          // Load admin data with proper error handling
          try {
            const [stats, activity] = await Promise.all([
              backendAPIService.getAdminStats(),
              backendAPIService.getRecentActivity()
            ]);
            
            setPlatformStats({
              totalRevenue: stats.totalRevenue,
              activeUsers: stats.activeUsers,
              totalListings: stats.totalListings,
              openDisputes: stats.openDisputes
            });
            
            setRecentActivity(activity);
          } catch (apiError) {
            console.error('Error loading admin data:', apiError);
            // Set default values if API fails
            setPlatformStats({
              totalRevenue: 0,
              activeUsers: 0,
              totalListings: 0,
              openDisputes: 0
            });
            setRecentActivity([]);
          }
        } catch (error) {
          console.error('Error checking admin access:', error);
          router.push('/dashboard');
        } finally {
          setLoading(false);
        }
      }
    };

    checkAdminAccess();
  }, [status, session, router]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Show loading while checking access
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render if no role (will redirect)
  if (!userRole) {
    return null;
  }

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

  const statsData = [
    { value: `$${platformStats.totalRevenue.toLocaleString()}`, label: "Total Revenue", icon: DollarSign, color: "text-green-500" },
    { value: platformStats.activeUsers.toLocaleString(), label: "Active Users", icon: Users, color: "text-primary" },
    { value: platformStats.totalListings.toLocaleString(), label: "Total Listings", icon: Package, color: "text-accent" },
    { value: platformStats.openDisputes.toString(), label: "Open Disputes", icon: AlertTriangle, color: "text-red-500" },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shadow-lg">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary">Abditrade</div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:translate-x-1 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          
          <Separator className="my-4" />
          
          {/* Admin Section */}
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary transition-all duration-200 hover:translate-x-1 group animate-fade-in"
          >
            <Shield className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Admin Panel</span>
            <Badge variant="secondary" className="ml-auto text-xs">Staff</Badge>
          </Link>
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <Avatar className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || session?.user?.email || 'Admin User'}
              </p>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-accent" />
                <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
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
                  placeholder="Search users, orders, disputes..."
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
              <Button 
                variant="default" 
                className="hover:shadow-lg transition-all"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Admin Header */}
          <Card className="mb-6 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary animate-pulse" />
                    Admin Dashboard
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Manage platform operations, users, and content
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Staff Access
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in hover:scale-105 border-border/50 hover:border-primary/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr,380px] gap-6">
            {/* Main Admin Area */}
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="disputes">Disputes</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Employee Departments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Link href="/admin/ceo">
                          <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary">
                            <Shield className="h-5 w-5 text-primary" />
                            <div className="text-left">
                              <div className="font-medium">CEO Dashboard</div>
                              <div className="text-xs text-muted-foreground">Executive overview & insights</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/admin/cfo">
                          <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <div className="text-left">
                              <div className="font-medium">CFO Dashboard</div>
                              <div className="text-xs text-muted-foreground">Financial analytics & reports</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/admin/hr">
                          <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary">
                            <UserCog className="h-5 w-5 text-blue-500" />
                            <div className="text-left">
                              <div className="font-medium">HR Dashboard</div>
                              <div className="text-xs text-muted-foreground">Employee management</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/admin/trust-safety">
                          <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary">
                            <Shield className="h-5 w-5 text-orange-500" />
                            <div className="text-left">
                              <div className="font-medium">Trust & Safety</div>
                              <div className="text-xs text-muted-foreground">Moderation & disputes</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/admin/order-management" className="md:col-span-2">
                          <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary">
                            <Package className="h-5 w-5 text-purple-500" />
                            <div className="text-left">
                              <div className="font-medium">Order Management</div>
                              <div className="text-xs text-muted-foreground">Verification & order tracking</div>
                            </div>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6 mt-6">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        User Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <UserCog className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">User management tools</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          View, edit, and manage user accounts
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="disputes" className="space-y-6 mt-6">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Dispute Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No active disputes</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Review and resolve user disputes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-6">
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Platform Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Platform configuration</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Manage platform settings and features
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-accent/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-accent" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.type}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 hover:border-primary/50">
                    <Users className="h-4 w-4" />
                    View All Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 hover:border-primary/50">
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 hover:border-primary/50">
                    <Settings className="h-4 w-4" />
                    Platform Settings
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Platform</span>
                    <Badge variant="secondary" className="gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Operational
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Database</span>
                    <Badge variant="secondary" className="gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Healthy
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;

