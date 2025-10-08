"use client";

import { ThemeProvider } from 'next-themes'
import { CartProvider } from '@/contexts/CartContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  )
}