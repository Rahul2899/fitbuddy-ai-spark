from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import csv
import random
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Global in-memory storage for user data (backup)
user_data_store = {}

# Your existing CSV file paths
CSV_FILES = {
    'demographic': 'attached_assets/users_demographic.csv',
    'physical': 'attached_assets/users_physical.csv',
    'activity': 'attached_assets/users_activity_weekly.csv'
}

def generate_demographic_data(user_id, age, gender, fitness_level, user_info=None):
    """Generate demographic data using real user information"""
    
    # Use real user data if provided, otherwise use defaults
    if user_info:
        first_name = user_info.get('firstName', 'User')
        last_name = user_info.get('lastName', 'Name')
        city = user_info.get('city', '')
        occupation = user_info.get('occupation', '')
    else:
        # Fallback to random generation
        male_names = ['Alexander', 'Benjamin', 'Christopher', 'Daniel', 'Erik', 'Felix', 'Gabriel', 'Hans']
        female_names = ['Anna', 'Brigitte', 'Christina', 'Diana', 'Elena', 'Frieda', 'Greta', 'Hannah']
        surnames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker']
        
        first_name = random.choice(female_names if gender == 'female' else male_names)
        last_name = random.choice(surnames)
        city = ''
        occupation = ''
    
    # Default cities and states for empty fields
    german_cities = ['München', 'Berlin', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig']
    german_states = ['Bayern', 'Nordrhein-Westfalen', 'Baden-Württemberg', 'Niedersachsen', 'Hessen']
    
    # Use user city or random German city
    final_city = city if city else random.choice(german_cities)
    
    # Generate reasonable defaults for missing fields
    education_levels = ['High School', 'Bachelor', 'Master', 'PhD', 'Vocational Training']
    default_occupations = ['Software Engineer', 'Teacher', 'Nurse', 'Manager', 'Designer', 'Analyst', 'Consultant']
    income_brackets = ['30000-50000', '50000-70000', '70000-100000', '100000-150000']
    
    final_occupation = occupation if occupation else random.choice(default_occupations)
    
    return {
        'user_id': user_id,
        'first_name': first_name,
        'last_name': last_name,
        'age': age,
        'gender': gender,
        'ethnicity': 'European',
        'nationality': 'German',
        'city': final_city,
        'state': random.choice(german_states),
        'postal_code': random.randint(10000, 99999),
        'education_level': random.choice(education_levels),
        'occupation': final_occupation,
        'income_bracket': random.choice(income_brackets)
    }

def generate_physical_data(user_id, age, gender, fitness_level):
    """Generate physical/health data for the user"""
    # Height and weight based on gender and fitness level
    if gender == 'female':
        base_height = random.randint(155, 175)
        if fitness_level == 'advanced':
            base_weight = random.randint(55, 70)
        elif fitness_level == 'intermediate':
            base_weight = random.randint(60, 75)
        else:  # beginner
            base_weight = random.randint(65, 80)
    else:  # male
        base_height = random.randint(170, 190)
        if fitness_level == 'advanced':
            base_weight = random.randint(70, 85)
        elif fitness_level == 'intermediate':
            base_weight = random.randint(75, 90)
        else:  # beginner
            base_weight = random.randint(80, 95)
    
    bmi = round(base_weight / ((base_height / 100) ** 2), 1)
    
    # Heart rate based on age and fitness level
    max_hr = 220 - age
    if fitness_level == 'advanced':
        resting_hr = random.randint(50, 65)
    elif fitness_level == 'intermediate':
        resting_hr = random.randint(60, 75)
    else:  # beginner
        resting_hr = random.randint(70, 85)
    
    blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    conditions = ['None', 'Hypertension', 'Diabetes Type 2', 'Asthma', 'None', 'None']  # More "None" for realistic distribution
    allergies = ['None', 'Pollen', 'Shellfish', 'Nuts', 'None', 'None']
    insurers = ['AOK', 'Barmer', 'TK', 'DAK', 'IKK', 'BKK']
    
    smoking_status = ['Never', 'Former', 'Current'][random.choices([0, 1, 2], weights=[60, 25, 15])[0]]
    alcohol_consumption = ['None', 'Light', 'Moderate', 'Heavy'][random.choices([0, 1, 2, 3], weights=[20, 40, 35, 5])[0]]
    
    return {
        'user_id': user_id,
        'height_cm': base_height,
        'weight_kg': base_weight,
        'bmi': bmi,
        'blood_type': random.choice(blood_types),
        'medical_conditions': random.choice(conditions),
        'allergies': random.choice(allergies),
        'current_insurance_provider': random.choice(insurers),
        'fitness_level': fitness_level,
        'resting_heart_rate': resting_hr,
        'blood_pressure_systolic': random.randint(110, 140),
        'blood_pressure_diastolic': random.randint(70, 90),
        'cholesterol_total': random.randint(150, 250),
        'glucose_level': random.randint(80, 120),
        'last_medical_checkup': (datetime.now() - timedelta(days=random.randint(30, 365))).strftime('%Y-%m-%d'),
        'medications': random.choice(['None', 'Vitamins', 'Blood Pressure Medication', 'None']),
        'smoking_status': smoking_status,
        'alcohol_consumption': alcohol_consumption,
        'sleep_hours_avg': round(random.uniform(6.0, 9.0), 1),
        'exercise_frequency_per_week': 2 if fitness_level == 'beginner' else 4 if fitness_level == 'intermediate' else 6
    }

def generate_activity_data(user_id, age, gender, fitness_level, physical_data):
    """Generate weekly activity data for the user"""
    # Base stats by fitness level
    fitness_multipliers = {
        'beginner': {'steps': 0.7, 'distance': 0.6, 'calories': 0.8, 'active_mins': 0.7},
        'intermediate': {'steps': 0.9, 'distance': 0.85, 'calories': 0.9, 'active_mins': 0.9},
        'advanced': {'steps': 1.2, 'distance': 1.3, 'calories': 1.1, 'active_mins': 1.2}
    }
    
    multiplier = fitness_multipliers.get(fitness_level, fitness_multipliers['intermediate'])
    
    # Generate realistic weekly data
    base_steps = int(65000 * multiplier['steps'])
    base_distance = round(45.0 * multiplier['distance'], 1)
    base_calories = int(2000 * multiplier['calories'])
    base_active_mins = int(300 * multiplier['active_mins'])
    
    # Heart rate ranges
    resting_hr = physical_data['resting_heart_rate']
    max_hr = 220 - age
    avg_hr = resting_hr + random.randint(20, 40)
    
    # Exercise sessions based on fitness level
    exercise_sessions = physical_data['exercise_frequency_per_week'] + random.randint(-1, 1)
    exercise_sessions = max(1, exercise_sessions)  # At least 1 session
    
    # Workout types based on fitness level
    beginner_workouts = ['Walking', 'Light Yoga', 'Swimming']
    intermediate_workouts = ['Running', 'Cycling', 'Weight Training', 'Yoga', 'Pilates']
    advanced_workouts = ['HIIT', 'CrossFit', 'Marathon Training', 'Heavy Weight Training', 'Triathlon']
    
    if fitness_level == 'beginner':
        workout_types = ','.join(random.sample(beginner_workouts, min(2, len(beginner_workouts))))
    elif fitness_level == 'intermediate':
        workout_types = ','.join(random.sample(intermediate_workouts, min(3, len(intermediate_workouts))))
    else:
        workout_types = ','.join(random.sample(advanced_workouts, min(3, len(advanced_workouts))))
    
    # Current week data
    current_week = datetime.now().strftime('%Y-%m-%d')
    
    return {
        'user_id': user_id,
        'week_start_date': current_week,
        'total_steps': base_steps + random.randint(-8000, 8000),
        'total_distance_km': base_distance + random.uniform(-5.0, 5.0),
        'total_calories_burned': base_calories + random.randint(-300, 300),
        'total_active_minutes': base_active_mins + random.randint(-50, 50),
        'avg_heart_rate': avg_hr,
        'max_heart_rate': min(max_hr, avg_hr + random.randint(30, 50)),
        'min_heart_rate': max(resting_hr - 5, avg_hr - random.randint(20, 30)),
        'sleep_hours_total': round(physical_data['sleep_hours_avg'] * 7, 1),
        'move_minutes': base_active_mins + random.randint(-30, 30),
        'exercise_sessions': exercise_sessions,
        'cycling_distance_km': round(random.uniform(0, 20), 1),
        'running_distance_km': round(random.uniform(0, 15), 1),
        'walking_distance_km': round(random.uniform(10, 30), 1),
        'floors_climbed': random.randint(20, 100),
        'sedentary_minutes': random.randint(300, 600),
        'workout_types': workout_types,
        'avg_pace_min_per_km': round(random.uniform(4.5, 7.0), 1),
        'stress_level_avg': round(random.uniform(1.0, 8.0), 1)
    }

def write_user_to_existing_csvs(user_id, age, gender, fitness_level, user_info=None):
    """Write user data to existing CSV files using real user information"""
    try:
        # Generate all data with user information
        demographic_data = generate_demographic_data(user_id, age, gender, fitness_level, user_info)
        physical_data = generate_physical_data(user_id, age, gender, fitness_level)
        activity_data = generate_activity_data(user_id, age, gender, fitness_level, physical_data)
        
        # Write to demographic CSV
        if os.path.exists(CSV_FILES['demographic']):
            with open(CSV_FILES['demographic'], 'a', newline='', encoding='utf-8') as file:
                fieldnames = ['user_id', 'first_name', 'last_name', 'age', 'gender', 'ethnicity', 
                             'nationality', 'city', 'state', 'postal_code', 'education_level', 
                             'occupation', 'income_bracket']
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writerow(demographic_data)
        
        # Write to physical CSV
        if os.path.exists(CSV_FILES['physical']):
            with open(CSV_FILES['physical'], 'a', newline='', encoding='utf-8') as file:
                fieldnames = ['user_id', 'height_cm', 'weight_kg', 'bmi', 'blood_type', 
                             'medical_conditions', 'allergies', 'current_insurance_provider', 
                             'fitness_level', 'resting_heart_rate', 'blood_pressure_systolic', 
                             'blood_pressure_diastolic', 'cholesterol_total', 'glucose_level', 
                             'last_medical_checkup', 'medications', 'smoking_status', 
                             'alcohol_consumption', 'sleep_hours_avg', 'exercise_frequency_per_week']
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writerow(physical_data)
        
        # Write to activity CSV
        if os.path.exists(CSV_FILES['activity']):
            with open(CSV_FILES['activity'], 'a', newline='', encoding='utf-8') as file:
                fieldnames = ['user_id', 'week_start_date', 'total_steps', 'total_distance_km', 
                             'total_calories_burned', 'total_active_minutes', 'avg_heart_rate', 
                             'max_heart_rate', 'min_heart_rate', 'sleep_hours_total', 'move_minutes', 
                             'exercise_sessions', 'cycling_distance_km', 'running_distance_km', 
                             'walking_distance_km', 'floors_climbed', 'sedentary_minutes', 
                             'workout_types', 'avg_pace_min_per_km', 'stress_level_avg']
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writerow(activity_data)
        
        print(f"✅ Successfully wrote user {user_id} to all CSV files")
        print(f"👤 Name: {demographic_data['first_name']} {demographic_data['last_name']}")
        print(f"📊 Steps: {activity_data['total_steps']}")
        print(f"💪 Workouts: {activity_data['exercise_sessions']}/week")
        print(f"❤️ Heart Rate: {physical_data['resting_heart_rate']} BPM")
        
        # Return combined data for API response
        return {
            'user_id': user_id,
            'age': age,
            'gender': gender,
            'fitness_level': fitness_level,
            'weekly_activity': {
                'total_steps': activity_data['total_steps'],
                'exercise_sessions': activity_data['exercise_sessions'],
                'calories_burned': activity_data['total_calories_burned'],
                'active_minutes': activity_data['total_active_minutes']
            },
            'health_metrics': {
                'resting_heart_rate': physical_data['resting_heart_rate'],
                'max_heart_rate': physical_data['blood_pressure_systolic'],  # Using systolic as max HR proxy
                'sleep_hours': physical_data['sleep_hours_avg'],
                'stress_level': int(activity_data['stress_level_avg'])
            },
            'goals': {
                'weekly_step_goal': 70000,
                'weekly_workout_goal': physical_data['exercise_frequency_per_week'],
                'target_weight': physical_data['weight_kg']
            }
        }
        
    except Exception as e:
        print(f"❌ Error writing to CSV files: {e}")
        return None

def load_user_from_existing_csvs(user_id):
    """Load user data from existing CSV files"""
    try:
        user_data = {}
        
        # Load demographic data
        if os.path.exists(CSV_FILES['demographic']):
            with open(CSV_FILES['demographic'], 'r', newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row.get('user_id') == user_id:
                        user_data.update({
                            'user_id': user_id,
                            'age': int(row['age']),
                            'gender': row['gender'],
                            'first_name': row['first_name'],
                            'last_name': row['last_name']
                        })
                        break
        
        if not user_data:
            return None
        
        # Load physical data
        if os.path.exists(CSV_FILES['physical']):
            with open(CSV_FILES['physical'], 'r', newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row.get('user_id') == user_id:
                        user_data['fitness_level'] = row['fitness_level']
                        user_data['health_metrics'] = {
                            'resting_heart_rate': int(row['resting_heart_rate']),
                            'max_heart_rate': int(row['blood_pressure_systolic']),
                            'sleep_hours': float(row['sleep_hours_avg']),
                            'stress_level': 5  # Default value
                        }
                        user_data['goals'] = {
                            'weekly_step_goal': 70000,
                            'weekly_workout_goal': int(row['exercise_frequency_per_week']),
                            'target_weight': int(float(row['weight_kg']))
                        }
                        break
        
        # Load activity data
        if os.path.exists(CSV_FILES['activity']):
            with open(CSV_FILES['activity'], 'r', newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row.get('user_id') == user_id:
                        user_data['weekly_activity'] = {
                            'total_steps': int(row['total_steps']),
                            'exercise_sessions': int(row['exercise_sessions']),
                            'calories_burned': int(row['total_calories_burned']),
                            'active_minutes': int(row['total_active_minutes'])
                        }
                        if 'health_metrics' in user_data:
                            user_data['health_metrics']['stress_level'] = int(float(row['stress_level_avg']))
                        break
        
        print(f"✅ Successfully loaded user {user_id} from existing CSV files")
        return user_data
        
    except Exception as e:
        print(f"❌ Error loading from existing CSV files: {e}")
        return None

@app.route('/user/<user_id>')
def get_user_profile(user_id):
    """Get user profile data"""
    try:
        # First check in-memory store
        if user_id in user_data_store:
            print(f"✅ Found user {user_id} in memory store")
            return jsonify(user_data_store[user_id])
        
        # Try to load from existing CSV files
        user_data = load_user_from_existing_csvs(user_id)
        if user_data:
            return jsonify(user_data)
        else:
            return jsonify({'error': f'User {user_id} not found'}), 404
            
    except Exception as e:
        print(f"❌ Error getting user profile: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/generate-csv', methods=['POST', 'OPTIONS'])
def generate_csv_endpoint():
    """Generate CSV data for a user and write to existing files"""
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        data = request.get_json()
        user_id = data.get('userId')
        age = data.get('age', 29)
        gender = data.get('gender', 'male')
        fitness_level = data.get('fitnessLevel', 'intermediate')
        
        # Extract user information
        user_info = {
            'firstName': data.get('firstName', ''),
            'lastName': data.get('lastName', ''),
            'city': data.get('city', ''),
            'occupation': data.get('occupation', '')
        }
        
        if not user_id:
            return jsonify({'error': 'userId is required'}), 400
        
        print(f"🔄 Generating data for user: {user_id}")
        print(f"👤 Name: {user_info['firstName']} {user_info['lastName']}")
        print(f"🏙️ City: {user_info['city'] or 'Not provided'}")
        print(f"💼 Occupation: {user_info['occupation'] or 'Not provided'}")
        
        # Generate and write user data to existing CSV files
        user_data = write_user_to_existing_csvs(user_id, age, gender, fitness_level, user_info)
        
        if user_data:
            # Store in memory as backup
            user_data_store[user_id] = user_data
            
            return jsonify({
                'success': True,
                'message': f'Data generated and saved for user {user_id}',
                'data': user_data,
                'csv_files_updated': ['demographic', 'physical', 'activity'],
                'user_name': f"{user_info['firstName']} {user_info['lastName']}"
            })
        else:
            return jsonify({'error': 'Failed to write to CSV files'}), 500
        
    except Exception as e:
        print(f"❌ Error generating CSV data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/users')
def list_users():
    """List all users from existing CSV files"""
    try:
        all_users = {}
        
        # Add in-memory users
        for user_id, data in user_data_store.items():
            all_users[user_id] = 'memory'
        
        # Add users from existing CSV files
        if os.path.exists(CSV_FILES['demographic']):
            with open(CSV_FILES['demographic'], 'r', newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    user_id = row.get('user_id')
                    if user_id:
                        all_users[user_id] = 'existing_csv'
        
        return jsonify({
            'total_users': len(all_users),
            'users': all_users,
            'memory_users': len(user_data_store),
            'csv_files': {
                'demographic': os.path.exists(CSV_FILES['demographic']),
                'physical': os.path.exists(CSV_FILES['physical']),
                'activity': os.path.exists(CSV_FILES['activity'])
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health_check():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'message': 'BewegungsLiga+ API is running with existing CSV structure',
        'users_in_memory': len(user_data_store),
        'csv_files': {
            'demographic': os.path.exists(CSV_FILES['demographic']),
            'physical': os.path.exists(CSV_FILES['physical']),
            'activity': os.path.exists(CSV_FILES['activity'])
        }
    })

if __name__ == '__main__':
    print("🚀 Starting BewegungsLiga+ API server...")
    print("📊 Using existing CSV structure:")
    for name, path in CSV_FILES.items():
        exists = "✅" if os.path.exists(path) else "❌"
        print(f"   {exists} {name}: {path}")
    print("🌐 Server running on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)