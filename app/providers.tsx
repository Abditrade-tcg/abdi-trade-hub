"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from 'next-themes'
import { CartProvider } from '@/contexts/CartContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}