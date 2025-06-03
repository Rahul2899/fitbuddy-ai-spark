
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Target, Trophy, Users, Calendar, Zap, Brain, Heart, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const stats = {
    weeklySteps: 52400,
    weeklyGoal: 70000,
    currentStreak: 7,
    totalPoints: 2840,
    level: 12,
    workoutsThisWeek: 5,
    caloriesBurned: 1850,
    avgHeartRate: 142
  };

  const quickActions = [
    {
      title: "Start Workout",
      description: "Begin your fitness session",
      icon: Activity,
      action: () => navigate('/workout-start'),
      color: "from-emerald-600 to-teal-600",
      featured: true
    },
    {
      title: "AI Coach",
      description: "Get personalized guidance",
      icon: Brain,
      action: () => navigate('/ai-coach'),
      color: "from-cyan-600 to-blue-600"
    },
    {
      title: "View Progress",
      description: "Track your achievements",
      icon: TrendingUp,
      action: () => navigate('/progress'),
      color: "from-teal-600 to-emerald-600"
    },
    {
      title: "Social",
      description: "Connect with friends",
      icon: Users,
      action: () => navigate('/social'),
      color: "from-blue-600 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FitBuddy AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
                Level {stats.level}
              </Badge>
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {greeting}, {user?.email?.split('@')[0] || 'Fitness Champion'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">Ready to crush your fitness goals today?</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.currentStreak} Day Streak! 🔥
              </div>
              <p className="text-gray-600">Keep it up!</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Weekly Steps</p>
                  <p className="text-3xl font-bold">{stats.weeklySteps.toLocaleString()}</p>
                  <p className="text-emerald-200 text-sm">Goal: {stats.weeklyGoal.toLocaleString()}</p>
                </div>
                <Activity className="w-10 h-10 text-emerald-200" />
              </div>
              <Progress 
                value={(stats.weeklySteps / stats.weeklyGoal) * 100} 
                className="mt-3 bg-emerald-600/30" 
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100">Workouts</p>
                  <p className="text-3xl font-bold">{stats.workoutsThisWeek}</p>
                  <p className="text-cyan-200 text-sm">This week</p>
                </div>
                <Target className="w-10 h-10 text-cyan-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100">Calories Burned</p>
                  <p className="text-3xl font-bold">{stats.caloriesBurned}</p>
                  <p className="text-teal-200 text-sm">This week</p>
                </div>
                <Zap className="w-10 h-10 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Avg Heart Rate</p>
                  <p className="text-3xl font-bold">{stats.avgHeartRate}</p>
                  <p className="text-blue-200 text-sm">BPM</p>
                </div>
                <Heart className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-xl transition-all duration-300 border-0 ${
                action.featured ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''
              }`}
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
                {action.featured && (
                  <Badge className="mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    Recommended
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-600" />
                Insurance Bonus Progress
              </CardTitle>
              <CardDescription>Track your progress towards insurance rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Goal Progress</span>
                  <span className="text-sm text-gray-600">18/20 days</span>
                </div>
                <Progress value={90} className="w-full" />
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    2 more days to earn $50 bonus!
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                Fitness Community
              </CardTitle>
              <CardDescription>Your social fitness network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Fitness Champions League</p>
                      <p className="text-sm text-gray-600">Rank #3 this week</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/social')}
                    className="border-emerald-200 hover:bg-emerald-50"
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-emerald-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { activity: "Completed HIIT Workout", time: "2 hours ago", calories: 320 },
                { activity: "Achieved 10k steps", time: "Yesterday", calories: 450 },
                { activity: "New personal record in squats", time: "2 days ago", calories: 280 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.activity}</p>
                    <p className="text-sm text-gray-600">{item.time}</p>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    {item.calories} cal
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
