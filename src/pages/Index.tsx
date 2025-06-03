
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Users, Shield, Dumbbell, Zap, Trophy, Heart, Star, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "KI-Fitness Coach",
      description: "Personalisierte Trainingspläne und Echtzeit-Formkorrekturen mit fortschrittlicher KI-Technologie",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Trophy,
      title: "Liga-System & Wettkämpfe",
      description: "Schließe dich lokalen Ligen an, tritt in Wettkämpfen an und gewinne echte Preise",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Soziale Bewegungsgemeinschaft",
      description: "Verbinde dich mit Gleichgesinnten und teile deine Fitness-Reise in der Gemeinschaft",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Shield,
      title: "Krankenkassen-Integration",
      description: "Automatische Qualifikation für Bonusprogramme deiner Krankenkasse - sicher und datenschutzkonform",
      color: "from-purple-500 to-violet-600"
    }
  ];

  const testimonials = [
    {
      name: "Maria Schneider",
      role: "Fitness-Enthusiastin",
      text: "BewegungsLiga+ hat meine Trainingsroutine revolutioniert. Der KI-Coach fühlt sich an wie ein persönlicher Trainer rund um die Uhr!",
      rating: 5
    },
    {
      name: "Thomas Weber",
      role: "Berufstätiger",
      text: "Endlich eine Fitness-App, die sich meinem Zeitplan anpasst. Die Krankenkassen-Boni sind ein großartiger Zusatz!",
      rating: 5
    }
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
              <Button onClick={() => navigate('/auth')}>Jetzt starten</Button>
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
            Bayerische Bewegungsrevolution
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8">
            Bewegung für
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent block">
              Alle zugänglich
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transformiere deine Fitness-Reise mit KI-gestütztem Coaching, Echtzeit-Formanalyse, 
            sozialer Motivation und automatischen Krankenkassen-Boni. Die Zukunft der personalisierten Bewegung ist hier.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl px-12 py-8 shadow-2xl"
              onClick={() => navigate('/auth')}
            >
              <Trophy className="w-6 h-6 mr-3" />
              Deine Reise beginnen
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-xl px-12 py-8 border-2 border-blue-600 hover:bg-blue-50"
            >
              <Heart className="w-6 h-6 mr-3" />
              Live Demo ansehen
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardContent className="text-center p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">10.000+</div>
                <div className="text-gray-600">Aktive Nutzer</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 bg-purple-50/50">
              <CardContent className="text-center p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">€2.5M+</div>
                <div className="text-gray-600">Krankenkassen-Boni ausgezahlt</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-200 bg-red-50/50">
              <CardContent className="text-center p-6">
                <div className="text-4xl font-bold text-red-600 mb-2">95%</div>
                <div className="text-gray-600">Nutzerzufriedenheit</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Was unsere Community sagt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic text-lg">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-3xl p-16 text-white">
          <h2 className="text-4xl font-bold mb-6">Bereit für deine Bewegungsrevolution?</h2>
          <p className="text-xl mb-8 opacity-90">
            Schließe dich Tausenden von Bayern an, die bereits ihre Fitnessziele erreichen
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6"
            onClick={() => navigate('/auth')}
          >
            <Trophy className="w-6 h-6 mr-3" />
            Kostenlos starten
          </Button>
        </div>

        {/* Bavaria Footer */}
        <div className="mt-16 text-center">
          <Badge variant="outline" className="text-lg px-6 py-2">
            🏛️ Unterstützt vom Bayerischen Staatsministerium für Gesundheit, Pflege und Prävention
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Index;
