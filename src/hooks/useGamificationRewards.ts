import { useGamification } from '../contexts/GamificationContext';
import { Reward } from '../types/gamification';

export const useGamificationRewards = () => {
  const { addXP, updateStreak, unlockBadge, user, checkEarlyBird } = useGamification();

  const rewardWorkout = (): Reward => {
    // Add XP for completing a workout
    addXP(25);
    
    // Update streak
    updateStreak();

    // Check for badge unlocks
    if (!user.badges.find(b => b.id === 'five_workouts')?.unlocked) {
      unlockBadge('five_workouts');
    }

    if (user.streak >= 7 && !user.badges.find(b => b.id === 'seven_day_streak')?.unlocked) {
      unlockBadge('seven_day_streak');
    }

    if (checkEarlyBird() && !user.badges.find(b => b.id === 'early_bird')?.unlocked) {
      unlockBadge('early_bird');
    }

    // Random bonus XP (10% chance)
    if (Math.random() < 0.1) {
      const bonusXP = Math.floor(Math.random() * 10) + 5; // 5-15 bonus XP
      addXP(bonusXP);
      return {
        type: 'bonus',
        message: `🎉 Bonus XP! +${bonusXP} XP`,
        xp: bonusXP
      };
    }

    return {
      type: 'workout',
      message: 'Workout completed! +25 XP',
      xp: 25
    };
  };

  const rewardStreak = (): Reward => {
    // Bonus XP for maintaining streak
    const streakBonus = Math.min(user.streak * 5, 50); // Max 50 XP bonus
    addXP(streakBonus);
    return {
      type: 'streak',
      message: `🔥 Streak Bonus! +${streakBonus} XP`,
      xp: streakBonus
    };
  };

  return {
    rewardWorkout,
    rewardStreak
  };
}; 