export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type FitnessGoal = 'get_active' | 'lose_weight' | 'build_strength' | 'maintain_fitness';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  age: number;
  gender: Gender;
  fitnessLevel: FitnessLevel;
  fitnessGoal: FitnessGoal;
  limitations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutActivity {
  id: string;
  day: number; // 1-7 for days of the week
  title: string;
  description: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  activities: WorkoutActivity[];
  progress: {
    completed: number;
    total: number;
    streak: number;
  };
}

export interface HealthData {
  steps: number;
  lastSynced: string;
  dailyGoal: number;
}

export interface AdaptiveTip {
  type: 'motivation' | 'warning' | 'achievement';
  message: string;
  condition: (plan: WorkoutPlan) => boolean;
} 