import React from 'react';
import { WorkoutPlan, WorkoutActivity } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan;
  onActivityComplete: (activityId: string) => void;
  onGenerateNewPlan: () => void;
}

export const WorkoutPlanDisplay: React.FC<WorkoutPlanDisplayProps> = ({
  plan,
  onActivityComplete,
  onGenerateNewPlan,
}) => {
  const progress = (plan.progress.completed / plan.progress.total) * 100;
  const weekStart = new Date(plan.weekStartDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Weekly Progress</CardTitle>
            <Button onClick={onGenerateNewPlan} variant="outline">
              Generate New Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">
                {plan.progress.completed} / {plan.progress.total} Activities
              </span>
              <span className="text-sm text-muted-foreground">
                {plan.progress.streak} Day Streak
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground">
            Week of {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Activities Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Workout Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {plan.activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onComplete={() => onActivityComplete(activity.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

interface ActivityCardProps {
  activity: WorkoutActivity;
  onComplete: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onComplete }) => {
  const intensityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        activity.completed ? 'bg-muted/50' : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={activity.completed}
              onCheckedChange={onComplete}
              disabled={activity.completed}
            />
            <h3 className="font-medium">{activity.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{activity.description}</p>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{activity.duration} min</Badge>
            <Badge
              className={intensityColors[activity.intensity]}
              variant="secondary"
            >
              {activity.intensity} intensity
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}; 