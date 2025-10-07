"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, DollarSign, Package, Users, Calendar, Download } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30days")
  const [category, setCategory] = useState("all")

  // Mock data
  const revenueData = {
    total: 45678.5,
    change: 12.5,
    trend: "up",
    orders: 234,
    avgOrderValue: 195.2,
  }

  const topProducts = [
    { name: "Charizard VMAX - PSA 10", sales: 45, revenue: 20250, growth: 15 },
    { name: "Pikachu VMAX Alt Art - PSA 10", sales: 38, revenue: 15200, growth: 8 },
    { name: "Umbreon VMAX Alt Art - BGS 9.5", sales: 32, revenue: 12800, growth: -5 },
    { name: "Mewtwo V Alt Art - PSA 10", sales: 28, revenue: 8960, growth: 22 },
    { name: "Rayquaza VMAX - PSA 10", sales: 25, revenue: 7500, growth: 10 },
  ]

  const customerMetrics = {
    newCustomers: 89,
    returningCustomers: 145,
    repeatPurchaseRate: 62,
    avgLifetimeValue: 487.3,
  }

  const inventoryMetrics = {
    totalItems: 1247,
    activeListings: 892,
    soldThisMonth: 234,
    turnoverRate: 26.2,
  }

  const salesByCategory = [
    { category: "Pokemon", sales: 145, revenue: 28950, percentage: 63 },
    { category: "Magic: The Gathering", sales: 56, revenue: 11200, percentage: 24 },
    { category: "Yu-Gi-Oh!", sales: 33, revenue: 6528.5, percentage: 13 },
  ]

  const revenueByMonth = [
    { month: "Jul", revenue: 32400 },
    { month: "Aug", revenue: 38200 },
    { month: "Sep", revenue: 41500 },
    { month: "Oct", revenue: 39800 },
    { month: "Nov", revenue: 43600 },
    { month: "Dec", revenue: 45678.5 },
  ]

  const topBuyers = [
    { name: "John Smith", orders: 12, spent: 2340.5, lastPurchase: "2 days ago" },
    { name: "Sarah Johnson", orders: 9, spent: 1856.2, lastPurchase: "5 days ago" },
    { name: "Mike Davis", orders: 8, spent: 1620.0, lastPurchase: "1 week ago" },
    { name: "Emily Brown", orders: 7, spent: 1432.8, lastPurchase: "3 days ago" },
    { name: "Chris Wilson", orders: 6, spent: 1245.6, lastPurchase: "4 days ago" },
  ]

  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Business Analytics</h1>
              <p className="text-muted-foreground">Comprehensive insights for your store</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mb-1">${revenueData.total.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+{revenueData.change}%</span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mb-1">{revenueData.orders}</p>
              <p className="text-sm text-muted-foreground">Avg: ${revenueData.avgOrderValue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mb-1">{inventoryMetrics.activeListings}</p>
              <p className="text-sm text-muted-foreground">{inventoryMetrics.turnoverRate}% turnover rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Customers</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mb-1">
                {customerMetrics.newCustomers + customerMetrics.returningCustomers}
              </p>
              <p className="text-sm text-muted-foreground">{customerMetrics.repeatPurchaseRate}% repeat rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueByMonth.map((data, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{data.month}</span>
                          <span className="font-medium">${data.revenue.toLocaleString()}</span>
                        </div>
                        <Progress value={(data.revenue / maxRevenue) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Revenue distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesByCategory.map((cat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{cat.category}</p>
                            <p className="text-xs text-muted-foreground">{cat.sales} sales</p>
                          </div>
                          <p className="text-sm font-medium">${cat.revenue.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={cat.percentage} className="h-2 flex-1" />
                          <span className="text-sm text-muted-foreground w-12">{cat.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Performing Products</CardTitle>
                    <CardDescription>Best sellers this period</CardDescription>
                  </div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="pokemon">Pokemon</SelectItem>
                      <SelectItem value="mtg">Magic: The Gathering</SelectItem>
                      <SelectItem value="yugioh">Yu-Gi-Oh!</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.sales}</TableCell>
                        <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={product.growth >= 0 ? "default" : "destructive"}>
                            {product.growth >= 0 ? "+" : ""}
                            {product.growth}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your product catalog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Best Seller</p>
                    <p className="font-medium">{topProducts[0].name}</p>
                    <p className="text-sm text-muted-foreground mt-2">{topProducts[0].sales} units sold</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Fastest Growing</p>
                    <p className="font-medium">{topProducts.sort((a, b) => b.growth - a.growth)[0].name}</p>
                    <p className="text-sm text-green-500 mt-2">
                      +{topProducts.sort((a, b) => b.growth - a.growth)[0].growth}% growth
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                    <p className="font-medium text-2xl">{inventoryMetrics.totalItems}</p>
                    <p className="text-sm text-muted-foreground mt-2">{inventoryMetrics.activeListings} active</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Price Performance</h3>
                  <div className="space-y-3">
                    {topProducts.slice(0, 3).map((product, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Avg price: ${(product.revenue / product.sales).toFixed(2)}
                          </p>
                        </div>
                        <Badge variant="outline">
                          Market avg: ${((product.revenue / product.sales) * 0.95).toFixed(2)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>New vs returning customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Customers</span>
                      <span className="font-medium">{customerMetrics.newCustomers}</span>
                    </div>
                    <Progress
                      value={
                        (customerMetrics.newCustomers /
                          (customerMetrics.newCustomers + customerMetrics.returningCustomers)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Returning Customers</span>
                      <span className="font-medium">{customerMetrics.returningCustomers}</span>
                    </div>
                    <Progress
                      value={
                        (customerMetrics.returningCustomers /
                          (customerMetrics.newCustomers + customerMetrics.returningCustomers)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Lifetime Value</span>
                    <span className="font-bold text-lg">${customerMetrics.avgLifetimeValue}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Buyers</CardTitle>
                  <CardDescription>Your most valuable customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topBuyers.map((buyer, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{buyer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {buyer.orders} orders · Last: {buyer.lastPurchase}
                          </p>
                        </div>
                        <p className="font-medium">${buyer.spent.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Stock levels and turnover analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{inventoryMetrics.totalItems}</p>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{inventoryMetrics.activeListings}</p>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{inventoryMetrics.soldThisMonth}</p>
                    <p className="text-sm text-muted-foreground">Sold This Month</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{inventoryMetrics.turnoverRate}%</p>
                    <p className="text-sm text-muted-foreground">Turnover Rate</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Stock Alerts</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Low stock items</span>
                      </div>
                      <Badge variant="outline">15 items</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">High demand items</span>
                      </div>
                      <Badge variant="outline">23 items</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends & Insights</CardTitle>
                <CardDescription>Identify opportunities and optimize pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Trending Up</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Categories gaining momentum</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pokemon Alt Arts</span>
                        <Badge className="bg-green-500">+34%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Graded Vintage Cards</span>
                        <Badge className="bg-green-500">+28%</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Seasonal Insights</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Best time to list</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Holiday season peak</span>
                        <span className="text-muted-foreground">Dec 15-25</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Set release boost</span>
                        <span className="text-muted-foreground">Ongoing</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Recommended Actions</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      💡 Consider increasing prices on Alt Art cards - market demand is up 34%
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      📦 Restock low inventory items - 15 items below optimal levels
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      🎯 Focus on returning customers - they spend 2.3x more on average
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

