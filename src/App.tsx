
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import { ScrollToTop } from './components/ui/scroll-to-top';
import CookieConsentBanner from './components/CookieConsentBanner';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NewPassword from './pages/NewPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import CreateParty from './pages/CreateParty';
import GameDetails from './pages/GameDetails';
import EditGame from './pages/EditGame';
import Parties from './pages/Parties';
import Toolbox from './pages/Toolbox';
import Team from './pages/Team';
import CreateTeam from './pages/CreateTeam';
import AuthGuard from './components/auth/AuthGuard';
import Messages from './pages/Messages';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/new-password" element={<NewPassword />} />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/create-party" element={
                <AuthGuard>
                  <CreateParty />
                </AuthGuard>
              } />
              <Route path="/game/:gameId" element={<GameDetails />} />
              <Route path="/edit-game/:gameId" element={
                <AuthGuard>
                  <EditGame />
                </AuthGuard>
              } />
              <Route path="/parties" element={<Parties />} />
              <Route path="/toolbox" element={<Toolbox />} />
              <Route path="/team/:teamId" element={<Team />} />
              <Route path="/create-team" element={
                <AuthGuard>
                  <CreateTeam />
                </AuthGuard>
              } />
              <Route path="/messages" element={
                <AuthGuard>
                  <Messages />
                </AuthGuard>
              } />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
          <CookieConsentBanner />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
