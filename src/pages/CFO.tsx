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
} from "lucide-react";
import { Link } from "react-router-dom";

const CFO = () => {
  const financialStats = [
    { label: "Total Revenue", value: "$0", change: "+0%", icon: DollarSign, trend: "up" },
    { label: "Operating Expenses", value: "$0", change: "-0%", icon: TrendingDown, trend: "down" },
    { label: "Net Profit", value: "$0", change: "+0%", icon: Wallet, trend: "up" },
    { label: "Cash Flow", value: "$0", change: "+0%", icon: CreditCard, trend: "up" },
    { label: "Platform Fees", value: "$0", change: "+0%", icon: PieChart, trend: "up" },
    { label: "Transaction Volume", value: "$0", change: "+0%", icon: BarChart3, trend: "up" },
  ];

  const revenueBreakdown = [
    { source: "Platform Fees", amount: "$0", percentage: "0%" },
    { source: "Verification Fees", amount: "$0", percentage: "0%" },
    { source: "Premium Listings", amount: "$0", percentage: "0%" },
    { source: "Subscriptions", amount: "$0", percentage: "0%" },
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
          <Link to="/admin">
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
