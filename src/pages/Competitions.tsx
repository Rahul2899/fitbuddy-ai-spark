
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Medal, Users, Calendar, Flame, Target, Star, Gift, Timer, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Competitions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');

  const currentCompetitions = [
    {
      id: 1,
      title: "Bayern Winter Challenge 2025",
      description: "10.000 Schritte täglich den ganzen Januar",
      type: "individual",
      status: "active",
      progress: 78,
      daysLeft: 8,
      participants: 2847,
      prize: "€50 + Wellness Wochenende",
      requirements: "10.000 Schritte täglich für 25 Tage",
      startDate: "01.01.2025",
      endDate: "31.01.2025",
      difficulty: "medium",
      category: "steps",
      icon: Medal,
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      id: 2,
      title: "Neujahrs-Liga",
      description: "Wöchentliche Team-Herausforderungen",
      type: "team",
      status: "active",
      progress: 92,
      daysLeft: 3,
      participants: 156,
      prize: "€100 Sportgutschein pro Team",
      requirements: "Team-Ziele erreichen",
      startDate: "01.01.2025",
      endDate: "28.01.2025",
      difficulty: "high",
      category: "team",
      icon: Crown,
      gradient: "from-amber-500 to-orange-600"
    },
    {
      id: 3,
      title: "Herzfrequenz-Master",
      description: "Optimale Herzfrequenz-Zonen einhalten",
      type: "individual",
      status: "active",
      progress: 65,
      daysLeft: 12,
      participants: 892,
      prize: "€35 + Fitness-Tracker",
      requirements: "14 Tage in optimaler HF-Zone",
      startDate: "15.01.2025",
      endDate: "31.01.2025",
      difficulty: "medium",
      category: "cardio",
      icon: Target,
      gradient: "from-red-500 to-pink-600"
    }
  ];

  const upcomingCompetitions = [
    {
      id: 4,
      title: "Frühlings-Erwachen Challenge",
      description: "Vorbereitung auf den Frühling",
      type: "individual",
      status: "upcoming",
      startDate: "01.03.2025",
      endDate: "31.03.2025",
      prize: "€75 + Outdoor-Ausrüstung",
      participants: 450,
      requirements: "Outdoor-Aktivitäten sammeln",
      difficulty: "easy",
      category: "outdoor",
      icon: Flame,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 5,
      title: "Bayern Liga Playoffs",
      description: "Die besten Teams treten gegeneinander an",
      type: "team",
      status: "upcoming",
      startDate: "15.02.2025",
      endDate: "28.02.2025",
      prize: "€500 + Pokal",
      participants: 64,
      requirements: "Qualifikation erforderlich",
      difficulty: "high",
      category: "elite",
      icon: Trophy,
      gradient: "from-purple-600 to-violet-700"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Team Alpenstürmer", points: 8945, members: 8, region: "München" },
    { rank: 2, name: "Fitness Warriors", points: 8823, members: 6, region: "Nürnberg" },
    { rank: 3, name: "Dein Team", points: 8756, members: 7, region: "Augsburg", isUser: true },
    { rank: 4, name: "Cardio Kings", points: 8634, members: 5, region: "Würzburg" },
    { rank: 5, name: "Step by Step", points: 8521, members: 9, region: "Regensburg" }
  ];

  const joinCompetition = (competitionId: number) => {
    console.log(`Joining competition ${competitionId}`);
    // Handle competition joining logic
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'steps': return <Medal className="w-5 h-5" />;
      case 'team': return <Users className="w-5 h-5" />;
      case 'cardio': return <Target className="w-5 h-5" />;
      case 'outdoor': return <MapPin className="w-5 h-5" />;
      case 'elite': return <Crown className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Wettkämpfe & Ligen
              </h1>
              <p className="text-gray-600">Tritt lokalen Herausforderungen bei und gewinne tolle Preise</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Zurück zum Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm opacity-90">Aktive Wettkämpfe</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <Medal className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">€225</div>
              <div className="text-sm opacity-90">Mögliche Gewinne</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">3.895</div>
              <div className="text-sm opacity-90">Teilnehmer</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">#3</div>
              <div className="text-sm opacity-90">Liga-Rang</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-gray-200">
            <TabsTrigger value="current" className="text-lg">Aktuelle Wettkämpfe</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-lg">Kommende Events</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-lg">Liga-Tabelle</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentCompetitions.map((competition) => (
                <Card key={competition.id} className="hover:shadow-xl transition-all duration-300 border-2 border-amber-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-12 h-12 bg-gradient-to-r ${competition.gradient} rounded-xl flex items-center justify-center`}>
                        <competition.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getDifficultyColor(competition.difficulty)} text-white`}>
                          {competition.difficulty === 'easy' ? 'Leicht' : 
                           competition.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                        </Badge>
                        <Badge variant="outline" className="border-amber-500">
                          <Timer className="w-3 h-3 mr-1" />
                          {competition.daysLeft} Tage
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{competition.title}</CardTitle>
                    <CardDescription className="text-lg">{competition.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Fortschritt:</span>
                        <span className="font-bold">{competition.progress}%</span>
                      </div>
                      <Progress value={competition.progress} className="h-3" />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Teilnehmer:</span>
                        <span className="font-medium">{competition.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Typ:</span>
                        <span className="font-medium capitalize flex items-center gap-1">
                          {getCategoryIcon(competition.category)}
                          {competition.type === 'team' ? 'Team' : 'Einzeln'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anforderung:</span>
                        <span className="font-medium text-right">{competition.requirements}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-700">
                        <Gift className="w-4 h-4" />
                        <span className="font-bold">Preis: {competition.prize}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                      onClick={() => joinCompetition(competition.id)}
                    >
                      An Wettkampf teilnehmen
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingCompetitions.map((competition) => (
                <Card key={competition.id} className="hover:shadow-xl transition-all duration-300 border-2 border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-12 h-12 bg-gradient-to-r ${competition.gradient} rounded-xl flex items-center justify-center`}>
                        <competition.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="border-blue-500 text-blue-600">
                        Demnächst
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{competition.title}</CardTitle>
                    <CardDescription className="text-lg">{competition.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start:</span>
                        <span className="font-medium">{competition.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ende:</span>
                        <span className="font-medium">{competition.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interessierte:</span>
                        <span className="font-medium">{competition.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anforderung:</span>
                        <span className="font-medium">{competition.requirements}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Gift className="w-4 h-4" />
                        <span className="font-bold">Preis: {competition.prize}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      onClick={() => joinCompetition(competition.id)}
                    >
                      Interessiert anmelden
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="w-8 h-8 text-amber-500" />
                  Bayern Liga - Aktuelle Saison
                </CardTitle>
                <CardDescription>Die besten Teams in Bayern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((team) => (
                    <div 
                      key={team.rank} 
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                        team.isUser 
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-400' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          team.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                          team.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                          team.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {team.rank === 1 ? <Crown className="w-6 h-6" /> : 
                           team.rank === 2 ? <Medal className="w-6 h-6" /> :
                           team.rank === 3 ? <Star className="w-6 h-6" /> : team.rank}
                        </div>
                        <div>
                          <div className={`font-bold text-lg ${team.isUser ? 'text-amber-700' : 'text-gray-900'}`}>
                            {team.name} {team.isUser && '(Du)'}
                          </div>
                          <div className="text-gray-600 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {team.members} Mitglieder
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {team.region}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{team.points.toLocaleString()}</div>
                        <div className="text-gray-600 text-sm">Punkte</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Competitions;
