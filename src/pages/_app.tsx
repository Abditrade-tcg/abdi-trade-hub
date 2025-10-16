import '@/global.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/contexts/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session} basePath="/api/auth" refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <CartProvider>
              <Component {...pageProps} />
              <Toaster />
              <Sonner />
            </CartProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
