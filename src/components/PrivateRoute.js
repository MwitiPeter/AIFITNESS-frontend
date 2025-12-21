import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../utils/api';
import Loading from './Loading';

const PrivateRoute = ({ children, requireProfile = false }) => {
  const { isAuthenticated } = useAuth();
  const [hasProfile, setHasProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (requireProfile && isAuthenticated) {
        try {
          const response = await profileAPI.checkProfile();
          setHasProfile(response.data.hasProfile);
        } catch (error) {
          console.error('Profile check failed:', error);
          setHasProfile(false);
        }
      }
      setLoading(false);
    };

    checkProfile();
  }, [requireProfile, isAuthenticated]);

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Checking profile status
  if (requireProfile && loading) {
    return <Loading message="Checking your profile..." />;
  }

  // No profile but required - redirect to onboarding
  if (requireProfile && !hasProfile) {
    return <Navigate to="/onboarding" />;
  }

  // All good - show the component
  return children;
};

export default PrivateRoute;