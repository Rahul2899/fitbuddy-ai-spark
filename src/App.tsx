import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Competitions from '@/pages/Competitions';
import Social from '@/pages/Social';
import WorkoutStart from '@/pages/WorkoutStart';
import AICoach from '@/pages/AICoach';
import Progress from '@/pages/Progress';
import HealthInsuranceIntegration from '@/components/HealthInsuranceIntegration';
import DataAnalytics from '@/components/DataAnalytics';
import { Toaster } from '@/components/ui/toaster';
import '@/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <DataAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/competitions" 
              element={
                <ProtectedRoute>
                  <Competitions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/social" 
              element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workout-start" 
              element={
                <ProtectedRoute>
                  <WorkoutStart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-coach" 
              element={
                <ProtectedRoute>
                  <AICoach />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insurance" 
              element={
                <ProtectedRoute>
                  <HealthInsuranceIntegration />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;