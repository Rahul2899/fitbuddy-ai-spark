import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export const GamificationDisplay: React.FC = () => {
  const { user, getLevel } = useGamification();
  const currentLevel = getLevel();
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = ((user.xp % 100) / 100) * 100;

  return (
    <div className="space-y-4 p-4">
      {/* Level and XP Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Level {currentLevel}</span>
              <span className="text-sm text-muted-foreground">
                {user.xp} / {xpForNextLevel} XP
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          {/* Streak */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-sm font-medium">{user.streak} Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Card */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-2 gap-4">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border ${
                    badge.unlocked
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted/50 border-muted'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Leaderboard Card */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {[1, 2, 3].map((position) => (
                <div
                  key={position}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">#{position}</span>
                    <span>User {position}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {position * 100} XP
                    </span>
                    <Badge variant="secondary">{position * 2} 🔥</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}; 