import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gamepad2, 
  GraduationCap, 
  Trophy, 
  Medal,
  Target,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/games', icon: Gamepad2, label: 'Game Hub' },
    { path: '/learning', icon: GraduationCap, label: 'Learning Hub' },
    { path: '/achievements', icon: Trophy, label: 'Achievements' },
    { path: '/leaderboard', icon: Medal, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' }, // Moved Profile into navItems
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-primary-600 to-primary-700 text-white px-3 py-4 flex flex-col h-screen">
      {/* App Title */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <Target className="w-8 h-8 text-white" />
        <h1 className="text-xl font-bold text-white">BIS Arena</h1>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 mt-4 w-full text-white hover:bg-white/10 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
