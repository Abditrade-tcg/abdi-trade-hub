import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

const ReturnPolicy = () => {
  const eligibleReturns = [
    "Item not as described in listing",
    "Item damaged in shipping",
    "Wrong item received",
    "Counterfeit or inauthentic item",
    "Grade or condition misrepresented",
  ];

  const ineligibleReturns = [
    "Change of mind after confirmation",
    "Buyer's remorse",
    "Found a better price elsewhere",
    "Item damaged after delivery confirmation",
    "Returns initiated after 3-day window",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">Return & Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 15, 2025</p>

          <Card className="mb-8">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At AbdiTrade, we want you to be completely satisfied with your purchases. This Return & Refund Policy explains 
                  your rights and our procedures for returns, refunds, and dispute resolution.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Inspection Period</h2>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold text-lg">3-Day Window</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Buyers have <strong>3 calendar days</strong> from delivery confirmation to inspect items and open a return 
                    request if there are issues. After this period, the transaction is considered final and payment is released to the seller.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Eligible Return Reasons</h2>
                <div className="space-y-3">
                  {eligibleReturns.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Ineligible Return Reasons</h2>
                <div className="space-y-3">
                  {ineligibleReturns.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Return Process</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">Step 1: Open a Return Request</h3>
                <p className="text-muted-foreground mb-4">
                  Within 3 days of delivery, go to your Orders page and click "Open Dispute" on the relevant order. 
                  Select your reason and provide detailed information and photos if applicable.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Step 2: Seller Response</h3>
                <p className="text-muted-foreground mb-4">
                  The seller has 24 hours to respond. They may:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Accept the return and provide a return shipping label</li>
                  <li>Offer a partial refund to resolve the issue</li>
                  <li>Dispute the claim with their own evidence</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Step 3: Mediation (if needed)</h3>
                <p className="text-muted-foreground mb-4">
                  If buyer and seller cannot reach an agreement, our Trust & Safety team will review the case and make a final decision 
                  within 24-48 hours.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Step 4: Return Shipping</h3>
                <p className="text-muted-foreground mb-4">
                  If the return is approved:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Seller provides prepaid return label (for seller's fault)</li>
                  <li>Buyer pays return shipping (for buyer's preference, if accepted by seller)</li>
                  <li>Item must be shipped within 5 business days</li>
                  <li>Use the same or better packaging than original shipment</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Step 5: Refund Processing</h3>
                <p className="text-muted-foreground">
                  Once the seller confirms receipt of the return, the refund is processed within 3-5 business days. 
                  Refunds are issued to the original payment method.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Refund Amounts</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Full Refund</h3>
                    <p className="text-muted-foreground text-sm">
                      Item price + original shipping (if item is not as described or damaged)
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Partial Refund</h3>
                    <p className="text-muted-foreground text-sm">
                      Negotiated amount if both parties agree to resolve without full return
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">No Refund</h3>
                    <p className="text-muted-foreground text-sm">
                      If dispute is resolved in seller's favor or return period has expired
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Verification Service Returns</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For orders with AbdiTrade Verification ($9.99):
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Verification fee is non-refundable</li>
                  <li>Verified items have documented condition reports</li>
                  <li>Returns for verified items must show clear discrepancies from verification report</li>
                  <li>Verification significantly reduces disputes and increases buyer confidence</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Special Circumstances</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">Lost or Damaged in Transit</h3>
                <p className="text-muted-foreground mb-4">
                  If an item is lost or damaged during shipping:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Seller must file insurance claim with carrier</li>
                  <li>Buyer receives full refund if item cannot be replaced</li>
                  <li>Seller may offer replacement if available</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Non-Delivery</h3>
                <p className="text-muted-foreground mb-4">
                  If tracking shows delivered but buyer claims non-receipt:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Buyer must report within 24 hours of delivery confirmation</li>
                  <li>Seller provides tracking evidence</li>
                  <li>Platform investigates and makes final determination</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Seller Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sellers must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Respond to return requests within 24 hours</li>
                  <li>Provide prepaid return labels for items not as described</li>
                  <li>Inspect returned items within 2 business days of receipt</li>
                  <li>Confirm receipt to trigger refund processing</li>
                  <li>Accept reasonable returns for legitimate issues</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Buyer Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Buyers must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Inspect items promptly upon delivery</li>
                  <li>Open return requests within 3-day window</li>
                  <li>Provide clear photos and description of issues</li>
                  <li>Return items in received condition (for "not as described")</li>
                  <li>Ship returns promptly with tracking</li>
                  <li>Package returns securely to prevent damage</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Abuse Prevention</h2>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Warning: Fraudulent Returns</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Abuse of the return system is strictly prohibited and may result in:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Account suspension or permanent ban</li>
                        <li>• Loss of buyer protection privileges</li>
                        <li>• Liability for seller's losses</li>
                        <li>• Legal action in cases of fraud</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about returns or refunds, contact our support team:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: support@abditrade.com<br />
                  Phone: 1-800-ABDITRADE<br />
                  Hours: Monday-Friday, 9 AM - 6 PM EST
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

export default ReturnPolicy;
