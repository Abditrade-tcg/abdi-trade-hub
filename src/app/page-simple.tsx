'use client';

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import NavbarWrapper from "@/components/NavbarWrapper"

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />

      {/* Main Content */}
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to AbdiTrade
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The premier marketplace for trading card enthusiasts. Buy, sell, and trade with confidence.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            
            {/* Hero Carousel */}
            <div className="mt-12">
              <HeroCarousel />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Trading</h3>
                <p className="text-gray-600">Protected transactions with escrow service</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Transactions</h3>
                <p className="text-gray-600">Quick and easy buying and selling</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-gray-600">Join thousands of collectors</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 AbdiTrade. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}