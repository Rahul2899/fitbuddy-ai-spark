// src/pages/Auth.tsx
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const { user, signUp, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, checking profile...');
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        console.log('User has profile, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('User has no profile, redirecting to dashboard for setup');
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        console.log('Starting signup for:', formData.email);
        const { user: newUser, error } = await signUp(
          formData.email, 
          formData.password, 
          { full_name: formData.fullName }
        );

        if (error) {
          toast({
            title: "Signup Failed", 
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (newUser) {
          toast({
            title: "Account Created!", 
            description: "Welcome to BewegungsLiga+! Let's set up your profile.",
            variant: "default"
          });
          
          // Clear any existing profile data for new user
          localStorage.removeItem('userProfile');
          
          // Navigate to dashboard for profile setup
          navigate('/dashboard');
        }
      } else {
        console.log('Starting signin for:', formData.email);
        const { user: existingUser, error } = await signIn(formData.email, formData.password);

        if (error) {
          toast({
            title: "Sign In Failed", 
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (existingUser) {
          toast({
            title: "Welcome Back!", 
            description: "You're successfully signed in.",
            variant: "default"
          });
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error", 
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-white to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-blue-800">BL+</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isSignUp ? 'Join BewegungsLiga+' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignUp ? 'Start your fitness journey today' : 'Sign in to continue your fitness journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({ email: '', password: '', fullName: '' });
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </button>
          </div>

          {isSignUp && (
            <div className="mt-4 text-xs text-gray-500 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy.
              <br />
              🎯 No email verification required - get started immediately!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}