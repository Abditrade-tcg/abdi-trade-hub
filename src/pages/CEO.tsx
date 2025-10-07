'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  DollarSign,
  ArrowLeftRight,
  Shield,
  CheckCircle,
  Package,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { backendAPIService } from '@/services/backendAPIService';
import { userManagementService } from '@/services/userManagementService';
import { toast } from '@/hooks/use-toast';

interface CEOStats {
  userCount: number;
  totalSellers: number;
  totalTrades: number;
  revenue: number;
  platformFeeRevenue: number;
  verificationRevenue: number;
  totalVerifications: number;
  grossMarketValue: number;
}

interface DisputeData {
  id: string;
  user: string;
  type: string;
  status: string;
  priority: string;
}

const CEO = () => {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CEOStats>({
    userCount: 0,
    totalSellers: 0,
    totalTrades: 0,
    revenue: 0,
    platformFeeRevenue: 0,
    verificationRevenue: 0,
    totalVerifications: 0,
    grossMarketValue: 0,
  });
  const [disputes, setDisputes] = useState<DisputeData[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkCEOAccess = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth?callbackUrl=/admin/ceo');
        return;
      }

      if (status === 'authenticated' && session?.user?.email) {
        try {
          const profile = await userManagementService.getUserProfile(session.user.email);
          const role = profile?.roles?.[0] || null;
          
          if (!role || !['admin', 'ceo'].includes(role)) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the CEO dashboard.",
              variant: "destructive",
            });
            router.push('/dashboard');
            return;
          }
          
          setUserRole(role);
          await loadCEOData();
        } catch (error) {
          console.error('Error checking CEO access:', error);
          toast({
            title: "Error",
            description: "Failed to verify access permissions.",
            variant: "destructive",
          });
          router.push('/dashboard');
        }
      }
    };

    checkCEOAccess();
  }, [status, session, router]);

  const loadCEOData = async () => {
    try {
      setLoading(true);
      
      // Load admin stats and MAU dashboard
      const [adminStats, mauData, disputesData] = await Promise.all([
        backendAPIService.getAdminStats(),
        backendAPIService.getMAUDashboard(),
        backendAPIService.getDisputes({ status: 'open', limit: 10 })
      ]);

      // Combine data for CEO view
      setStats({
        userCount: adminStats.activeUsers,
        totalSellers: mauData.topSellersByMAU?.length || 0,
        totalTrades: adminStats.totalOrders,
        revenue: adminStats.totalRevenue,
        platformFeeRevenue: adminStats.monthlyRevenue,
        verificationRevenue: 0, // This would come from a specific verification revenue endpoint
        totalVerifications: 0, // This would come from a specific verifications endpoint
        grossMarketValue: mauData.totalRevenue,
      });

      // Transform disputes data - using available properties
      const disputesList = disputesData.data.map((dispute, index) => ({
        id: `dispute-${index + 1}`,
        user: `User #${index + 1}`, // In production, this would be resolved from buyerId/sellerId
        type: 'Order Issue', // This would come from dispute.category when available
        status: dispute.status || 'Pending',
        priority: dispute.priority || 'Medium',
      }));

      setDisputes(disputesList);

    } catch (error) {
      console.error('Error loading CEO data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking access
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading CEO Dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if no role (will redirect)
  if (!userRole) {
    return null;
  }

  const statsCards = [
    { label: "User Count", value: stats.userCount.toLocaleString(), icon: Users, color: "text-blue-500" },
    { label: "Total Sellers MTD", value: stats.totalSellers.toLocaleString(), icon: Users, color: "text-green-500" },
    { label: "Total Trades MTD", value: stats.totalTrades.toLocaleString(), icon: ArrowLeftRight, color: "text-purple-500" },
    { label: "Revenue MTD", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
    { label: "Platform Fee Revenue", value: `$${stats.platformFeeRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-cyan-500" },
    { label: "Verification Revenue", value: `$${stats.verificationRevenue.toLocaleString()}`, icon: CheckCircle, color: "text-indigo-500" },
    { label: "Total Verifications", value: stats.totalVerifications.toLocaleString(), icon: Shield, color: "text-orange-500" },
    { label: "Gross Market Value MTD", value: `$${stats.grossMarketValue.toLocaleString()}`, icon: Package, color: "text-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              CEO Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Executive overview and platform insights</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <Badge variant="secondary" className="text-xs">MTD</Badge>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Complaints */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Active Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {disputes.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-medium">{complaint.user}</p>
                      <p className="text-sm text-muted-foreground">{complaint.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={complaint.priority === "High" ? "destructive" : "secondary"}>
                        {complaint.priority}
                      </Badge>
                      <Badge variant="outline">{complaint.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">0%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-medium">0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Platform Health</span>
                  <Badge variant="secondary" className="gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CEO;

