
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Dumbbell, Zap, Brain, Target, Users, Trophy, Star, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI Fitness Coach",
      description: "Get personalized workout plans and real-time form corrections powered by advanced AI",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set and achieve your fitness goals with intelligent progress monitoring",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Social Fitness Community",
      description: "Connect with like-minded fitness enthusiasts and share your journey",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Insurance Benefits",
      description: "Automatically qualify for your health insurance bonus programs",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Fitness Enthusiast",
      text: "FitBuddy transformed my workout routine. The AI coach feels like having a personal trainer 24/7!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Busy Professional",
      text: "Finally, a fitness app that adapts to my schedule. The insurance rewards are a great bonus!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                FitBuddy AI
              </span>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
            <Dumbbell className="w-12 h-12 text-white" />
          </div>
          
          <Badge className="mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Fitness Revolution
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Your Smart
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent block">
              Fitness Companion
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your fitness journey with AI-powered coaching, real-time form analysis, 
            social motivation, and automatic insurance benefits. The future of fitness is here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-lg px-8 py-6 shadow-lg"
              onClick={() => navigate('/auth')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-emerald-200 hover:bg-emerald-50"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { number: "50K+", label: "Active Users" },
            { number: "1M+", label: "Workouts Completed" },
            { number: "95%", label: "User Satisfaction" },
            { number: "$2M+", label: "Insurance Rewards Earned" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-emerald-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-emerald-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-emerald-200/50">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0 shadow-2xl">
          <CardContent className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-6 text-emerald-200" />
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who have already started their smart fitness journey. 
              Get AI coaching, earn insurance rewards, and achieve your goals faster than ever.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6 bg-white text-emerald-600 hover:bg-gray-100"
              onClick={() => navigate('/auth')}
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FitBuddy AI</span>
            </div>
            <p className="text-gray-400">© 2024 FitBuddy AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
