import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import GameHub from './pages/GameHub';
import LearningHub from './pages/LearningHub';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage authentication state

  // Function to update authentication status (to be called after login)
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Pass handleLogin as prop */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} /> {/* Pass handleLogin as prop */}
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-radial from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gradient-to-br from-transparent via-primary-50/30 to-secondary-50/30">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/games" element={<GameHub />} />
          <Route path="/learning" element={<LearningHub />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
