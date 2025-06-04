#!/usr/bin/env python3
"""
Individual User Analytics and Tracking System
Provides personalized insights, progress tracking, and recommendations for individual users
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings('ignore')

class UserAnalytics:
    def __init__(self):
        self.master_df = None
        self.scaler = StandardScaler()
        self.clustering_model = None
        self.cluster_labels = None
        self.user_features = None
        
    def load_and_prepare_data(self):
        """Load all datasets and combine them into master dataset"""
        print("Loading datasets...")
        
        # Load individual datasets
        demo_df = pd.read_csv('attached_assets/users_demographic.csv')
        physical_df = pd.read_csv('attached_assets/users_physical.csv')
        activity_df = pd.read_csv('attached_assets/users_activity_weekly.csv')
        insurance_df = pd.read_csv('attached_assets/insurance_providers.csv')
        services_df = pd.read_csv('attached_assets/insurance_services.csv')
        
        
        # Combine datasets
        master_df = demo_df.merge(physical_df, on='user_id')
        master_df = master_df.merge(activity_df, on='user_id')
        
        # Add insurance provider details
        insurance_mapping = insurance_df.set_index('provider_name')['provider_id'].to_dict()
        master_df['provider_id'] = master_df['current_insurance_provider'].map(insurance_mapping)
        
        # Remove unnecessary columns for analysis
        columns_to_remove = [
            'first_name', 'last_name', 'email', 'phone', 'postal_code',
            'last_medical_checkup', 'week_start_date', 'nationality',
            'education_level', 'occupation'
        ]
        
        # Only remove columns that exist
        columns_to_remove = [col for col in columns_to_remove if col in master_df.columns]
        master_df = master_df.drop(columns=columns_to_remove)
        
        # Encode categorical variables
        master_df = self._encode_categorical_features(master_df)
        
        self.master_df = master_df
        self.services_df = services_df
        self.insurance_df = insurance_df
        
        print(f"Master dataset created with {len(master_df)} users and {len(master_df.columns)} features")
        return master_df
    
    def _encode_categorical_features(self, df):
        """Encode categorical features for ML algorithms"""
        # Fitness level encoding
        fitness_map = {'Beginner': 0, 'Intermediate': 1, 'Advanced': 2}
        df['fitness_level_encoded'] = df['fitness_level'].map(fitness_map)
        
        # Gender encoding
        gender_map = {'Male': 0, 'Female': 1}
        df['gender_encoded'] = df['gender'].map(gender_map)
        
        # Smoking status encoding
        smoking_map = {'Non-smoker': 0, 'Ex-smoker': 1, 'Smoker': 2}
        df['smoking_encoded'] = df['smoking_status'].map(smoking_map)
        
        # Alcohol consumption encoding
        alcohol_map = {'Low': 0, 'Moderate': 1, 'High': 2}
        df['alcohol_encoded'] = df['alcohol_consumption'].map(alcohol_map)
        
        # Medical conditions binary encoding
        df['has_medical_condition'] = (df['medical_conditions'] != 'None').astype(int)
        
        return df
    
    def get_user_profile_summary(self, user_id):
        """Get comprehensive user profile summary"""
        if self.master_df is None:
            self.load_and_prepare_data()
            
        user_data = self.master_df[self.master_df['user_id'] == user_id]
        
        if user_data.empty:
            return {"error": f"User {user_id} not found"}
        
        user = user_data.iloc[0]
        
        profile = {
            "user_id": user_id,
            "basic_info": {
                "age": int(user['age']),
                "gender": user['gender'],
                "city": user['city'],
                "fitness_level": user['fitness_level']
            },
            "health_metrics": {
                "bmi": round(user['bmi'], 1),
                "resting_heart_rate": int(user['resting_heart_rate']),
                "blood_pressure": f"{int(user['blood_pressure_systolic'])}/{int(user['blood_pressure_diastolic'])}",
                "medical_conditions": user['medical_conditions'],
                "insurance_provider": user['current_insurance_provider']
            },
            "weekly_activity": {
                "total_steps": int(user['total_steps']),
                "calories_burned": int(user['total_calories_burned']),
                "active_minutes": int(user['total_active_minutes']),
                "exercise_sessions": int(user['exercise_sessions']),
                "sleep_hours": round(user['sleep_hours_total'], 1)
            },
            "fitness_score": self._calculate_fitness_score(user)
        }
        
        return profile
    
    def _calculate_fitness_score(self, user_data):
        """Calculate overall fitness score (0-100)"""
        score = 0
        
        # Activity score (40% weight)
        steps_score = min(user_data['total_steps'] / 70000 * 40, 40)
        
        # Health metrics score (30% weight)
        bmi_score = 30 if 18.5 <= user_data['bmi'] <= 24.9 else 15
        hr_score = 30 if 60 <= user_data['resting_heart_rate'] <= 75 else 15
        health_score = (bmi_score + hr_score) / 2
        
        # Lifestyle score (30% weight)
        sleep_score = 15 if 7 <= user_data['sleep_hours_avg'] <= 9 else 7
        exercise_score = min(user_data['exercise_frequency_per_week'] / 5 * 15, 15)
        lifestyle_score = sleep_score + exercise_score
        
        total_score = steps_score + health_score + lifestyle_score
        return round(total_score, 1)
    
    def create_user_dashboard(self, user_id, save_path=None):
        """Create comprehensive user dashboard with multiple visualizations"""
        profile = self.get_user_profile_summary(user_id)
        
        if "error" in profile:
            print(profile["error"])
            return
        
        # Create subplots
        fig = make_subplots(
            rows=3, cols=2,
            subplot_titles=[
                'Weekly Activity Overview', 'Health Metrics Radar',
                'Activity Breakdown', 'Progress Trends',
                'Fitness Score', 'Sleep & Recovery'
            ],
            specs=[
                [{"type": "bar"}, {"type": "scatterpolar"}],
                [{"type": "pie"}, {"type": "scatter"}],
                [{"type": "indicator"}, {"type": "bar"}]
            ]
        )
        
        # 1. Weekly Activity Overview (Bar Chart)
        activity_metrics = ['Steps', 'Calories', 'Active Min', 'Sessions']
        activity_values = [
            profile['weekly_activity']['total_steps'],
            profile['weekly_activity']['calories_burned'],
            profile['weekly_activity']['active_minutes'],
            profile['weekly_activity']['exercise_sessions'] * 1000  # Scale for visibility
        ]
        
        fig.add_trace(
            go.Bar(x=activity_metrics, y=activity_values, name="Activity"),
            row=1, col=1
        )
        
        # 2. Health Metrics Radar Chart
        health_categories = ['BMI', 'Heart Rate', 'Sleep', 'Activity', 'Overall']
        health_scores = [
            100 if 18.5 <= profile['health_metrics']['bmi'] <= 24.9 else 60,
            100 if 60 <= profile['health_metrics']['resting_heart_rate'] <= 75 else 70,
            100 if 7 <= profile['weekly_activity']['sleep_hours'] <= 9 else 70,
            min(profile['weekly_activity']['total_steps'] / 500, 100),
            profile['fitness_score']
        ]
        
        fig.add_trace(
            go.Scatterpolar(
                r=health_scores,
                theta=health_categories,
                fill='toself',
                name='Health Metrics'
            ),
            row=1, col=2
        )
        
        # 3. Activity Breakdown (Pie Chart)
        user_data = self.master_df[self.master_df['user_id'] == user_id].iloc[0]
        activity_breakdown = {
            'Walking': user_data['walking_distance_km'],
            'Running': user_data['running_distance_km'],
            'Cycling': user_data['cycling_distance_km']
        }
        
        fig.add_trace(
            go.Pie(
                labels=list(activity_breakdown.keys()),
                values=list(activity_breakdown.values()),
                name="Activity Types"
            ),
            row=2, col=1
        )
        
        # 4. Progress Trends (Mock weekly data)
        weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        steps_trend = [
            profile['weekly_activity']['total_steps'] * 0.8,
            profile['weekly_activity']['total_steps'] * 0.9,
            profile['weekly_activity']['total_steps'] * 0.95,
            profile['weekly_activity']['total_steps']
        ]
        
        fig.add_trace(
            go.Scatter(x=weeks, y=steps_trend, mode='lines+markers', name="Steps Trend"),
            row=2, col=2
        )
        
        # 5. Fitness Score Gauge
        fig.add_trace(
            go.Indicator(
                mode="gauge+number+delta",
                value=profile['fitness_score'],
                domain={'x': [0, 1], 'y': [0, 1]},
                title={'text': "Fitness Score"},
                gauge={
                    'axis': {'range': [None, 100]},
                    'bar': {'color': "darkblue"},
                    'steps': [
                        {'range': [0, 50], 'color': "lightgray"},
                        {'range': [50, 80], 'color': "yellow"},
                        {'range': [80, 100], 'color': "green"}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': 90
                    }
                }
            ),
            row=3, col=1
        )
        
        # 6. Sleep & Recovery
        sleep_data = ['Deep Sleep', 'Light Sleep', 'Awake']
        sleep_hours = profile['weekly_activity']['sleep_hours']
        sleep_values = [sleep_hours * 0.3, sleep_hours * 0.6, sleep_hours * 0.1]
        
        fig.add_trace(
            go.Bar(x=sleep_data, y=sleep_values, name="Sleep Breakdown"),
            row=3, col=2
        )
        
        # Update layout
        fig.update_layout(
            height=1200,
            title_text=f"User Dashboard - {user_id}",
            showlegend=False
        )
        
        if save_path:
            fig.write_html(save_path)
        
        fig.show()
        return fig
    
    def track_user_progress(self, user_id, weeks_back=4):
        """Track user progress over time (mock implementation for demo)"""
        profile = self.get_user_profile_summary(user_id)
        
        if "error" in profile:
            return profile
        
        # Generate mock historical data
        current_stats = profile['weekly_activity']
        
        progress_data = []
        for week in range(weeks_back, 0, -1):
            # Simulate progressive improvement
            improvement_factor = 0.8 + (weeks_back - week) * 0.05
            
            week_data = {
                'week': f"Week -{week}",
                'steps': int(current_stats['total_steps'] * improvement_factor),
                'calories': int(current_stats['calories_burned'] * improvement_factor),
                'active_minutes': int(current_stats['active_minutes'] * improvement_factor),
                'fitness_score': round(profile['fitness_score'] * improvement_factor, 1)
            }
            progress_data.append(week_data)
        
        # Add current week
        progress_data.append({
            'week': 'Current',
            'steps': current_stats['total_steps'],
            'calories': current_stats['calories_burned'],
            'active_minutes': current_stats['active_minutes'],
            'fitness_score': profile['fitness_score']
        })
        
        return progress_data
    
    def get_user_recommendations(self, user_id):
        """Get personalized recommendations for user"""
        if self.master_df is None:
            self.load_and_prepare_data()
        
        user_data = self.master_df[self.master_df['user_id'] == user_id]
        if user_data.empty:
            return {"error": f"User {user_id} not found"}
        
        user = user_data.iloc[0]
        recommendations = {
            "activity_recommendations": self._get_activity_recommendations(user),
            "health_recommendations": self._get_health_recommendations(user),
            "insurance_services": self._get_insurance_service_recommendations(user)
        }
        
        return recommendations
    
    def _get_activity_recommendations(self, user):
        """Generate activity recommendations based on user profile"""
        recommendations = []
        
        if user['total_steps'] < 40000:
            recommendations.append({
                "type": "steps",
                "message": "Try to increase daily steps by 2000. Consider taking walking breaks every hour.",
                "target": "45000+ steps per week"
            })
        
        if user['exercise_sessions'] < 3:
            recommendations.append({
                "type": "exercise",
                "message": "Add 1-2 more exercise sessions per week for better fitness.",
                "target": "4-5 sessions per week"
            })
        
        if user['total_active_minutes'] < 150:
            recommendations.append({
                "type": "activity",
                "message": "Increase active minutes to meet WHO recommendations.",
                "target": "150+ minutes per week"
            })
        
        return recommendations
    
    def _get_health_recommendations(self, user):
        """Generate health recommendations based on user metrics"""
        recommendations = []
        
        if user['bmi'] > 25:
            recommendations.append({
                "type": "weight",
                "message": "Consider consulting a nutritionist for healthy weight management.",
                "target": "BMI 18.5-24.9"
            })
        
        if user['resting_heart_rate'] > 80:
            recommendations.append({
                "type": "cardio",
                "message": "Focus on cardiovascular exercises to improve heart health.",
                "target": "Resting HR 60-75 bpm"
            })
        
        if user['sleep_hours_avg'] < 7:
            recommendations.append({
                "type": "sleep",
                "message": "Prioritize sleep hygiene for better recovery and health.",
                "target": "7-9 hours per night"
            })
        
        return recommendations
    
    def _get_insurance_service_recommendations(self, user):
        """Get insurance service recommendations based on user profile"""
        user_provider = user['current_insurance_provider']
        provider_id = user.get('provider_id')
        
        if not provider_id:
            return []
        
        # Get services for user's insurance provider
        provider_services = self.services_df[
            self.services_df['provider_id'] == provider_id
        ].copy()
        
        if provider_services.empty:
            return []
        
        # Score services based on user profile
        provider_services['user_relevance_score'] = provider_services.apply(
            lambda service: self._calculate_service_relevance(user, service), axis=1
        )
        
        # Get top 2 recommendations
        top_services = provider_services.nlargest(2, 'user_relevance_score')
        
        recommendations = []
        for _, service in top_services.iterrows():
            recommendations.append({
                "service_name": service['service_name'],
                "category": service['category'],
                "description": service['description'],
                "reward_amount": service['reward_amount'],
                "reward_type": service['reward_type'],
                "relevance_score": round(service['user_relevance_score'], 2),
                "eligibility": service['eligibility_criteria']
            })
        
        return recommendations
    
    def _calculate_service_relevance(self, user, service):
        """Calculate how relevant a service is for a specific user"""
        score = service['popularity_score']  # Base score
        
        # Fitness-related services
        if service['category'] == 'Fitness':
            if user['fitness_level'] in ['Intermediate', 'Advanced']:
                score += 2
            if user['total_steps'] > 50000:
                score += 1
        
        # Prevention services
        elif service['category'] == 'Prevention':
            if user['age'] > 40:
                score += 2
            if user['has_medical_condition']:
                score += 1.5
        
        # Mental health services
        elif service['category'] == 'Mental Health':
            if user['stress_level_avg'] > 4:
                score += 2
            if user['sleep_hours_avg'] < 7:
                score += 1
        
        # Wellness services
        elif service['category'] == 'Wellness':
            score += 1  # Generally applicable
        
        # Family services
        elif service['category'] == 'Family Health':
            if user['age'] < 45:  # Likely family age
                score += 1.5
        
        # Digital services preference (younger users)
        if service.get('digital_app_required') and user['age'] < 40:
            score += 0.5
        
        return score
    
    def visualize_user_vs_similar_users(self, user_id, n_similar=5):
        """Compare user with similar users in their cluster"""
        if self.master_df is None:
            self.load_and_prepare_data()
        
        similar_users = self.find_similar_users(user_id, n_similar)
        
        if not similar_users:
            print(f"No similar users found for {user_id}")
            return
        
        # Get comparison metrics
        metrics = ['total_steps', 'total_calories_burned', 'total_active_minutes', 'fitness_score']
        user_data = self.master_df[self.master_df['user_id'] == user_id].iloc[0]
        
        # Prepare data for comparison
        comparison_data = {
            'User': user_id,
            'Steps': user_data['total_steps'],
            'Calories': user_data['total_calories_burned'],
            'Active_Min': user_data['total_active_minutes'],
            'Fitness_Score': self._calculate_fitness_score(user_data)
        }
        
        similar_data = []
        for similar_user_id in similar_users:
            similar_user_data = self.master_df[self.master_df['user_id'] == similar_user_id].iloc[0]
            similar_data.append({
                'User': similar_user_id,
                'Steps': similar_user_data['total_steps'],
                'Calories': similar_user_data['total_calories_burned'],
                'Active_Min': similar_user_data['total_active_minutes'],
                'Fitness_Score': self._calculate_fitness_score(similar_user_data)
            })
        
        # Create visualization
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle(f'User {user_id} vs Similar Users Comparison', fontsize=16)
        
        metrics_to_plot = [
            ('Steps', 'total_steps'),
            ('Calories', 'total_calories_burned'),
            ('Active Minutes', 'total_active_minutes'),
            ('Fitness Score', 'fitness_score')
        ]
        
        for idx, (title, metric_key) in enumerate(metrics_to_plot):
            row, col = idx // 2, idx % 2
            ax = axes[row, col]
            
            # Plot similar users
            similar_values = [data[title.replace(' ', '_')] for data in similar_data]
            user_value = comparison_data[title.replace(' ', '_')]
            
            ax.bar(range(len(similar_values)), similar_values, alpha=0.7, color='lightblue', label='Similar Users')
            ax.axhline(y=user_value, color='red', linestyle='--', linewidth=2, label=f'Your {title}')
            
            ax.set_title(f'{title} Comparison')
            ax.set_ylabel(title)
            ax.set_xlabel('Similar Users')
            ax.legend()
            ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()
        
        return comparison_data, similar_data
    
    def find_similar_users(self, user_id, n_similar=5):
        """Find similar users based on profile characteristics"""
        if self.master_df is None:
            self.load_and_prepare_data()
        
        # Features for similarity calculation
        similarity_features = [
            'age', 'bmi', 'fitness_level_encoded', 'total_steps',
            'total_calories_burned', 'exercise_frequency_per_week',
            'resting_heart_rate', 'sleep_hours_avg'
        ]
        
        # Prepare data
        X = self.master_df[similarity_features].fillna(self.master_df[similarity_features].mean())
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Calculate similarities
        similarity_matrix = cosine_similarity(X_scaled)
        
        # Find user index
        user_idx = self.master_df[self.master_df['user_id'] == user_id].index
        if len(user_idx) == 0:
            return []
        
        user_idx = user_idx[0]
        user_similarities = similarity_matrix[user_idx]
        
        # Get most similar users (excluding self)
        similar_indices = np.argsort(user_similarities)[::-1][1:n_similar+1]
        similar_user_ids = self.master_df.iloc[similar_indices]['user_id'].tolist()
        
        return similar_user_ids

# Example usage functions
def demo_user_analytics():
    """Demonstrate user analytics functionality"""
    analytics = UserAnalytics()
    
    # Load data
    analytics.load_and_prepare_data()
    
    # Demo with user USR001
    user_id = "USR001"
    
    print("=== USER PROFILE SUMMARY ===")
    profile = analytics.get_user_profile_summary(user_id)
    print(f"User: {profile['basic_info']}")
    print(f"Health: {profile['health_metrics']}")
    print(f"Activity: {profile['weekly_activity']}")
    print(f"Fitness Score: {profile['fitness_score']}/100")
    
    print("\n=== USER RECOMMENDATIONS ===")
    recommendations = analytics.get_user_recommendations(user_id)
    for rec_type, recs in recommendations.items():
        print(f"\n{rec_type.upper()}:")
        for rec in recs:
            if isinstance(rec, dict):
                if 'message' in rec:
                    print(f"- {rec['message']}")
                elif 'service_name' in rec:
                    print(f"- {rec['service_name']}: {rec['description']}")
    
    print("\n=== PROGRESS TRACKING ===")
    progress = analytics.track_user_progress(user_id)
    for week_data in progress:
        print(f"{week_data['week']}: {week_data['steps']} steps, "
              f"{week_data['calories']} calories, Score: {week_data['fitness_score']}")
    
    print("\n=== SIMILAR USERS ===")
    similar_users = analytics.find_similar_users(user_id, 3)
    print(f"Users similar to {user_id}: {similar_users}")
    
    # Create dashboard
    print("\n=== Creating User Dashboard ===")
    analytics.create_user_dashboard(user_id)

if __name__ == "__main__":
    demo_user_analytics()