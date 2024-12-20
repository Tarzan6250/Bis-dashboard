import React from 'react';
import { Link } from 'react-router-dom';

const GameHub = () => {
  const games = [
    {
      title: 'Fruit Quality Inspector',
      description: 'Slice fruits while learning quality standards.',
      image: 'public/assets/images/Fruitcutter.jpeg',
      link: '/games/Fruitcutter/fruitCutterNew/index.html',
      category: 'Action',
      difficulty: 'Easy',
      color: 'from-green-400 to-emerald-600',
    },
    {
      title: 'BIS Quiz Challenge',
      description: 'Test your knowledge of BIS standards.',
      image: 'public/assets/images/Quiz.jpeg',
      link: 'http://localhost:3001', // Link to the React app
      category: 'Quiz',
      difficulty: 'Medium',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Standards Puzzle',
      description: 'Arrange pieces to complete BIS procedures.',
      image: 'public/assets/images/puzzle.jpeg',
      link: 'http://localhost:5174',
      category: 'Puzzle',
      difficulty: 'Hard',
      color: 'from-blue-400 to-indigo-600',
    },
    {
      title: 'Easter Egg Hunt',
      description: 'Find hidden BIS symbols across scenarios.',
      image: 'public/assets/images/EGG.png',
      link: 'http://localhost:3000',
      category: 'Adventure',
      difficulty: 'Medium',
      color: 'from-pink-400 to-rose-600',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <a href={game.link} key={index} className="block">
            <div className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative">
                {/* Game Image */}
                <img
                  src={game.image}
                  alt={`${game.title} Thumbnail`}
                  className="w-full h-40 object-cover"
                />
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                />
              </div>
              <div className="p-6">
                {/* Game Title */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{game.title}</h2>
                <p className="text-gray-600 mb-4">{game.description}</p>
                {/* Game Category and Difficulty */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{game.category}</span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${game.color} text-white`}
                  >
                    {game.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GameHub;
