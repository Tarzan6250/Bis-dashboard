import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import GameHub from './pages/GameHub';
import LearningHub from './pages/LearningHub';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import  Profile  from './pages/Profile'; // Import Profile as a named export

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to update authentication status after login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'yourAuthTokenHere'); // Save token in localStorage after login
  };

  // Handle logout by removing the token and setting authenticated to false
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  // If the user is not authenticated, show login/signup routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // If the user is authenticated, show the authenticated app (sidebar + content)
  return (
    <div className="flex h-screen bg-gradient-radial from-gray-50 to-gray-100">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto bg-gradient-to-br from-transparent via-primary-50/30 to-secondary-50/30">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/games" element={<GameHub />} />
          <Route path="/learning" element={<LearningHub />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} /> {/* Profile route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
