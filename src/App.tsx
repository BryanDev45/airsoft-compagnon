
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import GlobalServices from '@/components/GlobalServices';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';

// Pages
import Index from './pages/Index';
import Parties from './pages/Parties';
import Toolbox from './pages/Toolbox';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Team from './pages/Team';
import CreateTeam from './pages/CreateTeam';
import CreateParty from './pages/CreateParty';
import EditGame from './pages/EditGame';
import GameDetails from './pages/GameDetails';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import Admin from './pages/Admin';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import TermsOfSale from './pages/TermsOfSale';
import CookiesPolicy from './pages/CookiesPolicy';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

// Composant pour intégrer le tracking des pages
const PageTracker = () => {
  usePageAnalytics();
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <PageTracker />
          <GlobalServices />
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Pages publiques */}
              <Route path="/" element={<Index />} />
              <Route path="/parties" element={<Parties />} />
              <Route path="/toolbox" element={<Toolbox />} />
              <Route path="/toolbox/:activeTab" element={<Toolbox />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/terms-of-sale" element={<TermsOfSale />} />
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              
              {/* Pages d'authentification */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/new-password" element={<NewPassword />} />
              
              {/* Pages protégées */}
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/user/:username" element={<UserProfile />} />
              
              {/* Routes pour les équipes */}
              <Route path="/team/:id" element={<Team />} />
              <Route path="/create-team" element={
                <AuthGuard>
                  <CreateTeam />
                </AuthGuard>
              } />
              
              {/* Routes pour les parties - Support des deux URLs */}
              <Route path="/create-party" element={
                <AuthGuard>
                  <CreateParty />
                </AuthGuard>
              } />
              <Route path="/parties/create" element={
                <AuthGuard>
                  <CreateParty />
                </AuthGuard>
              } />
              <Route path="/edit-game/:id" element={
                <AuthGuard>
                  <EditGame />
                </AuthGuard>
              } />
              <Route path="/game/:id" element={<GameDetails />} />
              
              <Route path="/messages" element={
                <AuthGuard>
                  <Messages />
                </AuthGuard>
              } />
              <Route path="/admin" element={
                <AuthGuard>
                  <Admin />
                </AuthGuard>
              } />
              
              {/* Page 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
