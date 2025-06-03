import React from 'react';
import { toast } from 'sonner';
import { Reward } from '../types/gamification';

export const showRewardNotification = ({ message, type, xp }: Reward) => {
  const icons = {
    workout: '💪',
    streak: '🔥',
    bonus: '🎉',
    badge: '🏆'
  };

  toast.success(
    <div className="flex items-center space-x-2">
      <span className="text-xl">{icons[type]}</span>
      <div>
        <p className="font-medium">{message}</p>
        <p className="text-sm text-muted-foreground">+{xp} XP</p>
      </div>
    </div>,
    {
      duration: 3000,
      position: 'top-right',
    }
  );
}; 