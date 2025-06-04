export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type FitnessGoal = 'get_active' | 'lose_weight' | 'build_strength' | 'maintain_fitness';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  csvUserId: string;
  age: number;
  gender: Gender;
  fitnessLevel: FitnessLevel;
  fitnessGoal: FitnessGoal;
  limitations: string[];
  createdAt: string;
  updatedAt: string;
  weekly_activity?: {
    total_steps: number;
    exercise_sessions: number;
    calories_burned: number;
  };
  health_metrics?: {
    resting_heart_rate: number;
  };
}

// ADD: New interface that matches the actual API response
export interface APIUserProfile {
  user_id: string;
  age: number;
  gender: string;
  fitness_level: string;
  weekly_activity: {
    total_steps: number;
    exercise_sessions: number;
    calories_burned: number;
    active_minutes: number;
  };
  health_metrics: {
    resting_heart_rate: number;
    max_heart_rate: number;
    sleep_hours: number;
    stress_level: number;
  };
  goals: {
    weekly_step_goal: number;
    weekly_workout_goal: number;
    target_weight: number;
  };
}

// UPDATE: Fix UserProfileResponse to handle both error and success cases
export interface UserProfileResponse {
  error?: string;
  data?: UserProfile;
  // ADD: For direct API responses (when no error)
  user_id?: string;
  age?: number;
  gender?: string;
  fitness_level?: string;
  weekly_activity?: {
    total_steps: number;
    exercise_sessions: number;
    calories_burned: number;
    active_minutes: number;
  };
  health_metrics?: {
    resting_heart_rate: number;
    max_heart_rate: number;
    sleep_hours: number;
    stress_level: number;
  };
  goals?: {
    weekly_step_goal: number;
    weekly_workout_goal: number;
    target_weight: number;
  };
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