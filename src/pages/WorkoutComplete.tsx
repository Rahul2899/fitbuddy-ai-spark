
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Clock, Target, Share2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkoutSummary {
  name: string;
  duration: number;
  calories: number;
  exercises: number;
  completedAt: Date;
}

const WorkoutComplete = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummary>({
    name: "HIIT Cardio Blast",
    duration: 20,
    calories: 280,
    exercises: 6,
    completedAt: new Date()
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    saveWorkout();
  }, []);

  const saveWorkout = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Save workout to database
      const { error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: workoutSummary.name,
          type: 'HIIT',
          duration_minutes: workoutSummary.duration,
          calories_burned: workoutSummary.calories,
          exercises: {
            completed: workoutSummary.exercises,
            total: workoutSummary.exercises
          }
        });

      if (workoutError) throw workoutError;

      // Check for new achievements
      await checkAchievements(user.id);

      setSaved(true);
      toast({
        title: "Workout Saved!",
        description: "Great job completing your workout!",
      });
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const checkAchievements = async (userId: string) => {
    try {
      // Check for first workout achievement
      const { data: workouts } = await supabase
        .from('workouts')
        .select('id')
        .eq('user_id', userId);

      if (workouts?.length === 1) {
        // First workout achievement
        await supabase.from('achievements').insert({
          user_id: userId,
          name: 'First Steps',
          description: 'Complete your first workout',
          category: 'beginner'
        });
      }

      // Check for calorie crusher achievement
      if (workoutSummary.calories >= 300) {
        const { data: existing } = await supabase
          .from('achievements')
          .select('id')
          .eq('user_id', userId)
          .eq('name', 'Calorie Crusher')
          .single();

        if (!existing) {
          await supabase.from('achievements').insert({
            user_id: userId,
            name: 'Calorie Crusher',
            description: 'Burn 300+ calories in one session',
            category: 'performance'
          });
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const shareWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create social post
      const { error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          content: `Just completed ${workoutSummary.name}! 💪 Burned ${workoutSummary.calories} calories in ${workoutSummary.duration} minutes. #FitnessJourney #WorkoutComplete`,
        });

      if (error) throw error;

      toast({
        title: "Shared!",
        description: "Your workout has been shared with the community",
      });

      navigate('/social');
    } catch (error) {
      console.error('Error sharing workout:', error);
      toast({
        title: "Error",
        description: "Failed to share workout",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Workout Complete!</h1>
          <p className="text-xl text-gray-600">Amazing job crushing your fitness goals! 🎉</p>
        </div>

        {/* Workout Summary */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{workoutSummary.name}</CardTitle>
            <CardDescription>
              Completed on {workoutSummary.completedAt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{workoutSummary.duration}</p>
                <p className="text-sm text-gray-600">Minutes</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold text-orange-600">{workoutSummary.calories}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{workoutSummary.exercises}</p>
                <p className="text-sm text-gray-600">Exercises</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Notification */}
        <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Achievement Unlocked!</h3>
                <p className="text-sm text-gray-600">Check your achievements page to see your progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={shareWorkout}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Achievement
            </Button>
            
            <Button 
              onClick={() => navigate('/progress')}
              variant="outline"
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              View Progress
            </Button>
          </div>

          <Button 
            onClick={() => navigate('/workout-start')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            size="lg"
          >
            Start Another Workout
          </Button>

          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Saving Status */}
        {saving && (
          <div className="text-center mt-6">
            <Badge variant="outline">Saving workout...</Badge>
          </div>
        )}
        
        {saved && (
          <div className="text-center mt-6">
            <Badge className="bg-green-600">Workout saved successfully!</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutComplete;
