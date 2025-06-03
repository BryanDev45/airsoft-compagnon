import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import CreateGame from './pages/CreateGame';
import GameDetails from './pages/GameDetails';
import EditGame from './pages/EditGame';
import SearchGames from './pages/SearchGames';
import ToolBox from './pages/ToolBox';
import TeamPage from './pages/TeamPage';
import CreateTeam from './pages/CreateTeam';
import EditTeam from './pages/EditTeam';
import TeamInvitation from './pages/TeamInvitation';
import AuthGuard from './guards/AuthGuard';
import AdminGuard from './guards/AdminGuard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGames from './pages/admin/AdminGames';
import AdminTeams from './pages/admin/AdminTeams';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import Messages from './pages/Messages';

function App() {
  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/create-game" element={
                <AuthGuard>
                  <CreateGame />
                </AuthGuard>
              } />
              <Route path="/game/:gameId" element={<GameDetails />} />
              <Route path="/edit-game/:gameId" element={
                <AuthGuard>
                  <EditGame />
                </AuthGuard>
              } />
              <Route path="/parties" element={<SearchGames />} />
              <Route path="/toolbox" element={<ToolBox />} />
              <Route path="/team/:teamId" element={<TeamPage />} />
              <Route path="/create-team" element={
                <AuthGuard>
                  <CreateTeam />
                </AuthGuard>
              } />
              <Route path="/edit-team/:teamId" element={
                <AuthGuard>
                  <EditTeam />
                </AuthGuard>
              } />
              <Route path="/team-invitation/:inviteId" element={
                <AuthGuard>
                  <TeamInvitation />
                </AuthGuard>
              } />
              <Route path="/messages" element={
                <AuthGuard>
                  <Messages />
                </AuthGuard>
              } />
              <Route path="/admin" element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              } />
              <Route path="/admin/users" element={
                <AdminGuard>
                  <AdminUsers />
                </AdminGuard>
              } />
              <Route path="/admin/games" element={
                <AdminGuard>
                  <AdminGames />
                </AdminGuard>
              } />
              <Route path="/admin/teams" element={
                <AdminGuard>
                  <AdminTeams />
                </AdminGuard>
              } />
              <Route path="/admin/reports" element={
                <AdminGuard>
                  <AdminReports />
                </AdminGuard>
              } />
              <Route path="/admin/settings" element={
                <AdminGuard>
                  <AdminSettings />
                </AdminGuard>
              } />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
          <CookieConsent />
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;
