'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { backendAPIService } from '@/services/backendAPIService';
import { userManagementService } from '@/services/userManagementService';
import { toast } from '@/hooks/use-toast';

interface CFOFinancialData {
  totalRevenue: number;
  operatingExpenses: number;
  netProfit: number;
  cashFlow: number;
  platformFees: number;
  transactionVolume: number;
  transactionFees: number;
  listingFees: number;
  sellerFees: number;
  refunds: number;
  disputes: number;
  chargebacks: number;
}

interface RevenueBreakdown {
  source: string;
  amount: number;
  percentage: number;
}

interface FinancialTrend {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const CFO = () => {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<CFOFinancialData>({
    totalRevenue: 0,
    operatingExpenses: 0,
    netProfit: 0,
    cashFlow: 0,
    platformFees: 0,
    transactionVolume: 0,
    transactionFees: 0,
    listingFees: 0,
    sellerFees: 0,
    refunds: 0,
    disputes: 0,
    chargebacks: 0,
  });
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkCFOAccess = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth?callbackUrl=/admin/cfo');
        return;
      }

      if (status === 'authenticated' && session?.user?.email) {
        try {
          const profile = await userManagementService.getUserProfile(session.user.email);
          const role = profile?.roles?.[0] || null;
          
          if (!role || !['admin', 'cfo', 'ceo'].includes(role)) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the CFO dashboard.",
              variant: "destructive",
            });
            router.push('/dashboard');
            return;
          }
          
          setUserRole(role);
          await loadFinancialData();
        } catch (error) {
          console.error('Error checking CFO access:', error);
          toast({
            title: "Error",
            description: "Failed to verify access permissions.",
            variant: "destructive",
          });
          router.push('/dashboard');
        }
      }
    };

    checkCFOAccess();
  }, [status, session, router]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      
      // Load financial analytics
      const financialAnalytics = await backendAPIService.getFinancialAnalytics();

      // Calculate derived metrics
      const netProfit = financialAnalytics.totalRevenue - (financialAnalytics.transactionFees + financialAnalytics.listingFees + financialAnalytics.sellerFees);
      const totalExpenses = financialAnalytics.transactionFees + financialAnalytics.listingFees + financialAnalytics.sellerFees;

      setFinancialData({
        totalRevenue: financialAnalytics.totalRevenue,
        operatingExpenses: totalExpenses,
        netProfit: netProfit,
        cashFlow: financialAnalytics.monthlyRevenue, // Monthly cash flow
        platformFees: financialAnalytics.transactionFees,
        transactionVolume: financialAnalytics.totalRevenue, // Total transaction volume
        transactionFees: financialAnalytics.transactionFees,
        listingFees: financialAnalytics.listingFees,
        sellerFees: financialAnalytics.sellerFees,
        refunds: 0, // Would come from specific refunds endpoint
        disputes: 0, // Would come from disputes analytics
        chargebacks: 0, // Would come from payment processor
      });

      // Calculate revenue breakdown
      const totalRevenue = financialAnalytics.totalRevenue;
      if (totalRevenue > 0) {
        setRevenueBreakdown([
          {
            source: "Platform Fees",
            amount: financialAnalytics.transactionFees,
            percentage: (financialAnalytics.transactionFees / totalRevenue) * 100,
          },
          {
            source: "Listing Fees",
            amount: financialAnalytics.listingFees,
            percentage: (financialAnalytics.listingFees / totalRevenue) * 100,
          },
          {
            source: "Seller Fees",
            amount: financialAnalytics.sellerFees,
            percentage: (financialAnalytics.sellerFees / totalRevenue) * 100,
          },
          {
            source: "Monthly Revenue",
            amount: financialAnalytics.monthlyRevenue,
            percentage: (financialAnalytics.monthlyRevenue / totalRevenue) * 100,
          },
        ]);
      }

    } catch (error) {
      console.error('Error loading financial data:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data. Please try again.",
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
          <p className="text-muted-foreground">Loading CFO Dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if no role (will redirect)
  if (!userRole) {
    return null;
  }

  // Calculate trends (simplified - in production this would compare to previous period)
  const calculateTrend = (current: number, previous: number = 0) => {
    if (previous === 0) return { percentage: 0, direction: 'neutral' as const };
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change),
      direction: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    };
  };

  const financialStats = [
    { 
      label: "Total Revenue", 
      value: `$${financialData.totalRevenue.toLocaleString()}`, 
      change: "+15.2%", // In production, calculate from historical data
      icon: DollarSign, 
      trend: "up" as const
    },
    { 
      label: "Operating Expenses", 
      value: `$${financialData.operatingExpenses.toLocaleString()}`, 
      change: "-5.1%", 
      icon: TrendingDown, 
      trend: "down" as const
    },
    { 
      label: "Net Profit", 
      value: `$${financialData.netProfit.toLocaleString()}`, 
      change: "+28.4%", 
      icon: Wallet, 
      trend: "up" as const
    },
    { 
      label: "Cash Flow", 
      value: `$${financialData.cashFlow.toLocaleString()}`, 
      change: "+12.8%", 
      icon: CreditCard, 
      trend: "up" as const
    },
    { 
      label: "Platform Fees", 
      value: `$${financialData.platformFees.toLocaleString()}`, 
      change: "+18.7%", 
      icon: PieChart, 
      trend: "up" as const
    },
    { 
      label: "Transaction Volume", 
      value: `$${financialData.transactionVolume.toLocaleString()}`, 
      change: "+22.3%", 
      icon: BarChart3, 
      trend: "up" as const
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              CFO Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Financial overview and analytics</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financialStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{item.source}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage} of total</p>
                    </div>
                    <span className="text-lg font-bold">{item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Metrics */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Key Financial Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profit Margin</span>
                <Badge variant="secondary">0%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ROI</span>
                <Badge variant="secondary">0%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Transaction Value</span>
                <span className="font-medium">$0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Recurring Revenue</span>
                <span className="font-medium">$0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CFO;

