import { UserProfile, WorkoutActivity, WorkoutPlan } from '../types/fitness';

type Intensity = 'low' | 'medium' | 'high';

interface ActivityTemplate {
  title: string;
  description: string;
  duration: number;
  intensity: Intensity;
}

// Activity templates based on fitness level and goals
const activityTemplates: Record<string, Record<string, ActivityTemplate[]>> = {
  beginner: {
    get_active: [
      { title: 'Morning Stretch', description: '10-minute gentle stretching routine', duration: 10, intensity: 'low' },
      { title: 'Brisk Walk', description: '20-minute walk at a comfortable pace', duration: 20, intensity: 'low' },
      { title: 'Chair Exercises', description: '15-minute seated workout', duration: 15, intensity: 'low' },
    ],
    lose_weight: [
      { title: 'Power Walk', description: '25-minute walk with intervals', duration: 25, intensity: 'low' },
      { title: 'Bodyweight Basics', description: '20-minute basic exercises', duration: 20, intensity: 'low' },
      { title: 'Active Recovery', description: '15-minute light movement', duration: 15, intensity: 'low' },
    ],
    build_strength: [
      { title: 'Basic Strength', description: '20-minute bodyweight exercises', duration: 20, intensity: 'low' },
      { title: 'Core Basics', description: '15-minute core workout', duration: 15, intensity: 'low' },
      { title: 'Rest Day', description: 'Light stretching and mobility', duration: 10, intensity: 'low' },
    ],
    maintain_fitness: [
      { title: 'Mixed Cardio', description: '20-minute varied cardio', duration: 20, intensity: 'low' },
      { title: 'Full Body Light', description: '25-minute full body workout', duration: 25, intensity: 'low' },
      { title: 'Active Rest', description: '15-minute light activity', duration: 15, intensity: 'low' },
    ],
  },
  intermediate: {
    get_active: [
      { title: 'HIIT Cardio', description: '30-minute high-intensity intervals', duration: 30, intensity: 'medium' },
      { title: 'Strength Circuit', description: '25-minute strength training', duration: 25, intensity: 'medium' },
      { title: 'Active Recovery', description: '20-minute mobility work', duration: 20, intensity: 'low' },
    ],
    lose_weight: [
      { title: 'Fat Burn', description: '35-minute cardio workout', duration: 35, intensity: 'medium' },
      { title: 'Strength & Cardio', description: '30-minute mixed workout', duration: 30, intensity: 'medium' },
      { title: 'Active Recovery', description: '20-minute light cardio', duration: 20, intensity: 'low' },
    ],
    build_strength: [
      { title: 'Upper Body', description: '35-minute strength training', duration: 35, intensity: 'medium' },
      { title: 'Lower Body', description: '35-minute leg workout', duration: 35, intensity: 'medium' },
      { title: 'Core Power', description: '25-minute core workout', duration: 25, intensity: 'medium' },
    ],
    maintain_fitness: [
      { title: 'Mixed Training', description: '30-minute varied workout', duration: 30, intensity: 'medium' },
      { title: 'Strength Focus', description: '35-minute strength training', duration: 35, intensity: 'medium' },
      { title: 'Cardio Mix', description: '30-minute cardio workout', duration: 30, intensity: 'medium' },
    ],
  },
  advanced: {
    get_active: [
      { title: 'Power HIIT', description: '45-minute high-intensity workout', duration: 45, intensity: 'high' },
      { title: 'Strength Complex', description: '40-minute complex training', duration: 40, intensity: 'high' },
      { title: 'Active Recovery', description: '25-minute mobility work', duration: 25, intensity: 'medium' },
    ],
    lose_weight: [
      { title: 'Metabolic Conditioning', description: '45-minute intense cardio', duration: 45, intensity: 'high' },
      { title: 'Strength & Cardio', description: '40-minute mixed workout', duration: 40, intensity: 'high' },
      { title: 'Active Recovery', description: '25-minute light cardio', duration: 25, intensity: 'medium' },
    ],
    build_strength: [
      { title: 'Power Training', description: '45-minute strength workout', duration: 45, intensity: 'high' },
      { title: 'Hypertrophy', description: '40-minute muscle building', duration: 40, intensity: 'high' },
      { title: 'Strength Endurance', description: '35-minute endurance work', duration: 35, intensity: 'high' },
    ],
    maintain_fitness: [
      { title: 'Performance Training', description: '45-minute varied workout', duration: 45, intensity: 'high' },
      { title: 'Strength & Power', description: '40-minute strength training', duration: 40, intensity: 'high' },
      { title: 'Cardio Power', description: '35-minute intense cardio', duration: 35, intensity: 'high' },
    ],
  },
};

// Adaptive modifications based on limitations
const getAdaptiveModifications = (limitations: string[]): string[] => {
  const modifications: string[] = [];
  
  if (limitations.some(l => l.toLowerCase().includes('knee'))) {
    modifications.push('Low-impact alternatives for knee exercises');
  }
  if (limitations.some(l => l.toLowerCase().includes('back'))) {
    modifications.push('Core-focused, back-friendly movements');
  }
  if (limitations.some(l => l.toLowerCase().includes('shoulder'))) {
    modifications.push('Shoulder-friendly exercise modifications');
  }
  
  return modifications;
};

export const generateWorkoutPlan = (
  profile: UserProfile,
  previousPlan?: WorkoutPlan
): WorkoutPlan => {
  const templates = activityTemplates[profile.fitnessLevel][profile.fitnessGoal];
  const modifications = getAdaptiveModifications(profile.limitations);
  
  // If there's a previous plan, check for missed days
  const missedDays = previousPlan
    ? previousPlan.activities.filter(a => !a.completed).length
    : 0;

  // Adjust intensity based on missed days
  const intensityMultiplier = missedDays >= 2 ? 0.8 : 1;

  const activities: WorkoutActivity[] = Array.from({ length: 7 }, (_, i) => {
    const template = templates[i % templates.length];
    const duration = Math.round(template.duration * intensityMultiplier);
    
    return {
      id: `activity-${Date.now()}-${i}`,
      day: i + 1,
      title: template.title,
      description: `${template.description}${modifications.length ? ` (${modifications.join(', ')})` : ''}`,
      duration,
      intensity: template.intensity,
      completed: false,
    };
  });

  return {
    id: `plan-${Date.now()}`,
    userId: profile.id,
    weekStartDate: new Date().toISOString(),
    activities,
    progress: {
      completed: 0,
      total: activities.length,
      streak: previousPlan?.progress.streak || 0,
    },
  };
}; 