#!/usr/bin/env python3
"""
Quick Demo Script for Fitness App Analytics
Run this to see all functionality in action with sample data
"""

import pandas as pd
import numpy as np
from user_analytics import UserAnalytics
from admin_analytics import AdminAnalytics

def main_demo():
    """Main demonstration of all analytics functionality"""
    print("🏃‍♀️ GERMAN FITNESS APP ANALYTICS DEMO 🏃‍♂️")
    print("=" * 60)
    
    # Initialize analytics systems
    print("\n📊 Initializing Analytics Systems...")
    user_analytics = UserAnalytics()
    admin = AdminAnalytics()
    
    # Load and prepare data
    print("\n📂 Loading and Preparing Data...")
    try:
        admin.load_and_prepare_data()
        user_analytics.load_and_prepare_data()
        print(f"✅ Successfully loaded {len(admin.master_df)} users")
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return
    
    # PART 1: CLUSTERING ANALYSIS
    print("\n" + "="*60)
    print("🎯 PART 1: USER CLUSTERING ANALYSIS")
    print("="*60)
    
    print("\n🔄 Performing K-means clustering...")
    cluster_labels, silhouette_score = admin.perform_user_clustering(n_clusters=5)
    print(f"✅ Clustering completed with silhouette score: {silhouette_score:.3f}")
    
    print("\n📋 CLUSTER SUMMARY:")
    admin.print_cluster_summary()
    
    # PART 2: NEW USER ASSIGNMENT
    print("\n" + "="*60)
    print("👤 PART 2: NEW USER ASSIGNMENT DEMO")
    print("="*60)
    
    new_user_profiles = [
        {
            'name': 'Young Fitness Enthusiast',
            'data': {
                'age': 25,
                'gender': 'Female',
                'bmi': 21.2,
                'fitness_level': 'Advanced',
                'total_steps': 75000,
                'total_calories_burned': 3200,
                'total_active_minutes': 450,
                'exercise_frequency_per_week': 6,
                'resting_heart_rate': 58,
                'sleep_hours_avg': 8.0,
                'stress_level_avg': 2.1,
                'income_bracket': '50000-75000',
                'medical_conditions': 'None'
            }
        },
        {
            'name': 'Busy Professional',
            'data': {
                'age': 42,
                'gender': 'Male',
                'bmi': 26.1,
                'fitness_level': 'Beginner',
                'total_steps': 28000,
                'total_calories_burned': 1800,
                'total_active_minutes': 120,
                'exercise_frequency_per_week': 2,
                'resting_heart_rate': 78,
                'sleep_hours_avg': 6.2,
                'stress_level_avg': 4.8,
                'income_bracket': '75000-100000',
                'medical_conditions': 'Hypertension'
            }
        }
    ]
    
    for profile in new_user_profiles:
        print(f"\n👤 Assigning: {profile['name']}")
        assignment = admin.assign_new_user_to_cluster(profile['data'])
        print(f"   Cluster: {assignment['predicted_cluster']}")
        print(f"   Description: {assignment['cluster_description']}")
        print(f"   Confidence: {assignment['confidence_score']}")
    
    # PART 3: RECOMMENDATION ENGINE
    print("\n" + "="*60)
    print("🎯 PART 3: RECOMMENDATION ENGINE")
    print("="*60)
    
    print("\n🔧 Building recommendation engine...")
    admin.build_recommendation_engine()
    
    # Test recommendations for sample users
    sample_users = ["USR001", "USR002", "USR003"]
    
    for user_id in sample_users:
        print(f"\n📋 Recommendations for {user_id}:")
        recommendations = admin.get_user_service_recommendations(user_id)
        
        if 'error' in recommendations:
            print(f"   ❌ {recommendations['error']}")
            continue
            
        user_info = recommendations
        print(f"   User Cluster: {user_info['user_cluster']}")
        print(f"   Insurance: {user_info['insurance_provider']}")
        
        for i, rec in enumerate(user_info['recommendations'], 1):
            print(f"   {i}. {rec['service_name']} ({rec['category']})")
            print(f"      Reward: {rec['reward_amount']} {rec['reward_type']}")
            print(f"      Relevance Score: {rec['relevance_score']}")
    
    # PART 4: INDIVIDUAL USER ANALYSIS
    print("\n" + "="*60)
    print("👤 PART 4: INDIVIDUAL USER ANALYSIS")
    print("="*60)
    
    demo_user = "USR001"
    print(f"\n📊 Analyzing user: {demo_user}")
    
    # Get user profile
    profile = user_analytics.get_user_profile_summary(demo_user)
    print(f"\n📋 User Profile:")
    print(f"   Age: {profile['basic_info']['age']}, Gender: {profile['basic_info']['gender']}")
    print(f"   Fitness Level: {profile['basic_info']['fitness_level']}")
    print(f"   BMI: {profile['health_metrics']['bmi']}")
    print(f"   Weekly Steps: {profile['weekly_activity']['total_steps']:,}")
    print(f"   Fitness Score: {profile['fitness_score']}/100")
    
    # Get user recommendations
    user_recommendations = user_analytics.get_user_recommendations(demo_user)
    print(f"\n💡 Personalized Recommendations:")
    
    for rec_type, recs in user_recommendations.items():
        if recs:  # Only show if there are recommendations
            print(f"   {rec_type.replace('_', ' ').title()}:")
            for rec in recs:
                if isinstance(rec, dict):
                    if 'message' in rec:
                        print(f"     - {rec['message']}")
                    elif 'service_name' in rec:
                        print(f"     - {rec['service_name']}: {rec['description'][:60]}...")
    
    # Find similar users
    similar_users = user_analytics.find_similar_users(demo_user, 3)
    print(f"\n👥 Similar Users: {similar_users}")
    
    # Track progress
    progress = user_analytics.track_user_progress(demo_user)
    print(f"\n📈 Progress Tracking:")
    for week_data in progress[-3:]:  # Show last 3 weeks
        print(f"   {week_data['week']}: {week_data['steps']:,} steps, "
              f"Score: {week_data['fitness_score']}")
    
    # PART 5: VISUALIZATION DEMO
    print("\n" + "="*60)
    print("📊 PART 5: VISUALIZATION DEMO")
    print("="*60)
    
    print("\n🎨 Creating visualizations...")
    print("   Note: Visualizations will open in your browser/viewer")
    
    try:
        # Cluster visualization
        print("   📊 Creating cluster analysis visualization...")
        admin.visualize_clusters(save_path="cluster_analysis_demo.html")
        
        # Admin dashboard
        print("   📈 Creating admin dashboard...")
        admin.generate_admin_dashboard(save_path="admin_dashboard_demo.html")
        
        # User dashboard
        print("   👤 Creating user dashboard...")
        user_analytics.create_user_dashboard(demo_user, save_path="user_dashboard_demo.html")
        
        print("   ✅ Visualizations created successfully!")
        print("   📁 Files saved: cluster_analysis_demo.html, admin_dashboard_demo.html, user_dashboard_demo.html")
        
    except Exception as e:
        print(f"   ⚠️  Visualization error (likely missing display): {e}")
        print("   💡 Run in Jupyter notebook or environment with display for full visualization")
    
    # PART 6: MODEL EXPORT/IMPORT DEMO
    print("\n" + "="*60)
    print("💾 PART 6: MODEL PERSISTENCE DEMO")
    print("="*60)
    
    print("\n💾 Exporting clustering model...")
    admin.export_cluster_model('demo_cluster_model.pkl')
    
    print("\n📂 Loading clustering model...")
    new_admin = AdminAnalytics()
    new_admin.load_cluster_model('demo_cluster_model.pkl')
    print("   ✅ Model loaded successfully!")
    
    # PART 7: PERFORMANCE SUMMARY
    print("\n" + "="*60)
    print("📊 PART 7: SYSTEM PERFORMANCE SUMMARY")
    print("="*60)
    
    print(f"\n📈 Dataset Statistics:")
    print(f"   Total Users: {len(admin.master_df):,}")
    print(f"   Features Used: {len([col for col in admin.master_df.columns if col.endswith('_encoded') or col in ['age', 'bmi', 'total_steps']])}")
    print(f"   Number of Clusters: {len(admin.master_df['cluster'].unique())}")
    print(f"   Clustering Quality (Silhouette): {silhouette_score:.3f}")
    
    print(f"\n🏢 Insurance Coverage:")
    insurance_stats = admin.master_df['current_insurance_provider'].value_counts()
    for provider, count in insurance_stats.head(3).items():
        percentage = (count / len(admin.master_df)) * 100
        print(f"   {provider}: {count} users ({percentage:.1f}%)")
    
    print(f"\n🎯 Service Recommendations:")
    print(f"   Total Services Available: {len(admin.services_df)}")
    print(f"   Average Services per Provider: {len(admin.services_df) / len(admin.insurance_df):.1f}")
    
    category_stats = admin.services_df['category'].value_counts()
    print(f"   Most Popular Category: {category_stats.index[0]} ({category_stats.iloc[0]} services)")
    
    print(f"\n🏃‍♀️ Activity Insights:")
    avg_steps = admin.master_df['total_steps'].mean()
    avg_calories = admin.master_df['total_calories_burned'].mean()
    print(f"   Average Weekly Steps: {avg_steps:,.0f}")
    print(f"   Average Weekly Calories: {avg_calories:,.0f}")
    
    fitness_dist = admin.master_df['fitness_level'].value_counts()
    print(f"   Fitness Level Distribution:")
    for level, count in fitness_dist.items():
        percentage = (count / len(admin.master_df)) * 100
        print(f"     {level}: {percentage:.1f}%")
    
    # CONCLUSION
    print("\n" + "="*60)
    print("🎉 DEMO COMPLETED SUCCESSFULLY!")
    print("="*60)
    
    print("\n✅ What was demonstrated:")
    print("   🎯 User clustering with 5 distinct groups")
    print("   👤 New user assignment to clusters")
    print("   🎯 Insurance service recommendation engine")
    print("   📊 Individual user analytics and tracking")
    print("   📈 Comprehensive admin dashboards")
    print("   🔍 Similar user matching")
    print("   💾 Model persistence for production use")
    
    print("\n🚀 Ready for hackathon integration!")
    print("   Use these analytics in your Flutter app backend")
    print("   Real-time clustering and recommendations available")
    print("   Comprehensive user insights and admin dashboards")
    
    print("\n📁 Files created:")
    print("   - demo_cluster_model.pkl (trained model)")
    print("   - cluster_analysis_demo.html (cluster visualization)")
    print("   - admin_dashboard_demo.html (admin insights)")
    print("   - user_dashboard_demo.html (user analytics)")

if __name__ == "__main__":
    try:
        main_demo()
    except Exception as e:
        print(f"\n❌ Demo failed with error: {e}")
        print("\n💡 Make sure you have:")
        print("   - All required CSV files in the same directory")
        print("   - Required Python packages installed:")
        print("     pip install pandas numpy matplotlib seaborn plotly scikit-learn joblib")
        print("\n🔧 If issues persist, run individual components:")
        print("   python user_analytics.py")
        print("   python admin_analytics.py")