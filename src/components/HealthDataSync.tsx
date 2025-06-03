import React, { useState } from 'react';
import { HealthData } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface HealthDataSyncProps {
  onStepsUpdate: (steps: number) => void;
}

export const HealthDataSync: React.FC<HealthDataSyncProps> = ({ onStepsUpdate }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    lastSynced: new Date().toISOString(),
    dailyGoal: 10000,
  });

  const syncHealthData = async () => {
    setIsSyncing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random steps between 2000 and 8000
    const newSteps = Math.floor(Math.random() * 6000) + 2000;
    
    setHealthData(prev => ({
      ...prev,
      steps: newSteps,
      lastSynced: new Date().toISOString(),
    }));
    
    onStepsUpdate(newSteps);
    
    // Show different messages based on step count
    if (newSteps >= healthData.dailyGoal) {
      toast.success('Amazing! You\'ve reached your daily step goal! 🎉');
    } else if (newSteps >= healthData.dailyGoal * 0.7) {
      toast.success('Great progress! Keep going! 💪');
    } else {
      toast.info('Every step counts! Keep moving! 👣');
    }
    
    setIsSyncing(false);
  };

  const progress = (healthData.steps / healthData.dailyGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Daily Steps</span>
            <span className="text-sm text-muted-foreground">
              {healthData.steps.toLocaleString()} / {healthData.dailyGoal.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Last synced: {new Date(healthData.lastSynced).toLocaleTimeString()}
          </div>
          <Button
            onClick={syncHealthData}
            disabled={isSyncing}
            variant="outline"
          >
            {isSyncing ? 'Syncing...' : 'Sync Steps'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 