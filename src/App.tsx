import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthenticatedHome from "./pages/AuthenticatedHome";
import Guilds from "./pages/Guilds";
import Marketplace from "./pages/Marketplace";
import Auctions from "./pages/Auctions";
import Trades from "./pages/Trades";
import Orders from "./pages/Orders";
import Messages from "./pages/Messages";
import MyCollection from "./pages/MyCollection";
import Profile from "./pages/Profile";
import Disputes from "./pages/Disputes";
import Admin from "./pages/Admin";
import CEO from "./pages/CEO";
import CFO from "./pages/CFO";
import HR from "./pages/HR";
import TrustSafety from "./pages/TrustSafety";
import OrderManagement from "./pages/OrderManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<AuthenticatedHome />} />
            <Route path="/guilds" element={<Guilds />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/collection" element={<MyCollection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/ceo" element={<CEO />} />
            <Route path="/admin/cfo" element={<CFO />} />
            <Route path="/admin/hr" element={<HR />} />
            <Route path="/admin/trust-safety" element={<TrustSafety />} />
            <Route path="/admin/order-management" element={<OrderManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
