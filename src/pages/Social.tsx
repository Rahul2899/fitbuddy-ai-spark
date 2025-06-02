
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Trophy, Users, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Social = () => {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      user: { name: "Sarah Chen", avatar: "", level: 15 },
      type: "workout",
      content: "Just crushed a 45-minute HIIT session! 💪 Feeling stronger every day!",
      workout: { name: "HIIT Cardio", duration: "45 min", calories: 380 },
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      user: { name: "Mike Johnson", avatar: "", level: 12 },
      type: "achievement",
      content: "Finally hit my goal of 50 push-ups in a row! 🎉",
      achievement: { name: "Push-up Master", points: 500 },
      likes: 18,
      comments: 5,
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      user: { name: "Emma Wilson", avatar: "", level: 18 },
      type: "progress",
      content: "30-day transformation update! Consistency is key 🔥",
      progress: { before: "Day 1", after: "Day 30", improvement: "Lost 8 lbs, gained muscle" },
      likes: 42,
      comments: 15,
      timestamp: "6 hours ago"
    }
  ];

  const challenges = [
    { id: 1, name: "30-Day Plank Challenge", participants: 156, daysLeft: 12 },
    { id: 2, name: "10K Steps Daily", participants: 89, daysLeft: 5 },
    { id: 3, name: "Hydration Hero", participants: 203, daysLeft: 18 }
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Rivera", points: 4250, level: 20 },
    { rank: 2, name: "Jordan Kim", points: 3980, level: 19 },
    { rank: 3, name: "Sam Taylor", points: 3760, level: 18 },
    { rank: 4, name: "You", points: 2840, level: 12 },
    { rank: 5, name: "Casey Brown", points: 2650, level: 11 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8" />
                Social Feed
              </h1>
              <p className="text-gray-600 mt-2">Connect with your fitness community</p>
            </div>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
              <Share className="w-4 h-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>See what your fitness friends are up to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                            {post.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{post.user.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Level {post.user.level}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{post.timestamp}</p>
                        </div>
                      </div>

                      <p className="mb-3">{post.content}</p>

                      {post.type === 'workout' && post.workout && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{post.workout.name}</span>
                            <div className="text-sm text-gray-600">
                              {post.workout.duration} • {post.workout.calories} cal
                            </div>
                          </div>
                        </div>
                      )}

                      {post.type === 'achievement' && post.achievement && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium">{post.achievement.name}</span>
                            <Badge className="bg-yellow-600">+{post.achievement.points} pts</Badge>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-gray-600">
                        <button className="flex items-center gap-1 hover:text-pink-600">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Leaderboard
                </CardTitle>
                <CardDescription>This week's top performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        user.name === 'You' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <p className={`font-medium ${user.name === 'You' ? 'text-blue-800' : ''}`}>
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600">Level {user.level}</p>
                        </div>
                      </div>
                      <span className="font-semibold">{user.points.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Join community challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium mb-2">{challenge.name}</h4>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>{challenge.participants} participants</span>
                        <span>{challenge.daysLeft} days left</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Join Challenge
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
