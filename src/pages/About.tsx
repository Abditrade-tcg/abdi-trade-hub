import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, TrendingUp, Heart, Target, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every transaction is protected with secure payment processing and dispute resolution.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built by collectors, for collectors. We understand the passion behind every card.",
    },
    {
      icon: TrendingUp,
      title: "Fair Pricing",
      description: "Transparent 13% platform fee with no hidden charges. Market data helps you price competitively.",
    },
    {
      icon: Heart,
      title: "Passion for Cards",
      description: "We're collectors too. We built the platform we wished existed for trading cards.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$5M+", label: "Cards Traded" },
    { value: "150K+", label: "Listings" },
    { value: "4.9", label: "Avg Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About AbdiTrade</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're building the most trusted marketplace for collectible trading cards. 
              Our platform connects collectors worldwide, making it safe and easy to buy, sell, and trade cards.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-secondary/30 py-20 mb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-6 mb-12">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To create the safest, most transparent marketplace where collectors can confidently buy, sell, 
                    and trade their passion. We believe every card has a story, and we're here to help those stories 
                    continue through fair, secure transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To be the global platform that powers the collectible card economy. From vintage rarities to 
                    the latest releases, we're building tools and services that make collecting more accessible, 
                    secure, and enjoyable for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  AbdiTrade was born from frustration. As collectors ourselves, we experienced countless issues 
                  with existing marketplaces: confusing fees, unreliable sellers, no buyer protection, and 
                  complicated trading processes.
                </p>
                <p>
                  We knew there had to be a better way. So we built it.
                </p>
                <p>
                  Starting in 2024, we created a platform that puts collectors first. Every feature, from our 
                  secure payment system to our verification service, was designed with the community's needs in mind. 
                  We've worked with thousands of collectors to refine the experience, making it easier and safer 
                  than ever to buy, sell, and trade cards.
                </p>
                <p>
                  Today, AbdiTrade serves collectors across the globe, facilitating millions in transactions 
                  while maintaining the trust and transparency that defines us. We're just getting started, 
                  and we're excited to have you join us on this journey.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

