import { useState } from "react";
import { Package, Scan, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  items: number;
  status: "pending" | "picked" | "packed" | "shipped";
  priority: "standard" | "express" | "urgent";
  buyer: string;
  createdAt: string;
  location: string;
}

const Warehouse = () => {
  const [scanInput, setScanInput] = useState("");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-12345",
      items: 3,
      status: "pending",
      priority: "urgent",
      buyer: "John Smith",
      createdAt: "2025-12-20 10:30 AM",
      location: "A3-B2"
    },
    {
      id: "2",
      orderNumber: "ORD-12346",
      items: 1,
      status: "picked",
      priority: "express",
      buyer: "Sarah Johnson",
      createdAt: "2025-12-20 11:15 AM",
      location: "B1-C4"
    },
    {
      id: "3",
      orderNumber: "ORD-12347",
      items: 5,
      status: "packed",
      priority: "standard",
      buyer: "Mike Davis",
      createdAt: "2025-12-20 09:45 AM",
      location: "C2-D1"
    },
    {
      id: "4",
      orderNumber: "ORD-12348",
      items: 2,
      status: "pending",
      priority: "express",
      buyer: "Emily Brown",
      createdAt: "2025-12-20 12:00 PM",
      location: "A1-B3"
    }
  ]);

  const handleScan = () => {
    if (!scanInput) {
      toast({
        title: "Scan Required",
        description: "Please scan or enter an order number",
        variant: "destructive"
      });
      return;
    }

    const order = orders.find(o => o.orderNumber === scanInput);
    if (order) {
      toast({
        title: "Order Found",
        description: `Order ${order.orderNumber} - ${order.items} item(s) at location ${order.location}`,
      });
      setScanInput("");
    } else {
      toast({
        title: "Not Found",
        description: "Order not found in the system",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Status Updated",
      description: `Order status changed to ${newStatus}`,
    });
  };

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], { variant: any; icon: any }> = {
      pending: { variant: "outline", icon: Clock },
      picked: { variant: "default", icon: Package },
      packed: { variant: "default", icon: CheckCircle },
      shipped: { variant: "default", icon: CheckCircle }
    };
    
    const { variant, icon: Icon } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Order["priority"]) => {
    const colors: Record<Order["priority"], string> = {
      urgent: "bg-red-500",
      express: "bg-orange-500",
      standard: "bg-blue-500"
    };
    
    return (
      <Badge className={colors[priority]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const stats = {
    pending: orders.filter(o => o.status === "pending").length,
    picked: orders.filter(o => o.status === "picked").length,
    packed: orders.filter(o => o.status === "packed").length,
    shipped: orders.filter(o => o.status === "shipped").length
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Warehouse Operations</h1>
              <p className="text-muted-foreground">Pick, pack, and ship orders efficiently</p>
            </div>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Manifest
          </Button>
        </div>

        <Separator className="mb-6" />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Picked</p>
                  <p className="text-2xl font-bold">{stats.picked}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Packed</p>
                  <p className="text-2xl font-bold">{stats.packed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shipped</p>
                  <p className="text-2xl font-bold">{stats.shipped}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pick" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pick">Pick</TabsTrigger>
            <TabsTrigger value="pack">Pack</TabsTrigger>
            <TabsTrigger value="manifest">Manifests</TabsTrigger>
          </TabsList>

          <TabsContent value="pick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Scanner</CardTitle>
                <CardDescription>Scan or enter order number to start picking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Scan barcode or enter order number..."
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScan()}
                    className="flex-1"
                  />
                  <Button onClick={handleScan}>
                    <Scan className="h-4 w-4 mr-2" />
                    Scan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>Orders ready for picking</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => o.status === "pending").map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.buyer}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.location}</Badge>
                        </TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.createdAt}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "picked")}
                          >
                            Start Picking
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pack" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ready for Packing</CardTitle>
                <CardDescription>Orders that have been picked and need packing</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => o.status === "picked" || o.status === "packed").map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.buyer}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {order.status === "picked" ? (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(order.id, "packed")}
                            >
                              Mark as Packed
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(order.id, "shipped")}
                            >
                              Ship Order
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manifest" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Manifests</CardTitle>
                <CardDescription>Generate and view shipping manifests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Today's Manifest</p>
                    <p className="text-sm text-muted-foreground">
                      {orders.filter(o => o.status === "packed").length} orders ready to ship
                    </p>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Manifest
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Previous Manifests</p>
                  {[
                    { date: "Dec 19, 2025", orders: 45 },
                    { date: "Dec 18, 2025", orders: 38 },
                    { date: "Dec 17, 2025", orders: 52 }
                  ].map((manifest, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{manifest.date}</p>
                        <p className="text-xs text-muted-foreground">{manifest.orders} orders</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Warehouse;