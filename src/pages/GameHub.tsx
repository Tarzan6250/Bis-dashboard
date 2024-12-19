import React from 'react';
import { Gamepad2, Puzzle, Brain, Search } from 'lucide-react';

const GameHub = () => {
  const games = [
    {
      title: 'Fruit Quality Inspector',
      description: 'Slice fruits while learning quality standards',
      icon: Gamepad2,
      category: 'Action',
      difficulty: 'Easy',
      color: 'from-green-400 to-emerald-600',
    },
    {
      title: 'Standards Puzzle',
      description: 'Arrange pieces to complete BIS procedures',
      icon: Puzzle,
      category: 'Puzzle',
      difficulty: 'Medium',
      color: 'from-blue-400 to-indigo-600',
    },
    {
      title: 'BIS Quiz Challenge',
      description: 'Test your knowledge of BIS standards',
      icon: Brain,
      category: 'Quiz',
      difficulty: 'Hard',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Easter Egg Hunt',
      description: 'Find hidden BIS symbols across scenarios',
      icon: Search,
      category: 'Adventure',
      difficulty: 'Medium',
      color: 'from-pink-400 to-rose-600',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Game Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${game.color}" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${game.color}`}>
                  <game.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{game.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{game.category}</span>
                <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${game.color} text-white`}>
                  {game.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHub;