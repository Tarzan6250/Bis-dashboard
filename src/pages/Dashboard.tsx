import React from 'react';
import { Trophy, Target, Book, Calendar } from 'lucide-react';

const Dashboard = () => {
  const dailyMissions = [
    { title: 'Complete Safety Standards Quiz', points: 100, progress: 0 },
    { title: 'Watch 2 Videos on Quality Control', points: 50, progress: 1 },
    { title: 'Find 3 Easter Eggs', points: 75, progress: 2 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
          Welcome to BIS Arena
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Trophy}
          title="Total Points"
          value="1,250"
          trend="+150 today"
          color="from-yellow-400 to-orange-600"
        />
        <StatCard
          icon={Target}
          title="Missions Completed"
          value="8/10"
          trend="80% complete"
          color="from-primary-400 to-primary-600"
        />
        <StatCard
          icon={Book}
          title="Standards Learned"
          value="15"
          trend="3 this week"
          color="from-secondary-400 to-secondary-600"
        />
        <StatCard
          icon={Calendar}
          title="Daily Streak"
          value="5 days"
          trend="Personal best!"
          color="from-accent-400 to-accent-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
            Daily Missions
          </h2>
          <div className="space-y-4">
            {dailyMissions.map((mission, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-800">{mission.title}</h3>
                  <p className="text-sm text-gray-500">{mission.points} points</p>
                </div>
                <div className="w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(mission.progress / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
            Recent Achievements
          </h2>
          <div className="space-y-4">
            <Achievement
              title="Standards Champion"
              description="Completed all basic safety standards modules"
              date="2 days ago"
            />
            <Achievement
              title="Quick Learner"
              description="Watched 5 videos in one day"
              date="3 days ago"
            />
            <Achievement
              title="Perfect Score"
              description="Scored 100% in Quality Control quiz"
              date="1 week ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{trend}</p>
  </div>
);

const Achievement = ({ title, description, date }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="mt-1">
      <Trophy className="w-5 h-5 text-yellow-500" />
    </div>
    <div>
      <h3 className="font-medium text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  </div>
);

export default Dashboard;