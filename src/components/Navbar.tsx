"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, ShoppingCart, Bell, User, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/contexts/CartContext";
import { userManagementService, type UserProfile } from "@/services/userManagementService";

const Navbar = () => {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAdminNav, setShowAdminNav] = useState(false);
  const notificationCount = 5; // Mock notification count

  // Load user profile and check admin permissions
  useEffect(() => {
    const loadUserProfile = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          // Check if user has company email
          const isCompanyEmail = userManagementService.isCompanyEmail(session.user.email);
          
          if (isCompanyEmail) {
            // Get or create user profile
            let profile = await userManagementService.getUserProfile(session.user.email);
            
            if (!profile) {
              // Create profile for company email user
              profile = {
                id: session.user.email,
                email: session.user.email,
                name: session.user.name || '',
                groups: [userManagementService.determineUserGroup(session.user.email)],
                roles: ['employee'], // Default role for company emails
                companyEmail: true
              };
            }
            
            setUserProfile(profile);
            setShowAdminNav(userManagementService.shouldShowAdminNav(profile));
          } else {
            // Regular user, no admin access
            setShowAdminNav(false);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setShowAdminNav(false);
      }
    };

    loadUserProfile();
  }, [status, session]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-primary">Abditrade</div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search cards..."
                className="w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            {status === 'authenticated' ? (
              <>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {notificationCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" className="hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                {showAdminNav && (
                  <Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground transition-colors" asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                {userProfile && userManagementService.hasPermission(userProfile, 'view_hr_dashboard') && (
                  <Button variant="ghost" className="hover:bg-secondary hover:text-secondary-foreground transition-colors" asChild>
                    <Link href="/hr" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      HR
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button variant="accent" asChild>
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {/* Search Bar - Mobile */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder="Search cards..."
                  className="w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="flex gap-2 pt-2 border-t border-border items-center justify-between">
                <div className="flex gap-2 flex-1">
                  {status === 'authenticated' ? (
                    <>
                      <Button variant="ghost" className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      {showAdminNav && (
                        <Button variant="ghost" className="flex-1 hover:bg-accent hover:text-accent-foreground transition-colors" asChild>
                          <Link href="/admin">Admin</Link>
                        </Button>
                      )}
                      {userProfile && userManagementService.hasPermission(userProfile, 'view_hr_dashboard') && (
                        <Button variant="ghost" className="flex-1 hover:bg-secondary hover:text-secondary-foreground transition-colors" asChild>
                          <Link href="/hr">HR</Link>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={handleSignOut}
                        className="flex-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                        <Link href="/auth">Sign In</Link>
                      </Button>
                      <Button variant="accent" className="flex-1" asChild>
                        <Link href="/auth">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
