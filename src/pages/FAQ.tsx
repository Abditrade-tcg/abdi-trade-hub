import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top right corner and follow the registration process. You can sign up with email, phone, or social accounts. Verification takes just a few minutes."
        },
        {
          q: "Is AbdiTrade free to use?",
          a: "Creating an account and browsing is completely free. We charge a 13% platform fee on sales, which includes payment processing and buyer protection. There are no hidden fees."
        },
        {
          q: "What cards can I buy and sell?",
          a: "We support Pokemon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, Digimon, and many other trading card games. Both modern and vintage cards are welcome."
        },
      ]
    },
    {
      category: "Buying",
      questions: [
        {
          q: "How do I search for cards?",
          a: "Use the search bar to find cards by name, set, or card number. Apply filters for game, condition, rarity, price range, and seller rating to narrow your results."
        },
        {
          q: "Is my payment secure?",
          a: "Yes! All payments are processed through Stripe, an industry-leading payment processor. Your payment is held securely until you confirm receipt of your cards."
        },
        {
          q: "What if the card isn't as described?",
          a: "You're protected! Open a dispute within 3 days of delivery. Our Trust & Safety team will review the case and help resolve it fairly. You may be eligible for a full refund."
        },
        {
          q: "Can I make an offer on a listing?",
          a: "Some sellers accept offers. Look for the 'Make Offer' button on listings. Sellers can accept, decline, or counter your offer."
        },
      ]
    },
    {
      category: "Selling",
      questions: [
        {
          q: "How do I start selling?",
          a: "Complete the seller onboarding process by connecting your Stripe account. This allows us to pay you securely. Then create your first listing!"
        },
        {
          q: "What are the fees?",
          a: "We charge 13% on each sale, which covers payment processing, buyer protection, and platform services. This is transparent and shown before you finalize your listing."
        },
        {
          q: "How do I get paid?",
          a: "Once a buyer confirms receipt of their order, payment is released to your connected Stripe account. Payouts typically arrive within 2-3 business days."
        },
        {
          q: "How should I ship cards?",
          a: "Use rigid card protectors and padded envelopes or boxes. Include tracking for orders over $20. Print shipping labels through our platform for discounted rates."
        },
        {
          q: "Can I cancel an order after it's placed?",
          a: "Orders can be canceled within 1 hour of placement if you haven't shipped yet. Contact the buyer and our support team. After shipping, cancellations require buyer agreement."
        },
      ]
    },
    {
      category: "Trading",
      questions: [
        {
          q: "How does trading work?",
          a: "Browse other users' collections and propose trades. Select cards from both sides, add cash compensation if needed, and send the offer. The other user can accept, decline, or counter."
        },
        {
          q: "What is trade verification?",
          a: "Optional verification service ($9.99 per side) where both parties' cards are checked by our team before the trade is completed. This adds extra security for high-value trades."
        },
        {
          q: "What if someone doesn't ship their side of the trade?",
          a: "Open a dispute immediately. If the other party fails to ship within the agreed timeframe, we'll help resolve the issue and may issue refunds or penalties."
        },
      ]
    },
    {
      category: "Safety & Support",
      questions: [
        {
          q: "How do I report a problem?",
          a: "Use the 'Report' button on any listing, message, or user profile. You can also contact support directly through your account. We review all reports within 24 hours."
        },
        {
          q: "What is buyer protection?",
          a: "Your payment is held until you confirm receipt and satisfaction. If there's an issue, you can open a dispute within 3 days. We'll mediate and help reach a fair resolution."
        },
        {
          q: "How do you handle disputes?",
          a: "Our Trust & Safety team reviews all disputes within 24-48 hours. Both parties can provide evidence and communicate their side. We aim for fair, transparent resolutions."
        },
        {
          q: "Can I trust sellers on AbdiTrade?",
          a: "We verify all seller identities through Stripe Connect. Check seller ratings, total sales, and reviews before purchasing. Report suspicious activity immediately."
        },
      ]
    },
    {
      category: "Account & Technical",
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Account Settings > Security. You can update your password, enable two-factor authentication, and review active sessions."
        },
        {
          q: "I forgot my password. What do I do?",
          a: "Click 'Forgot Password' on the login page. We'll send a reset link to your email. If you don't receive it, check spam or contact support."
        },
        {
          q: "Can I delete my account?",
          a: "Yes, go to Account Settings > Privacy & Data. You can request account deletion. Note that some transaction records are retained for legal compliance."
        },
        {
          q: "Why isn't my listing showing up?",
          a: "New listings may take up to 15 minutes to appear in search. If it's been longer, check that your listing meets our content guidelines and isn't flagged for review."
        },
      ]
    },
  ];

  const filteredFAQs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      searchQuery === "" ||
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about buying, selling, and trading on AbdiTrade
            </p>
          </div>

          {/* Search */}
          <Card className="max-w-2xl mx-auto mb-12 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* FAQ Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredFAQs.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                <Card className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <Card className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a href="/contact">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Contact Support
                </button>
              </a>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;

