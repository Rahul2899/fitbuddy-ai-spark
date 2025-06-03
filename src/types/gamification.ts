export interface User {
  id: string;
  name: string;
  xp: number;
  streak: number;
  lastActivityDate: string | null;
  badges: Badge[];
  level: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  xp: number;
  streak: number;
}

export type RewardType = 'workout' | 'streak' | 'bonus' | 'badge';

export interface Reward {
  type: RewardType;
  message: string;
  xp: number;
  badgeId?: string;
} 