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
    weeklySteps: 52400,
    weeklyGoal: 70000,
    currentStreak: 7,
    totalPoints: 2840,
    level: 12
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Max! 👋</h1>
              <p className="text-gray-600 mt-2">Let's achieve your fitness goals today</p>
            </div>
            <Button onClick={() => navigate('/profile')} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Zap className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Weekly Steps</p>
                  <p className="text-2xl font-bold">{stats.weeklySteps.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
              <Progress value={(stats.weeklySteps / stats.weeklyGoal) * 100} className="mt-3" />
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
                Insurance Bonus Progress
              </CardTitle>
              <CardDescription>Track your progress towards insurance rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Goal Progress</span>
                  <span className="text-sm text-gray-600">12/20 days</span>
                </div>
                <Progress value={60} className="w-full" />
                <div className="text-center">
                  <Badge variant="outline">8 more days to earn your bonus!</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Liga
              </CardTitle>
              <CardDescription>Your group's activity this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Family Champions</p>
                      <p className="text-sm text-gray-600">4 members active</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button 
            size="lg" 
            className="h-24 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            onClick={() => navigate('/activity')}
          >
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Track Activity</p>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-24"
            onClick={() => navigate('/liga')}
          >
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Join Liga</p>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-24"
            onClick={() => navigate('/rewards')}
          >
            <div className="text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">View Rewards</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;