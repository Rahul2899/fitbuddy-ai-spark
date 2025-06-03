import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Plus, Users, Flame, Calendar, Trophy, TrendingUp, Crown, Medal, Target, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WorkoutBuddyFinder from '@/components/WorkoutBuddyFinder';

interface SocialPost {
  id: string;
  content: string;
  user_id: string;
  likes_count: number;
  created_at: string;
  image_url?: string;
  profiles?: {
    display_name: string;
    username: string;
  };
}

const Social = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles (
            display_name,
            username
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load social posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          content: newPost.trim()
        });

      if (error) throw error;

      setNewPost('');
      await fetchPosts(); // Refresh posts

      toast({
        title: "Posted!",
        description: "Your post has been shared with the community",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId: string, currentLikes: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

      // Refresh posts to get updated like counts
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const communityStats = [
    { label: 'Aktive Mitglieder', value: '12.547', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { label: 'Teams in Bayern', value: '1.284', icon: Trophy, color: 'from-amber-500 to-orange-600' },
    { label: 'Wöchentliche Challenges', value: '47', icon: Target, color: 'from-green-500 to-emerald-600' },
    { label: 'Erfolgsgeschichten', value: '3.892', icon: TrendingUp, color: 'from-purple-500 to-violet-600' }
  ];

  const recentActivity = [
    {
      user: 'Maria S.',
      action: 'hat die Bayern Winter Challenge gewonnen! 🏆',
      time: 'vor 2 Stunden',
      region: 'München',
      badge: '🥇'
    },
    {
      user: 'Team Alpenstürmer',
      action: 'ist in Liga 1 aufgestiegen! 🚀',
      time: 'vor 4 Stunden',
      region: 'Garmisch',
      badge: '⭐'
    },
    {
      user: 'Thomas K.',
      action: 'hat seinen 30-Tage Streak erreicht! 🔥',
      time: 'vor 6 Stunden',
      region: 'Nürnberg',
      badge: '🔥'
    },
    {
      user: 'Fitness Freunde',
      action: 'lädt zum Gruppenlauf in Augsburg ein',
      time: 'vor 8 Stunden',
      region: 'Augsburg',
      badge: '👟'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 p-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Community & Liga
              </h1>
              <p className="text-gray-600 mt-2">Verbinde dich mit der Bayern Fitness-Community</p>
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
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {communityStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Community Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Flame className="w-7 h-7 text-orange-500" />
              Community Activity
            </CardTitle>
            <CardDescription>Was passiert gerade in der Bayern Fitness-Community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{activity.badge}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        <span className="font-bold text-blue-600">{activity.user}</span> {activity.action}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.region}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Post */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Share Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your workout achievements, motivation, or tips with the community..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{newPost.length}/500 characters</p>
                <Button 
                  onClick={createPost}
                  disabled={!newPost.trim() || posting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {posting ? "Posting..." : "Share Post"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="w-6 h-6 text-blue-600" />
                Trainingspartner finden
              </CardTitle>
              <CardDescription>Verbinde dich mit Leuten in deiner Nähe</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                Partner finden
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="w-6 h-6 text-amber-600" />
                Wettkämpfe beitreten
              </CardTitle>
              <CardDescription>Nimm an Community-Challenges teil</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                onClick={() => navigate('/competitions')}
              >
                Wettkämpfe ansehen
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageCircle className="w-6 h-6 text-green-600" />
                Community-Gruppen
              </CardTitle>
              <CardDescription>Tritt Fitness-Gruppen in deiner Nähe bei</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                Gruppen erkunden
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* League Promotion */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 to-violet-100 border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Crown className="w-8 h-8 text-purple-600" />
              Steige in der Liga auf!
            </CardTitle>
            <CardDescription className="text-lg">
              Du stehst aktuell auf Platz #3 in der Bayern Winter Liga
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 mb-4">
                  Noch <strong>89 Punkte</strong> bis zur nächsten Liga. 
                  Schließe mehr Challenges ab und klettere die Rangliste hoch!
                </p>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-violet-700"
                  onClick={() => navigate('/competitions')}
                >
                  Liga-Tabelle anzeigen
                </Button>
              </div>
              <div className="text-6xl">🏆</div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to share your fitness journey with the community!
                </p>
                <Button 
                  onClick={() => navigate('/workout-start')}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  Start a Workout
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {post.profiles?.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {post.profiles?.display_name || 'Anonymous User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{post.profiles?.username || 'user'} • {formatTimeAgo(post.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt="Post image" 
                      className="w-full rounded-lg mb-4"
                    />
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id, post.likes_count)}
                      className="flex items-center gap-2 hover:text-red-600"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likes_count}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comment</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Workout Buddy Finder Component */}
        <WorkoutBuddyFinder />
      </div>
    </div>
  );
};

export default Social;