
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import GameDetails from "./pages/GameDetails";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import TermsOfUse from "./pages/TermsOfUse";
import TermsOfSale from "./pages/TermsOfSale";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/parties" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/team/:id" element={<Team />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/terms-of-sale" element={<TermsOfSale />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
