
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';

interface PoseKeypoint {
  x: number;
  y: number;
  confidence: number;
}

interface FormFeedback {
  score: number;
  feedback: string[];
  isCorrect: boolean;
}

const WorkoutFormChecker = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCamera, setIsCamera] = useState(false);
  const [currentExercise, setCurrentExercise] = useState('push-ups');
  const [formFeedback, setFormFeedback] = useState<FormFeedback>({
    score: 0,
    feedback: [],
    isCorrect: false
  });
  const [repCount, setRepCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const exercises = [
    { id: 'push-ups', name: 'Push-ups', description: 'Keep your body straight, arms shoulder-width apart' },
    { id: 'squats', name: 'Squats', description: 'Keep your back straight, knees over toes' },
    { id: 'planks', name: 'Planks', description: 'Maintain straight line from head to heels' },
  ];

  useEffect(() => {
    if (isCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsAnalyzing(true);
        analyzeForm();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsAnalyzing(false);
  };

  const analyzeForm = () => {
    // Simulated pose analysis - in real implementation, use MediaPipe or TensorFlow.js
    const analysisInterval = setInterval(() => {
      if (!isAnalyzing || !videoRef.current) {
        clearInterval(analysisInterval);
        return;
      }

      // Simulate form analysis based on exercise type
      const feedback = generateFormFeedback(currentExercise);
      setFormFeedback(feedback);

      // Simulate rep counting
      if (feedback.isCorrect && Math.random() > 0.8) {
        setRepCount(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(analysisInterval);
  };

  const generateFormFeedback = (exercise: string): FormFeedback => {
    const feedbacks = {
      'push-ups': [
        'Keep your core engaged',
        'Lower your chest closer to the ground',
        'Great form! Keep it up',
        'Straighten your back',
        'Perfect push-up form!'
      ],
      'squats': [
        'Go deeper in your squat',
        'Keep your knees aligned with toes',
        'Excellent depth!',
        'Engage your glutes more',
        'Perfect squat form!'
      ],
      'planks': [
        'Keep your hips level',
        'Engage your core muscles',
        'Great plank position!',
        'Don\'t let your hips sag',
        'Perfect plank form!'
      ]
    };

    const exerciseFeedback = feedbacks[exercise as keyof typeof feedbacks] || feedbacks['push-ups'];
    const randomFeedback = exerciseFeedback[Math.floor(Math.random() * exerciseFeedback.length)];
    const score = Math.floor(Math.random() * 40) + 60; // 60-100 score
    const isCorrect = score > 80;

    return {
      score,
      feedback: [randomFeedback],
      isCorrect
    };
  };

  const resetSession = () => {
    setRepCount(0);
    setFormFeedback({ score: 0, feedback: [], isCorrect: false });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6" />
            AI Form Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Section */}
            <div className="space-y-4">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {isCamera ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <CameraOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Camera off</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsCamera(!isCamera)}
                  className={isCamera ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                >
                  {isCamera ? <CameraOff className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                  {isCamera ? 'Stop Camera' : 'Start Camera'}
                </Button>
                <Button onClick={resetSession} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Analysis Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Exercise</label>
                <select
                  value={currentExercise}
                  onChange={(e) => setCurrentExercise(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-1">
                  {exercises.find(e => e.id === currentExercise)?.description}
                </p>
              </div>

              {/* Rep Counter */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Rep Counter</h3>
                <div className="text-3xl font-bold text-blue-600">{repCount}</div>
              </div>

              {/* Form Analysis */}
              {isAnalyzing && formFeedback.feedback.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Form Analysis</h3>
                    <Badge variant={formFeedback.isCorrect ? 'default' : 'destructive'}>
                      {formFeedback.score}/100
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {formFeedback.feedback.map((feedback, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        {formFeedback.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                        )}
                        <span className="text-sm">{feedback}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutFormChecker;
