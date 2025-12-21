import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI, profileAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

  const handleGenerateWorkout = async () => {
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
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {user?.name}! 👋</h1>
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
                <h3 style={styles.sectionTitle}>Weekly Schedule</h3>
                <div style={styles.workoutGrid}>
                  {workoutPlan.dailyWorkouts.map((day, index) => (
                    <div key={index} style={styles.workoutDay}>
                      <div style={styles.dayHeader}>
                        <h4 style={styles.dayTitle}>{day.day}</h4>
                        <span style={styles.dayDuration}>⏱️ {day.totalDuration} min</span>
                      </div>
                      
                      <div style={styles.exerciseList}>
                        <p style={styles.exerciseCount}>
                          {day.exercises.length} exercises
                        </p>
                        <ul style={styles.exercises}>
                          {day.exercises.slice(0, 3).map((exercise, idx) => (
                            <li key={idx} style={styles.exerciseItem}>
                              • {exercise.name} - {exercise.sets} sets × {exercise.reps}
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
                        onClick={() => navigate('/workout-tracker', { state: { day, planId: workoutPlan._id } })}
                        style={styles.startBtn}
                      >
                        Start Workout →
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
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#f5f5f5',
    padding: '2rem'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#2c3e50',
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.1rem'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '2rem'
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
    color: '#2c3e50',
    fontSize: '1.8rem',
    marginBottom: '1rem'
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  profileItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  profileLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  },
  profileValue: {
    color: '#2c3e50',
    fontSize: '1.1rem',
    fontWeight: 'bold'
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
    color: '#2c3e50',
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    marginBottom: '2rem',
    maxWidth: '500px',
    margin: '0 auto 2rem'
  },
  generateBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  regenerateBtn: {
    backgroundColor: '#9b59b6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  spinner: {
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
    display: 'inline-block'
  },
  planInfo: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #ecf0f1'
  },
  planName: {
    color: '#2c3e50',
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  },
  planDescription: {
    color: '#7f8c8d',
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
    color: '#95a5a6',
    fontSize: '0.9rem',
    marginBottom: '0.25rem'
  },
  statValue: {
    color: '#2c3e50',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  workoutsContainer: {
    marginTop: '2rem'
  },
  sectionTitle: {
    color: '#2c3e50',
    fontSize: '1.5rem',
    marginBottom: '1.5rem'
  },
  workoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  workoutDay: {
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #dee2e6'
  },
  dayTitle: {
    color: '#2c3e50',
    fontSize: '1.2rem',
    margin: 0
  },
  dayDuration: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  exerciseList: {
    marginBottom: '1rem'
  },
  exerciseCount: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  },
  exercises: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  exerciseItem: {
    color: '#34495e',
    fontSize: '0.95rem',
    padding: '0.25rem 0',
    lineHeight: '1.5'
  },
  moreExercises: {
    color: '#3498db',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    marginTop: '0.5rem'
  },
  startBtn: {
    width: '100%',
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1.5rem'
  },
  actionsTitle: {
    color: '#2c3e50',
    fontSize: '1.3rem',
    marginBottom: '1rem'
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  actionBtn: {
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    padding: '1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
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

export default Dashboard;