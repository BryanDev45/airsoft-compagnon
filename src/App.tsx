
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Parties from './pages/Parties';
import GameDetails from './pages/GameDetails';
import EditGame from './pages/EditGame';
import NotFound from './pages/NotFound';
import UserProfile from './pages/UserProfile';
import CreateParty from './pages/CreateParty';
import Team from './pages/Team';
import Contact from './pages/Contact';
import About from './pages/About';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of a token in local storage
    const token = localStorage.getItem('sb-raolbrsijdjnilvkbvgj-auth-token');
    setIsLoggedIn(!!token);

    // If the user is not logged in and tries to access a protected route, redirect to the login page
    const publicRoutes = ['/login', '/register', '/', '/parties', '/game', '/contact', '/about'];
    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

    if (!isLoggedIn && !isPublicRoute) {
      navigate('/login');
    }
  }, [location, navigate, isLoggedIn]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/parties" element={<Parties />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/edit-game/:id" element={<EditGame />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/create-party" element={<CreateParty />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
