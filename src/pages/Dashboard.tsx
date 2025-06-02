
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Target, Trophy, Users, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = {
    weeklyWorkouts: 4,
    weeklyGoal: 5,
    currentStreak: 7,
    totalPoints: 2840,
    level: 12
  };

  const recentWorkouts = [
    { id: 1, name: "Upper Body Strength", duration: "45 min", calories: 320, date: "Today" },
    { id: 2, name: "HIIT Cardio", duration: "30 min", calories: 280, date: "Yesterday" },
    { id: 3, name: "Yoga Flow", duration: "60 min", calories: 180, date: "2 days ago" }
  ];

  const achievements = [
    { id: 1, name: "Week Warrior", description: "Complete 5 workouts in a week", earned: false },
    { id: 2, name: "Streak Master", description: "Maintain 7-day streak", earned: true },
    { id: 3, name: "Calorie Crusher", description: "Burn 300+ calories in one session", earned: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Fitness Warrior! 💪</h1>
              <p className="text-gray-600 mt-2">Let's crush your fitness goals today</p>
            </div>
            <Button onClick={() => navigate('/ai-coach')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Zap className="w-4 h-4 mr-2" />
              AI Coach
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Weekly Progress</p>
                  <p className="text-2xl font-bold">{stats.weeklyWorkouts}/{stats.weeklyGoal}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
              <Progress value={(stats.weeklyWorkouts / stats.weeklyGoal) * 100} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Current Streak</p>
                  <p className="text-2xl font-bold">{stats.currentStreak} days</p>
                </div>
                <Target className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Points</p>
                  <p className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</p>
                </div>
                <Trophy className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Current Level</p>
                  <p className="text-2xl font-bold">Level {stats.level}</p>
                </div>
                <Zap className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Workouts
              </CardTitle>
              <CardDescription>Your latest fitness activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-gray-600">{workout.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{workout.duration}</p>
                      <p className="text-sm text-gray-600">{workout.calories} cal</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/workouts')}
              >
                View All Workouts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
              <CardDescription>Your fitness milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                      <Trophy className={`w-5 h-5 ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.earned ? "Earned" : "Locked"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/achievements')}
              >
                View All Achievements
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button 
            size="lg" 
            className="h-24 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            onClick={() => navigate('/workout-start')}
          >
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Start Workout</p>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-24"
            onClick={() => navigate('/social')}
          >
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Social Feed</p>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-24"
            onClick={() => navigate('/progress')}
          >
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Progress</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
