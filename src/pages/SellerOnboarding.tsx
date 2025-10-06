import { useState } from "react";
import { CheckCircle, AlertCircle, DollarSign, FileText, Building2, CreditCard, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "action_required";
  icon: any;
  actionText?: string;
  estimatedTime?: string;
}

const SellerOnboarding = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "business_info",
      title: "Business Information",
      description: "Provide your business details and tax information",
      status: "completed",
      icon: Building2,
      estimatedTime: "2 min"
    },
    {
      id: "tax_forms",
      title: "Tax Forms",
      description: "Submit W-9 or W-8BEN form for tax reporting",
      status: "action_required",
      icon: FileText,
      actionText: "Submit Tax Form",
      estimatedTime: "3 min"
    },
    {
      id: "bank_account",
      title: "Bank Account",
      description: "Connect your bank account for payouts",
      status: "pending",
      icon: CreditCard,
      actionText: "Add Bank Account",
      estimatedTime: "2 min"
    },
    {
      id: "verification",
      title: "Identity Verification",
      description: "Verify your identity to enable payouts",
      status: "pending",
      icon: CheckCircle,
      actionText: "Verify Identity",
      estimatedTime: "5 min"
    }
  ]);

  const completedSteps = steps.filter(s => s.status === "completed").length;
  const progress = (completedSteps / steps.length) * 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "action_required":
        return <Badge variant="destructive">Action Required</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "action_required":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seller Onboarding</h1>
          <p className="text-muted-foreground">
            Complete these steps to start receiving payouts from your sales
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Setup Progress</CardTitle>
              <span className="text-2xl font-bold">{completedSteps}/{steps.length}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {completedSteps === steps.length 
                ? "🎉 Your seller account is fully set up! You can now receive payouts."
                : `${steps.length - completedSteps} step${steps.length - completedSteps !== 1 ? 's' : ''} remaining to complete your setup.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Action Required Alert */}
        {steps.some(s => s.status === "action_required") && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              Some steps need your immediate attention to enable payouts.
            </AlertDescription>
          </Alert>
        )}

        {/* Onboarding Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <Card key={step.id} className={step.status === "action_required" ? "border-destructive" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          {getStatusIcon(step.status)}
                        </div>
                        <CardDescription className="mb-3">{step.description}</CardDescription>
                        {step.estimatedTime && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>~{step.estimatedTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(step.status)}
                  </div>
                </CardHeader>
                {step.status !== "completed" && step.actionText && (
                  <CardContent className="pt-0">
                    <Button 
                      variant={step.status === "action_required" ? "default" : "outline"}
                      className="w-full sm:w-auto"
                    >
                      {step.actionText}
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <Separator className="my-8" />

        {/* Payout Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6" />
              <CardTitle>Payout Settings</CardTitle>
            </div>
            <CardDescription>Manage your payout preferences and schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Payout Schedule</p>
                <p className="text-sm text-muted-foreground">Weekly on Fridays</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-muted-foreground">
                  {steps.find(s => s.id === "bank_account")?.status === "completed" 
                    ? "••••1234 - Wells Fargo" 
                    : "Not connected"
                  }
                </p>
              </div>
              <Button variant="outline" size="sm">
                {steps.find(s => s.id === "bank_account")?.status === "completed" ? "Update" : "Add"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Available Balance</p>
                <p className="text-sm text-muted-foreground">$1,247.50</p>
              </div>
              <Button variant="outline" size="sm" disabled>Payout Now</Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              If you're having trouble with onboarding, our support team is here to help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline">View FAQ</Button>
              <Button variant="outline">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SellerOnboarding;