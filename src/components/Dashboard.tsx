import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutPlan } from '../types/fitness';
import { ProfileForm } from './ProfileForm';
import { WorkoutPlanDisplay } from './WorkoutPlanDisplay';
import { HealthDataSync } from './HealthDataSync';
import { generateWorkoutPlan } from '../utils/workoutGenerator';
import { toast } from 'sonner';
import BonusScore from './BonusScore';

export const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setShowProfileForm(false);
    }
  }, []);

  // Save profile to localStorage when updated
  useEffect(() => {
    if (profile) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }, [profile]);

  const handleProfileSubmit = (data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfile: UserProfile = {
      ...data,
      id: 'user-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    setShowProfileForm(false);
    
    // Generate initial workout plan
    const plan = generateWorkoutPlan(newProfile);
    setWorkoutPlan(plan);
    toast.success('Profile saved! Your personalized workout plan is ready.');
  };

  const handleActivityComplete = (activityId: string) => {
    if (!workoutPlan) return;

    setWorkoutPlan(prev => {
      if (!prev) return null;

      const updatedActivities = prev.activities.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: true, completedAt: new Date().toISOString() }
          : activity
      );

      const completedCount = updatedActivities.filter(a => a.completed).length;
      const streak = completedCount > prev.progress.streak ? completedCount : prev.progress.streak;

      return {
        ...prev,
        activities: updatedActivities,
        progress: {
          ...prev.progress,
          completed: completedCount,
          streak,
        },
      };
    });

    toast.success('Great job! Keep up the good work! 💪');
  };

  const handleGenerateNewPlan = () => {
    if (!profile) return;

    const newPlan = generateWorkoutPlan(profile, workoutPlan);
    setWorkoutPlan(newPlan);
    toast.success('New workout plan generated! Ready to crush your goals? 🎯');
  };

  const handleStepsUpdate = (steps: number) => {
    // You could use this to adjust the workout plan based on activity level
    if (steps > 5000 && workoutPlan) {
      toast.info('You\'re very active today! Consider adding some extra exercises to your plan.');
    }
  };

  if (showProfileForm) {
    return <ProfileForm onSubmit={handleProfileSubmit} initialData={profile || undefined} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <HealthDataSync onStepsUpdate={handleStepsUpdate} />
        </div>
        <div>
          <button
            onClick={() => setShowProfileForm(true)}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <BonusScore />

      {workoutPlan && (
        <WorkoutPlanDisplay
          plan={workoutPlan}
          onActivityComplete={handleActivityComplete}
          onGenerateNewPlan={handleGenerateNewPlan}
        />
      )}
    </div>
  );
}; 