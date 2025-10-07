import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

          <Card>
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AbdiTrade ("we", "us", "our") respects your privacy and is committed to protecting your personal data. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Account information (name, email, phone number)</li>
                  <li>Payment information (processed securely by Stripe)</li>
                  <li>Shipping addresses</li>
                  <li>Profile information and preferences</li>
                  <li>Communications with us and other users</li>
                  <li>Listings, reviews, and feedback</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (with your permission)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Information from Third Parties</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Social media authentication data</li>
                  <li>Payment verification from Stripe</li>
                  <li>Shipping tracking from carriers</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide and maintain the Service</li>
                  <li>Process transactions and send confirmations</li>
                  <li>Communicate with you about your account and orders</li>
                  <li>Send marketing and promotional materials (with your consent)</li>
                  <li>Improve and personalize your experience</li>
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce our Terms</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">4.1 With Other Users</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your public profile, listings, reviews, and transaction history may be visible to other users.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.2 With Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We share information with trusted third parties who help us operate:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Stripe (payment processing)</li>
                  <li>Shipping carriers (fulfillment)</li>
                  <li>Email service providers (communications)</li>
                  <li>Analytics services (service improvement)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.3 For Legal Reasons</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may disclose information when required by law, to protect our rights, or to prevent fraud and abuse.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use the Service</li>
                  <li>Improve performance and user experience</li>
                  <li>Deliver relevant advertising</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You can control cookies through your browser settings. See our Cookie Policy for more details.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your information, including encryption, secure servers, 
                  and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot 
                  guarantee absolute security.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Your Rights and Choices</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">You have the right to:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Access and review your personal data</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict certain processing</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Disable cookies through browser settings</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, contact us at privacy@abditrade.com
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your information for as long as necessary to provide the Service and comply with legal obligations. 
                  Transaction records are retained for at least 7 years for tax and legal purposes.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service is not intended for users under 18. We do not knowingly collect information from children. 
                  If we learn we have collected a child's information, we will delete it promptly.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
                  safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or 
                  platform notice. Your continued use after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about this Privacy Policy or our data practices, contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: privacy@abditrade.com<br />
                  Address: 123 Trading Card Ave, New York, NY 10001<br />
                  Phone: 1-800-ABDITRADE
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

export default PrivacyPolicy;

