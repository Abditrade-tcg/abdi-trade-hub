import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SellerAgreement = () => {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">Seller Agreement</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

          <Card>
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By registering as a seller on AbdiTrade, you agree to be bound by this Seller Agreement ("Agreement"), 
                  our Terms of Service, and all applicable laws and regulations. This Agreement supplements and is incorporated 
                  into our Terms of Service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Seller Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To sell on AbdiTrade, you must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Have a valid payment account through Stripe Connect</li>
                  <li>Complete identity verification</li>
                  <li>Provide accurate tax information</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Have a physical address in a supported country</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Listing Requirements</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Accurate Descriptions</h3>
                <p className="text-muted-foreground mb-4">
                  You must provide accurate, complete, and current information in all listings, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Card name, set, and number</li>
                  <li>Accurate condition assessment</li>
                  <li>Clear photos from multiple angles</li>
                  <li>Any defects, damage, or imperfections</li>
                  <li>Grading information if applicable</li>
                  <li>Print run or edition details</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Prohibited Items</h3>
                <p className="text-muted-foreground mb-4">
                  You may not list:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Counterfeit, fake, or unauthorized reproductions</li>
                  <li>Stolen property</li>
                  <li>Items that violate intellectual property rights</li>
                  <li>Illegal or restricted items</li>
                  <li>Items you do not physically possess</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Pricing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You are free to set your own prices. However, price manipulation, artificial inflation, or coordination 
                  with other sellers to fix prices is prohibited.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Fees and Payment</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Platform Fee</h3>
                <p className="text-muted-foreground mb-4">
                  AbdiTrade charges a 13% platform fee on each sale, calculated on the total sale price (excluding shipping). 
                  This fee covers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Payment processing</li>
                  <li>Buyer and seller protection</li>
                  <li>Platform features and support</li>
                  <li>Fraud prevention</li>
                  <li>Dispute resolution services</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Payment Processing</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All payments are processed through Stripe Connect. Payment is held securely until the buyer confirms receipt 
                  or the inspection period (3 days) expires without dispute.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Payouts</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Payouts are processed within 2-3 business days after payment release. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Maintaining accurate banking information</li>
                  <li>Taxes on your earnings</li>
                  <li>Fees charged by your bank or payment provider</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Shipping Obligations</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Shipping Timeframe</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You must ship items within 2 business days of receiving payment confirmation. Failure to ship promptly 
                  may result in order cancellation and seller penalties.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Packaging Standards</h3>
                <p className="text-muted-foreground mb-4">
                  All items must be packaged securely:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Use rigid card protectors or toploaders</li>
                  <li>Include padding to prevent movement</li>
                  <li>Use waterproof packaging</li>
                  <li>Label packages clearly</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tracking is required for all orders over $20. You must upload tracking information to the platform 
                  within 24 hours of shipment.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Returns and Refunds</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You must accept returns for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Items not as described</li>
                  <li>Damaged items (if damage occurred before delivery)</li>
                  <li>Wrong items sent</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You are not required to accept returns for buyer's remorse or change of mind, though you may choose to do so.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Communication & Customer Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Respond to buyer messages within 24 hours</li>
                  <li>Provide timely updates on order status</li>
                  <li>Resolve issues professionally and courteously</li>
                  <li>Communicate only through the AbdiTrade platform</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Seller Performance Standards</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To maintain good standing, sellers should strive for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Order defect rate below 1%</li>
                  <li>Late shipment rate below 4%</li>
                  <li>Average response time under 24 hours</li>
                  <li>Seller rating above 4.5 stars</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Consistent poor performance may result in account restrictions or termination.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Tax Obligations</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Determining and paying all applicable taxes</li>
                  <li>Providing accurate tax information to Stripe</li>
                  <li>Receiving and filing Form 1099-K if applicable</li>
                  <li>Maintaining records for tax purposes</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  AbdiTrade is not responsible for your tax obligations. Consult a tax professional for guidance.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Prohibited Seller Practices</h2>
                <p className="text-muted-foreground mb-4">
                  The following practices are strictly prohibited:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Manipulating feedback or ratings</li>
                  <li>Creating multiple accounts</li>
                  <li>Circumventing platform fees</li>
                  <li>Requesting direct payment outside the platform</li>
                  <li>Misrepresenting items or conditions</li>
                  <li>Interfering with other sellers' listings</li>
                  <li>Harassing buyers or other sellers</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Disputes</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If a buyer opens a dispute, you must respond within 24 hours and work towards resolution. 
                  Our Trust & Safety team may mediate and make final decisions. Decisions are binding and final.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Account Termination</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AbdiTrade may suspend or terminate your seller account for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Violation of this Agreement or Terms of Service</li>
                  <li>Poor performance or excessive complaints</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Failure to maintain accurate account information</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You may close your account at any time, subject to fulfilling existing orders and obligations.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AbdiTrade provides a platform for transactions but is not party to the actual sale. We are not liable for 
                  buyer claims, payment disputes (beyond our mediation), or any losses resulting from your use of the platform.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Changes to Agreement</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may modify this Agreement at any time. Continued selling after changes constitutes acceptance. 
                  Significant changes will be communicated via email.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">15. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about this Seller Agreement, contact:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: sellers@abditrade.com<br />
                  Phone: 1-800-ABDITRADE<br />
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

export default SellerAgreement;
