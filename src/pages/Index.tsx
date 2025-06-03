
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Heart, 
  Trophy, 
  Users, 
  Shield, 
  Zap, 
  Target, 
  TrendingUp, 
  Award,
  Medal,
  Dumbbell,
  Brain,
  BarChart3,
  Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Coaching",
      description: "Get personalized workout recommendations and real-time form analysis powered by advanced AI technology.",
      color: "from-purple-600 to-violet-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive data insights with beautiful charts and detailed progress tracking across all metrics.",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: Trophy,
      title: "Competitive Leagues",
      description: "Join Bavaria-wide competitions, climb leaderboards, and win real prizes and insurance bonuses.",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Insurance Integration",
      description: "Automatically earn bonuses and discounts from major German health insurance providers.",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: Users,
      title: "Social Community",
      description: "Connect with like-minded fitness enthusiasts, join teams, and motivate each other.",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Flame,
      title: "Streak System",
      description: "Build momentum with our advanced streak tracking and get rewarded for consistency.",
      color: "from-red-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "€2.5M+", label: "Insurance Bonuses Earned", icon: Shield },
    { number: "1.2M+", label: "Workouts Completed", icon: Activity },
    { number: "98%", label: "User Satisfaction", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-white to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Dumbbell className="w-7 h-7 text-blue-800" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  BewegungsLiga+
                </span>
                <div className="text-xs text-gray-600">Powered by Bavarian Innovation</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-red-600 text-white border-0">
                🏆 Hackathon 2025
              </Badge>
              <Button onClick={() => navigate('/auth')}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-600 via-white to-red-600 rounded-full flex items-center justify-center shadow-2xl">
            <Medal className="w-16 h-16 text-blue-800" />
          </div>
          
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-red-600 text-white border-0 text-lg px-6 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Bavarian Movement Revolution
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8">
            Movement for
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent block">
              Everyone
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your fitness journey with AI-powered coaching, real-time form analysis, 
            social motivation, and automatic health insurance bonuses. The future of personalized movement is here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl px-12 py-6"
              onClick={() => navigate('/auth')}
            >
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-xl px-12 py-6"
              onClick={() => navigate('/analytics')}
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <CardContent className="p-8">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Revolutionary Features
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                Fitness Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with proven fitness science 
              to deliver results that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <Trophy className="w-20 h-20 mx-auto mb-6 text-amber-300" />
              <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Fitness Journey?</h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of users who are already earning insurance bonuses, 
                competing in leagues, and achieving their fitness goals with BewegungsLiga+.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6 font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 text-xl px-12 py-6"
                  onClick={() => navigate('/analytics')}
                >
                  Explore Analytics
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-80">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Insurance Integrated
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Real Rewards
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Proven Results
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
