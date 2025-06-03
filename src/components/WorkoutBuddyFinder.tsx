
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, MessageCircle, Calendar, Filter, Search } from 'lucide-react';

interface WorkoutBuddy {
  id: string;
  name: string;
  avatar: string;
  distance: number;
  fitnessLevel: string;
  preferredWorkouts: string[];
  availability: string[];
  rating: number;
  bio: string;
  location: string;
}

const WorkoutBuddyFinder = () => {
  const [searchRadius, setSearchRadius] = useState(5);
  const [workoutType, setWorkoutType] = useState('');
  const [buddies, setBuddies] = useState<WorkoutBuddy[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockBuddies: WorkoutBuddy[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '',
      distance: 1.2,
      fitnessLevel: 'Intermediate',
      preferredWorkouts: ['Running', 'Yoga', 'Strength Training'],
      availability: ['Morning', 'Evening'],
      rating: 4.8,
      bio: 'Fitness enthusiast looking for running partners!',
      location: 'Downtown Gym'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: '',
      distance: 2.8,
      fitnessLevel: 'Advanced',
      preferredWorkouts: ['CrossFit', 'Boxing', 'Cycling'],
      availability: ['Evening', 'Weekend'],
      rating: 4.9,
      bio: 'CrossFit coach available for training sessions.',
      location: 'FitZone CrossFit'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: '',
      distance: 0.8,
      fitnessLevel: 'Beginner',
      preferredWorkouts: ['Walking', 'Swimming', 'Pilates'],
      availability: ['Morning', 'Afternoon'],
      rating: 4.6,
      bio: 'New to fitness, looking for supportive workout partners.',
      location: 'Community Center'
    },
    {
      id: '4',
      name: 'David Park',
      avatar: '',
      distance: 4.2,
      fitnessLevel: 'Intermediate',
      preferredWorkouts: ['Basketball', 'Running', 'Weightlifting'],
      availability: ['Evening', 'Weekend'],
      rating: 4.7,
      bio: 'Basketball player seeking training partners.',
      location: 'Sports Complex'
    }
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          findNearbyBuddies();
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use mock data even without location
          findNearbyBuddies();
          setIsLoading(false);
        }
      );
    } else {
      findNearbyBuddies();
      setIsLoading(false);
    }
  };

  const findNearbyBuddies = () => {
    // Filter buddies based on search criteria
    let filteredBuddies = mockBuddies.filter(buddy => buddy.distance <= searchRadius);
    
    if (workoutType) {
      filteredBuddies = filteredBuddies.filter(buddy => 
        buddy.preferredWorkouts.some(workout => 
          workout.toLowerCase().includes(workoutType.toLowerCase())
        )
      );
    }

    setBuddies(filteredBuddies);
  };

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      findNearbyBuddies();
      setIsLoading(false);
    }, 1000);
  };

  const sendMessage = (buddyId: string) => {
    console.log(`Sending message to buddy ${buddyId}`);
    // In real app, this would open a chat interface
  };

  const scheduleWorkout = (buddyId: string) => {
    console.log(`Scheduling workout with buddy ${buddyId}`);
    // In real app, this would open a scheduling interface
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Find Workout Buddies
          </CardTitle>
          <CardDescription>
            Connect with fitness enthusiasts in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Search Radius (km)</label>
              <Input
                type="number"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Workout Type</label>
              <Input
                placeholder="e.g., Running, Yoga, CrossFit"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Searching...' : 'Find Buddies'}
              </Button>
            </div>
          </div>

          {userLocation && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Location enabled - showing nearby workout buddies</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buddies.map((buddy) => (
          <Card key={buddy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {buddy.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{buddy.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{buddy.distance} km away</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{buddy.fitnessLevel}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{buddy.bio}</p>
              
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-xs font-medium text-gray-500">PREFERRED WORKOUTS</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {buddy.preferredWorkouts.slice(0, 3).map((workout, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {workout}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-gray-500">AVAILABILITY</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {buddy.availability.map((time, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-500">LOCATION:</span>
                  <span className="text-xs">{buddy.location}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendMessage(buddy.id)}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button
                  size="sm"
                  onClick={() => scheduleWorkout(buddy.id)}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {buddies.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No workout buddies found</h3>
            <p className="text-gray-600 mb-4">
              Try expanding your search radius or adjusting your workout preferences.
            </p>
            <Button onClick={handleSearch}>
              <Filter className="w-4 h-4 mr-2" />
              Adjust Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutBuddyFinder;
