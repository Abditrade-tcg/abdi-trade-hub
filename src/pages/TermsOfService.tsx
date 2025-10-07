import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

          <Card>
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using AbdiTrade ("Service", "Platform", "we", "us"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you do not agree to these Terms, you may not access or use the Service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You must be at least 18 years old to use AbdiTrade. By using the Service, you represent and warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into a binding agreement</li>
                  <li>You will comply with all applicable laws and regulations</li>
                  <li>All information you provide is accurate and truthful</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Not create multiple accounts or impersonate others</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Buying and Selling</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Listings</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sellers must provide accurate descriptions, conditions, and images of items. Misrepresentation of items is strictly prohibited.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Transactions</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All transactions are subject to our payment processing terms. Payment is held securely until the buyer confirms receipt or the inspection period expires.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Fees</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AbdiTrade charges a 13% platform fee on all sales. This fee covers payment processing, buyer protection, and platform services. 
                  Additional fees may apply for optional services like verification.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Prohibited Activities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Sell counterfeit, stolen, or illegal items</li>
                  <li>Manipulate prices or engage in fraudulent activities</li>
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Circumvent platform fees or payment systems</li>
                  <li>Use automated tools to scrape or collect data</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Service and its content, including but not limited to text, graphics, logos, and software, are owned by AbdiTrade 
                  and protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of content you post, but grant AbdiTrade a worldwide, non-exclusive license to use, display, 
                  and distribute your content in connection with the Service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Disputes and Resolution</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our dispute resolution process is designed to resolve conflicts fairly:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Buyers have 3 days from delivery to open a dispute</li>
                  <li>Both parties can provide evidence and communicate</li>
                  <li>Our Trust & Safety team reviews all disputes within 24-48 hours</li>
                  <li>Decisions are final and binding</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AbdiTrade provides a platform for users to buy, sell, and trade. We are not responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>The quality, safety, or legality of items listed</li>
                  <li>The accuracy of listings or user representations</li>
                  <li>Ability of buyers to pay or sellers to deliver</li>
                  <li>Any user-generated content or conduct</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, ABDITRADE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold AbdiTrade harmless from any claims, losses, liabilities, and expenses arising from 
                  your use of the Service, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may suspend or terminate your account at any time for violations of these Terms, fraudulent activity, or any reason 
                  we deem necessary. You may close your account at any time through your account settings.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may modify these Terms at any time. We will notify users of significant changes via email or platform notice. 
                  Continued use of the Service after changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of the State of New York, without regard to conflict of law principles. 
                  Any disputes shall be resolved in the courts located in New York, NY.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: legal@abditrade.com<br />
                  Address: 123 Trading Card Ave, New York, NY 10001
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;

