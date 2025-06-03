
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Messages from './pages/Messages';

// Create placeholder components for missing pages
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const ForgotPassword = () => <div>Forgot Password Page</div>;
const ResetPassword = () => <div>Reset Password Page</div>;
const Profile = () => <div>Profile Page</div>;
const UserProfile = () => <div>User Profile Page</div>;
const CreateGame = () => <div>Create Game Page</div>;
const GameDetails = () => <div>Game Details Page</div>;
const EditGame = () => <div>Edit Game Page</div>;
const SearchGames = () => <div>Search Games Page</div>;
const ToolBox = () => <div>ToolBox Page</div>;
const TeamPage = () => <div>Team Page</div>;
const CreateTeam = () => <div>Create Team Page</div>;
const EditTeam = () => <div>Edit Team Page</div>;
const TeamInvitation = () => <div>Team Invitation Page</div>;

// Create placeholder guards
const AuthGuard = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const AdminGuard = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Create placeholder admin pages
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminUsers = () => <div>Admin Users</div>;
const AdminGames = () => <div>Admin Games</div>;
const AdminTeams = () => <div>Admin Teams</div>;
const AdminReports = () => <div>Admin Reports</div>;
const AdminSettings = () => <div>Admin Settings</div>;

// Create placeholder components
const ScrollToTop = () => null;
const CookieConsent = () => null;

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
