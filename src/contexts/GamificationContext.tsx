import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Badge, Reward, RewardType, LeaderboardEntry } from '../types/gamification';

// Mock data for initial state
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  xp: 0,
  streak: 0,
  lastActivityDate: null,
  badges: [
    {
      id: 'five_workouts',
      name: '5 Workouts',
      description: 'Complete 5 workouts',
      icon: '💪',
      unlocked: false,
    },
    {
      id: 'seven_day_streak',
      name: '7-Day Streak',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: false,
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete a workout before 8am',
      icon: '🌅',
      unlocked: false,
    },
  ],
  level: 1,
};

interface GamificationContextType {
  user: User;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  getLevel: () => number;
  getLeaderboard: () => Promise<LeaderboardEntry[]>;
  checkEarlyBird: () => boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : mockUser;
  });

  // Save user data to storage
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(user));
  }, [user]);

  const addXP = (amount: number) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + amount,
      level: Math.floor((prev.xp + amount) / 100) + 1,
    }));
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    setUser(prev => {
      if (!prev.lastActivityDate) {
        return { ...prev, streak: 1, lastActivityDate: today };
      }

      const lastDate = new Date(prev.lastActivityDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = prev.streak;
      if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        newStreak = prev.streak + 1;
      } else if (lastDate.toISOString().split('T')[0] !== today) {
        newStreak = 1;
      }

      return { ...prev, streak: newStreak, lastActivityDate: today };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setUser(prev => ({
      ...prev,
      badges: prev.badges.map(badge =>
        badge.id === badgeId
          ? { ...badge, unlocked: true, unlockedAt: new Date().toISOString() }
          : badge
      ),
    }));
  };

  const getLevel = () => {
    return Math.floor(user.xp / 100) + 1;
  };

  const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    // Mock leaderboard data
    return [
      { userId: '1', name: 'John Doe', xp: user.xp, streak: user.streak },
      { userId: '2', name: 'Jane Smith', xp: 850, streak: 3 },
      { userId: '3', name: 'Mike Johnson', xp: 720, streak: 5 },
      // Add more mock entries as needed
    ].sort((a, b) => b.xp - a.xp);
  };

  const checkEarlyBird = () => {
    const now = new Date();
    return now.getHours() < 8;
  };

  return (
    <GamificationContext.Provider
      value={{
        user,
        addXP,
        updateStreak,
        unlockBadge,
        getLevel,
        getLeaderboard,
        checkEarlyBird,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}; 