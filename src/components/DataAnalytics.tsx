
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Heart, 
  Target,
  Award,
  Calendar,
  MapPin,
  Zap,
  Crown,
  Medal,
  Star
} from 'lucide-react';

const DataAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated data based on your CSV files
  const userDemographics = [
    { ageGroup: '20-29', count: 12, percentage: 24 },
    { ageGroup: '30-39', count: 18, percentage: 36 },
    { ageGroup: '40-49', count: 15, percentage: 30 },
    { ageGroup: '50+', count: 5, percentage: 10 }
  ];

  const activityData = [
    { day: 'Mon', steps: 8500, calories: 2400, heartRate: 72 },
    { day: 'Tue', steps: 9200, calories: 2650, heartRate: 74 },
    { day: 'Wed', steps: 7800, calories: 2200, heartRate: 70 },
    { day: 'Thu', steps: 10500, calories: 2900, heartRate: 76 },
    { day: 'Fri', steps: 9800, calories: 2750, heartRate: 73 },
    { day: 'Sat', steps: 12000, calories: 3200, heartRate: 78 },
    { day: 'Sun', steps: 11200, calories: 3000, heartRate: 75 }
  ];

  const fitnessLevels = [
    { level: 'Beginner', count: 15, color: '#ff6b6b' },
    { level: 'Intermediate', count: 25, color: '#4ecdc4' },
    { level: 'Advanced', count: 10, color: '#45b7d1' }
  ];

  const insuranceProviders = [
    { name: 'Techniker Krankenkasse', users: 12, bonus: '€200' },
    { name: 'AOK Bayern', users: 8, bonus: '€180' },
    { name: 'Barmer', users: 6, bonus: '€220' },
    { name: 'DAK-Gesundheit', users: 5, bonus: '€190' },
    { name: 'Others', users: 19, bonus: '€175' }
  ];

  const competitionStats = [
    { competition: 'Bavaria Winter Challenge', participants: 2847, avgScore: 78 },
    { competition: 'New Year League', participants: 156, avgScore: 92 },
    { competition: 'Heart Rate Master', participants: 892, avgScore: 65 },
    { competition: 'Spring Awakening', participants: 450, avgScore: 85 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BewegungsLiga+ Analytics
              </h1>
              <p className="text-gray-600">Comprehensive fitness data insights and analytics</p>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              Live Data
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">2,847</div>
              <div className="text-sm opacity-90">Active Users</div>
              <div className="text-xs mt-1">↑ 12% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">1.2M</div>
              <div className="text-sm opacity-90">Weekly Steps</div>
              <div className="text-xs mt-1">↑ 8% vs last week</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">€125K</div>
              <div className="text-sm opacity-90">Insurance Bonuses</div>
              <div className="text-xs mt-1">This quarter</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm opacity-90">Engagement Rate</div>
              <div className="text-xs mt-1">↑ 5% improvement</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity Trends</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Weekly Activity Overview
                  </CardTitle>
                  <CardDescription>Steps, calories, and heart rate trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="steps" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="calories" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Fitness Level Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Fitness Level Distribution
                  </CardTitle>
                  <CardDescription>User fitness level breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={fitnessLevels}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {fitnessLevels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Top Performers This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Maria Schmidt', steps: 75280, badge: '🥇', rank: 1 },
                    { name: 'Thomas Weber', steps: 73680, badge: '🥈', rank: 2 },
                    { name: 'Elena Richter', steps: 72480, badge: '🥉', rank: 3 }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.badge}</span>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.steps.toLocaleString()} steps</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500 text-white">#{user.rank}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Trends</CardTitle>
                <CardDescription>Comprehensive activity metrics over the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#8884d8" strokeWidth={3} />
                    <Line yAxisId="left" type="monotone" dataKey="calories" stroke="#82ca9d" strokeWidth={3} />
                    <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#ffc658" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Popular Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {[
                    { activity: 'Running', percentage: 35 },
                    { activity: 'Cycling', percentage: 28 },
                    { activity: 'Swimming', percentage: 22 },
                    { activity: 'Gym Training', percentage: 15 }
                  ].map((item) => (
                    <div key={item.activity} className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.activity}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Peak Activity Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  {[
                    { time: '6:00-8:00 AM', users: 1250 },
                    { time: '12:00-2:00 PM', users: 890 },
                    { time: '6:00-8:00 PM', users: 1680 },
                    { time: '8:00-10:00 PM', users: 920 }
                  ].map((slot) => (
                    <div key={slot.time} className="flex justify-between items-center py-2">
                      <span className="font-medium">{slot.time}</span>
                      <Badge variant="outline">{slot.users} users</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Steps Goal</span>
                        <span>89% completion</span>
                      </div>
                      <Progress value={89} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Calories Goal</span>
                        <span>76% completion</span>
                      </div>
                      <Progress value={76} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Exercise Sessions</span>
                        <span>92% completion</span>
                      </div>
                      <Progress value={92} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userDemographics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { state: 'Bavaria', users: 850, percentage: 30 },
                      { state: 'North Rhine-Westphalia', users: 680, percentage: 24 },
                      { state: 'Baden-Württemberg', users: 520, percentage: 18 },
                      { state: 'Lower Saxony', users: 380, percentage: 13 },
                      { state: 'Others', users: 417, percentage: 15 }
                    ].map((region) => (
                      <div key={region.state} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{region.state}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{region.users} users</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${region.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Education Level</CardTitle>
                </CardHeader>
                <CardContent>
                  {[
                    { level: 'University', percentage: 65 },
                    { level: 'Master/PhD', percentage: 25 },
                    { level: 'Technical', percentage: 10 }
                  ].map((edu) => (
                    <div key={edu.level} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span>{edu.level}</span>
                        <span>{edu.percentage}%</span>
                      </div>
                      <Progress value={edu.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Income Brackets</CardTitle>
                </CardHeader>
                <CardContent>
                  {[
                    { bracket: '€50K-75K', percentage: 40 },
                    { bracket: '€40K-50K', percentage: 30 },
                    { bracket: '€75K+', percentage: 30 }
                  ].map((income) => (
                    <div key={income.bracket} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span>{income.bracket}</span>
                        <span>{income.percentage}%</span>
                      </div>
                      <Progress value={income.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Avg BMI</span>
                      <Badge variant="outline">23.2</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Heart Rate</span>
                      <Badge variant="outline">69 BPM</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Sleep Quality</span>
                      <Badge className="bg-green-500">7.8/10</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="competitions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competition Performance</CardTitle>
                <CardDescription>Participation and success rates across all competitions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={competitionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="competition" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="participants" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="avgScore" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-amber-500" />
                    Top Competitions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {competitionStats.map((comp, index) => (
                    <div key={comp.competition} className="flex items-center justify-between p-3 mb-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{comp.competition}</p>
                        <p className="text-sm text-gray-600">{comp.participants.toLocaleString()} participants</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-500 text-white mb-1">
                          {comp.avgScore}% completion
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-500" />
                    Achievement Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Achievements</span>
                      <Badge className="bg-green-500 text-white">15,230</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Streak Champions</span>
                      <Badge className="bg-orange-500 text-white">342</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>League Winners</span>
                      <Badge className="bg-purple-500 text-white">89</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Perfect Months</span>
                      <Badge className="bg-blue-500 text-white">156</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Provider Distribution</CardTitle>
                <CardDescription>User distribution across different insurance providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={insuranceProviders}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, users }) => `${name}: ${users}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="users"
                      >
                        {insuranceProviders.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-4">
                    {insuranceProviders.map((provider, index) => (
                      <div key={provider.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-gray-600">{provider.users} users</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {provider.bonus} avg bonus
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bonus Payouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">€125,420</div>
                    <p className="text-gray-600">Total paid this quarter</p>
                    <div className="mt-4">
                      <Badge className="bg-green-100 text-green-800">
                        ↑ 15% vs last quarter
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Bonus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">€195</div>
                    <p className="text-gray-600">Per user this quarter</p>
                    <div className="mt-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        ↑ 8% improvement
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Qualification Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                    <p className="text-gray-600">Users qualifying for bonuses</p>
                    <div className="mt-4">
                      <Badge className="bg-purple-100 text-purple-800">
                        ↑ 12% this month
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataAnalytics;
