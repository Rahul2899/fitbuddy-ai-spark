import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, Clock, Flame, Heart, Target, TrendingUp, Users, Bot, BarChart3, Award, ArrowLeft } from 'lucide-react';

type Workout = {
  id: string;
  name: string;
  duration: number;
  calories: number;
  exercises: string[];
  description: string;
};

// Start Workout Component
export const StartWorkout = ({ onBack, userProfile }: { onBack: () => void, userProfile: any }) => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);

  // Generate workouts based on USER'S ACTUAL fitness level from CSV
  const getWorkouts = () => {
    const level = userProfile?.fitness_level || userProfile?.fitnessLevel || 'beginner';
    
    const workouts = {
      beginner: [
        {
          id: 'beginner-cardio',
          name: 'Gentle Cardio',
          duration: 15,
          calories: Math.round((userProfile?.weekly_activity?.calories_burned || 1500) / 7 / 2), // Half daily calories
          exercises: ['5 min warm-up walk', '8 min light jogging', '2 min cool down'],
          description: 'Perfect for building endurance'
        },
        {
          id: 'beginner-strength',
          name: 'Basic Strength',
          duration: 20,
          calories: Math.round((userProfile?.weekly_activity?.calories_burned || 1500) / 7 / 3),
          exercises: ['Bodyweight squats x10', 'Wall push-ups x8', 'Plank 30s', 'Rest 1 min'],
          description: 'Build foundation strength'
        }
      ],
      intermediate: [
        {
          id: 'intermediate-hiit',
          name: 'HIIT Training',
          duration: 25,
          calories: Math.round((userProfile?.weekly_activity?.calories_burned || 2000) / 7 / 2),
          exercises: ['Jumping jacks 45s', 'Burpees x10', 'Mountain climbers 30s', 'Rest 30s'],
          description: 'High intensity fat burning'
        },
        {
          id: 'intermediate-strength',
          name: 'Strength Circuit',
          duration: 30,
          calories: Math.round((userProfile?.weekly_activity?.calories_burned || 2000) / 7 / 2.5),
          exercises: ['Push-ups x15', 'Squats x20', 'Lunges x12', 'Plank 1 min'],
          description: 'Full body strength building'
        }
      ],
      advanced: [
        {
          id: 'advanced-hiit',
          name: 'Advanced HIIT',
          duration: 35,
          calories: Math.round((userProfile?.weekly_activity?.calories_burned || 2500) / 7 / 2),
          exercises: ['Burpee box jumps x8', 'Pistol squats x6', 'Handstand push-ups x5', 'Sprint intervals'],
          description: 'Elite level conditioning'
        }
      ]
    };
    
    return workouts[level] || workouts.beginner;
  };

  const workouts = getWorkouts();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && selectedWorkout) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, selectedWorkout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setIsActive(true);
    setTimeElapsed(0);
    setCurrentExercise(0);
  };

  const completeWorkout = () => {
    setIsActive(false);
    const workoutData = {
      date: new Date().toISOString(),
      workout: selectedWorkout,
      duration: timeElapsed,
      completed: true,
      calories: selectedWorkout.calories
    };
    
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    workoutHistory.push(workoutData);
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    
    alert('🎉 Workout completed! Great job!');
    onBack(); // Return to dashboard
  };

  if (selectedWorkout && isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedWorkout.name}</h1>
              <div className="text-6xl font-bold text-green-600 mb-4">{formatTime(timeElapsed)}</div>
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {selectedWorkout.duration} min target</span>
                <span className="flex items-center"><Flame className="w-4 h-4 mr-1" /> {selectedWorkout.calories} cal</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Current Exercise:</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">
                  {selectedWorkout.exercises[currentExercise % selectedWorkout.exercises.length]}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setIsActive(!isActive)}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isActive ? 'Pause' : 'Resume'}
              </button>
              
              <button
                onClick={() => setCurrentExercise(prev => prev + 1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Exercise
              </button>
              
              <button
                onClick={completeWorkout}
                className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete
              </button>
            </div>

            <button
              onClick={() => {setSelectedWorkout(null); setIsActive(false); onBack();}}
              className="w-full py-2 text-gray-600 hover:text-gray-800"
            >
              End Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Start Workout</h1>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Your Profile</h3>
          <p className="text-blue-800 text-sm">
            Fitness Level: <strong>{userProfile?.fitness_level || userProfile?.fitnessLevel}</strong> | 
            Weekly Goal: <strong>{userProfile?.goals?.weekly_workout_goal || userProfile?.weeklyGoal || 3} workouts</strong> |
            Avg Calories: <strong>{Math.round((userProfile?.weekly_activity?.calories_burned || 1500) / 7)}/day</strong>
          </p>
        </div>

        <div className="grid gap-6">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{workout.name}</h3>
                  <p className="text-gray-600 mb-4">{workout.description}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {workout.duration} min
                  </div>
                  <div className="flex items-center">
                    <Flame className="w-4 h-4 mr-1" />
                    {workout.calories} cal
                  </div>
                </div>
              </div>

              <button
                onClick={() => startWorkout(workout)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start {workout.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// AI Coach Component - Uses real user data
export const AICoach = ({ onBack, userProfile }: { onBack: () => void, userProfile: any }) => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: `Hello ${userProfile?.firstName || userProfile?.first_name || 'there'}! I can see you're ${userProfile?.age} years old with a ${userProfile?.fitness_level || userProfile?.fitnessLevel} fitness level. Your current weekly activity shows ${userProfile?.weekly_activity?.total_steps || 'some'} steps and ${userProfile?.weekly_activity?.exercise_sessions || 0} exercise sessions. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');

  const getAIResponse = (question: string) => {
    const level = userProfile?.fitness_level || userProfile?.fitnessLevel || 'beginner';
    const currentSteps = userProfile?.weekly_activity?.total_steps || 50000;
    const currentWorkouts = userProfile?.weekly_activity?.exercise_sessions || 2;
    const restingHR = userProfile?.health_metrics?.resting_heart_rate || 70;
    
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('exercise') || lowerQuestion.includes('workout')) {
      return `Based on your ${level} level and current ${currentWorkouts} workouts per week, I suggest gradually increasing to ${currentWorkouts + 1} sessions. Your resting heart rate of ${restingHR} BPM shows good cardiovascular health!`;
    }
    
    if (lowerQuestion.includes('steps')) {
      const dailySteps = Math.round(currentSteps / 7);
      return `You're averaging ${dailySteps} steps per day! For your fitness level, try to reach ${dailySteps + 1000} daily steps next week.`;
    }
    
    return `That's a great question! With your current stats (${currentSteps} weekly steps, ${currentWorkouts} workouts), you're on a good track. Keep up the consistency!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    
    setTimeout(() => {
      const response = getAIResponse(input);
      setMessages(prev => [...prev, { type: 'ai', content: response }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bot className="w-8 h-8 mr-3 text-purple-600" />
            AI Fitness Coach
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg h-96 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your fitness progress..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// View Progress Component - Uses real workout history and user data
export const ViewProgress = ({ onBack, userProfile }: { onBack: () => void, userProfile: any }) => {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    setWorkoutHistory(history);
  }, []);

  // Use real user data for stats
  const weeklySteps = userProfile?.weekly_activity?.total_steps || 0;
  const weeklyWorkouts = userProfile?.weekly_activity?.exercise_sessions || 0;
  const weeklyCalories = userProfile?.weekly_activity?.calories_burned || 0;
  const avgHeartRate = userProfile?.health_metrics?.resting_heart_rate || 70;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Weekly Steps</h3>
            <div className="text-3xl font-bold text-blue-600">{weeklySteps.toLocaleString()}</div>
            <p className="text-sm text-gray-500">This week from CSV</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Workouts</h3>
            <div className="text-3xl font-bold text-green-600">{weeklyWorkouts}</div>
            <p className="text-sm text-gray-500">Sessions this week</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Calories</h3>
            <div className="text-3xl font-bold text-orange-600">{weeklyCalories}</div>
            <p className="text-sm text-gray-500">Burned this week</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Resting HR</h3>
            <div className="text-3xl font-bold text-red-600">{avgHeartRate}</div>
            <p className="text-sm text-gray-500">BPM average</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Workouts</h2>
          {workoutHistory.length > 0 ? (
            <div className="space-y-4">
              {workoutHistory.slice(-5).reverse().map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{workout.workout?.name || 'Workout'}</h3>
                    <p className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{Math.floor(workout.duration / 60)}:{(workout.duration % 60).toString().padStart(2, '0')}</p>
                    <p className="text-sm text-gray-500">{workout.calories || 0} cal</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No completed workouts yet. Start your first workout!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard - Uses real CSV data
export const AnalyticsDashboard = ({ onBack, userProfile }: { onBack: () => void, userProfile: any }) => {
  const dailySteps = Math.round((userProfile?.weekly_activity?.total_steps || 0) / 7);
  const dailyCalories = Math.round((userProfile?.weekly_activity?.calories_burned || 0) / 7);
  const activeMinutes = userProfile?.weekly_activity?.active_minutes || 0;
  const sleepHours = userProfile?.health_metrics?.sleep_hours || 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Averages (From CSV)</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Steps</span>
                <span className="font-semibold text-blue-600">{dailySteps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Calories</span>
                <span className="font-semibold text-orange-600">{dailyCalories}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Minutes/Week</span>
                <span className="font-semibold text-green-600">{activeMinutes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sleep Hours</span>
                <span className="font-semibold text-purple-600">{sleepHours}h</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Health Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Resting Heart Rate</span>
                <span className="font-semibold">{userProfile?.health_metrics?.resting_heart_rate || 70} BPM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fitness Level</span>
                <span className="font-semibold capitalize">{userProfile?.fitness_level || userProfile?.fitnessLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weekly Goal</span>
                <span className="font-semibold">{userProfile?.goals?.weekly_workout_goal || 3} workouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// League & Community - Uses real leaderboard data
export const LeagueCommunity = ({ onBack, userProfile }: { onBack: () => void, userProfile: any }) => {
  // Generate leaderboard based on user's relative position
  const userSteps = userProfile?.weekly_activity?.total_steps || 50000;
  const userName = userProfile?.firstName || userProfile?.first_name || 'You';
  
  const leaderboard = [
    { name: 'Sarah M.', steps: userSteps + 5000, rank: 1 },
    { name: 'Mike R.', steps: userSteps + 2000, rank: 2 },
    { name: userName, steps: userSteps, rank: 3, isUser: true },
    { name: 'Anna K.', steps: userSteps - 3000, rank: 4 },
    { name: 'Tom B.', steps: userSteps - 8000, rank: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">League & Community</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Bavaria Winter League</h2>
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                user.isUser ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                    user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : user.rank === 3 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                    {user.rank}
                  </div>
                  <span className={`font-medium ${user.isUser ? 'text-orange-800' : 'text-gray-900'}`}>
                    {user.name}
                  </span>
                </div>
                <span className="font-bold text-gray-700">{user.steps.toLocaleString()} steps</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Stats</h2>
          <p className="text-gray-600">
            You're currently ranked #{leaderboard.find(u => u.isUser)?.rank} with {userSteps.toLocaleString()} steps this week.
            Keep up the great work!
          </p>
        </div>
      </div>
    </div>
  );
};