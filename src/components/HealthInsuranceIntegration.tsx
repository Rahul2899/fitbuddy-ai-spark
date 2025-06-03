import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  Target,
  Gift,
  Star,
  Calendar,
  Clock,
  Check,
  Euro
} from 'lucide-react';

interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  benefits: string[];
  currentDiscount: number;
  maxDiscount: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'health' | 'fitness' | 'lifestyle';
  claimed: boolean;
  expiresIn: number; // days
}

interface HealthMetric {
  name: string;
  current: number;
  target: number;
  improvement: number;
  unit: string;
}

const HealthInsuranceIntegration = () => {
  const [activeProvider, setActiveProvider] = useState<string | null>('healthplus');
  const [userPoints, setUserPoints] = useState(2450);
  const [monthlyGoals, setMonthlyGoals] = useState({
    workouts: { current: 18, target: 20 },
    steps: { current: 185000, target: 200000 },
    sleep: { current: 7.2, target: 8.0 },
    heartRate: { current: 65, target: 60 }
  });

  const insuranceProviders: InsuranceProvider[] = [
    {
      id: 'healthplus',
      name: 'HealthPlus Insurance',
      logo: '🏥',
      connected: true,
      benefits: ['Premium Discounts', 'Wellness Rewards', 'Free Health Checkups'],
      currentDiscount: 15,
      maxDiscount: 25
    },
    {
      id: 'vitalcare',
      name: 'VitalCare',
      logo: '💙',
      connected: false,
      benefits: ['Cashback Rewards', 'Gym Partnerships', 'Mental Health Support'],
      currentDiscount: 0,
      maxDiscount: 30
    },
    {
      id: 'fitinsure',
      name: 'FitInsure Pro',
      logo: '💪',
      connected: false,
      benefits: ['Equipment Discounts', 'Trainer Credits', 'Nutrition Consulting'],
      currentDiscount: 0,
      maxDiscount: 20
    }
  ];

  const availableRewards: Reward[] = [
    {
      id: '1',
      title: '$50 Premium Credit',
      description: 'Reduce your monthly premium by $50',
      points: 1000,
      category: 'health',
      claimed: false,
      expiresIn: 30
    },
    {
      id: '2',
      title: 'Free Gym Membership (1 Month)',
      description: 'Access to partner gym facilities',
      points: 800,
      category: 'fitness',
      claimed: false,
      expiresIn: 15
    },
    {
      id: '3',
      title: 'Health Screening Package',
      description: 'Comprehensive health checkup',
      points: 1200,
      category: 'health',
      claimed: true,
      expiresIn: 0
    },
    {
      id: '4',
      title: 'Wellness App Premium',
      description: '6-month premium subscription',
      points: 600,
      category: 'lifestyle',
      claimed: false,
      expiresIn: 45
    }
  ];

  const healthMetrics: HealthMetric[] = [
    { name: 'Resting Heart Rate', current: 65, target: 60, improvement: -5, unit: 'bpm' },
    { name: 'Body Fat %', current: 18, target: 15, improvement: -3, unit: '%' },
    { name: 'Muscle Mass', current: 45, target: 48, improvement: +2, unit: 'kg' },
    { name: 'Sleep Quality', current: 8.2, target: 8.5, improvement: +0.5, unit: '/10' }
  ];

  const connectProvider = (providerId: string) => {
    console.log(`Connecting to ${providerId}`);
    // In real app, this would initiate OAuth flow
  };

  const claimReward = (rewardId: string) => {
    const reward = availableRewards.find(r => r.id === rewardId);
    if (reward && userPoints >= reward.points) {
      setUserPoints(prev => prev - reward.points);
      reward.claimed = true;
      console.log(`Claimed reward: ${reward.title}`);
    }
  };

  const calculateInsuranceScore = () => {
    const workoutScore = (monthlyGoals.workouts.current / monthlyGoals.workouts.target) * 25;
    const stepsScore = (monthlyGoals.steps.current / monthlyGoals.steps.target) * 25;
    const sleepScore = (monthlyGoals.sleep.current / monthlyGoals.sleep.target) * 25;
    const heartRateScore = monthlyGoals.heartRate.current <= monthlyGoals.heartRate.target ? 25 : 15;

    return Math.min(100, workoutScore + stepsScore + sleepScore + heartRateScore);
  };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'health':
                return 'from-red-500 to-pink-500';
            case 'fitness':
                return 'from-green-500 to-teal-500';
            case 'lifestyle':
                return 'from-yellow-500 to-orange-500';
            default:
                return 'from-gray-500 to-gray-700';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'health':
                return <Heart className="w-6 h-6 text-white" />;
            case 'fitness':
                return <TrendingUp className="w-6 h-6 text-white" />;
            case 'lifestyle':
                return <Gift className="w-6 h-6 text-white" />;
            default:
                return <Star className="w-6 h-6 text-white" />;
        }
    };

  const insuranceScore = calculateInsuranceScore();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Health Insurance Integration
          </CardTitle>
          <CardDescription>
            Earn real rewards and discounts through your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Insurance Score</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{insuranceScore.toFixed(0)}%</div>
              <Progress value={insuranceScore} className="mb-2" />
              <p className="text-xs text-gray-600">Based on your fitness activities</p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-6 h-6 text-green-600" />
                <span className="font-bold text-lg">Verfügbare Punkte</span>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-3">{userPoints.toLocaleString()}</div>
              <p className="text-sm text-gray-700">Tausche gegen Belohnungen und Rabatte</p>
            </div>
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Euro className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-lg">Nächster Bonus</span>
              </div>
              <div className="text-4xl font-bold text-amber-600 mb-3">€75</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fortschritt</span>
                  <span>22/25 Tage</span>
                </div>
                <Progress value={88} className="h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-blue-200">
          <TabsTrigger value="providers" className="text-lg">Krankenkassen</TabsTrigger>
          <TabsTrigger value="rewards" className="text-lg">Belohnungen</TabsTrigger>
          <TabsTrigger value="progress" className="text-lg">Monatsziele</TabsTrigger>
          <TabsTrigger value="metrics" className="text-lg">Gesundheitsdaten</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insuranceProviders.map((provider) => (
              <Card 
                key={provider.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  provider.connected 
                    ? 'border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50' 
                    : 'border-2 border-gray-200 hover:border-blue-400'
                }`}
                onClick={() => !provider.connected && connectProvider(provider.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{provider.logo}</span>
                      <div>
                        <CardTitle className="text-xl">{provider.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {provider.connected ? (
                            <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                              <Check className="w-4 h-4 mr-1" />
                              Verbunden
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-sm px-3 py-1">Nicht verbunden</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-bold text-gray-700">Vorteile:</span>
                      <ul className="mt-2 space-y-2">
                        {provider.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <Star className="w-4 h-4 mr-2 text-amber-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {provider.connected ? (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Aktueller Rabatt:</span>
                          <span className="font-bold text-green-600">{provider.currentDiscount}%</span>
                        </div>
                        <Progress 
                          value={(provider.currentDiscount / provider.maxDiscount) * 100} 
                          className="h-3"
                        />
                        <p className="text-xs text-gray-600">
                          Maximal möglich: {provider.maxDiscount}%
                        </p>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                        onClick={() => connectProvider(provider.id)}
                      >
                        Krankenkasse verbinden
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className={`transition-all duration-300 hover:shadow-xl ${reward.claimed ? 'opacity-60 bg-gray-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${getCategoryColor(reward.category)} flex items-center justify-center shadow-lg`}>
                        {getCategoryIcon(reward.category)}
                        <span className="text-white">{getCategoryIcon(reward.category)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <CardDescription className="text-sm">{reward.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Benötigte Punkte:</span>
                      <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                        {reward.points.toLocaleString()}
                      </Badge>
                    </div>

                    {!reward.claimed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Läuft ab in:</span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {reward.expiresIn} Tagen
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full text-lg py-3" 
                      disabled={reward.claimed || userPoints < reward.points}
                      onClick={() => claimReward(reward.id)}
                    >
                      {reward.claimed ? '✓ Bereits eingelöst' : 
                       userPoints < reward.points ? 'Nicht genug Punkte' : 'Belohnung einlösen'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(monthlyGoals).map(([key, goal]) => {
              const titles = {
                workouts: 'Trainingseinheiten',
                steps: 'Schritte',
                sleep: 'Schlafstunden',
                heartRate: 'Ruhepuls'
              };

              return (
                <Card key={key} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{titles[key as keyof typeof titles]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Fortschritt:</span>
                        <span className="font-bold text-2xl">
                          {typeof goal.current === 'number' ? goal.current.toLocaleString() : goal.current} / 
                          {typeof goal.target === 'number' ? goal.target.toLocaleString() : goal.target}
                        </span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-4" />
                      <div className="text-center">
                        <Badge 
                          variant={goal.current >= goal.target ? "default" : "secondary"}
                          className={`text-lg px-4 py-2 ${goal.current >= goal.target ? "bg-green-600" : ""}`}
                        >
                          {goal.current >= goal.target ? "Ziel erreicht! 🎉" : "Weiter so! 💪"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-3">
                        {metric.current}{metric.unit}
                      </div>
                      <div className="text-lg text-gray-600">
                        Ziel: {metric.target}{metric.unit}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <Badge 
                        variant={metric.improvement > 0 ? "default" : "secondary"}
                        className={`text-lg px-4 py-2 ${metric.improvement > 0 ? "bg-green-600" : "bg-red-600"}`}
                      >
                        {metric.improvement > 0 ? '↗' : '↘'} {Math.abs(metric.improvement)}{metric.unit}
                      </Badge>
                    </div>

                    <Progress 
                      value={Math.min((metric.current / metric.target) * 100, 100)} 
                      className="h-4"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsuranceIntegration;