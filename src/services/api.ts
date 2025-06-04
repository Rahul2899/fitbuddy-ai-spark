// src/services/api.ts
import { UserProfileResponse } from '@/types/fitness';

// FIXED: Remove /api from base URL
const API_BASE = 'http://localhost:5000';

export interface UserProfile {
  user_id: string;
  basic_info: {
    age: number;
    gender: string;
    city: string;
    fitness_level: string;
  };
  health_metrics: {
    bmi: number;
    resting_heart_rate: number;
    blood_pressure: string;
    medical_conditions: string;
    insurance_provider: string;
  };
  weekly_activity: {
    total_steps: number;
    calories_burned: number;
    active_minutes: number;
    exercise_sessions: number;
    sleep_hours: number;
  };
  fitness_score: number;
}

export const apiService = {
  getUserProfile: async (userId: string): Promise<UserProfileResponse> => {
    try {
      console.log(`🔍 Fetching profile for user: ${userId}`);
      
      // FIXED: Use correct endpoint that matches our Python API
      const url = `${API_BASE}/user/${userId}`;
      console.log(`📡 API URL: ${url}`);
      
      const response = await fetch(url);
      console.log(`📊 Response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`❌ API request failed with status: ${response.status}`);
        return { error: 'Failed to fetch user profile' };
      }
      
      const data = await response.json();
      console.log(`✅ API Response:`, data);
      
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      return { error: 'Failed to fetch user profile' };
    }
  },
   
  getUserRecommendations: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/user/${userId}/recommendations`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    } catch (error) {
      console.error('❌ Recommendations Error:', error);
      throw error;
    }
  },

  // NEW: Add the missing generateUserData function
  generateUserData: async (userId: string, profileData: any) => {
    try {
      console.log(`🔄 Generating data for user: ${userId}`);
      console.log(`👤 User info:`, {
        name: `${profileData.firstName} ${profileData.lastName}`,
        city: profileData.city,
        occupation: profileData.occupation
      });
      
      const url = `${API_BASE}/generate-csv`;
      console.log(`📡 Generate URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          age: profileData.age,
          gender: profileData.gender,
          fitnessLevel: profileData.fitnessLevel,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          city: profileData.city || '',
          occupation: profileData.occupation || ''
        }),
      });

      console.log(`📊 Generate Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Generate Response Data:`, data);
      
      return data;
    } catch (error) {
      console.error('❌ Generate Error:', error);
      return { error: 'Failed to generate user data' };
    }
  },

  // NEW: Add health check for debugging
  healthCheck: async () => {
    try {
      const url = `${API_BASE}/health`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('🏥 Health check:', data);
      return data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { error: 'Health check failed' };
    }
  }
};