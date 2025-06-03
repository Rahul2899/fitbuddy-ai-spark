
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Area, AreaChart
} from 'recharts';
import { 
  Users, Activity, TrendingUp, Heart, Target, Award, 
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  UserCheck, Clock, Zap, Shield, Star
} from 'lucide-react';

const DataAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedUser, setSelectedUser] = useState('USR001');

  // Simulated data based on your CSV structure
  const userDemographics = [
    { ageGroup: '20-29', count: 12, percentage: 24, avgBmi: 22.1, avgSteps: 58000 },
    { ageGroup: '30-39', count: 18, percentage: 36, avgBmi: 24.2, avgSteps: 52000 },
    { ageGroup: '40-49', count: 15, percentage: 30, avgBmi: 26.1, avgSteps: 45000 },
    { ageGroup: '50+', count: 5, percentage: 10, avgBmi: 27.8, avgSteps: 38000 }
  ];

  const clusterData = [
    {
      id: 0,
      name: 'Young Fitness Enthusiasts',
      size: 12,
      percentage: 24,
      description: 'Advanced fitness level young adults who are highly active',
      avgAge: 26.5,
      avgBmi: 21.8,
      avgSteps: 72000,
      avgCalories: 3200,
      fitnessLevel: 'Advanced',
      topInsurance: 'Techniker Krankenkasse',
      color: '#8884d8'
    },
    {
      id: 1,
      name: 'Active Professionals',
      size: 18,
      percentage: 36,
      description: 'Intermediate fitness level middle-aged adults who are moderately active',
      avgAge: 34.2,
      avgBmi: 24.1,
      avgSteps: 58000,
      avgCalories: 2650,
      fitnessLevel: 'Intermediate',
      topInsurance: 'AOK Bayern',
      color: '#82ca9d'
    },
    {
      id: 2,
      name: 'Health Conscious Beginners',
      size: 10,
      percentage: 20,
      description: 'Beginner fitness level adults who are moderately active',
      avgAge: 41.8,
      avgBmi: 26.5,
      avgSteps: 42000,
      avgCalories: 2100,
      fitnessLevel: 'Beginner',
      topInsurance: 'Barmer',
      color: '#ffc658'
    },
    {
      id: 3,
      name: 'Senior Wellness',
      size: 6,
      percentage: 12,
      description: 'Intermediate fitness level older adults who are less active',
      avgAge: 52.3,
      avgBmi: 27.2,
      avgSteps: 35000,
      avgCalories: 1850,
      fitnessLevel: 'Intermediate',
      topInsurance: 'DAK-Gesundheit',
      color: '#ff7300'
    },
    {
      id: 4,
      name: 'Casual Users',
      size: 4,
      percentage: 8,
      description: 'Beginner fitness level adults who are less active',
      avgAge: 38.5,
      avgBmi: 28.1,
      avgSteps: 28000,
      avgCalories: 1650,
      fitnessLevel: 'Beginner',
      topInsurance: 'IKK classic',
      color: '#8dd1e1'
    }
  ];

  const weeklyActivityData = [
    { day: 'Mon', steps: 8500, calories: 2400, heartRate: 72, activeMinutes: 45 },
    { day: 'Tue', steps: 9200, calories: 2650, heartRate: 74, activeMinutes: 52 },
    { day: 'Wed', steps: 7800, calories: 2200, heartRate: 70, activeMinutes: 38 },
    { day: 'Thu', steps: 10500, calories: 2900, heartRate: 76, activeMinutes: 58 },
    { day: 'Fri', steps: 9800, calories: 2750, heartRate: 73, activeMinutes: 48 },
    { day: 'Sat', steps: 12000, calories: 3200, heartRate: 78, activeMinutes: 65 },
    { day: 'Sun', steps: 11200, calories: 3000, heartRate: 75, activeMinutes: 60 }
  ];

  const insuranceProviders = [
    { name: 'Techniker Krankenkasse', users: 12, bonus: '€200', services: 15, rating: 4.8 },
    { name: 'AOK Bayern', users: 8, bonus: '€180', services: 12, rating: 4.5 },
    { name: 'Barmer', users: 6, bonus: '€220', services: 14, rating: 4.7 },
    { name: 'DAK-Gesundheit', users: 5, bonus: '€190', services: 11, rating: 4.4 },
    { name: 'IKK classic', users: 4, bonus: '€170', services: 10, rating: 4.3 },
    { name: 'Others', users: 15, bonus: '€185', services: 13, rating: 4.6 }
  ];

  const serviceCategories = [
    { category: 'Fitness', count: 28, popularity: 8.5, avgReward: 180 },
    { category: 'Prevention', count: 22, popularity: 7.8, avgReward: 150 },
    { category: 'Mental Health', count: 18, popularity: 7.2, avgReward: 200 },
    { category: 'Wellness', count: 25, popularity: 8.1, avgReward: 160 },
    { category: 'Family Health', count: 15, popularity: 6.9, avgReward: 140 },
    { category: 'Chronic Care', count: 12, popularity: 6.5, avgReward: 220 }
  ];

  const userProfile = {
    userId: 'USR001',
    basicInfo: {
      age: 32,
      gender: 'Female',
      city: 'Munich',
      fitnessLevel: 'Intermediate'
    },
    healthMetrics: {
      bmi: 23.1,
      restingHeartRate: 68,
      bloodPressure: '118/75',
      medicalConditions: 'None',
      insuranceProvider: 'Techniker Krankenkasse'
    },
    weeklyActivity: {
      totalSteps: 58000,
      caloriesBurned: 2650,
      activeMinutes: 285,
      exerciseSessions: 4,
      sleepHours: 7.5
    },
    fitnessScore: 78.5,
    cluster: 1,
    recommendations: [
      {
        type: 'activity',
        message: 'Great job! You\'re meeting WHO activity recommendations. Try adding one more strength session.',
        target: '5 sessions per week'
      },
      {
        type: 'health',
        message: 'Your BMI and heart rate are in excellent ranges. Keep up the good work!',
        target: 'Maintain current levels'
      }
    ],
    insuranceServices: [
      {
        serviceName: 'Premium Fitness Bonus',
        category: 'Fitness',
        description: 'Earn extra rewards for consistent gym attendance and personal training sessions',
        rewardAmount: 250,
        rewardType: 'EUR',
        relevanceScore: 9.2
      },
      {
        serviceName: 'Preventive Health Screening',
        category: 'Prevention',
        description: 'Comprehensive annual health check-up with additional benefits',
        rewardAmount: 180,
        rewardType: 'EUR',
        relevanceScore: 8.1
      }
    ]
  };

  const progressTrends = [
    { week: 'Week 1', steps: 46400, calories: 2120, fitnessScore: 62.8 },
    { week: 'Week 2', steps: 52200, calories: 2385, fitnessScore: 70.5 },
    { week: 'Week 3', steps: 55100, calories: 2518, fitnessScore: 74.7 },
    { week: 'Week 4', steps: 58000, calories: 2650, fitnessScore: 78.5 }
  ];

  const healthRadarData = [
    { subject: 'BMI', A: 85, fullMark: 100 },
    { subject: 'Heart Rate', A: 92, fullMark: 100 },
    { subject: 'Sleep', A: 88, fullMark: 100 },
    { subject: 'Activity', A: 78, fullMark: 100 },
    { subject: 'Overall', A: 79, fullMark: 100 }
  ];

  const similarUsers = ['USR045', 'USR023', 'USR067'];

  const OverviewDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">50</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Weekly Steps</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">48,600</div>
          <p className="text-xs text-muted-foreground">+8% from last week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <p className="text-xs text-muted-foreground">84% engagement rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Fitness Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">72.3</div>
          <p className="text-xs text-muted-foreground">+5.2 points this month</p>
        </CardContent>
      </Card>

      {/* Demographics Chart */}
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>User Demographics by Age Group</CardTitle>
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

      {/* Weekly Activity */}
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="steps" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="calories" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const ClusterAnalysis = () => (
    <div className="space-y-6">
      {/* Cluster Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusterData.map((cluster) => (
          <Card 
            key={cluster.id} 
            className={`cursor-pointer transition-all ${selectedCluster === cluster.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedCluster(cluster.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm">{cluster.name}</span>
                <Badge style={{ backgroundColor: cluster.color }}>
                  {cluster.size} users
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{cluster.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Avg Age:</span>
                  <span>{cluster.avgAge} years</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Avg Steps:</span>
                  <span>{cluster.avgSteps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>BMI:</span>
                  <span>{cluster.avgBmi}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Fitness Level:</span>
                  <Badge variant="outline" className="text-xs">{cluster.fitnessLevel}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cluster Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cluster Size Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clusterData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="size"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {clusterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Levels by Cluster</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clusterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgSteps" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Selected Cluster Details */}
      {selectedCluster !== null && (
        <Card>
          <CardHeader>
            <CardTitle>
              Cluster {selectedCluster} - {clusterData[selectedCluster].name} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Demographics</h4>
                <div className="space-y-1 text-sm">
                  <div>Average Age: {clusterData[selectedCluster].avgAge} years</div>
                  <div>Size: {clusterData[selectedCluster].size} users ({clusterData[selectedCluster].percentage}%)</div>
                  <div>Fitness Level: {clusterData[selectedCluster].fitnessLevel}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Health Metrics</h4>
                <div className="space-y-1 text-sm">
                  <div>Average BMI: {clusterData[selectedCluster].avgBmi}</div>
                  <div>Top Insurance: {clusterData[selectedCluster].topInsurance}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Activity Metrics</h4>
                <div className="space-y-1 text-sm">
                  <div>Average Steps: {clusterData[selectedCluster].avgSteps.toLocaleString()}</div>
                  <div>Average Calories: {clusterData[selectedCluster].avgCalories.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const UserAnalytics = () => (
    <div className="space-y-6">
      {/* User Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select User for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="USR001">USR001 - Sarah M. (32, Munich)</option>
            <option value="USR002">USR002 - Michael K. (28, Berlin)</option>
            <option value="USR003">USR003 - Anna L. (45, Hamburg)</option>
          </select>
        </CardContent>
      </Card>

      {/* User Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>Age: {userProfile.basicInfo.age}</div>
              <div>Gender: {userProfile.basicInfo.gender}</div>
              <div>City: {userProfile.basicInfo.city}</div>
              <div>Level: <Badge>{userProfile.basicInfo.fitnessLevel}</Badge></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>BMI: {userProfile.healthMetrics.bmi}</div>
              <div>HR: {userProfile.healthMetrics.restingHeartRate} bpm</div>
              <div>BP: {userProfile.healthMetrics.bloodPressure}</div>
              <div>Conditions: {userProfile.healthMetrics.medicalConditions}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>Steps: {userProfile.weeklyActivity.totalSteps.toLocaleString()}</div>
              <div>Calories: {userProfile.weeklyActivity.caloriesBurned.toLocaleString()}</div>
              <div>Active Min: {userProfile.weeklyActivity.activeMinutes}</div>
              <div>Sessions: {userProfile.weeklyActivity.exerciseSessions}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Fitness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{userProfile.fitnessScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
              <Progress value={userProfile.fitnessScore} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={healthRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Health Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="fitnessScore" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userProfile.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{rec.type}</Badge>
                  <Target className="h-4 w-4" />
                </div>
                <p className="text-sm mb-1">{rec.message}</p>
                <p className="text-xs text-muted-foreground">Target: {rec.target}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Services */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Insurance Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userProfile.insuranceServices.map((service, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{service.serviceName}</h4>
                  <div className="flex items-center gap-2">
                    <Badge>{service.category}</Badge>
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{service.relevanceScore}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Reward: {service.rewardAmount} {service.rewardType}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Similar Users */}
      <Card>
        <CardHeader>
          <CardTitle>Similar Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {similarUsers.map((userId) => (
              <Badge key={userId} variant="outline">{userId}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Users with similar fitness profiles and activity patterns
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const InsuranceAnalytics = () => (
    <div className="space-y-6">
      {/* Insurance Provider Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Insurance Provider Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insuranceProviders}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                  label={({ name, users }) => `${name}: ${users}`}
                >
                  {insuranceProviders.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Categories Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="popularity" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Provider Details */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Provider Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Provider</th>
                  <th className="text-left p-2">Users</th>
                  <th className="text-left p-2">Avg Bonus</th>
                  <th className="text-left p-2">Services</th>
                  <th className="text-left p-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {insuranceProviders.map((provider, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{provider.name}</td>
                    <td className="p-2">{provider.users}</td>
                    <td className="p-2">{provider.bonus}</td>
                    <td className="p-2">{provider.services}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {provider.rating}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Service Categories Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Service Categories Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCategories.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{category.category}</h4>
                <div className="space-y-1 text-sm">
                  <div>Services: {category.count}</div>
                  <div>Popularity: {category.popularity}/10</div>
                  <div>Avg Reward: €{category.avgReward}</div>
                </div>
                <Progress value={category.popularity * 10} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BewegungsLiga+ Analytics</h1>
          <p className="text-gray-600">Comprehensive fitness and health insurance analytics dashboard</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clusters" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              User Clusters
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              User Analytics
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Insurance
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">
              <OverviewDashboard />
            </TabsContent>

            <TabsContent value="clusters">
              <ClusterAnalysis />
            </TabsContent>

            <TabsContent value="users">
              <UserAnalytics />
            </TabsContent>

            <TabsContent value="insurance">
              <InsuranceAnalytics />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DataAnalytics;
