"use client";

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { CartProvider } from '@/contexts/CartContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider basePath="/api/auth" refetchInterval={0}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}