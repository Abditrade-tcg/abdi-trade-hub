import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const CookiePolicy = () => {
  const lastUpdated = "January 15, 2025";
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    advertising: true,
  });

  const handleSavePreferences = () => {
    // In production, this would save to localStorage or backend
    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been updated.",
    });
  };

  const cookieTypes = [
    {
      name: "Strictly Necessary Cookies",
      canDisable: false,
      description: "These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and basic navigation.",
      examples: [
        "Session cookies",
        "Authentication tokens",
        "Security cookies",
        "Load balancing"
      ]
    },
    {
      name: "Functional Cookies",
      canDisable: true,
      key: "functional" as const,
      description: "These cookies enhance your experience by remembering your preferences and choices.",
      examples: [
        "Language preferences",
        "Theme settings (dark/light mode)",
        "Search filters",
        "Saved searches"
      ]
    },
    {
      name: "Analytics Cookies",
      canDisable: true,
      key: "analytics" as const,
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      examples: [
        "Page views and traffic sources",
        "Time spent on pages",
        "Click patterns",
        "Device and browser information"
      ]
    },
    {
      name: "Advertising Cookies",
      canDisable: true,
      key: "advertising" as const,
      description: "These cookies are used to deliver relevant advertisements and track advertising campaign performance.",
      examples: [
        "Ad impressions and clicks",
        "Retargeting",
        "Interest-based advertising",
        "Third-party ad networks"
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

            {/* Cookie Preferences Card */}
            <Card className="mb-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Manage Your Cookie Preferences</h2>
                <p className="text-muted-foreground mb-6">
                  You can control which types of cookies we use. Note that blocking some types of cookies may impact your experience.
                </p>

                <div className="space-y-4">
                  {cookieTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                      <div className="flex-1">
                        <Label htmlFor={type.key} className="font-semibold cursor-pointer">
                          {type.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                      <Switch
                        id={type.key}
                        checked={type.canDisable ? preferences[type.key] : true}
                        onCheckedChange={(checked) => {
                          if (type.canDisable && type.key) {
                            setPreferences({ ...preferences, [type.key]: checked });
                          }
                        }}
                        disabled={!type.canDisable}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={handleSavePreferences}>Save Preferences</Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPreferences({
                      necessary: true,
                      functional: false,
                      analytics: false,
                      advertising: false,
                    })}
                  >
                    Reject All
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPreferences({
                      necessary: true,
                      functional: true,
                      analytics: true,
                      advertising: true,
                    })}
                  >
                    Accept All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Policy Content */}
            <Card>
              <CardContent className="p-8 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Cookies are small text files that are placed on your device when you visit a website. They help websites recognize 
                    your device and remember information about your visit, such as your preferred language and other settings.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    AbdiTrade uses cookies for the following purposes:
                  </p>

                  <div className="space-y-6">
                    {cookieTypes.map((type, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                        <p className="text-muted-foreground mb-3">{type.description}</p>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium mb-1">Examples:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            {type.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We also use cookies from trusted third parties:
                  </p>
                  <ul className="space-y-3 text-muted-foreground ml-4">
                    <li>
                      <strong>Stripe:</strong> For secure payment processing and fraud prevention
                    </li>
                    <li>
                      <strong>Google Analytics:</strong> To understand how visitors use our site
                    </li>
                    <li>
                      <strong>Social Media Platforms:</strong> For social sharing and authentication
                    </li>
                    <li>
                      <strong>Advertising Networks:</strong> To deliver relevant ads
                    </li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className="text-2xl font-bold mb-4">How Long Cookies Last</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="font-semibold mb-2">Session Cookies</h3>
                      <p>These are temporary cookies that expire when you close your browser.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                      <p>
                        These remain on your device for a set period or until you delete them. 
                        Our persistent cookies typically last from 30 days to 2 years.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You can control cookies in several ways:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4">
                    <li>
                      <strong>Cookie Preferences:</strong> Use the preference manager above
                    </li>
                    <li>
                      <strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies
                    </li>
                    <li>
                      <strong>Browser Add-ons:</strong> Install privacy-focused extensions
                    </li>
                    <li>
                      <strong>Do Not Track:</strong> Enable your browser's Do Not Track setting
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Note: Blocking certain cookies may affect your ability to use some features of AbdiTrade.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-2xl font-bold mb-4">Browser-Specific Instructions</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                    </p>
                    <p>
                      <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                    </p>
                    <p>
                      <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                    </p>
                    <p>
                      <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies
                    </p>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. 
                    We will notify you of significant changes via email or platform notice.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about our use of cookies, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: privacy@abditrade.com<br />
                    Address: 123 Trading Card Ave, New York, NY 10001
                  </p>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
