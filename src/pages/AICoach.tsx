
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, Zap, Target, Heart, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AICoach = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi there! I'm your AI fitness coach. I'm here to help you achieve your fitness goals! How can I assist you today?",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(message),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
  };

  const getAIResponse = (userMessage: string) => {
    const responses = {
      workout: "Great! I recommend a 30-minute HIIT workout focusing on compound movements. This will boost your metabolism and build strength efficiently. Would you like me to create a personalized routine?",
      diet: "Nutrition is key! Focus on whole foods: lean proteins, complex carbs, and healthy fats. Aim for 1.6-2.2g protein per kg body weight. Would you like a meal plan suggestion?",
      motivation: "Remember, every workout counts! You're building not just strength, but discipline and confidence. Your future self will thank you for the effort you put in today! 💪",
      default: "That's a great question! Based on your fitness profile, I'd recommend focusing on consistency over intensity. Small daily improvements lead to amazing long-term results!"
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) return responses.workout;
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) return responses.diet;
    if (lowerMessage.includes('motivation') || lowerMessage.includes('tired') || lowerMessage.includes('lazy')) return responses.motivation;
    return responses.default;
  };

  const quickActions = [
    { label: "Plan my workout", icon: Target },
    { label: "Nutrition advice", icon: Heart },
    { label: "Motivate me", icon: Zap },
    { label: "Form check", icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FitBuddy AI Coach</h1>
            <p className="text-gray-600">Your personal AI fitness companion</p>
            <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">
              Available 24/7
            </Badge>
          </div>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get instant help with these common requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => setMessage(action.label)}
                >
                  <action.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chat with AI Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-xs lg:max-w-md`}>
                    {msg.type === 'ai' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-600 text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-white border'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    {msg.type === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your AI coach anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
