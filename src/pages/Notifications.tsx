import { useState } from "react";
import { Bell, Package, DollarSign, ShieldAlert, CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  type: "buyer" | "seller" | "payment" | "trust_safety";
  category: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  icon: any;
  variant: "default" | "success" | "warning" | "destructive";
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Buyer notifications
    {
      id: "1",
      type: "buyer",
      category: "Order Placed",
      title: "Order #12345 Confirmed",
      message: "Your order for PSA 10 Charizard has been confirmed. We'll notify you when it ships.",
      timestamp: "2 hours ago",
      read: false,
      actionUrl: "/orders",
      actionText: "View Order",
      icon: CheckCircle,
      variant: "success"
    },
    {
      id: "2",
      type: "buyer",
      category: "Shipped",
      title: "Order #12344 Shipped",
      message: "Your order has shipped! Tracking: 1Z999AA10123456784",
      timestamp: "1 day ago",
      read: false,
      actionUrl: "/orders",
      actionText: "Track Package",
      icon: Package,
      variant: "default"
    },
    {
      id: "3",
      type: "buyer",
      category: "Out for Delivery",
      title: "Order #12343 Out for Delivery",
      message: "Your package is out for delivery and will arrive today by 8 PM.",
      timestamp: "3 hours ago",
      read: true,
      icon: TrendingUp,
      variant: "default"
    },
    {
      id: "4",
      type: "buyer",
      category: "Delivered",
      title: "Order #12342 Delivered",
      message: "Your order has been delivered. Please confirm receipt in your orders page.",
      timestamp: "2 days ago",
      read: true,
      actionUrl: "/orders",
      actionText: "Confirm Receipt",
      icon: CheckCircle,
      variant: "success"
    },
    {
      id: "5",
      type: "buyer",
      category: "Dispute",
      title: "Dispute Opened - Order #12341",
      message: "Your dispute regarding condition mismatch has been opened. Our team will review within 24 hours.",
      timestamp: "1 day ago",
      read: false,
      actionUrl: "/disputes",
      actionText: "View Dispute",
      icon: AlertCircle,
      variant: "warning"
    },

    // Seller notifications
    {
      id: "6",
      type: "seller",
      category: "New Order",
      title: "New Order Received #98765",
      message: "You have a new order for BGS 9.5 Pikachu VMAX. Ship by Dec 25, 2025.",
      timestamp: "30 minutes ago",
      read: false,
      actionUrl: "/orders",
      actionText: "Process Order",
      icon: Package,
      variant: "success"
    },
    {
      id: "7",
      type: "seller",
      category: "Ship-by Reminder",
      title: "Order #98764 - Ship Today",
      message: "Reminder: Order #98764 must be shipped by end of day to meet delivery commitment.",
      timestamp: "4 hours ago",
      read: false,
      actionUrl: "/orders",
      actionText: "Ship Now",
      icon: Clock,
      variant: "warning"
    },
    {
      id: "8",
      type: "seller",
      category: "Dispute Opened",
      title: "Dispute Filed - Order #98763",
      message: "A buyer has opened a dispute claiming item not as described. Respond within 48 hours.",
      timestamp: "1 day ago",
      read: true,
      actionUrl: "/disputes",
      actionText: "Respond to Dispute",
      icon: AlertCircle,
      variant: "destructive"
    },
    {
      id: "9",
      type: "seller",
      category: "Payout Initiated",
      title: "Payout of $1,247.50 Initiated",
      message: "Your payout has been initiated and will arrive in your account within 2-3 business days.",
      timestamp: "2 days ago",
      read: true,
      icon: DollarSign,
      variant: "success"
    },
    {
      id: "10",
      type: "seller",
      category: "Payout Failed",
      title: "Payout Failed - Action Required",
      message: "Your payout of $847.20 failed due to invalid bank details. Please update your payment information.",
      timestamp: "3 days ago",
      read: false,
      actionUrl: "/seller-onboarding",
      actionText: "Update Banking Info",
      icon: AlertCircle,
      variant: "destructive"
    },

    // Payment notifications
    {
      id: "11",
      type: "payment",
      category: "Onboarding Required",
      title: "Complete Stripe Connect Onboarding",
      message: "To receive payouts, complete your Stripe Connect onboarding. This takes about 5 minutes.",
      timestamp: "1 week ago",
      read: false,
      actionUrl: "/seller-onboarding",
      actionText: "Complete Setup",
      icon: DollarSign,
      variant: "warning"
    },
    {
      id: "12",
      type: "payment",
      category: "Tax Form Required",
      title: "Tax Form W-9 Required",
      message: "Please submit your W-9 tax form to continue receiving payouts.",
      timestamp: "5 days ago",
      read: false,
      actionUrl: "/seller-onboarding",
      actionText: "Submit Form",
      icon: AlertCircle,
      variant: "warning"
    },
    {
      id: "13",
      type: "payment",
      category: "Tax Form Approved",
      title: "Tax Documents Verified",
      message: "Your tax documents have been verified. You're all set to receive payouts.",
      timestamp: "4 days ago",
      read: true,
      icon: CheckCircle,
      variant: "success"
    },
    {
      id: "14",
      type: "payment",
      category: "Payout Schedule",
      title: "Payout Schedule Updated",
      message: "Your payout schedule has been updated to weekly transfers every Friday.",
      timestamp: "1 week ago",
      read: true,
      icon: DollarSign,
      variant: "default"
    },

    // Trust & Safety notifications
    {
      id: "15",
      type: "trust_safety",
      category: "Report Received",
      title: "Your Report Has Been Received",
      message: "We've received your report regarding listing #54321. Our team will review and respond within 24 hours.",
      timestamp: "6 hours ago",
      read: false,
      icon: ShieldAlert,
      variant: "default"
    },
    {
      id: "16",
      type: "trust_safety",
      category: "Action Taken",
      title: "Action Taken on Your Report",
      message: "After reviewing your report, we've removed the listing and issued a warning to the seller.",
      timestamp: "2 days ago",
      read: true,
      actionUrl: "/trust-safety",
      actionText: "View Details",
      icon: CheckCircle,
      variant: "success"
    },
    {
      id: "17",
      type: "trust_safety",
      category: "Appeal Result",
      title: "Appeal Decision - Account Restriction",
      message: "Your appeal has been reviewed. The restriction on your account has been lifted.",
      timestamp: "3 days ago",
      read: true,
      icon: CheckCircle,
      variant: "success"
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationsByType = (type: string) => {
    if (type === "all") return notifications;
    return notifications.filter(n => n.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const Icon = notification.icon;
    
    return (
      <Card className={`mb-4 transition-all ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                notification.variant === 'success' ? 'bg-green-100 text-green-600' :
                notification.variant === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                notification.variant === 'destructive' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-base">{notification.title}</CardTitle>
                  {!notification.read && (
                    <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                  )}
                </div>
                <Badge variant="outline" className="mb-2">{notification.category}</Badge>
                <CardDescription className="text-sm mt-2">
                  {notification.message}
                </CardDescription>
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
              {notification.timestamp}
            </span>
          </div>
        </CardHeader>
        {notification.actionUrl && (
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => markAsRead(notification.id)}
              >
                {notification.actionText}
              </Button>
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>

        <Separator className="mb-6" />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="buyer">
              Buyer ({getNotificationsByType("buyer").length})
            </TabsTrigger>
            <TabsTrigger value="seller">
              Seller ({getNotificationsByType("seller").length})
            </TabsTrigger>
            <TabsTrigger value="payment">
              Payments ({getNotificationsByType("payment").length})
            </TabsTrigger>
            <TabsTrigger value="trust_safety">
              Safety ({getNotificationsByType("trust_safety").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="buyer">
            {getNotificationsByType("buyer").map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="seller">
            {getNotificationsByType("seller").map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="payment">
            {getNotificationsByType("payment").map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="trust_safety">
            {getNotificationsByType("trust_safety").map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
