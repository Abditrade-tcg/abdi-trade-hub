import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "next-themes"
import { CartProvider } from "@/contexts/CartContext"
import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: "AbdiTrade - Premium Trading Card Marketplace",
  description:
    "Buy, sell, and trade trading cards securely on AbdiTrade. Join thousands of collectors in live auctions, social trading, and connect with the TCG community.",
  authors: [{ name: "AbdiTrade" }],
  openGraph: {
    title: "AbdiTrade - Premium Trading Card Marketplace",
    description: "The ultimate marketplace for trading card enthusiasts. Buy, sell, and trade with confidence.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <CartProvider>
                <Suspense fallback={null}>
                  {children}
                  <Toaster />
                  <Sonner />
                </Suspense>
              </CartProvider>
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}