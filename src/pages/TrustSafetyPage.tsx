import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Users,
  FileText,
  MessageSquare,
  Clock,
  Scale
} from "lucide-react";
import { Link } from "react-router-dom";

const TrustSafetyPage = () => {
  const protections = [
    {
      icon: Shield,
      title: "Buyer Protection",
      description: "Your payment is held securely until you confirm receipt and satisfaction with your purchase. If something goes wrong, you're covered.",
      features: [
        "Secure payment escrow",
        "3-day inspection period",
        "Full refund guarantee for misrepresented items",
        "Fraud protection"
      ]
    },
    {
      icon: Lock,
      title: "Seller Protection",
      description: "Verified buyers and protection against chargebacks and fraudulent claims ensure safe transactions for sellers.",
      features: [
        "Identity-verified buyers",
        "Chargeback protection",
        "Clear transaction records",
        "Fair dispute resolution"
      ]
    },
    {
      icon: CheckCircle,
      title: "Verification Service",
      description: "Professional authentication and condition verification for high-value cards and trades ($9.99 per side).",
      features: [
        "Expert authentication",
        "Condition assessment",
        "Photo documentation",
        "Dispute prevention"
      ]
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Secure Transaction",
      description: "Payment is held securely when a buyer purchases. Funds aren't released until both parties are satisfied."
    },
    {
      step: "2",
      title: "Inspection Period",
      description: "Buyers have 3 days to inspect their purchase and ensure it matches the listing description."
    },
    {
      step: "3",
      title: "Confirmation or Dispute",
      description: "Confirm receipt to release payment, or open a dispute if there's an issue. Our team reviews all disputes fairly."
    },
    {
      step: "4",
      title: "Resolution",
      description: "Disputes are typically resolved within 24-48 hours with clear communication and evidence review."
    },
  ];

  const reportingReasons = [
    "Counterfeit or fake cards",
    "Misrepresented condition",
    "Non-delivery or shipping issues",
    "Harassment or abusive behavior",
    "Prohibited items or activity",
    "Price manipulation or fraud"
  ];

  const safetyTips = [
    {
      icon: Eye,
      title: "Check Seller Ratings",
      description: "Review seller ratings, total sales, and feedback before making purchases. Look for verified sellers."
    },
    {
      icon: FileText,
      title: "Read Listings Carefully",
      description: "Examine photos closely and read descriptions thoroughly. Ask questions if anything is unclear."
    },
    {
      icon: MessageSquare,
      title: "Communicate on Platform",
      description: "Always communicate through AbdiTrade messaging. Never send money outside the platform."
    },
    {
      icon: AlertTriangle,
      title: "Report Suspicious Activity",
      description: "If something seems off, report it immediately. Our team reviews all reports within 24 hours."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Trust & Safety</h1>
            <p className="text-xl text-muted-foreground">
              Your security is our top priority. Every transaction on AbdiTrade is protected by our comprehensive safety measures.
            </p>
          </div>
        </section>

        {/* Main Protections */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {protections.map((protection, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <protection.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{protection.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{protection.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {protection.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How Protection Works */}
        <section className="bg-secondary/30 py-20 mb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Payment Protection Works</h2>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <Card key={index} className="relative">
                  <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {item.step}
                  </div>
                  <CardContent className="pt-8 pb-6">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="max-w-2xl mx-auto mt-12 text-center">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold mb-2">Average Resolution Time: 24-48 Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Most disputes are resolved quickly with clear communication and our dedicated Trust & Safety team.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Reporting */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 p-8">
                  <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Report Issues</h2>
                  <p className="text-muted-foreground mb-6">
                    See something suspicious? Report it immediately. Our Trust & Safety team investigates all reports within 24 hours.
                  </p>
                  <Link to="/contact">
                    <Button variant="destructive" className="gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Report a Problem
                    </Button>
                  </Link>
                </div>
                
                <div className="p-8">
                  <h3 className="font-semibold mb-4">Common Reasons to Report:</h3>
                  <ul className="space-y-2">
                    {reportingReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="container mx-auto px-4 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Safety Tips for Collectors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {safetyTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                      <tip.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Identity Verification */}
        <section className="bg-primary/5 py-20 mb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Identity Verification</h2>
              <p className="text-lg text-muted-foreground mb-8">
                All sellers are verified through Stripe Connect, ensuring accountability and trust in every transaction. 
                Sellers provide government ID and business information before they can list items.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <Card>
                  <CardContent className="p-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                    <p className="text-sm font-medium">KYC Verification</p>
                    <p className="text-xs text-muted-foreground mt-1">Know Your Customer identity checks</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                    <p className="text-sm font-medium">Bank Verification</p>
                    <p className="text-xs text-muted-foreground mt-1">Validated payment accounts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                    <p className="text-sm font-medium">Tax Compliance</p>
                    <p className="text-xs text-muted-foreground mt-1">1099 reporting for sellers</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Disputes & Resolution */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Fair Dispute Resolution</h2>
              <p className="text-lg text-muted-foreground">
                Our Trust & Safety team ensures every dispute is handled fairly, with evidence reviewed from both sides.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">95%</p>
                  <p className="text-sm text-muted-foreground">Disputes Resolved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">24-48h</p>
                  <p className="text-sm text-muted-foreground">Average Response</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">4.9/5</p>
                  <p className="text-sm text-muted-foreground">Resolution Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Questions About Safety?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our team is here to help. Contact us anytime for safety concerns or questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contact Support
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button size="lg" variant="outline">View FAQs</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrustSafetyPage;
