import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, DollarSign, Shield, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Fees = () => {
  const feeStructure = [
    {
      title: "Buying",
      description: "Browse and purchase freely",
      fee: "Free",
      details: [
        "No listing browsing fees",
        "No search fees",
        "No registration fees",
        "Free buyer protection included"
      ]
    },
    {
      title: "Selling",
      description: "Simple, transparent pricing",
      fee: "13%",
      details: [
        "13% platform fee per sale",
        "Includes payment processing",
        "Seller protection included",
        "No monthly subscription"
      ]
    },
    {
      title: "Trading",
      description: "Connect with collectors",
      fee: "Free",
      details: [
        "No fees for direct trades",
        "Free messaging with traders",
        "Optional verification available",
        "No hidden charges"
      ]
    },
  ];

  const optionalServices = [
    {
      service: "AbdiTrade Verification",
      price: "$9.99 per side",
      description: "Professional verification for trades and high-value purchases",
      features: [
        "Card authentication",
        "Condition verification",
        "Photo documentation",
        "Secure handling"
      ]
    },
    {
      service: "Featured Listings",
      price: "Starting at $4.99",
      description: "Boost visibility for your listings",
      features: [
        "Priority placement in search",
        "Homepage feature opportunities",
        "Extended visibility period",
        "Analytics dashboard"
      ]
    },
  ];

  const comparison = [
    {
      platform: "AbdiTrade",
      sellerFee: "13%",
      buyerProtection: true,
      verifiedSellers: true,
      tradeSupport: true,
      hiddenFees: false,
    },
    {
      platform: "Competitor A",
      sellerFee: "12.9% + $0.30",
      buyerProtection: true,
      verifiedSellers: false,
      tradeSupport: false,
      hiddenFees: true,
    },
    {
      platform: "Competitor B",
      sellerFee: "10% + $0.50",
      buyerProtection: false,
      verifiedSellers: false,
      tradeSupport: false,
      hiddenFees: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              No hidden fees. No surprises. Just honest, straightforward pricing that works for collectors.
            </p>
          </div>
        </section>

        {/* Main Fee Structure */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feeStructure.map((item, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary mb-6">{item.fee}</p>
                  <ul className="space-y-3">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seller Fee Breakdown */}
        <section className="bg-secondary/30 py-20 mb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Understanding the 13% Seller Fee</h2>
              <p className="text-center text-muted-foreground mb-12">
                Here's exactly what's included in our platform fee
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Payment Processing (≈3%)</h3>
                        <p className="text-sm text-muted-foreground">
                          Secure Stripe payment processing, fraud protection, and instant transfers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Buyer & Seller Protection</h3>
                        <p className="text-sm text-muted-foreground">
                          Dispute resolution, secure transactions, and platform insurance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Platform Features</h3>
                        <p className="text-sm text-muted-foreground">
                          Listing tools, analytics, messaging, and customer support
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Marketing & Discovery</h3>
                        <p className="text-sm text-muted-foreground">
                          Search optimization, email marketing, and community promotion
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-8 bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Example: Selling a $100 Card</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sale Price:</span>
                      <span className="font-medium">$100.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee (13%):</span>
                      <span className="font-medium text-red-500">-$13.00</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">You Receive:</span>
                      <span className="font-bold text-primary">$87.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Optional Services */}
        <section className="container mx-auto px-4 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Optional Add-Ons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {optionalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>{service.service}</CardTitle>
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-secondary/30 py-20 mb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How We Compare</h2>
            
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-4 px-4">Feature</th>
                    {comparison.map((platform, idx) => (
                      <th key={idx} className="text-center py-4 px-4">
                        {platform.platform}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4 font-medium">Seller Fee</td>
                    {comparison.map((platform, idx) => (
                      <td key={idx} className="py-4 px-4 text-center">
                        {platform.sellerFee}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4 font-medium">Buyer Protection</td>
                    {comparison.map((platform, idx) => (
                      <td key={idx} className="py-4 px-4 text-center">
                        {platform.buyerProtection ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4 font-medium">Verified Sellers</td>
                    {comparison.map((platform, idx) => (
                      <td key={idx} className="py-4 px-4 text-center">
                        {platform.verifiedSellers ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4 font-medium">Trade Support</td>
                    {comparison.map((platform, idx) => (
                      <td key={idx} className="py-4 px-4 text-center">
                        {platform.tradeSupport ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Hidden Fees</td>
                    {comparison.map((platform, idx) => (
                      <td key={idx} className="py-4 px-4 text-center">
                        {platform.hiddenFees ? (
                          <span className="text-red-500 font-medium">Yes</span>
                        ) : (
                          <span className="text-green-500 font-medium">No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of collectors enjoying transparent, fair pricing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg">Create Free Account</Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">Have Questions?</Button>
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

export default Fees;
