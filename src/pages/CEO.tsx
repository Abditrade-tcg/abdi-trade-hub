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
} from "lucide-react";
import { Link } from "react-router-dom";

const CEO = () => {
  const stats = [
    { label: "User Count", value: "0", icon: Users, color: "text-blue-500" },
    { label: "Total Sellers MTD", value: "0", icon: Users, color: "text-green-500" },
    { label: "Total Trades MTD", value: "0", icon: ArrowLeftRight, color: "text-purple-500" },
    { label: "Revenue MTD", value: "$0", icon: DollarSign, color: "text-emerald-500" },
    { label: "Platform Fee Revenue", value: "$0", icon: TrendingUp, color: "text-cyan-500" },
    { label: "Verification Revenue", value: "$0", icon: CheckCircle, color: "text-indigo-500" },
    { label: "Total Verifications", value: "0", icon: Shield, color: "text-orange-500" },
    { label: "Gross Market Value MTD", value: "$0", icon: Package, color: "text-pink-500" },
  ];

  const complaints = [
    { id: 1, user: "User #001", type: "Order Issue", status: "Pending", priority: "High" },
    { id: 2, user: "User #002", type: "Payment", status: "Reviewing", priority: "Medium" },
    { id: 3, user: "User #003", type: "Verification", status: "Resolved", priority: "Low" },
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
          <Link to="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
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
                {complaints.map((complaint) => (
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
