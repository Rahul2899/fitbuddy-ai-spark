
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, Award, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProgressStats {
  totalWorkouts: number;
  totalCalories: number;
  totalMinutes: number;
  weeklyGoal: number;
  weeklyProgress: number;
  currentStreak: number;
  achievements: number;
}

const Progress = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<ProgressStats>({
    totalWorkouts: 0,
    totalCalories: 0,
    totalMinutes: 0,
    weeklyGoal: 5,
    weeklyProgress: 0,
    currentStreak: 0,
    achievements: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch workouts
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id);

      if (workoutsError) throw workoutsError;

      // Fetch achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      if (achievementsError) throw achievementsError;

      // Calculate stats
      const totalWorkouts = workouts?.length || 0;
      const totalCalories = workouts?.reduce((sum, w) => sum + (w.calories_burned || 0), 0) || 0;
      const totalMinutes = workouts?.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) || 0;

      // Calculate weekly progress
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyWorkouts = workouts?.filter(w => 
        new Date(w.completed_at) >= oneWeekAgo
      ).length || 0;

      // Calculate streak (simplified)
      const currentStreak = Math.min(totalWorkouts, 7);

      setStats({
        totalWorkouts,
        totalCalories,
        totalMinutes,
        weeklyGoal: 5,
        weeklyProgress: weeklyWorkouts,
        currentStreak,
        achievements: achievements?.length || 0
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
      toast({
        title: "Error",
        description: "Failed to load progress data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
            <p className="text-gray-600 mt-2">Monitor your fitness journey and achievements</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Workouts</p>
                  <p className="text-3xl font-bold">{stats.totalWorkouts}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Calories Burned</p>
                  <p className="text-3xl font-bold">{stats.totalCalories.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Minutes</p>
                  <p className="text-3xl font-bold">{stats.totalMinutes}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Achievements</p>
                  <p className="text-3xl font-bold">{stats.achievements}</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goal Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Goal Progress
              </CardTitle>
              <CardDescription>
                Track your weekly workout goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Workouts this week</span>
                  <span className="text-sm text-gray-600">
                    {stats.weeklyProgress} / {stats.weeklyGoal}
                  </span>
                </div>
                <ProgressBar 
                  value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
                  className="w-full"
                />
                <div className="text-center">
                  <Badge 
                    variant={stats.weeklyProgress >= stats.weeklyGoal ? "default" : "secondary"}
                  >
                    {stats.weeklyProgress >= stats.weeklyGoal ? "Goal Achieved!" : "Keep Going!"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Current Streak
              </CardTitle>
              <CardDescription>
                Your workout consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats.currentStreak}
                </div>
                <p className="text-gray-600">days in a row</p>
                <div className="mt-4">
                  <Badge variant="outline">
                    {stats.currentStreak >= 7 ? "On Fire! 🔥" : "Building momentum..."}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            size="lg" 
            className="h-16 bg-gradient-to-r from-green-600 to-green-700"
            onClick={() => navigate('/workout-start')}
          >
            <div className="text-center">
              <Activity className="w-6 h-6 mx-auto mb-1" />
              <p className="font-semibold">Start Workout</p>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-16"
            onClick={() => navigate('/workouts')}
          >
            <div className="text-center">
              <Calendar className="w-6 h-6 mx-auto mb-1" />
              <p className="font-semibold">View History</p>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-16"
            onClick={() => navigate('/achievements')}
          >
            <div className="text-center">
              <Award className="w-6 h-6 mx-auto mb-1" />
              <p className="font-semibold">Achievements</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Progress;
