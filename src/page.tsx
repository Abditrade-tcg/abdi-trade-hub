import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden py-20 sm:py-32" style={{ background: "var(--gradient-hero)" }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                  The Premier{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Trading Card
                  </span>{" "}
                  Marketplace
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-pretty">
                  Buy, sell, and trade your favorite cards with confidence. Join thousands of collectors in the most
                  trusted TCG marketplace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    asChild
                  >
                    <Link href="/browse">
                      Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="transition-all duration-300 hover:scale-105 hover:border-primary hover:text-primary bg-transparent"
                    asChild
                  >
                    <Link href="/how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Right Content - Carousel */}
              <div className="flex justify-center">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">Why Choose Abditrade?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div
                className="bg-card p-8 rounded-lg border border-primary/20 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                style={{ transition: "var(--transition-smooth)" }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Trading</h3>
                <p className="text-muted-foreground">
                  Advanced buyer and seller protection ensures every transaction is safe and secure.
                </p>
              </div>
              <div
                className="bg-card p-8 rounded-lg border border-primary/20 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                style={{ transition: "var(--transition-smooth)" }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent/20">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Instant listings, real-time auctions, and quick checkout for seamless trading.
                </p>
              </div>
              <div
                className="bg-card p-8 rounded-lg border border-primary/20 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                style={{ transition: "var(--transition-smooth)" }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Thriving Community</h3>
                <p className="text-muted-foreground">
                  Connect with collectors worldwide, join guilds, and share your passion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">Ready to Start Trading?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto text-pretty">
                Join thousands of collectors and start building your dream collection today.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="transition-all duration-300 hover:scale-110 hover:shadow-lg"
                asChild
              >
                <Link href="/auth">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
