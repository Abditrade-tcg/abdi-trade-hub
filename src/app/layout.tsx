import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}