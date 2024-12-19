import React from 'react';
import { Target } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Target className="w-10 h-10 text-indigo-600" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          BIS Arena
        </h1>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{title}</h2>
      {children}
    </div>
  </div>
);