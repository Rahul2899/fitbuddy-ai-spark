#!/usr/bin/env python3
"""
Admin Analytics and Dashboard System
Provides comprehensive insights, clustering analysis, and recommendation engine management
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
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import warnings
warnings.filterwarnings('ignore')

class AdminAnalytics:
    def __init__(self):
        self.master_df = None
        self.scaler = StandardScaler()
        self.clustering_model = None
        self.pca_model = None
        self.cluster_labels = None
        self.cluster_summary = None
        self.services_df = None
        self.insurance_df = None
        
    def load_and_prepare_data(self):
        """Load all datasets and combine them into master dataset"""
        print("Loading datasets...")
        
        # Load individual datasets
        demo_df = pd.read_csv('users_demographic.csv')
        physical_df = pd.read_csv('users_physical.csv')
        activity_df = pd.read_csv('users_activity_weekly.csv')
        insurance_df = pd.read_csv('insurance_providers.csv')
        services_df = pd.read_csv('insurance_services.csv')
        
        # Combine datasets
        master_df = demo_df.merge(physical_df, on='user_id')
        master_df = master_df.merge(activity_df, on='user_id')
        
        # Add insurance provider details
        insurance_mapping = insurance_df.set_index('provider_name')['provider_id'].to_dict()
        master_df['provider_id'] = master_df['current_insurance_provider'].map(insurance_mapping)
        
        # Remove unnecessary columns for clustering
        columns_to_remove = [
            'first_name', 'last_name', 'postal_code', 'last_medical_checkup',
            'week_start_date', 'nationality', 'education_level', 'occupation',
            'workout_types', 'allergies', 'medications', 'blood_type'
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
        
        # Income bracket encoding
        income_map = {
            '30000-35000': 32500, '35000-40000': 37500, '40000-50000': 45000,
            '50000-75000': 62500, '75000-100000': 87500, '100000+': 110000
        }
        df['income_numeric'] = df['income_bracket'].map(income_map)
        
        return df
    
    def perform_user_clustering(self, n_clusters=5, clustering_features=None):
        """Perform K-means clustering on user data"""
        if self.master_df is None:
            self.load_and_prepare_data()
        
        # Define clustering features if not provided
        if clustering_features is None:
            clustering_features = [
                'age', 'bmi', 'fitness_level_encoded', 'gender_encoded',
                'total_steps', 'total_calories_burned', 'total_active_minutes',
                'exercise_frequency_per_week', 'resting_heart_rate',
                'sleep_hours_avg', 'stress_level_avg', 'income_numeric',
                'has_medical_condition'
            ]
        
        # Filter features that exist in the dataset
        clustering_features = [f for f in clustering_features if f in self.master_df.columns]
        
        print(f"Clustering using features: {clustering_features}")
        
        # Prepare data
        X = self.master_df[clustering_features].fillna(self.master_df[clustering_features].mean())
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Perform clustering
        self.clustering_model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        cluster_labels = self.clustering_model.fit_predict(X_scaled)
        
        # Add cluster labels to dataframe
        self.master_df['cluster'] = cluster_labels
        self.cluster_labels = cluster_labels
        
        # Calculate silhouette score
        silhouette_avg = silhouette_score(X_scaled, cluster_labels)
        print(f"Clustering completed with {n_clusters} clusters")
        print(f"Silhouette Score: {silhouette_avg:.3f}")
        
        # Create cluster summary
        self._create_cluster_summary()
        
        # Perform PCA for visualization
        self.pca_model = PCA(n_components=2)
        X_pca = self.pca_model.fit_transform(X_scaled)
        self.master_df['pca_x'] = X_pca[:, 0]
        self.master_df['pca_y'] = X_pca[:, 1]
        
        return cluster_labels, silhouette_avg
    
    def _create_cluster_summary(self):
        """Create detailed summary of each cluster"""
        cluster_summary = {}
        
        for cluster_id in sorted(self.master_df['cluster'].unique()):
            cluster_data = self.master_df[self.master_df['cluster'] == cluster_id]
            
            summary = {
                'size': len(cluster_data),
                'percentage': round(len(cluster_data) / len(self.master_df) * 100, 1),
                'demographics': {
                    'avg_age': round(cluster_data['age'].mean(), 1),
                    'gender_distribution': cluster_data['gender'].value_counts().to_dict(),
                    'fitness_level_distribution': cluster_data['fitness_level'].value_counts().to_dict(),
                    'top_cities': cluster_data['city'].value_counts().head(3).to_dict()
                },
                'health_metrics': {
                    'avg_bmi': round(cluster_data['bmi'].mean(), 1),
                    'avg_resting_hr': round(cluster_data['resting_heart_rate'].mean(), 1),
                    'medical_conditions': cluster_data['medical_conditions'].value_counts().head(3).to_dict(),
                    'avg_sleep_hours': round(cluster_data['sleep_hours_avg'].mean(), 1)
                },
                'activity_metrics': {
                    'avg_steps': int(cluster_data['total_steps'].mean()),
                    'avg_calories': int(cluster_data['total_calories_burned'].mean()),
                    'avg_active_minutes': int(cluster_data['total_active_minutes'].mean()),
                    'avg_exercise_sessions': round(cluster_data['exercise_sessions'].mean(), 1)
                },
                'insurance_distribution': cluster_data['current_insurance_provider'].value_counts().to_dict()
            }
            
            # Generate cluster description
            summary['description'] = self._generate_cluster_description(summary)
            
            cluster_summary[f'Cluster_{cluster_id}'] = summary
        
        self.cluster_summary = cluster_summary
        return cluster_summary
    
    def _generate_cluster_description(self, summary):
        """Generate human-readable description for cluster"""
        avg_age = summary['demographics']['avg_age']
        dominant_fitness = max(summary['demographics']['fitness_level_distribution'], 
                             key=summary['demographics']['fitness_level_distribution'].get)
        avg_steps = summary['activity_metrics']['avg_steps']
        
        if avg_steps > 60000:
            activity_level = "highly active"
        elif avg_steps > 45000:
            activity_level = "moderately active"
        else:
            activity_level = "less active"
        
        age_group = "young adults" if avg_age < 30 else "middle-aged adults" if avg_age < 50 else "older adults"
        
        description = f"{dominant_fitness.lower()} fitness level {age_group} who are {activity_level}"
        
        return description
    
    def visualize_clusters(self, save_path=None):
        """Create comprehensive cluster visualizations"""
        if self.cluster_labels is None:
            print("Please run clustering first")
            return
        
        # Create subplots
        fig = make_subplots(
            rows=3, cols=2,
            subplot_titles=[
                'Cluster Distribution (PCA)', 'Cluster Sizes',
                'Age Distribution by Cluster', 'Activity Levels by Cluster',
                'Health Metrics by Cluster', 'Insurance Distribution'
            ],
            specs=[
                [{"type": "scatter"}, {"type": "pie"}],
                [{"type": "box"}, {"type": "bar"}],
                [{"type": "bar"}, {"type": "bar"}]
            ]
        )
        
        # 1. PCA Scatter Plot
        for cluster_id in sorted(self.master_df['cluster'].unique()):
            cluster_data = self.master_df[self.master_df['cluster'] == cluster_id]
            fig.add_trace(
                go.Scatter(
                    x=cluster_data['pca_x'],
                    y=cluster_data['pca_y'],
                    mode='markers',
                    name=f'Cluster {cluster_id}',
                    text=cluster_data['user_id'],
                    hovertemplate='User: %{text}<br>Cluster: ' + str(cluster_id)
                ),
                row=1, col=1
            )
        
        # 2. Cluster Sizes (Pie Chart)
        cluster_sizes = self.master_df['cluster'].value_counts().sort_index()
        fig.add_trace(
            go.Pie(
                labels=[f'Cluster {i}' for i in cluster_sizes.index],
                values=cluster_sizes.values,
                name="Cluster Sizes"
            ),
            row=1, col=2
        )
        
        # 3. Age Distribution by Cluster (Box Plot)
        for cluster_id in sorted(self.master_df['cluster'].unique()):
            cluster_data = self.master_df[self.master_df['cluster'] == cluster_id]
            fig.add_trace(
                go.Box(
                    y=cluster_data['age'],
                    name=f'Cluster {cluster_id}',
                    showlegend=False
                ),
                row=2, col=1
            )
        
        # 4. Activity Levels by Cluster (Bar Chart)
        cluster_activity = self.master_df.groupby('cluster')['total_steps'].mean()
        fig.add_trace(
            go.Bar(
                x=[f'Cluster {i}' for i in cluster_activity.index],
                y=cluster_activity.values,
                name="Average Steps",
                showlegend=False
            ),
            row=2, col=2
        )
        
        # 5. Health Metrics by Cluster (BMI)
        cluster_bmi = self.master_df.groupby('cluster')['bmi'].mean()
        fig.add_trace(
            go.Bar(
                x=[f'Cluster {i}' for i in cluster_bmi.index],
                y=cluster_bmi.values,
                name="Average BMI",
                showlegend=False
            ),
            row=3, col=1
        )
        
        # 6. Insurance Distribution
        insurance_dist = self.master_df['current_insurance_provider'].value_counts().head(5)
        fig.add_trace(
            go.Bar(
                x=insurance_dist.index,
                y=insurance_dist.values,
                name="Insurance Providers",
                showlegend=False
            ),
            row=3, col=2
        )
        
        # Update layout
        fig.update_layout(
            height=1200,
            title_text="User Clustering Analysis Dashboard",
            showlegend=True
        )
        
        if save_path:
            fig.write_html(save_path)
        
        fig.show()
        return fig
    
    def print_cluster_summary(self):
        """Print detailed cluster analysis"""
        if self.cluster_summary is None:
            print("Please run clustering first")
            return
        
        print("=== CLUSTER ANALYSIS SUMMARY ===\n")
        
        for cluster_name, summary in self.cluster_summary.items():
            print(f"--- {cluster_name.upper()} ---")
            print(f"Description: {summary['description']}")
            print(f"Size: {summary['size']} users ({summary['percentage']}%)")
            
            print(f"\nDemographics:")
            print(f"  Average Age: {summary['demographics']['avg_age']} years")
            print(f"  Gender: {summary['demographics']['gender_distribution']}")
            print(f"  Fitness Levels: {summary['demographics']['fitness_level_distribution']}")
            
            print(f"\nHealth Metrics:")
            print(f"  Average BMI: {summary['health_metrics']['avg_bmi']}")
            print(f"  Average Resting HR: {summary['health_metrics']['avg_resting_hr']} bpm")
            print(f"  Average Sleep: {summary['health_metrics']['avg_sleep_hours']} hours")
            
            print(f"\nActivity Metrics:")
            print(f"  Average Steps: {summary['activity_metrics']['avg_steps']:,}")
            print(f"  Average Calories: {summary['activity_metrics']['avg_calories']:,}")
            print(f"  Average Active Minutes: {summary['activity_metrics']['avg_active_minutes']}")
            
            print(f"\nTop Insurance Providers:")
            for provider, count in list(summary['insurance_distribution'].items())[:3]:
                print(f"  {provider}: {count} users")
            
            print("\n" + "="*50 + "\n")
    
    def assign_new_user_to_cluster(self, new_user_data):
        """Assign a new user to the most appropriate cluster"""
        if self.clustering_model is None:
            print("Please run clustering first")
            return None
        
        # Ensure new user data has all required features
        clustering_features = [
            'age', 'bmi', 'fitness_level_encoded', 'gender_encoded',
            'total_steps', 'total_calories_burned', 'total_active_minutes',
            'exercise_frequency_per_week', 'resting_heart_rate',
            'sleep_hours_avg', 'stress_level_avg', 'income_numeric',
            'has_medical_condition'
        ]
        
        # Encode categorical features for new user
        new_user_encoded = self._encode_new_user_features(new_user_data)
        
        # Prepare feature vector
        feature_vector = []
        for feature in clustering_features:
            if feature in new_user_encoded:
                feature_vector.append(new_user_encoded[feature])
            else:
                # Use mean value from training data
                feature_vector.append(self.master_df[feature].mean())
        
        # Scale features
        feature_vector_scaled = self.scaler.transform([feature_vector])
        
        # Predict cluster
        predicted_cluster = self.clustering_model.predict(feature_vector_scaled)[0]
        
        # Get cluster characteristics
        cluster_info = self.cluster_summary.get(f'Cluster_{predicted_cluster}', {})
        
        result = {
            'predicted_cluster': predicted_cluster,
            'cluster_description': cluster_info.get('description', 'No description'),
            'cluster_size': cluster_info.get('size', 0),
            'confidence_score': self._calculate_assignment_confidence(feature_vector_scaled, predicted_cluster)
        }
        
        return result
    
    def _encode_new_user_features(self, user_data):
        """Encode categorical features for a new user"""
        encoded = user_data.copy()
        
        # Fitness level encoding
        fitness_map = {'Beginner': 0, 'Intermediate': 1, 'Advanced': 2}
        if 'fitness_level' in encoded:
            encoded['fitness_level_encoded'] = fitness_map.get(encoded['fitness_level'], 0)
        
        # Gender encoding
        gender_map = {'Male': 0, 'Female': 1}
        if 'gender' in encoded:
            encoded['gender_encoded'] = gender_map.get(encoded['gender'], 0)
        
        # Smoking status encoding
        smoking_map = {'Non-smoker': 0, 'Ex-smoker': 1, 'Smoker': 2}
        if 'smoking_status' in encoded:
            encoded['smoking_encoded'] = smoking_map.get(encoded['smoking_status'], 0)
        
        # Alcohol consumption encoding
        alcohol_map = {'Low': 0, 'Moderate': 1, 'High': 2}
        if 'alcohol_consumption' in encoded:
            encoded['alcohol_encoded'] = alcohol_map.get(encoded['alcohol_consumption'], 0)
        
        # Medical conditions binary encoding
        if 'medical_conditions' in encoded:
            encoded['has_medical_condition'] = 1 if encoded['medical_conditions'] != 'None' else 0
        
        # Income bracket encoding
        income_map = {
            '30000-35000': 32500, '35000-40000': 37500, '40000-50000': 45000,
            '50000-75000': 62500, '75000-100000': 87500, '100000+': 110000
        }
        if 'income_bracket' in encoded:
            encoded['income_numeric'] = income_map.get(encoded['income_bracket'], 50000)
        
        return encoded
    
    def _calculate_assignment_confidence(self, feature_vector_scaled, predicted_cluster):
        """Calculate confidence score for cluster assignment"""
        # Calculate distances to all cluster centers
        distances = []
        for center in self.clustering_model.cluster_centers_:
            distance = np.linalg.norm(feature_vector_scaled[0] - center)
            distances.append(distance)
        
        # Confidence is inversely related to distance to assigned cluster
        min_distance = min(distances)
        max_distance = max(distances)
        
        if max_distance == min_distance:
            return 1.0
        
        confidence = 1 - (distances[predicted_cluster] - min_distance) / (max_distance - min_distance)
        return round(confidence, 3)
    
    def build_recommendation_engine(self):
        """Build comprehensive recommendation engine"""
        if self.master_df is None:
            self.load_and_prepare_data()
        
        # Create user-service interaction matrix for collaborative filtering
        user_provider_matrix = pd.crosstab(
            self.master_df['user_id'], 
            self.master_df['current_insurance_provider']
        )
        
        # Calculate service popularity scores
        service_popularity = self.services_df.groupby('category')['popularity_score'].mean()
        
        # Create recommendation rules based on clusters
        recommendation_rules = {}
        
        for cluster_id in sorted(self.master_df['cluster'].unique()):
            cluster_data = self.master_df[self.master_df['cluster'] == cluster_id]
            
            # Analyze cluster characteristics
            avg_fitness = cluster_data['fitness_level_encoded'].mean()
            avg_age = cluster_data['age'].mean()
            avg_activity = cluster_data['total_calories_burned'].mean()
            has_conditions = cluster_data['has_medical_condition'].mean()
            
            # Define recommendation priorities
            rules = []
            
            if avg_fitness >= 1.5:  # Advanced users
                rules.append(('Fitness', 2.0))
                rules.append(('Wellness', 1.5))
            
            if avg_age >= 45:  # Older users
                rules.append(('Prevention', 2.0))
                rules.append(('Health Screening', 1.8))
            
            if has_conditions > 0.3:  # Many with medical conditions
                rules.append(('Chronic Care', 2.0))
                rules.append(('Prevention', 1.5))
            
            if avg_activity > 2500:  # Highly active
                rules.append(('Fitness', 1.8))
                rules.append(('Sports Program', 1.6))
            
            recommendation_rules[cluster_id] = rules
        
        self.recommendation_rules = recommendation_rules
        print("Recommendation engine built successfully")
        
        return recommendation_rules
    
    def get_user_service_recommendations(self, user_id, n_recommendations=2):
        """Get service recommendations for a specific user"""
        if self.master_df is None:
            self.load_and_prepare_data()
        
        user_data = self.master_df[self.master_df['user_id'] == user_id]
        if user_data.empty:
            return {"error": f"User {user_id} not found"}
        
        user = user_data.iloc[0]
        user_cluster = user['cluster']
        user_provider_id = user['provider_id']
        
        # Get services from user's insurance provider
        provider_services = self.services_df[
            self.services_df['provider_id'] == user_provider_id
        ].copy()
        
        if provider_services.empty:
            return {"error": "No services found for user's insurance provider"}
        
        # Calculate relevance scores
        provider_services['relevance_score'] = provider_services.apply(
            lambda service: self._calculate_service_relevance_score(user, service, user_cluster), 
            axis=1
        )
        
        # Get top recommendations
        top_services = provider_services.nlargest(n_recommendations, 'relevance_score')
        
        recommendations = []
        for _, service in top_services.iterrows():
            recommendations.append({
                "service_id": service['service_id'],
                "service_name": service['service_name'],
                "category": service['category'],
                "description": service['description'],
                "reward_amount": service['reward_amount'],
                "reward_type": service['reward_type'],
                "relevance_score": round(service['relevance_score'], 2),
                "eligibility_criteria": service['eligibility_criteria'],
                "popularity_score": service['popularity_score']
            })
        
        return {
            "user_id": user_id,
            "user_cluster": user_cluster,
            "insurance_provider": user['current_insurance_provider'],
            "recommendations": recommendations
        }
    
    def _calculate_service_relevance_score(self, user, service, user_cluster):
        """Calculate relevance score for a service given user profile"""
        base_score = service['popularity_score']
        
        # Apply cluster-based rules
        if hasattr(self, 'recommendation_rules') and user_cluster in self.recommendation_rules:
            for category, multiplier in self.recommendation_rules[user_cluster]:
                if category.lower() in service['category'].lower():
                    base_score *= multiplier
        
        # Individual user characteristics
        if service['category'] == 'Fitness':
            if user['fitness_level'] in ['Intermediate', 'Advanced']:
                base_score += 2
            if user['total_steps'] > 50000:
                base_score += 1
        
        elif service['category'] == 'Prevention':
            if user['age'] > 40:
                base_score += 2
            if user['has_medical_condition']:
                base_score += 1.5
        
        elif service['category'] == 'Mental Health':
            if user['stress_level_avg'] > 4:
                base_score += 2
            if user['sleep_hours_avg'] < 7:
                base_score += 1
        
        elif service['category'] == 'Wellness':
            base_score += 1  # Generally applicable
        
        # Digital preference for younger users
        if service.get('digital_app_required') and user['age'] < 40:
            base_score += 0.5
        
        # Reward amount consideration
        if service['reward_amount'] > 200:
            base_score += 0.5
        
        return base_score
    
    def generate_admin_dashboard(self, save_path=None):
        """Generate comprehensive admin dashboard"""
        if self.master_df is None:
            self.load_and_prepare_data()
        
        # Create comprehensive dashboard
        fig = make_subplots(
            rows=4, cols=2,
            subplot_titles=[
                'User Demographics Overview', 'Activity Distribution',
                'Health Metrics Distribution', 'Insurance Provider Market Share',
                'Fitness Level vs Activity Correlation', 'Service Category Popularity',
                'Cluster Performance Metrics', 'User Engagement Trends'
            ],
            specs=[
                [{"type": "bar"}, {"type": "histogram"}],
                [{"type": "box"}, {"type": "pie"}],
                [{"type": "scatter"}, {"type": "bar"}],
                [{"type": "bar"}, {"type": "scatter"}]
            ]
        )
        
        # 1. Demographics Overview
        age_groups = pd.cut(self.master_df['age'], bins=[20, 30, 40, 50, 60, 70], labels=['20-30', '30-40', '40-50', '50-60', '60-70'])
        age_dist = age_groups.value_counts()
        
        fig.add_trace(
            go.Bar(x=age_dist.index, y=age_dist.values, name="Age Distribution"),
            row=1, col=1
        )
        
        # 2. Activity Distribution
        fig.add_trace(
            go.Histogram(x=self.master_df['total_steps'], nbinsx=20, name="Steps Distribution"),
            row=1, col=2
        )
        
        # 3. Health Metrics (BMI distribution by gender)
        for gender in self.master_df['gender'].unique():
            gender_data = self.master_df[self.master_df['gender'] == gender]
            fig.add_trace(
                go.Box(y=gender_data['bmi'], name=f'{gender} BMI'),
                row=2, col=1
            )
        
        # 4. Insurance Market Share
        insurance_dist = self.master_df['current_insurance_provider'].value_counts()
        fig.add_trace(
            go.Pie(labels=insurance_dist.index, values=insurance_dist.values, name="Insurance Share"),
            row=2, col=2
        )
        
        # 5. Fitness vs Activity Correlation
        fig.add_trace(
            go.Scatter(
                x=self.master_df['fitness_level_encoded'],
                y=self.master_df['total_calories_burned'],
                mode='markers',
                name="Fitness vs Calories",
                text=self.master_df['fitness_level']
            ),
            row=3, col=1
        )
        
        # 6. Service Category Popularity
        service_popularity = self.services_df['category'].value_counts()
        fig.add_trace(
            go.Bar(x=service_popularity.index, y=service_popularity.values, name="Service Categories"),
            row=3, col=2
        )
        
        # 7. Cluster Performance (if clustering is done)
        if self.cluster_labels is not None:
            cluster_performance = self.master_df.groupby('cluster')['total_calories_burned'].mean()
            fig.add_trace(
                go.Bar(
                    x=[f'Cluster {i}' for i in cluster_performance.index],
                    y=cluster_performance.values,
                    name="Cluster Performance"
                ),
                row=4, col=1
            )
        
        # 8. User Engagement (mock trend data)
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        engagement = [85, 88, 92, 89, 94, 96]
        
        fig.add_trace(
            go.Scatter(x=months, y=engagement, mode='lines+markers', name="Engagement %"),
            row=4, col=2
        )
        
        # Update layout
        fig.update_layout(
            height=1600,
            title_text="Fitness App Admin Dashboard",
            showlegend=False
        )
        
        if save_path:
            fig.write_html(save_path)
        
        fig.show()
        return fig
    
    def export_cluster_model(self, filepath='cluster_model.pkl'):
        """Export trained clustering model for production use"""
        if self.clustering_model is None:
            print("No clustering model to export. Please run clustering first.")
            return
        
        model_data = {
            'clustering_model': self.clustering_model,
            'scaler': self.scaler,
            'pca_model': self.pca_model,
            'cluster_summary': self.cluster_summary,
            'recommendation_rules': getattr(self, 'recommendation_rules', None)
        }
        
        joblib.dump(model_data, filepath)
        print(f"Clustering model exported to {filepath}")
    
    def load_cluster_model(self, filepath='cluster_model.pkl'):
        """Load pre-trained clustering model"""
        try:
            model_data = joblib.load(filepath)
            self.clustering_model = model_data['clustering_model']
            self.scaler = model_data['scaler']
            self.pca_model = model_data.get('pca_model')
            self.cluster_summary = model_data.get('cluster_summary')
            self.recommendation_rules = model_data.get('recommendation_rules')
            print(f"Clustering model loaded from {filepath}")
        except FileNotFoundError:
            print(f"Model file {filepath} not found")
        except Exception as e:
            print(f"Error loading model: {e}")

# Demo and testing functions
def demo_admin_analytics():
    """Comprehensive demo of admin analytics functionality"""
    admin = AdminAnalytics()
    
    print("=== LOADING DATA ===")
    admin.load_and_prepare_data()
    
    print("\n=== PERFORMING CLUSTERING ===")
    cluster_labels, silhouette_score = admin.perform_user_clustering(n_clusters=5)
    
    print("\n=== CLUSTER SUMMARY ===")
    admin.print_cluster_summary()
    
    print("\n=== BUILDING RECOMMENDATION ENGINE ===")
    admin.build_recommendation_engine()
    
    print("\n=== USER RECOMMENDATIONS DEMO ===")
    recommendations = admin.get_user_service_recommendations("USR001")
    print(f"Recommendations for USR001:")
    for rec in recommendations.get('recommendations', []):
        print(f"- {rec['service_name']} (Score: {rec['relevance_score']})")
    
    print("\n=== NEW USER ASSIGNMENT DEMO ===")
    new_user = {
        'age': 32,
        'gender': 'Female',
        'bmi': 22.5,
        'fitness_level': 'Intermediate',
        'total_steps': 55000,
        'total_calories_burned': 2200,
        'total_active_minutes': 180,
        'exercise_frequency_per_week': 4,
        'resting_heart_rate': 68,
        'sleep_hours_avg': 7.5,
        'stress_level_avg': 3.2,
        'income_bracket': '50000-75000',
        'medical_conditions': 'None'
    }
    
    assignment = admin.assign_new_user_to_cluster(new_user)
    print(f"New user assigned to: Cluster {assignment['predicted_cluster']}")
    print(f"Description: {assignment['cluster_description']}")
    print(f"Confidence: {assignment['confidence_score']}")
    
    print("\n=== CREATING VISUALIZATIONS ===")
    admin.visualize_clusters()
    admin.generate_admin_dashboard()
    
    print("\n=== EXPORTING MODEL ===")
    admin.export_cluster_model()

if __name__ == "__main__":
    demo_admin_analytics()