import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Shield, Users, MessageSquare, Star, AlertTriangle, CheckCircle, Ban } from "lucide-react";

const CommunityGuidelines = () => {
  const coreValues = [
    {
      icon: Heart,
      title: "Be Respectful",
      description: "Treat all community members with courtesy and kindness, regardless of their experience level or collection size."
    },
    {
      icon: Shield,
      title: "Be Honest",
      description: "Provide accurate descriptions, honest representations, and transparent communication in all transactions."
    },
    {
      icon: Users,
      title: "Be Helpful",
      description: "Share knowledge, answer questions, and support fellow collectors in building their collections."
    },
    {
      icon: MessageSquare,
      title: "Communicate Clearly",
      description: "Respond promptly to messages, provide updates on orders, and keep open lines of communication."
    },
  ];

  const expectedBehaviors = [
    "Provide accurate card descriptions and high-quality photos",
    "Ship items promptly and with proper protection",
    "Respond to messages within 24 hours",
    "Honor agreed-upon prices and terms",
    "Leave honest, constructive feedback",
    "Resolve conflicts professionally and respectfully",
    "Report violations of these guidelines"
  ];

  const prohibitedActions = [
    {
      category: "Fraudulent Activity",
      examples: [
        "Selling counterfeit or fake cards",
        "Misrepresenting card condition or authenticity",
        "Price manipulation or bid rigging",
        "Creating multiple accounts to manipulate ratings"
      ]
    },
    {
      category: "Abusive Behavior",
      examples: [
        "Harassment, threats, or intimidation",
        "Hate speech or discrimination",
        "Doxxing or sharing personal information",
        "Spam or unwanted solicitation"
      ]
    },
    {
      category: "Platform Abuse",
      examples: [
        "Circumventing fees or payment systems",
        "Fee manipulation or transaction splitting",
        "Interfering with other users' listings",
        "Using bots or automated tools"
      ]
    },
  ];

  const consequences = [
    {
      severity: "Minor Violations",
      icon: AlertTriangle,
      actions: ["Warning message", "Temporary restrictions", "Required education"],
      color: "text-yellow-500"
    },
    {
      severity: "Serious Violations",
      icon: Ban,
      actions: ["Listing removal", "Account suspension (7-30 days)", "Loss of seller privileges"],
      color: "text-orange-500"
    },
    {
      severity: "Severe Violations",
      icon: Shield,
      actions: ["Permanent account ban", "Legal action if necessary", "Report to authorities"],
      color: "text-red-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <section className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Community Guidelines</h1>
            <p className="text-xl text-muted-foreground">
              Building a safe, respectful, and thriving community for collectors worldwide
            </p>
          </section>

          {/* Core Values */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Expected Behaviors */}
          <section className="mb-20 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl">Expected Behaviors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  As a member of the AbdiTrade community, we expect you to:
                </p>
                <ul className="space-y-3">
                  {expectedBehaviors.map((behavior, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Prohibited Actions */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Prohibited Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {prohibitedActions.map((category, index) => (
                <Card key={index} className="border-red-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Ban className="h-6 w-6 text-red-500" />
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span className="text-sm text-muted-foreground">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Consequences */}
          <section className="bg-secondary/30 py-20 -mx-4 px-4 mb-20">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Enforcement & Consequences</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Violations of these guidelines will result in appropriate action based on severity and history
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {consequences.map((consequence, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-${consequence.color}/10 to-${consequence.color}/20 flex items-center justify-center mb-4`}>
                        <consequence.icon className={`h-6 w-6 ${consequence.color}`} />
                      </div>
                      <CardTitle>{consequence.severity}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {consequence.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className={`mt-1 ${consequence.color}`}>•</span>
                            <span className="text-sm text-muted-foreground">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Reporting */}
          <section className="max-w-4xl mx-auto mb-20">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Report Violations</h3>
                    <p className="text-muted-foreground mb-4">
                      If you witness behavior that violates these guidelines, please report it immediately. 
                      All reports are reviewed by our Trust & Safety team within 24 hours.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>How to report:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Click the "Report" button on any listing, message, or profile</li>
                        <li>Contact support@abditrade.com directly</li>
                        <li>Use the "Report Issue" feature in your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Best Practices */}
          <section className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl">Best Practices for Success</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">For Sellers:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Take clear, well-lit photos from multiple angles</li>
                    <li>• Describe condition honestly and in detail</li>
                    <li>• Package items securely with proper protection</li>
                    <li>• Ship within 2 business days of purchase</li>
                    <li>• Provide tracking information promptly</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">For Buyers:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Read descriptions carefully before purchasing</li>
                    <li>• Ask questions if anything is unclear</li>
                    <li>• Inspect items promptly upon receipt</li>
                    <li>• Communicate issues professionally</li>
                    <li>• Leave honest, fair feedback</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">For Traders:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Value cards fairly based on market prices</li>
                    <li>• Be open to negotiation and counter-offers</li>
                    <li>• Consider verification for high-value trades</li>
                    <li>• Ship simultaneously or use verification service</li>
                    <li>• Maintain clear communication throughout</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
