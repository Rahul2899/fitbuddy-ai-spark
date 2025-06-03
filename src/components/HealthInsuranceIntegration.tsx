
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
  Clock
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

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Reward Points</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{userPoints.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Available for redemption</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Monthly Savings</span>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ${activeProvider ? insuranceProviders.find(p => p.id === activeProvider)?.currentDiscount || 0 : 0}
              </div>
              <p className="text-xs text-gray-600">Premium discount earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insuranceProviders.map((provider) => (
              <Card key={provider.id} className={`${provider.connected ? 'ring-2 ring-green-500' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{provider.logo}</span>
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        {provider.connected && (
                          <Badge className="bg-green-600">Connected</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Benefits:</span>
                      <ul className="text-xs text-gray-600 mt-1">
                        {provider.benefits.map((benefit, index) => (
                          <li key={index}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Discount:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={(provider.currentDiscount / provider.maxDiscount) * 100} 
                          className="flex-1"
                        />
                        <span className="text-xs">{provider.currentDiscount}%/{provider.maxDiscount}%</span>
                      </div>
                    </div>

                    {!provider.connected ? (
                      <Button 
                        onClick={() => connectProvider(provider.id)}
                        className="w-full"
                        size="sm"
                      >
                        Connect
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Connection
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className={reward.claimed ? 'opacity-50' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{reward.title}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                    <Badge variant={reward.category === 'health' ? 'default' : reward.category === 'fitness' ? 'secondary' : 'outline'}>
                      {reward.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold">{reward.points} points</span>
                    </div>
                    
                    {!reward.claimed && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{reward.expiresIn} days left</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => claimReward(reward.id)}
                    disabled={reward.claimed || userPoints < reward.points}
                    className="w-full mt-3"
                    size="sm"
                  >
                    {reward.claimed ? 'Claimed' : userPoints < reward.points ? 'Insufficient Points' : 'Claim Reward'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {metric.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{metric.current}{metric.unit}</span>
                      <Badge variant={metric.improvement > 0 ? 'default' : 'secondary'}>
                        {metric.improvement > 0 ? '+' : ''}{metric.improvement}{metric.unit}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress to target</span>
                        <span>{metric.target}{metric.unit}</span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Monthly Fitness Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Workouts Completed</span>
                    <span>{monthlyGoals.workouts.current}/{monthlyGoals.workouts.target}</span>
                  </div>
                  <Progress value={(monthlyGoals.workouts.current / monthlyGoals.workouts.target) * 100} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Steps</span>
                    <span>{monthlyGoals.steps.current.toLocaleString()}/{monthlyGoals.steps.target.toLocaleString()}</span>
                  </div>
                  <Progress value={(monthlyGoals.steps.current / monthlyGoals.steps.target) * 100} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Average Sleep</span>
                    <span>{monthlyGoals.sleep.current}h/{monthlyGoals.sleep.target}h</span>
                  </div>
                  <Progress value={(monthlyGoals.sleep.current / monthlyGoals.sleep.target) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insurance Benefits Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium">Premium Discount</span>
                      <p className="text-sm text-gray-600">Monthly savings earned</p>
                    </div>
                    <span className="text-xl font-bold text-green-600">15%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="font-medium">Wellness Credits</span>
                      <p className="text-sm text-gray-600">Available this month</p>
                    </div>
                    <span className="text-xl font-bold text-blue-600">$125</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <span className="font-medium">Health Score</span>
                      <p className="text-sm text-gray-600">Insurance rating</p>
                    </div>
                    <span className="text-xl font-bold text-purple-600">A+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsuranceIntegration;
