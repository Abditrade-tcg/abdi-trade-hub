import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  Ban,
  Clock,
  Eye,
  MessageSquare,
  Flag,
  ArrowUpCircle,
  UserX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const TrustSafety = () => {
  const disputes = [
    { id: 1, user: "User #001", issue: "Payment not received", status: "Open", priority: "High" },
    { id: 2, user: "User #002", issue: "Item not as described", status: "Under Review", priority: "Medium" },
    { id: 3, user: "User #003", issue: "Shipping delay", status: "Resolved", priority: "Low" },
  ];

  const violations = [
    { id: 1, user: "User #004", keyword: "prohibited term", severity: "High", action: "Pending" },
    { id: 2, user: "User #005", keyword: "spam content", severity: "Medium", action: "Warning Sent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Trust & Safety Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Moderation, disputes, and safety management</p>
          </div>
          <Link to="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Ban className="h-5 w-5 text-red-500" />
                  <div className="text-sm font-medium">Ban User</div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ban User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>User ID or Email</Label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Enter ban reason..." />
                </div>
                <Button className="w-full" variant="destructive">Ban User</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div className="text-sm font-medium">Suspend User</div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suspend User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>User ID or Email</Label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Input type="number" placeholder="7" />
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Enter suspension reason..." />
                </div>
                <Button className="w-full">Suspend User</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div className="text-sm font-medium">Shadow Ban</div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Shadow Ban User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>User ID or Email</Label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Input type="number" placeholder="30" />
                </div>
                <Button className="w-full">Shadow Ban User</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <ArrowUpCircle className="h-5 w-5 text-purple-500" />
                  <div className="text-sm font-medium">Escalate</div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Escalate to Management</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Escalate To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO</SelectItem>
                      <SelectItem value="cfo">CFO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Details</Label>
                  <Textarea placeholder="Enter escalation details..." />
                </div>
                <Button className="w-full">Escalate Issue</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Disputes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Active Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{dispute.user}</p>
                        <p className="text-sm text-muted-foreground">{dispute.issue}</p>
                      </div>
                      <Badge variant={dispute.priority === "High" ? "destructive" : "secondary"}>
                        {dispute.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Respond
                      </Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keyword Violations */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-orange-500" />
                Keyword Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {violations.map((violation) => (
                  <div key={violation.id} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{violation.user}</p>
                        <p className="text-sm text-muted-foreground">Flagged: {violation.keyword}</p>
                      </div>
                      <Badge variant={violation.severity === "High" ? "destructive" : "secondary"}>
                        {violation.severity}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <UserX className="h-3 w-3 mr-1" />
                        Take Action
                      </Button>
                      <Button size="sm" variant="outline">Dismiss</Button>
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

export default TrustSafety;
