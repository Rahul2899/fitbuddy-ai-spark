
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Timer, Flame, Target, User, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkoutStart = () => {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<string>('hiit');
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [totalTime, setTotalTime] = useState(0);

  const workoutTypes = [
    {
      id: 'hiit',
      name: 'HIIT Blast',
      duration: 20,
      calories: 300,
      exercises: 8,
      difficulty: 'High',
      description: 'High-intensity interval training for maximum calorie burn',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'strength',
      name: 'Strength Builder',
      duration: 30,
      calories: 250,
      exercises: 6,
      difficulty: 'Medium',
      description: 'Build muscle and increase strength with targeted exercises',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'cardio',
      name: 'Cardio Core',
      duration: 25,
      calories: 350,
      exercises: 10,
      difficulty: 'Medium',
      description: 'Improve cardiovascular health and core strength',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      id: 'yoga',
      name: 'Flexibility Flow',
      duration: 40,
      calories: 150,
      exercises: 12,
      difficulty: 'Low',
      description: 'Enhance flexibility and mindfulness with yoga poses',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const exercises = [
    { name: 'Jumping Jacks', duration: 30, rest: 10 },
    { name: 'Push-ups', duration: 30, rest: 10 },
    { name: 'Mountain Climbers', duration: 30, rest: 10 },
    { name: 'Burpees', duration: 30, rest: 10 },
    { name: 'High Knees', duration: 30, rest: 10 },
    { name: 'Plank', duration: 30, rest: 10 },
    { name: 'Squats', duration: 30, rest: 10 },
    { name: 'Lunges', duration: 30, rest: 0 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
        setTotalTime(time => time + 1);
      }, 1000);
    } else if (timeRemaining === 0 && currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setTimeRemaining(exercises[currentExercise + 1]?.duration || 30);
    } else if (timeRemaining === 0 && currentExercise === exercises.length - 1) {
      navigate('/workout-complete');
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentExercise, navigate]);

  const selectedWorkoutData = workoutTypes.find(w => w.id === selectedWorkout);
  const progress = ((currentExercise + (1 - timeRemaining / 30)) / exercises.length) * 100;

  const startWorkout = () => {
    setIsActive(true);
    setTimeRemaining(exercises[0].duration);
  };

  const pauseWorkout = () => setIsActive(!isActive);

  const skipExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setTimeRemaining(exercises[currentExercise + 1]?.duration || 30);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isActive || currentExercise > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedWorkoutData?.name}</h1>
            <Progress value={progress} className="w-full max-w-md mx-auto mb-4" />
            <p className="text-gray-600">Exercise {currentExercise + 1} of {exercises.length}</p>
          </div>

          {/* Main Workout Display */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-emerald-200/50">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Badge className="mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-lg px-4 py-2">
                  {exercises[currentExercise]?.name}
                </Badge>
              </div>

              <div className="mb-8">
                <div className="text-8xl font-bold text-gray-900 mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-gray-600">Time Remaining</p>
              </div>

              {/* Exercise Demo Area */}
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                <p className="text-gray-700">Follow the form shown above</p>
                <Button 
                  variant="outline" 
                  className="mt-2 border-emerald-200 hover:bg-emerald-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Enable Form Check
                </Button>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={pauseWorkout}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                >
                  {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={skipExercise}
                  size="lg"
                  variant="outline"
                  className="border-emerald-200 hover:bg-emerald-50"
                >
                  <SkipForward className="w-6 h-6" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Workout Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200/50">
              <CardContent className="p-4 text-center">
                <Timer className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                <div className="text-lg font-bold">{formatTime(totalTime)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200/50">
              <CardContent className="p-4 text-center">
                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-lg font-bold">{Math.floor(totalTime * 8)}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200/50">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
                <div className="text-lg font-bold">{currentExercise}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Workout</h1>
            <p className="text-gray-600 mt-2">Select a workout that matches your goals and fitness level</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="border-emerald-200 hover:bg-emerald-50"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Workout Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {workoutTypes.map((workout) => (
            <Card 
              key={workout.id}
              className={`cursor-pointer transition-all duration-300 border-2 ${
                selectedWorkout === workout.id 
                  ? 'border-emerald-500 ring-2 ring-emerald-500 ring-opacity-50' 
                  : 'border-emerald-200/50 hover:border-emerald-300'
              } bg-white/80 backdrop-blur-sm`}
              onClick={() => setSelectedWorkout(workout.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{workout.name}</CardTitle>
                    <CardDescription className="mt-2">{workout.description}</CardDescription>
                  </div>
                  <Badge 
                    className={`bg-gradient-to-r ${workout.color} text-white`}
                  >
                    {workout.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{workout.duration}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{workout.calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{workout.exercises}</div>
                    <div className="text-sm text-gray-600">Exercises</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Workout Details */}
        {selectedWorkoutData && (
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200/50 mb-8">
            <CardHeader>
              <CardTitle>Workout Preview: {selectedWorkoutData.name}</CardTitle>
              <CardDescription>Here's what you'll be doing today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {exercises.slice(0, 8).map((exercise, index) => (
                  <div key={index} className="text-center p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg">
                    <div className="font-medium text-gray-900">{exercise.name}</div>
                    <div className="text-sm text-gray-600">{exercise.duration}s</div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={startWorkout}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-lg px-8 py-6"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutStart;
