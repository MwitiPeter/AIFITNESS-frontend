import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI, profileAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Loading from '../components/Loading';
import VoicePlayer from '../components/VoicePlayer';
import ExerciseDetails from '../components/ExerciseDetails';

const Dashboard = React.memo(() => {
  const [profile, setProfile] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  
  // Get styles using CSS variables (theme-agnostic)
  const styles = useMemo(() => getStyles(), [currentTheme]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch profile
      const profileRes = await profileAPI.getMyProfile();
      setProfile(profileRes.data.data);

      // Try to fetch active workout plan
      try {
        const workoutRes = await workoutAPI.getActiveWorkout();
        setWorkoutPlan(workoutRes.data.data);
      } catch (err) {
        // No active workout plan yet
        console.log('No active workout plan');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerateWorkout = useCallback(async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await workoutAPI.generateWorkout();
      setWorkoutPlan(response.data.data);
      alert('✅ Workout plan generated successfully!');
    } catch (err) {
      console.error('Error generating workout:', err);
      setError(err.response?.data?.message || 'Failed to generate workout plan');
    } finally {
      setGenerating(false);
    }
  }, []);

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  // Get dynamic styles based on current theme
  const styles = useMemo(() => getStyles(currentTheme), [currentTheme]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {user?.name?.split(' ')[0] || user?.name}! 👋</h1>
            <p style={styles.subtitle}>Your personalized fitness dashboard</p>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Profile Summary */}
        {profile && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 Your Profile</h2>
            <div style={styles.profileGrid}>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Fitness Level:</span>
                <span style={styles.profileValue}>
                  {profile.fitnessLevel.charAt(0).toUpperCase() + profile.fitnessLevel.slice(1)}
                </span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Age:</span>
                <span style={styles.profileValue}>{profile.age} years</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Goals:</span>
                <span style={styles.profileValue}>
                  {profile.fitnessGoals.map(g => g.replace('_', ' ')).join(', ')}
                </span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Workouts/Week:</span>
                <span style={styles.profileValue}>{profile.workoutsPerWeek} days</span>
              </div>
            </div>
          </div>
        )}

        {/* Workout Plan Section */}
        {!workoutPlan ? (
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🤖</span>
              <h2 style={styles.emptyTitle}>No Workout Plan Yet</h2>
              <p style={styles.emptyText}>
                Generate your personalized AI-powered workout plan based on your profile and goals!
              </p>
              <button
                onClick={handleGenerateWorkout}
                style={styles.generateBtn}
                disabled={generating}
                aria-label="Generate personalized workout plan"
              >
                {generating ? (
                  <>
                    <span style={styles.spinner}></span>
                    Generating Your Plan... (This may take 20-30 seconds)
                  </>
                ) : (
                  '✨ Generate My Workout Plan'
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Current Workout Plan */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>💪 Your Current Workout Plan</h2>
                <button
                  onClick={handleGenerateWorkout}
                  style={styles.regenerateBtn}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : '🔄 Generate New Plan'}
                </button>
              </div>

              <div style={styles.planInfo}>
                <h3 style={styles.planName}>{workoutPlan.planName}</h3>
                <p style={styles.planDescription}>{workoutPlan.description}</p>

                <div style={styles.planStats}>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Difficulty:</span>
                    <span style={styles.statValue}>
                      {workoutPlan.difficultyLevel.charAt(0).toUpperCase() + workoutPlan.difficultyLevel.slice(1)}
                    </span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Total Days:</span>
                    <span style={styles.statValue}>{workoutPlan.dailyWorkouts.length} days</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Created:</span>
                    <span style={styles.statValue}>
                      {new Date(workoutPlan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Daily Workouts */}
              <div style={styles.workoutsContainer}>
                <h3 style={styles.sectionTitle}>📅 Your Workout Schedule</h3>
                <div style={styles.workoutGrid}>
                  {workoutPlan.dailyWorkouts.map((day, dayIndex) => (
                    <div key={dayIndex} style={styles.workoutDay}>
                      <div style={styles.dayHeader}>
                        <h4 style={styles.dayTitle}>{day.day}</h4>
                        <span style={styles.dayDuration}>
                          ⏱️ {day.totalDuration} min
                        </span>
                      </div>
                      
                      <div style={styles.exerciseList}>
                        <p style={styles.exerciseCount}>
                          {day.exercises.length} exercises
                        </p>
                        <ul style={styles.exercises}>
                          {day.exercises.slice(0, 3).map((exercise, idx) => (
                            <li key={idx} style={styles.exerciseListItem}>
                              • {exercise.name} ({exercise.sets} sets × {exercise.reps} reps)
                            </li>
                          ))}
                          {day.exercises.length > 3 && (
                            <li style={styles.moreExercises}>
                              + {day.exercises.length - 3} more exercises
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => navigate('/workout-tracker', { 
                          state: { day: day, planId: workoutPlan._id } 
                        })}
                        style={styles.startBtn}
                        aria-label={`Start ${day.day} workout`}
                      >
                        Start This Workout
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.actionsCard}>
              <h3 style={styles.actionsTitle}>Quick Actions</h3>
              <div style={styles.actions}>
                <button
                  onClick={() => navigate('/workout-tracker')}
                  style={styles.actionBtn}
                >
                  📝 Log Workout
                </button>
                <button
                  onClick={() => navigate('/progress')}
                  style={styles.actionBtn}
                >
                  📊 View Progress
                </button>
                <button
                  onClick={() => navigate('/onboarding')}
                  style={styles.actionBtn}
                >
                  ⚙️ Update Profile
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

// Helper function to get CSS variable
const getCSSVar = (varName, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(varName).trim();
    return value || fallback;
  } catch {
    return fallback;
  }
};

// Get theme-aware styles using CSS variables
const getStyles = () => {
  const bgPrimary = getCSSVar('--theme-bg-primary', '#f5f7fa');
  const bgSecondary = getCSSVar('--theme-bg-secondary', '#e8edf2');
  const textPrimary = getCSSVar('--theme-text-primary', '#2c3e50');
  const textSecondary = getCSSVar('--theme-text-secondary', '#5a6c7d');
  const accent = getCSSVar('--theme-accent', '#a8c5d9');
  const cardBg = getCSSVar('--theme-card-bg', '#ffffff');
  const border = getCSSVar('--theme-border', '#d1d9e0');
  const shadow = getCSSVar('--theme-shadow', 'rgba(0, 0, 0, 0.1)');
  
  return {
    container: {
      minHeight: 'calc(100vh - 70px)',
      background: `linear-gradient(180deg, ${bgPrimary} 0%, ${bgSecondary} 50%, ${bgPrimary} 100%)`,
      padding: 'clamp(1rem, 4vw, 2rem)',
      transition: 'background 0.3s ease'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    },
    header: {
      marginBottom: 'clamp(1rem, 4vw, 2rem)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    title: {
      color: textPrimary,
      fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
      marginBottom: '0.5rem',
      wordWrap: 'break-word',
      fontWeight: '700',
      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
    },
    subtitle: {
      color: textSecondary,
      fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
      opacity: 0.9
    },
    error: {
      backgroundColor: cardBg,
      color: '#ff6b6b',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      textAlign: 'center',
      border: '1px solid #ff6b6b'
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: '20px',
      boxShadow: `0 8px 32px ${shadow}`,
      padding: 'clamp(1rem, 4vw, 2rem)',
      marginBottom: 'clamp(1rem, 4vw, 2rem)',
      width: '100%',
      boxSizing: 'border-box',
      border: `1px solid ${border}`,
      transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    cardTitle: {
      color: textPrimary,
      fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
      marginBottom: '1rem',
      wordWrap: 'break-word',
      fontWeight: '700'
    },
    profileGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
      gap: 'clamp(0.75rem, 2vw, 1rem)'
    },
    profileItem: {
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      backgroundColor: bgSecondary,
      borderRadius: '12px',
      border: `1px solid ${border}`,
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    },
    profileLabel: {
      color: textSecondary,
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    profileValue: {
      color: accent,
      fontSize: '1.1rem',
      fontWeight: '700'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 1rem'
    },
    emptyIcon: {
      fontSize: '5rem',
      display: 'block',
      marginBottom: '1rem'
    },
    emptyTitle: {
      color: textPrimary,
      fontSize: '2rem',
      marginBottom: '1rem',
      fontWeight: '700'
    },
    emptyText: {
      color: textSecondary,
      fontSize: '1.1rem',
      marginBottom: '2rem',
      maxWidth: '500px',
      margin: '0 auto 2rem'
    },
    generateBtn: {
      backgroundColor: accent,
      color: textPrimary,
      padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
      border: 'none',
      borderRadius: '12px',
      fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      minHeight: '48px',
      width: '100%',
      maxWidth: '400px',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease'
    },
    regenerateBtn: {
      backgroundColor: accent,
      color: textPrimary,
      padding: '0.875rem 1.5rem',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      minHeight: '48px'
    },
    spinner: {
      border: `3px solid ${textPrimary}33`,
      borderTop: `3px solid ${textPrimary}`,
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      animation: 'spin 1s linear infinite',
      display: 'inline-block'
    },
    planInfo: {
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: `1px solid ${border}`
    },
    planName: {
      color: textPrimary,
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
      fontWeight: '700'
    },
    planDescription: {
      color: textSecondary,
      fontSize: '1rem',
      marginBottom: '1rem'
    },
    planStats: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap'
    },
    stat: {
      display: 'flex',
      flexDirection: 'column'
    },
    statLabel: {
      color: textSecondary,
      fontSize: '0.9rem',
      marginBottom: '0.25rem',
      fontWeight: '500'
    },
    statValue: {
      color: accent,
      fontSize: '1.1rem',
      fontWeight: '700'
    },
    workoutsContainer: {
      marginTop: '2rem'
    },
    sectionTitle: {
      color: textPrimary,
      fontSize: '1.5rem',
      marginBottom: '1.5rem',
      fontWeight: '700'
    },
    workoutGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
      gap: 'clamp(1rem, 3vw, 1.5rem)'
    },
    workoutDay: {
      border: `1px solid ${border}`,
      borderRadius: '16px',
      padding: '1.5rem',
      backgroundColor: bgSecondary,
      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.3s ease, background-color 0.3s ease',
      boxShadow: `0 4px 12px ${shadow}`
    },
    dayHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: `1px solid ${border}`
    },
    dayTitle: {
      color: textPrimary,
      fontSize: '1.2rem',
      margin: 0,
      fontWeight: '700'
    },
    dayDuration: {
      color: accent,
      fontSize: '0.9rem',
      fontWeight: '600'
    },
    exerciseList: {
      marginBottom: '1rem'
    },
    exerciseCount: {
      color: textSecondary,
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    exercises: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    exerciseItem: {
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: `1px solid ${border}`
    },
    exerciseListItem: {
      color: textPrimary,
      fontSize: '0.95rem',
      padding: '0.25rem 0',
      lineHeight: '1.5',
      marginBottom: '0.5rem'
    },
    moreExercises: {
      color: accent,
      fontSize: '0.9rem',
      fontStyle: 'italic',
      marginTop: '0.5rem',
      fontWeight: '600'
    },
    startBtn: {
      width: '100%',
      backgroundColor: accent,
      color: textPrimary,
      padding: '0.875rem',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      minHeight: '48px',
      marginTop: '1rem'
    },
    actionsCard: {
      backgroundColor: cardBg,
      borderRadius: '20px',
      boxShadow: `0 8px 32px ${shadow}`,
      padding: '1.5rem',
      border: `1px solid ${border}`,
      transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
    },
    actionsTitle: {
      color: textPrimary,
      fontSize: '1.3rem',
      marginBottom: '1rem',
      fontWeight: '700'
    },
    actions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
      gap: 'clamp(0.75rem, 2vw, 1rem)'
    },
    actionBtn: {
      backgroundColor: bgSecondary,
      color: textPrimary,
      padding: 'clamp(0.875rem, 2vw, 1rem)',
      border: `1px solid ${border}`,
      borderRadius: '12px',
      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '48px',
      wordWrap: 'break-word'
    },
    exerciseHeader: {
      marginBottom: '0.5rem'
    },
    exerciseName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: textPrimary
    }
  };
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
try {
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Animation already exists
}

Dashboard.displayName = 'Dashboard';

export default Dashboard;