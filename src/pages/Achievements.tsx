
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Flame, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  earned_at: string | null;
}

const Achievements = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Default achievements
  const defaultAchievements = [
    {
      id: 'first-workout',
      name: 'First Steps',
      description: 'Complete your first workout',
      category: 'beginner',
      earned_at: null
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Complete 5 workouts in a week',
      category: 'consistency',
      earned_at: null
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Maintain a 7-day workout streak',
      category: 'consistency',
      earned_at: null
    },
    {
      id: 'calorie-crusher',
      name: 'Calorie Crusher',
      description: 'Burn 300+ calories in one session',
      category: 'performance',
      earned_at: null
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Connect with 5 workout buddies',
      category: 'social',
      earned_at: null
    },
    {
      id: 'form-perfectionist',
      name: 'Form Perfectionist',
      description: 'Achieve 95+ form score in workout checker',
      category: 'technique',
      earned_at: null
    }
  ];

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Merge default achievements with earned ones
      const earnedAchievements = data || [];
      const mergedAchievements = defaultAchievements.map(defaultAch => {
        const earned = earnedAchievements.find(e => e.name === defaultAch.name);
        return {
          ...defaultAch,
          earned_at: earned?.earned_at || null
        };
      });

      setAchievements(mergedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements",
        variant: "destructive"
      });
      // Set default achievements if error
      setAchievements(defaultAchievements);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beginner': return <Star className="w-5 h-5" />;
      case 'consistency': return <Calendar className="w-5 h-5" />;
      case 'performance': return <Flame className="w-5 h-5" />;
      case 'social': return <Users className="w-5 h-5" />;
      case 'technique': return <Target className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner': return 'from-green-500 to-green-600';
      case 'consistency': return 'from-blue-500 to-blue-600';
      case 'performance': return 'from-orange-500 to-orange-600';
      case 'social': return 'from-purple-500 to-purple-600';
      case 'technique': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const earnedCount = achievements.filter(a => a.earned_at).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
            <p className="text-gray-600 mt-2">
              Your fitness milestones • {earnedCount} of {totalCount} unlocked
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Achievement Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{earnedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`transition-all duration-300 ${
                achievement.earned_at 
                  ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' 
                  : 'opacity-70 hover:opacity-90'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCategoryColor(achievement.category)} flex items-center justify-center text-white`}>
                      {getCategoryIcon(achievement.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={achievement.earned_at ? "default" : "secondary"}
                    className={achievement.earned_at ? "bg-yellow-500" : ""}
                  >
                    {achievement.earned_at ? "Earned" : "Locked"}
                  </Badge>
                </div>
              </CardHeader>
              {achievement.earned_at && (
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold mb-2">Keep Going!</h3>
              <p className="text-gray-600 mb-6">
                Complete more workouts to unlock new achievements and track your progress.
              </p>
              <Button 
                onClick={() => navigate('/workout-start')}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                Start Workout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
