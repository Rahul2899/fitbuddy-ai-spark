// BonusScore.tsx
// This component tracks health insurance bonus progress based on daily steps.
// Replace the mock data generation with real step data integration as needed.

import React, { useMemo } from "react";
import { Button } from "./ui/button"; // Adjust import if needed
import { Progress } from "./ui/progress"; // Adjust import if needed

// Configurable bonus rule (easily adjust for other insurers)
const BONUS_STEP_GOAL = 8000;
const BONUS_DAYS_REQUIRED = 20;
const DAYS_TRACKED = 30;

const generateMockSteps = () =>
  Array.from({ length: DAYS_TRACKED }, () =>
    Math.floor(Math.random() * 6000) + 6000 // 6000–12000 steps
  );

const BonusScore: React.FC = () => {
  // Replace this with real step data from health API/device
  const stepData = useMemo(() => generateMockSteps(), []);

  // Calculate days with steps >= goal
  const daysWithBonus = stepData.filter((steps) => steps >= BONUS_STEP_GOAL).length;

  // Calculate current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = stepData.length - 1; i >= 0; i--) {
      if (stepData[i] >= BONUS_STEP_GOAL) streak++;
      else break;
    }
    return streak;
  }, [stepData]);

  const percent = Math.min((daysWithBonus / BONUS_DAYS_REQUIRED) * 100, 100);

  const handleSimulateClaim = () => {
    alert("Bonus ready to claim!");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Bonus Score</h2>
      <p className="text-gray-700">
        Days with {BONUS_STEP_GOAL.toLocaleString()}+ steps: {" "}
        <span className="font-semibold text-blue-600">{daysWithBonus}</span> out of {" "}
        <span className="font-semibold">{BONUS_DAYS_REQUIRED}</span> needed for bonus
      </p>
      <Progress value={percent} className="h-3 rounded bg-gray-200" />
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>0</span>
        <span>{BONUS_DAYS_REQUIRED}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-600 font-semibold">Current Streak:</span>
        <span className="text-lg font-bold">{currentStreak} day{currentStreak !== 1 ? "s" : ""}</span>
      </div>
      {daysWithBonus >= BONUS_DAYS_REQUIRED ? (
        <div className="bg-green-100 text-green-800 rounded p-3 text-center font-semibold">
          🎉 Congratulations! You've reached your bonus goal.
        </div>
      ) : null}
      <Button
        className="w-full mt-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold"
        onClick={handleSimulateClaim}
      >
        Simulate Claim
      </Button>
    </div>
  );
};

export default BonusScore; 