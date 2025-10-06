import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, Keyboard, Monitor, Volume2, Accessibility as AccessibilityIcon, CheckCircle } from "lucide-react";

const Accessibility = () => {
  const features = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard navigation support for users who cannot use a mouse"
    },
    {
      icon: Eye,
      title: "Screen Reader Compatible",
      description: "ARIA labels and semantic HTML for screen reader accessibility"
    },
    {
      icon: Monitor,
      title: "Responsive Design",
      description: "Works on all devices and screen sizes, from mobile to desktop"
    },
    {
      icon: Volume2,
      title: "Text Alternatives",
      description: "Alt text for images and transcripts for audio content"
    }
  ];

  const standards = [
    "WCAG 2.1 Level AA compliance",
    "Section 508 standards",
    "ADA (Americans with Disabilities Act) guidelines",
    "ARIA (Accessible Rich Internet Applications) best practices"
  ];

  const improvements = [
    {
      area: "Navigation",
      items: [
        "Skip to main content links",
        "Consistent navigation structure",
        "Clear page titles and headings",
        "Focus indicators on interactive elements"
      ]
    },
    {
      area: "Visual Design",
      items: [
        "High contrast color schemes",
        "Scalable text (up to 200%)",
        "Dark mode support",
        "Clear typography and spacing"
      ]
    },
    {
      area: "Content",
      items: [
        "Plain language and clear instructions",
        "Descriptive link text",
        "Error messages with clear guidance",
        "Form labels and instructions"
      ]
    },
    {
      area: "Multimedia",
      items: [
        "Alternative text for images",
        "Captions for video content",
        "Transcripts for audio",
        "No auto-playing content"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <section className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <AccessibilityIcon className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Accessibility Statement</h1>
            <p className="text-xl text-muted-foreground">
              AbdiTrade is committed to ensuring digital accessibility for people with disabilities. 
              We continually improve the user experience for everyone.
            </p>
          </section>

          {/* Our Commitment */}
          <section className="mb-20 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Commitment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We believe that everyone should be able to buy, sell, and trade collectible cards on our platform, 
                  regardless of their abilities. We are actively working to increase the accessibility and usability 
                  of our website for all users.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our ongoing accessibility efforts work towards conforming to the Web Content Accessibility Guidelines (WCAG) 
                  version 2.1, level AA criteria. These guidelines explain how to make web content more accessible for people 
                  with disabilities and more user-friendly for everyone.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Accessibility Features */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Accessibility Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Standards */}
          <section className="bg-secondary/30 py-20 -mx-4 px-4 mb-20">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">Conformance Standards</h2>
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    AbdiTrade strives to conform to the following accessibility standards:
                  </p>
                  <ul className="space-y-3">
                    {standards.map((standard, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{standard}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Ongoing Improvements */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Ongoing Improvements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {improvements.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.area}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Assistive Technology */}
          <section className="mb-20 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Compatible Assistive Technology</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  AbdiTrade is designed to be compatible with the following assistive technologies:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Screen readers (JAWS, NVDA, VoiceOver)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Screen magnification software</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Speech recognition software</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Browser text-only mode</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Operating system accessibility features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Keyboard-only navigation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Known Limitations */}
          <section className="mb-20 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Known Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Despite our best efforts, some areas of our website may not yet be fully accessible:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li>• Some third-party integrations may have limited accessibility</li>
                  <li>• User-uploaded images may lack adequate alt text</li>
                  <li>• Some complex interactive features are still being optimized</li>
                </ul>
                <p className="text-muted-foreground">
                  We are actively working to address these limitations and appreciate your patience as we continue to improve.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Feedback */}
          <section className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">We Welcome Your Feedback</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We are committed to continuous improvement. If you encounter accessibility barriers on AbdiTrade, 
                  or if you have suggestions for improvement, please let us know.
                </p>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    <strong>Accessibility Coordinator:</strong><br />
                    Email: accessibility@abditrade.com<br />
                    Phone: 1-800-ABDITRADE<br />
                    Address: 123 Trading Card Ave, New York, NY 10001
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to accessibility feedback within 3 business days.
                  </p>
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

export default Accessibility;
