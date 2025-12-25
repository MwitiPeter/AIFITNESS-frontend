import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { workoutAPI, progressAPI } from '../utils/api';
import Loading from '../components/Loading';
import VoicePlayer from '../components/VoicePlayer'; // ADDED
import ExerciseDetails from '../components/ExerciseDetails';
const WorkoutTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Workout log data
  const [logData, setLogData] = useState({
    completedExercises: [],
    totalDuration: 0,
    difficultyRating: 3,
    mood: '',
    notes: ''
  });

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      setLoading(true);

      // Check if we came from dashboard with specific day
      if (location.state?.day && location.state?.planId) {
        setSelectedDay(location.state.day);
        const response = await workoutAPI.getWorkoutById(location.state.planId);
        setWorkoutPlan(response.data.data);
      } else {
        // Fetch active workout plan
        const response = await workoutAPI.getActiveWorkout();
        setWorkoutPlan(response.data.data);
        setSelectedDay(response.data.data.dailyWorkouts[0]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError('No active workout plan found. Please generate one first.');
      setLoading(false);
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    // Reset log data when changing days
    setLogData({
      completedExercises: [],
      totalDuration: 0,
      difficultyRating: 3,
      mood: '',
      notes: ''
    });
  };

  const handleExerciseToggle = (exercise) => {
    setLogData(prev => {
      const exists = prev.completedExercises.find(e => e.exerciseName === exercise.name);

      if (exists) {
        // Remove exercise
        return {
          ...prev,
          completedExercises: prev.completedExercises.filter(e => e.exerciseName !== exercise.name)
        };
      } else {
        // Add exercise
        return {
          ...prev,
          completedExercises: [
            ...prev.completedExercises,
            {
              exerciseName: exercise.name,
              setsCompleted: exercise.sets,
              repsCompleted: Array(exercise.sets).fill(parseInt(exercise.reps) || 10),
              weightUsed: 0,
              notes: ''
            }
          ]
        };
      }
    });
  };

  const isExerciseCompleted = (exerciseName) => {
    return logData.completedExercises.some(e => e.exerciseName === exerciseName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (logData.completedExercises.length === 0) {
      alert('Please check off at least one completed exercise');
      return;
    }

    if (logData.totalDuration === 0) {
      alert('Please enter the workout duration');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const workoutLog = {
        workoutPlanId: workoutPlan._id,
        dayOfWeek: selectedDay.day,
        exercisesCompleted: logData.completedExercises,
        totalDuration: parseInt(logData.totalDuration),
        caloriesBurned: selectedDay.caloriesBurn || 0,
        completed: true,
        completionPercentage: Math.round((logData.completedExercises.length / selectedDay.exercises.length) * 100),
        difficultyRating: logData.difficultyRating,
        mood: logData.mood,
        notes: logData.notes
      };
      await progressAPI.logWorkout(workoutLog);

      alert('✅ Workout logged successfully!');
      navigate('/progress');

    } catch (err) {
      console.error('Error logging workout:', err);
      setError(err.response?.data?.message || 'Failed to log workout');
      setSaving(false);
    }
  };
  if (loading) {
    return <Loading message="Loading workout..." />;
  }
  if (!workoutPlan || !selectedDay) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2>No Workout Plan Found</h2>
          <p>{error || 'Please generate a workout plan first'}</p>
          <button onClick={() => navigate('/dashboard')} style={styles.button}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  const completionPercentage = selectedDay.exercises.length > 0
    ? Math.round((logData.completedExercises.length / selectedDay.exercises.length) * 100)
    : 0;
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>Track Your Workout</h1>
        </div>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.mainGrid} className="workout-tracker-grid">
          {/* Left Side - Day Selection */}
          <div style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Select Workout Day</h3>
            <div style={styles.dayList}>
              {workoutPlan.dailyWorkouts.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDaySelect(day)}
                  style={{
                    ...styles.dayButton,
                    ...(selectedDay.day === day.day ? styles.dayButtonActive : {})
                  }}
                >
                  <span style={styles.dayButtonText}>{day.day}</span>
                  <span style={styles.dayButtonDuration}>⏱️ {day.totalDuration}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Workout Tracking */}
          <div style={styles.main}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>{selectedDay.day}</h2>
                  <p style={styles.cardSubtitle}>
                    {selectedDay.exercises.length} exercises • {selectedDay.totalDuration} minutes
                  </p>
                </div>
                <div style={styles.completionBadge}>
                  {completionPercentage}% Complete
                </div>
              </div>

              {/* Exercise Checklist */}
              {selectedDay.exercises.map((exercise, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.exerciseCard,
                    ...(isExerciseCompleted(exercise.name) ? styles.exerciseCardCompleted : {})
                  }}
                >
                  <div style={styles.exerciseHeader}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isExerciseCompleted(exercise.name)}
                        onChange={() => handleExerciseToggle(exercise)}
                        style={styles.checkbox}
                      />
                      <span style={styles.exerciseName}>{exercise.name}</span>
                    </label>
                  </div>

                  {/* ADDED: Detailed Exercise Instructions */}
                  <ExerciseDetails exercise={exercise} />

                  {/* Voice Player */}
                  <VoicePlayer exercise={exercise} />
                </div>
              ))}
              
              {/* Workout Details Form */}
              <form onSubmit={handleSubmit} style={styles.form}>
                <h3 style={styles.sectionTitle}>Workout Details</h3>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Duration (minutes) *</label>
                    <input
                      type="number"
                      value={logData.totalDuration}
                      onChange={(e) => setLogData({ ...logData, totalDuration: e.target.value })}
                      style={styles.input}
                      placeholder="e.g., 45"
                      min="1"
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>How was it? *</label>
                    <select
                      value={logData.mood}
                      onChange={(e) => setLogData({ ...logData, mood: e.target.value })}
                      style={styles.select}
                      required
                    >
                      <option value="">Select mood</option>
                      <option value="great">😄 Great</option>
                      <option value="good">🙂 Good</option>
                      <option value="okay">😐 Okay</option>
                      <option value="tired">😴 Tired</option>
                      <option value="struggled">😓 Struggled</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Difficulty Rating: {logData.difficultyRating}/5</label>
                  <div style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setLogData({ ...logData, difficultyRating: rating })}
                        style={{
                          ...styles.ratingBtn,
                          ...(logData.difficultyRating >= rating ? styles.ratingBtnActive : {})
                        }}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  <p style={styles.ratingHint}>
                    1 = Too easy, 3 = Just right, 5 = Very challenging
                  </p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Notes (Optional)</label>
                  <textarea
                    value={logData.notes}
                    onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
                    style={styles.textarea}
                    placeholder="Any comments about this workout? (e.g., felt strong, need to increase weight, etc.)"
                    rows="4"
                  />
                </div>

                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '✅ Complete & Save Workout'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 25%, #2d7a5f 50%, #1a5f4a 75%, #0f4c3a 100%)',
    padding: 'clamp(1rem, 4vw, 2rem)'
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    marginBottom: 'clamp(1rem, 4vw, 2rem)'
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    cursor: 'pointer',
    marginBottom: '1rem',
    minHeight: '44px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  title: {
    color: '#ffffff',
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    wordWrap: 'break-word',
    fontWeight: '700',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    border: '1px solid #ffcdd2'
  },
  errorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '3rem',
    borderRadius: '20px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)'
  },
  button: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(250px, 300px) 1fr',
    gap: 'clamp(1rem, 3vw, 2rem)'
  },
  sidebar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    height: 'fit-content',
    position: 'sticky',
    top: 'clamp(1rem, 3vw, 2rem)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  sidebarTitle: {
    color: '#1a5f4a',
    fontSize: '1.2rem',
    marginBottom: '1rem',
    fontWeight: '700'
  },
  dayList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  dayButton: {
    backgroundColor: '#f1f8f4',
    border: '2px solid #e8f5e9',
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dayButtonActive: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
    color: 'white',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
  },
  dayButtonText: {
    fontWeight: '600',
    fontSize: '1rem'
  },
  dayButtonDuration: {
    fontSize: '0.9rem',
    opacity: 0.8
  },
  main: {
    display: 'flex',
    flexDirection: 'column'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: 'clamp(1rem, 4vw, 2rem)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    width: '100%',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e8f5e9'
  },
  cardTitle: {
    color: '#1a5f4a',
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    fontWeight: '700'
  },
  cardSubtitle: {
    color: '#555',
    fontSize: '1rem'
  },
  completionBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
  },
  exerciseSection: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    color: '#1a5f4a',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontWeight: '700'
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  exerciseCard: {
    border: '2px solid #e8f5e9',
    borderRadius: '12px',
    padding: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff'
  },
  exerciseCardCompleted: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)'
  },
  exerciseHeader: {
    marginBottom: '0.75rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginRight: '0.75rem',
    cursor: 'pointer'
  },
  exerciseName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a5f4a'
  },
  exerciseDetails: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap'
  },
  exerciseStat: {
    color: '#555',
    fontSize: '0.95rem'
  },
  exerciseInstructions: {
    color: '#555',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    margin: 0,
    marginBottom: '0.75rem'
  },
  form: {
    borderTop: '2px solid #e8f5e9',
    paddingTop: '2rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    marginBottom: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.5rem'
  },
  label: {
    color: '#1a5f4a',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontSize: '1rem'
  },
  input: {
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '44px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.3s ease'
  },
  select: {
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '44px',
    transition: 'border-color 0.3s ease'
  },
  textarea: {
    padding: 'clamp(0.75rem, 2vw, 0.875rem)',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '100px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.3s ease'
  },
  ratingContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  ratingBtn: {
    backgroundColor: '#e9ecef',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  ratingBtnActive: {
    backgroundColor: '#ffc107',
    transform: 'scale(1.1)',
    boxShadow: '0 2px 8px rgba(255, 193, 7, 0.4)'
  },
  ratingHint: {
    color: '#555',
    fontSize: '0.9rem',
    margin: 0
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: 'clamp(0.875rem, 2vw, 1rem)',
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 3vw, 1.1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    minHeight: '44px',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
    transition: 'all 0.3s ease'
  }
};
export default WorkoutTracker;