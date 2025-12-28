import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Loading from './components/Loading';
import { ToastContainer } from './components/Toast';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkoutTracker = lazy(() => import('./pages/WorkoutTracker'));
const Progress = lazy(() => import('./pages/Progress'));

// Simple Protected Route Component (no profile check needed)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="App" style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg-primary)', color: 'var(--theme-text-primary)' }}>
            <Navbar />
            <Suspense fallback={<Loading message="Loading..." />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                {/* Onboarding - requires authentication but NOT profile completion */}
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Dashboard - requires authentication AND completed profile */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute requireProfile={true}>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />

                {/* Workout Tracker - requires authentication AND completed profile */}
                <Route 
                  path="/workout-tracker" 
                  element={
                    <PrivateRoute requireProfile={true}>
                      <WorkoutTracker />
                    </PrivateRoute>
                  } 
                />

                {/* Progress Page - requires authentication AND completed profile */}
                <Route 
                  path="/progress" 
                  element={
                    <PrivateRoute requireProfile={true}>
                      <Progress />
                    </PrivateRoute>
                  } 
                />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
            <PWAInstallPrompt />
            <ToastContainer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;