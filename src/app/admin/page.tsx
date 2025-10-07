'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  FileText,
  DollarSign,
  AlertTriangle,
  Crown,
  Building2,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { userManagementService, UserProfile } from '@/services/userManagementService';

const Admin = () => {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check admin permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const profile = await userManagementService.getUserProfile(session.user.email);
          if (!profile || !userManagementService.hasPermission(profile, 'view_admin_panel')) {
            router.push('/dashboard');
            return;
          }
          setUserProfile(profile);
        } catch (error) {
          console.error('Error checking permissions:', error);
          router.push('/dashboard');
        }
      } else if (status === 'unauthenticated') {
        router.push('/auth/signin?callbackUrl=/admin');
        return;
      }
      setLoading(false);
    };

    checkPermissions();
  }, [status, session, router]);

  // Show loading while checking permissions
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'Human Resources',
      description: 'Manage employees, assign roles, and control access permissions',
      icon: Users,
      href: '/hr',
      color: 'text-blue-500',
      permission: 'view_hr_dashboard'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View platform metrics, user engagement, and financial reports',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-green-500',
      permission: 'view_analytics'
    },
    {
      title: 'Trust & Safety',
      description: 'Handle disputes, review reports, and maintain platform safety',
      icon: ShieldCheck,
      href: '/trust-safety',
      color: 'text-orange-500',
      permission: 'manage_disputes'
    },
    {
      title: 'Order Management',
      description: 'Monitor orders, handle issues, and manage transactions',
      icon: FileText,
      href: '/order-management',
      color: 'text-purple-500',
      permission: 'manage_orders'
    },
    {
      title: 'Financial Reports',
      description: 'Revenue tracking, payout management, and financial analytics',
      icon: DollarSign,
      href: '/financial',
      color: 'text-emerald-500',  
      permission: 'view_financial_reports'
    },
    {
      title: 'System Settings',
      description: 'Platform configuration, feature flags, and system maintenance',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-500',
      permission: 'manage_system'
    }
  ];

  const filteredCards = adminCards.filter(card => 
    !userProfile || userManagementService.hasPermission(userProfile, card.permission)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Crown className="h-8 w-8 text-primary" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform administration and management tools
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              {userProfile?.roles?.[0] || 'Admin'}
            </Badge>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* User Info */}
        {userProfile && (
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Welcome, {session?.user?.name || 'Admin'}</h3>
                  <p className="text-muted-foreground">
                    {session?.user?.email} • Groups: {userProfile.groups?.join(', ') || 'None'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {userProfile.roles?.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card 
              key={card.title} 
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Link href={card.href}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/hr">
                  <Users className="h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/trust-safety">
                  <ShieldCheck className="h-4 w-4" />
                  Safety Center
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">Online</div>
                <div className="text-sm text-muted-foreground">Platform Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">23</div>
                <div className="text-sm text-muted-foreground">Pending Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;