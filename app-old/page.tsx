import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import PopularCards from "@/components/PopularCards";
import TrustSection from "@/components/TrustSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <PopularCards />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}