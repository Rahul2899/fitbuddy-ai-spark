
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Target, Trophy, Users, Zap, Heart, Brain, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: "AI Personal Trainer",
      description: "Get personalized workouts and real-time coaching from our advanced AI",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set and achieve your fitness goals with intelligent progress monitoring",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn points, unlock achievements, and level up your fitness journey",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Social Community",
      description: "Connect with friends, share progress, and join fitness challenges",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Workouts Completed", value: "2M+", icon: Activity },
    { label: "Calories Burned", value: "500M+", icon: Zap },
    { label: "Achievements Unlocked", value: "1M+", icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> AI Fitness </span>
              Buddy
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your fitness journey with personalized AI coaching, gamified workouts, 
              and a supportive community. Get stronger, healthier, and happier - one workout at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6"
                onClick={() => navigate('/dashboard')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/ai-coach')}
              >
                <Bot className="w-5 h-5 mr-2" />
                Meet AI Coach
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                <Heart className="w-3 h-3 mr-1" />
                Personalized
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                <Trophy className="w-3 h-3 mr-1" />
                Gamified
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                <Users className="w-3 h-3 mr-1" />
                Social
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FitBuddy AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of fitness with cutting-edge AI technology and engaging features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of users who are already crushing their fitness goals with FitBuddy AI
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-50 text-lg px-8 py-6"
            onClick={() => navigate('/dashboard')}
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
