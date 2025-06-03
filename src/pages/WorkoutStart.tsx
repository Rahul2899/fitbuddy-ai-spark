
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, SkipForward, Timer, Flame, Target, Camera, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkoutFormChecker from '@/components/WorkoutFormChecker';

const WorkoutStart = () => {
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('workout');

  const workout = {
    name: "HIIT Cardio Blast",
    duration: "20 minutes",
    exercises: [
      { name: "Jumping Jacks", duration: 45, rest: 15, reps: null },
      { name: "Push-ups", duration: 45, rest: 15, reps: "10-15" },
      { name: "Mountain Climbers", duration: 45, rest: 15, reps: null },
      { name: "Squats", duration: 45, rest: 15, reps: "15-20" },
      { name: "Plank", duration: 45, rest: 15, reps: null },
      { name: "Burpees", duration: 45, rest: 15, reps: "5-10" }
    ],
    estimatedCalories: 280
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextExercise();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startWorkout = () => {
    setWorkoutStarted(true);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleNextExercise = () => {
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setTimeLeft(45);
    } else {
      setIsActive(false);
      // Navigate to workout complete page
      navigate('/workout-complete');
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const progress = ((currentExercise + 1) / workout.exercises.length) * 100;

  if (!workoutStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workout">Workout Plan</TabsTrigger>
              <TabsTrigger value="form-check">Form Checker</TabsTrigger>
              <TabsTrigger value="buddy-finder">Find Buddy</TabsTrigger>
            </TabsList>

            <TabsContent value="workout">
              <Card className="mb-6">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{workout.name}</CardTitle>
                  <CardDescription>Get ready to sweat!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Timer className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{workout.duration}</p>
                    </div>
                    <div className="text-center">
                      <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-gray-600">Exercises</p>
                      <p className="font-semibold">{workout.exercises.length}</p>
                    </div>
                    <div className="text-center">
                      <Flame className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                      <p className="text-sm text-gray-600">Est. Calories</p>
                      <p className="font-semibold">{workout.estimatedCalories}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h3 className="font-semibold mb-3">Workout Preview:</h3>
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{exercise.name}</span>
                        <Badge variant="outline">{exercise.duration}s</Badge>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={startWorkout}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="form-check">
              <WorkoutFormChecker />
            </TabsContent>

            <TabsContent value="buddy-finder">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Workout Buddy Finder
                  </CardTitle>
                  <CardDescription>
                    Find someone to workout with for extra motivation!
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Find Your Workout Partner</h3>
                  <p className="text-gray-600 mb-6">
                    Connect with fitness enthusiasts in your area and make working out more fun!
                  </p>
                  <Button 
                    onClick={() => navigate('/buddy-finder')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Find Workout Buddies
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{workout.name}</h1>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            Exercise {currentExercise + 1} of {workout.exercises.length}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{workout.exercises[currentExercise].name}</h2>
            
            <div className="text-8xl font-bold text-green-600 mb-6">
              {formatTime(timeLeft)}
            </div>

            {workout.exercises[currentExercise].reps && (
              <Badge className="mb-4 text-lg py-2 px-4">
                Target: {workout.exercises[currentExercise].reps} reps
              </Badge>
            )}

            <div className="flex justify-center gap-4">
              <Button
                onClick={toggleTimer}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button
                onClick={handleNextExercise}
                size="lg"
                variant="outline"
              >
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Up</CardTitle>
          </CardHeader>
          <CardContent>
            {currentExercise < workout.exercises.length - 1 ? (
              <div className="flex justify-between items-center">
                <span className="font-medium">{workout.exercises[currentExercise + 1].name}</span>
                <Badge variant="outline">{workout.exercises[currentExercise + 1].duration}s</Badge>
              </div>
            ) : (
              <p className="text-center text-green-600 font-semibold">Last exercise! You're almost done! 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutStart;
