import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import WorkoutTracker from './pages/WorkoutTracker';
import Progress from './pages/Progress';

// Simple Protected Route Component (no profile check needed)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
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
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;