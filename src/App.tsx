import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Sell from "./pages/Sell";
import Inventory from "./pages/Inventory";
import CreateTrade from "./pages/CreateTrade";
import Auth from "./pages/Auth";
import AuthenticatedHome from "./pages/AuthenticatedHome";
import Guilds from "./pages/Guilds";
import GuildDetail from "./pages/GuildDetail";
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
import Browse from "./pages/Browse";
import ListingDetail from "./pages/ListingDetail";
import HowItWorksPage from "./pages/HowItWorksPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Fees from "./pages/Fees";
import TrustSafetyPage from "./pages/TrustSafetyPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import CookiePolicy from "./pages/CookiePolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import DMCA from "./pages/DMCA";
import SellerAgreement from "./pages/SellerAgreement";
import Accessibility from "./pages/Accessibility";
import Notifications from "./pages/Notifications";
import SellerOnboarding from "./pages/SellerOnboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<AuthenticatedHome />} />
            <Route path="/guilds" element={<Guilds />} />
            <Route path="/guilds/:guildId" element={<GuildDetail />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/create-trade" element={<CreateTrade />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/collection" element={<MyCollection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/seller-onboarding" element={<SellerOnboarding />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/ceo" element={<CEO />} />
            <Route path="/admin/cfo" element={<CFO />} />
            <Route path="/admin/hr" element={<HR />} />
            <Route path="/admin/trust-safety" element={<TrustSafety />} />
            <Route path="/admin/order-management" element={<OrderManagement />} />
            
            {/* Public Pages */}
            <Route path="/browse" element={<Browse />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/trust-safety" element={<TrustSafetyPage />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/returns" element={<ReturnPolicy />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/seller-agreement" element={<SellerAgreement />} />
            <Route path="/accessibility" element={<Accessibility />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
