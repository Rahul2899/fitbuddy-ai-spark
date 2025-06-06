import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Target, Trophy, Users, Calendar, Zap, Brain, Heart, TrendingUp, Award, Medal, Flame, Crown, Shield, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { generateUserCSVEntry } from '@/utils/csvGenerator';
import ProfileForm from '@/components/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileResponse } from '@/types/fitness';

interface DashboardProps {
  forceShowProfileForm?: boolean;
  onProfileComplete?: () => void;
}

const Dashboard = ({ forceShowProfileForm = false, onProfileComplete }: DashboardProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentStreak, setCurrentStreak] = useState(12);
  const [leaguePosition, setLeaguePosition] = useState(3);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(forceShowProfileForm);

  // Only force profile form for truly new users (no stored profile)
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (!storedProfile && !forceShowProfileForm) {
      console.log('🔥 NEW USER DETECTED - SHOWING PROFILE FORM');
      setShowProfileForm(true);
    }
  }, [forceShowProfileForm]);

  useEffect(() => {
    console.log('=== DASHBOARD USEEFFECT ===');
    console.log('forceShowProfileForm prop:', forceShowProfileForm);
    console.log('User:', user?.email);
    
    // For new users, ALWAYS show profile form first
    const storedProfile = localStorage.getItem('userProfile');
    console.log('Stored profile:', storedProfile);
    
    if (!storedProfile) {
      console.log('🟡 No stored profile found, FORCING profile form for new user');
      setShowProfileForm(true);
      setLoading(false);
      return; // Don't try to load API data for new users
    }
    
    // Only try to load API data if user has a profile
    console.log('✅ User has profile, loading API data...');
    
    try {
      const profile = JSON.parse(storedProfile);
      const csvUserId = profile.csvUserId || 'USR001';
      console.log('Using stored CSV user ID:', csvUserId);
      
      apiService.getUserProfile(csvUserId)
        .then((profile: UserProfileResponse) => {
          console.log('API Response:', profile);
          
          // Check if API returned an error
          if (profile.error) {
            console.log('❌ API returned error:', profile.error);
            throw new Error(profile.error);
          }
          
          // Check if we have the expected data structure
          if (!profile.weekly_activity || !profile.health_metrics) {
            console.log('❌ API response missing expected data structure');
            throw new Error('Invalid API response structure');
          }
          
          // Success - use real API data
          console.log('✅ API Success - using real data');
          console.log('📊 Setting userStats with API data:', {
            weeklySteps: profile.weekly_activity.total_steps,
            weeklyGoal: 70000,
            workoutsThisWeek: profile.weekly_activity.exercise_sessions,
            caloriesBurned: profile.weekly_activity.calories_burned,
            avgHeartRate: profile.health_metrics.resting_heart_rate
          });
          
          setUserStats({
            weeklySteps: profile.weekly_activity.total_steps,
            weeklyGoal: 70000,
            currentStreak: 12,
            totalPoints: 3840,
            level: 15,
            workoutsThisWeek: profile.weekly_activity.exercise_sessions,
            caloriesBurned: profile.weekly_activity.calories_burned,
            avgHeartRate: profile.health_metrics.resting_heart_rate,
            insuranceBonus: 85,
            leagueRank: 3
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to load user stats:', error);
          
          // If user not found, try to generate their data automatically
          const storedProfile = localStorage.getItem('userProfile');
          if (storedProfile) {
            try {
              const profile = JSON.parse(storedProfile);
              console.log('🔄 User not found in API, generating data automatically...');
              
              // Generate data for this user
              apiService.generateUserData(profile.csvUserId, profile)
                .then(generateResult => {
                  console.log('✅ Auto-generated user data:', generateResult);
                  if (generateResult.success) {
                    console.log(`👤 Generated data for: ${generateResult.user_name}`);
                    // Retry fetching the user profile
                    console.log('🔄 Retrying user profile fetch...');
                    return apiService.getUserProfile(profile.csvUserId);
                  } else {
                    throw new Error('Failed to generate user data');
                  }
                })
                .then((retryProfile: UserProfileResponse) => {
                  if (retryProfile.error || !retryProfile.weekly_activity) {
                    throw new Error('Retry failed');
                  }
                  
                  console.log('✅ Retry successful - using generated data');
                  setUserStats({
                    weeklySteps: retryProfile.weekly_activity.total_steps,
                    weeklyGoal: 70000,
                    currentStreak: 12,
                    totalPoints: 3840,
                    level: 15,
                    workoutsThisWeek: retryProfile.weekly_activity.exercise_sessions,
                    caloriesBurned: retryProfile.weekly_activity.calories_burned,
                    avgHeartRate: retryProfile.health_metrics!.resting_heart_rate,
                    insuranceBonus: 85,
                    leagueRank: 3
                  });
                  setLoading(false);
                })
                .catch(retryError => {
                  console.error('❌ Auto-generation failed:', retryError);
                  // Fall back to default stats
                  setUserStats({
                    weeklySteps: 67400,
                    weeklyGoal: 70000,
                    currentStreak: 12,
                    totalPoints: 3840,
                    level: 15,
                    workoutsThisWeek: 6,
                    caloriesBurned: 2250,
                    avgHeartRate: 145,
                    insuranceBonus: 85,
                    leagueRank: 3
                  });
                  setLoading(false);
                });
            } catch (parseError) {
              console.error('❌ Error parsing profile for auto-generation:', parseError);
              // Use default stats
              setUserStats({
                weeklySteps: 67400,
                weeklyGoal: 70000,
                currentStreak: 12,
                totalPoints: 3840,
                level: 15,
                workoutsThisWeek: 6,
                caloriesBurned: 2250,
                avgHeartRate: 145,
                insuranceBonus: 85,
                leagueRank: 3
              });
              setLoading(false);
            }
          } else {
            // No profile found, use defaults
            setUserStats({
              weeklySteps: 67400,
              weeklyGoal: 70000,
              currentStreak: 12,
              totalPoints: 3840,
              level: 15,
              workoutsThisWeek: 6,
              caloriesBurned: 2250,
              avgHeartRate: 145,
              insuranceBonus: 85,
              leagueRank: 3
            });
            setLoading(false);
          }
        });
    } catch (error) {
      console.error('Error parsing stored profile:', error);
      console.log('🟡 Error with profile, showing profile form');
      setShowProfileForm(true);
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Handle profile form completion
  const handleProfileComplete = (csvUserId: string) => {
    setShowProfileForm(false);
    if (onProfileComplete) {
      onProfileComplete();
    }
    // Reload to show new user data
    window.location.reload();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  // Show profile form for new users
  if (showProfileForm) {
    console.log('🟢 RENDERING PROFILE FORM');
    return (
      <ProfileForm 
        onComplete={handleProfileComplete}
      />
    );
  }

  console.log('🔵 RENDERING DASHBOARD (not profile form)');
  console.log('ShowProfileForm state:', showProfileForm);
  console.log('UserStats:', userStats ? 'loaded' : 'null');

  // Use userStats (from API) instead of hardcoded stats
  const stats = userStats || {
    weeklySteps: 67400,
    weeklyGoal: 70000,
    currentStreak: currentStreak,
    totalPoints: 3840,
    level: 15,
    workoutsThisWeek: 6,
    caloriesBurned: 2250,
    avgHeartRate: 145,
    insuranceBonus: 85,
    leagueRank: leaguePosition
  };

  const competitions = [
    {
      title: "Bavaria Winter Challenge",
      description: "10,000 steps daily throughout January",
      progress: 78,
      daysLeft: 8,
      prize: "€50 + Wellness Weekend",
      participants: 2847,
      icon: Medal,
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "New Year League",
      description: "Weekly team challenges",
      progress: 92,
      daysLeft: 3,
      prize: "€100 Sports Voucher",
      participants: 156,
      icon: Crown,
      color: "from-amber-500 to-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Start Workout",
      description: "Begin your fitness session",
      icon: Activity,
      action: () => navigate('/workout-start'),
      color: "from-green-600 to-emerald-600",
      featured: true
    },
    {
      title: "AI Coach",
      description: "Get personalized guidance",
      icon: Brain,
      action: () => navigate('/ai-coach'),
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "View Progress",
      description: "Track your achievements",
      icon: TrendingUp,
      action: () => navigate('/progress'),
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed insights",
      icon: BarChart3,
      action: () => navigate('/analytics'),
      color: "from-indigo-600 to-purple-600"
    },
    {
      title: "League & Community",
      description: "Connect with friends",
      icon: Users,
      action: () => navigate('/social'),
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-white to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-blue-800" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  BewegungsLiga+
                </span>
                <div className="text-xs text-gray-600">Your Fitness Companion</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                <Crown className="w-4 h-4 mr-1" />
                Level {stats.level}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                <Flame className="w-4 h-4 mr-1" />
                {stats.currentStreak} Day Streak
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
                {greeting}, {user?.email?.split('@')[0] || 'Champion'}! 🏆
              </h1>
              <p className="text-gray-600 text-lg">Ready to crush your fitness goals today?</p>
              {/* Show real data indicator */}
              <p className="text-sm text-blue-600 mt-1">
                📊 Showing personalized data for {user?.email} (CSV ID: {JSON.parse(localStorage.getItem('userProfile') || '{}').csvUserId})
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  League Rank #{stats.leagueRank}
                </div>
                <Medal className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-gray-600">Bavaria Winter League</p>
            </div>
          </div>
        </header>

        {/* Active Competitions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-500" />
            Active Competitions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.map((comp, index) => (
              <Card key={index} className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${comp.color} rounded-xl flex items-center justify-center`}>
                        <comp.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{comp.title}</CardTitle>
                        <CardDescription>{comp.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-amber-500 text-amber-700">
                      {comp.daysLeft} days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-semibold">{comp.progress}%</span>
                      </div>
                      <Progress value={comp.progress} className="h-3" />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {comp.participants.toLocaleString()} participants
                      </span>
                      <span className="font-semibold text-amber-700">🏆 {comp.prize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Grid - NOW USING REAL DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Weekly Steps</p>
                  <p className="text-3xl font-bold">{stats.weeklySteps.toLocaleString()}</p>
                  <p className="text-blue-200 text-sm">Goal: {stats.weeklyGoal.toLocaleString()}</p>
                </div>
                <Activity className="w-10 h-10 text-blue-200" />
              </div>
              <Progress 
                value={(stats.weeklySteps / stats.weeklyGoal) * 100} 
                className="mt-3 bg-blue-600/30" 
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Insurance Bonus</p>
                  <p className="text-3xl font-bold">{stats.insuranceBonus}%</p>
                  <p className="text-purple-200 text-sm">to payout</p>
                </div>
                <Shield className="w-10 h-10 text-purple-200" />
              </div>
              <Progress 
                value={stats.insuranceBonus} 
                className="mt-3 bg-purple-600/30" 
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Workouts</p>
                  <p className="text-3xl font-bold">{stats.workoutsThisWeek}</p>
                  <p className="text-green-200 text-sm">This week</p>
                </div>
                <Target className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Heart Rate</p>
                  <p className="text-3xl font-bold">{stats.avgHeartRate}</p>
                  <p className="text-red-200 text-sm">BPM Average</p>
                </div>
                <Heart className="w-10 h-10 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 ${
                action.featured ? 'ring-2 ring-green-500 ring-opacity-50' : ''
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
                  <Badge className="mt-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    Recommended
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Insurance Bonus Progress
              </CardTitle>
              <CardDescription>Track your progress toward insurance rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Goal Progress</span>
                  <span className="text-sm text-gray-600">22/25 days</span>
                </div>
                <Progress value={88} className="w-full" />
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Only 3 days to €75 bonus!
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                League Leaderboard
              </CardTitle>
              <CardDescription>Your ranking in the Bavaria Winter League</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Bavaria Winter League</p>
                      <p className="text-sm text-gray-600">Rank #{stats.leagueRank} of 2,847</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/social')}
                    className="border-amber-200 hover:bg-amber-50"
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { activity: "HIIT training completed", time: "2 hours ago", calories: 320, badge: "🔥" },
                { activity: "12k steps reached", time: "Yesterday", calories: 450, badge: "👟" },
                { activity: "New record in squats", time: "2 days ago", calories: 280, badge: "💪" },
                { activity: "League challenge won", time: "3 days ago", calories: 0, badge: "🏆" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.badge}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.activity}</p>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                  </div>
                  {item.calories > 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {item.calories} kcal
                    </Badge>
                  )}
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