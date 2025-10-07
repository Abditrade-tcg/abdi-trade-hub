import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  ArrowUpCircle,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrderManagement = () => {
  const verificationRequests = [
    { id: 1, user: "User #001", card: "Charizard VMAX", status: "Pending Review", submitted: "2h ago" },
    { id: 2, user: "User #002", card: "Pikachu Illustrator", status: "In Progress", submitted: "5h ago" },
    { id: 3, user: "User #003", card: "Black Lotus", status: "Awaiting Images", submitted: "1d ago" },
  ];

  const orders = [
    { id: 1, user: "User #004", card: "Mox Sapphire", status: "Ready to Ship", trackingStatus: "Pending" },
    { id: 2, user: "User #005", card: "Shaymin EX", status: "In Transit", trackingStatus: "Shipped" },
    { id: 3, user: "User #006", card: "Time Walk", status: "Delivered", trackingStatus: "Completed" },
  ];

  const statusColors = {
    "Pending Review": "bg-yellow-500",
    "In Progress": "bg-blue-500",
    "Awaiting Images": "bg-orange-500",
    "Ready to Ship": "bg-green-500",
    "In Transit": "bg-blue-500",
    "Delivered": "bg-green-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              Order Management Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Verification requests and order tracking</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Pending Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Verified Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-muted-foreground">In Transit</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Issues</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Requests */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Verification Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {verificationRequests.map((request) => (
                  <div key={request.id} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{request.card}</p>
                        <p className="text-sm text-muted-foreground">{request.user}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary">{request.status}</Badge>
                        <span className="text-xs text-muted-foreground">{request.submitted}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Compare Images
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Image Comparison - {request.card}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-2">API Reference</p>
                              <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-16 w-16 text-muted-foreground" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Submitted Image</p>
                              <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-16 w-16 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button className="flex-1" variant="outline">Reject</Button>
                            <Button className="flex-1">Approve</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Update Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Verification Status</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>New Status</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="awaiting">Awaiting More Info</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Notes</Label>
                              <Textarea placeholder="Add notes..." />
                            </div>
                            <Button className="w-full">Update Status</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Escalate to Trust & Safety</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Reason for Escalation</Label>
                              <Textarea placeholder="Describe the issue..." />
                            </div>
                            <Button className="w-full">Escalate</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{order.card}</p>
                        <p className="text-sm text-muted-foreground">{order.user}</p>
                      </div>
                      <Badge variant="secondary">{order.status}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`h-2 w-2 rounded-full ${statusColors[order.status]}`} />
                      <span className="text-sm text-muted-foreground">{order.trackingStatus}</span>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            Update Tracking
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Tracking Status</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Tracking Status</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="in_transit">In Transit</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Tracking Number</Label>
                              <Textarea placeholder="Enter tracking number..." />
                            </div>
                            <Button className="w-full">Update Status</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">View Order</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;

