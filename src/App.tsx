
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AICoach from "./pages/AICoach";
import WorkoutStart from "./pages/WorkoutStart";
import WorkoutComplete from "./pages/WorkoutComplete";
import Social from "./pages/Social";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import WorkoutBuddyFinder from "./components/WorkoutBuddyFinder";
import HealthInsuranceIntegration from "./components/HealthInsuranceIntegration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
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
              path="/workout-start" 
              element={
                <ProtectedRoute>
                  <WorkoutStart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workout-complete" 
              element={
                <ProtectedRoute>
                  <WorkoutComplete />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workouts" 
              element={
                <ProtectedRoute>
                  <Workouts />
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
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Achievements />
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
              path="/buddy-finder" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                    <WorkoutBuddyFinder />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/health-insurance" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                    <HealthInsuranceIntegration />
                  </div>
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
