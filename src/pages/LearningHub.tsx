import React from 'react';
import { Play, BookOpen, Shield, Factory } from 'lucide-react';

const LearningHub = () => {
  const categories = [
    {
      title: 'Safety Standards',
      icon: Shield,
      videos: [
        { title: 'Introduction to Safety Standards', duration: '5:30', standards: ['IS 12345', 'IS 67890'] },
        { title: 'Workplace Safety Guidelines', duration: '8:45', standards: ['IS 45678'] },
      ]
    },
    {
      title: 'Quality Control',
      icon: Factory,
      videos: [
        { title: 'Quality Management Basics', duration: '6:15', standards: ['IS 98765'] },
        { title: 'Inspection Techniques', duration: '7:20', standards: ['IS 34567'] },
      ]
    },
  ];

  // Function to handle "View More" button click
  const handleViewMoreClick = () => {
    window.open('http://localhost:5175', '_blank'); // Replace with the desired URL
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Learning Hub</h1>
        {/* View More Button */}
        <button
          onClick={handleViewMoreClick}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          View More
        </button>
      </div>
      <div className="space-y-8">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <category.icon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
            </div>
            <div className="space-y-4">
              {category.videos.map((video, vIndex) => (
                <div key={vIndex} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Play className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-800">{video.title}</h3>
                      <p className="text-sm text-gray-500">Standards: {video.standards.join(', ')}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{video.duration}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningHub;
