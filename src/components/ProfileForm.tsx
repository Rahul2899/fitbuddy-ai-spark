import React, { useState } from 'react';
import { User, Heart, Target, Activity, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Gender, FitnessLevel, FitnessGoal } from '@/types/fitness';

interface ProfileFormProps {
  onComplete: (profileData: any) => void;
  onCancel?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: 25,
    gender: 'female' as Gender,
    fitnessLevel: 'beginner' as FitnessLevel,
    fitnessGoal: 'get_active' as FitnessGoal,
    limitations: [] as string[],
    activityPreference: '',
    weeklyGoal: 3,
    city: '',
    occupation: ''
  });

  const totalSteps = 4;

  const handleLimitationToggle = (limitation: string) => {
    setFormData(prev => ({
      ...prev,
      limitations: prev.limitations.includes(limitation)
        ? prev.limitations.filter(l => l !== limitation)
        : [...prev.limitations, limitation]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('Please fill in your first and last name');
      return;
    }

    try {
      const profile = {
        id: `user-${Date.now()}`,
        csvUserId: `USR${Math.floor(Math.random() * 900000) + 100000}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age,
        gender: formData.gender,
        fitnessLevel: formData.fitnessLevel,
        fitnessGoal: formData.fitnessGoal,
        limitations: formData.limitations.join(', ') || 'none',
        activityPreference: formData.activityPreference || '',
        weeklyGoal: formData.weeklyGoal,
        city: formData.city.trim() || '',
        occupation: formData.occupation.trim() || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('💾 Saving profile:', profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      onComplete(profile);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="w-6 h-6" />;
      case 2: return <Heart className="w-6 h-6" />;
      case 3: return <Target className="w-6 h-6" />;
      case 4: return <Activity className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            {/* Full Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                min="18"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as Gender }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* City and Occupation */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your occupation"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fitness Level</h2>
              <p className="text-gray-600">How would you describe your current fitness level?</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'Just starting out or returning to fitness' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Regular exercise, comfortable with basic movements' },
                { value: 'advanced', label: 'Advanced', desc: 'Very active, experienced with various workouts' }
              ].map((level) => (
                <label key={level.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value={level.value}
                    checked={formData.fitnessLevel === level.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, fitnessLevel: e.target.value as FitnessLevel }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-500">{level.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fitness Goals</h2>
              <p className="text-gray-600">What's your primary fitness goal?</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'get_active', label: 'Get Active', desc: 'Start moving more and build healthy habits' },
                { value: 'lose_weight', label: 'Lose Weight', desc: 'Reduce body weight and improve body composition' },
                { value: 'build_strength', label: 'Build Strength', desc: 'Increase muscle mass and overall strength' },
                { value: 'maintain_fitness', label: 'Maintain Fitness', desc: 'Stay in current shape and prevent decline' }
              ].map((goal) => (
                <label key={goal.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="fitnessGoal"
                    value={goal.value}
                    checked={formData.fitnessGoal === goal.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, fitnessGoal: e.target.value as FitnessGoal }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{goal.label}</div>
                    <div className="text-sm text-gray-500">{goal.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physical Limitations or Injuries (optional)
              </label>
              <div className="space-y-2">
                {['knee_issues', 'back_problems', 'shoulder_injury', 'heart_condition', 'none'].map((limitation) => (
                  <label key={limitation} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.limitations.includes(limitation)}
                      onChange={() => handleLimitationToggle(limitation)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {limitation.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Preferences</h2>
              <p className="text-gray-600">Let's customize your experience</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Workout Goal
              </label>
              <select
                value={formData.weeklyGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, weeklyGoal: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 workout per week</option>
                <option value={2}>2 workouts per week</option>
                <option value={3}>3 workouts per week</option>
                <option value={4}>4 workouts per week</option>
                <option value={5}>5 workouts per week</option>
                <option value={6}>6 workouts per week</option>
                <option value={7}>Daily workouts</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Activity Type (optional)
              </label>
              <select
                value={formData.activityPreference}
                onChange={(e) => setFormData(prev => ({ ...prev, activityPreference: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No preference</option>
                <option value="cardio">Cardio (Running, Cycling)</option>
                <option value="strength">Strength Training</option>
                <option value="yoga">Yoga & Flexibility</option>
                <option value="sports">Sports & Games</option>
                <option value="mixed">Mixed Activities</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Profile Summary</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                {formData.city && <p><strong>City:</strong> {formData.city}</p>}
                {formData.occupation && <p><strong>Occupation:</strong> {formData.occupation}</p>}
                <p><strong>Fitness Level:</strong> {formData.fitnessLevel}</p>
                <p><strong>Goal:</strong> {formData.fitnessGoal.replace('_', ' ')}</p>
                <p><strong>Weekly Goal:</strong> {formData.weeklyGoal} workouts</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Complete Your Profile</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }
                  `}>
                    {isCompleted ? <Check className="w-5 h-5" /> : getStepIcon(stepNumber)}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && (!formData.firstName.trim() || !formData.lastName.trim())}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Profile
                <Check className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;