import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressAPI } from '../utils/api';
import Loading from '../components/Loading';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState(30); // days
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgressData();
  }, [timeframe]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsRes = await progressAPI.getStats(timeframe);
      setStats(statsRes.data.data);

      // Fetch workout logs
      const logsRes = await progressAPI.getLogs({ limit: 10 });
      setLogs(logsRes.data.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Failed to load progress data');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      great: '😄',
      good: '🙂',
      okay: '😐',
      tired: '😴',
      struggled: '😓'
    };
    return moods[mood] || '😐';
  };

  if (loading) {
    return <Loading message="Loading your progress..." />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Your Progress 📊</h1>
            <p style={styles.subtitle}>Track your fitness journey</p>
          </div>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← Back to Dashboard
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Timeframe Selector */}
        <div style={styles.timeframeCard}>
          <span style={styles.timeframeLabel}>Show stats for:</span>
          <div style={styles.timeframeButtons}>
            {[7, 30, 90].map(days => (
              <button
                key={days}
                onClick={() => setTimeframe(days)}
                style={{
                  ...styles.timeframeBtn,
                  ...(timeframe === days ? styles.timeframeBtnActive : {})
                }}
              >
                Last {days} days
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🏋️</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.totalWorkouts}</h3>
                <p style={styles.statLabel}>Total Workouts</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>✅</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.completedWorkouts}</h3>
                <p style={styles.statLabel}>Completed</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>⏱️</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.totalDuration}</h3>
                <p style={styles.statLabel}>Total Minutes</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>🔥</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.totalCalories}</h3>
                <p style={styles.statLabel}>Calories Burned</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📈</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.completionRate}%</h3>
                <p style={styles.statLabel}>Completion Rate</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.avgDifficulty}/5</h3>
                <p style={styles.statLabel}>Avg Difficulty</p>
              </div>
            </div>
          </div>
        )}

        {/* Averages Section */}
        {stats && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 Averages</h2>
            <div style={styles.averagesGrid}>
              <div style={styles.averageItem}>
                <span style={styles.averageLabel}>Average Duration</span>
                <span style={styles.averageValue}>{stats.avgDuration} minutes</span>
              </div>
              <div style={styles.averageItem}>
                <span style={styles.averageLabel}>Average Calories</span>
                <span style={styles.averageValue}>{stats.avgCalories} cal</span>
              </div>
            </div>
          </div>
        )}

        {/* Workout History */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📝 Recent Workouts</h2>
          
          {logs.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No workouts logged yet</p>
              <button 
                onClick={() => navigate('/workout-tracker')}
                style={styles.primaryBtn}
              >
                Log Your First Workout
              </button>
            </div>
          ) : (
            <div style={styles.logsList}>
              {logs.map((log, index) => (
                <div key={log._id || index} style={styles.logCard}>
                  <div style={styles.logHeader}>
                    <div>
                      <h3 style={styles.logDay}>{log.dayOfWeek}</h3>
                      <p style={styles.logDate}>{formatDate(log.date)}</p>
                    </div>
                    <div style={styles.logBadges}>
                      {log.completed && (
                        <span style={styles.completedBadge}>✓ Completed</span>
                      )}
                      <span style={styles.moodBadge}>
                        {getMoodEmoji(log.mood)} {log.mood}
                      </span>
                    </div>
                  </div>

                  <div style={styles.logStats}>
                    <div style={styles.logStat}>
                      <span style={styles.logStatLabel}>Duration:</span>
                      <span style={styles.logStatValue}>{log.totalDuration} min</span>
                    </div>
                    <div style={styles.logStat}>
                      <span style={styles.logStatLabel}>Exercises:</span>
                      <span style={styles.logStatValue}>{log.exercisesCompleted.length}</span>
                    </div>
                    <div style={styles.logStat}>
                      <span style={styles.logStatLabel}>Completion:</span>
                      <span style={styles.logStatValue}>{log.completionPercentage}%</span>
                    </div>
                    {log.caloriesBurned > 0 && (
                      <div style={styles.logStat}>
                        <span style={styles.logStatLabel}>Calories:</span>
                        <span style={styles.logStatValue}>{log.caloriesBurned} cal</span>
                      </div>
                    )}
                  </div>

                  {log.difficultyRating && (
                    <div style={styles.logRating}>
                      <span style={styles.logRatingLabel}>Difficulty:</span>
                      <div style={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            style={{
                              ...styles.star,
                              ...(i < log.difficultyRating ? styles.starFilled : {})
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {log.exercisesCompleted.length > 0 && (
                    <div style={styles.exercisesSummary}>
                      <p style={styles.exercisesSummaryTitle}>Exercises completed:</p>
                      <div style={styles.exercisesTags}>
                        {log.exercisesCompleted.map((ex, idx) => (
                          <span key={idx} style={styles.exerciseTag}>
                            {ex.exerciseName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {log.notes && (
                    <div style={styles.logNotes}>
                      <p style={styles.logNotesLabel}>Notes:</p>
                      <p style={styles.logNotesText}>{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsCard}>
          <h3 style={styles.actionsTitle}>What's Next?</h3>
          <div style={styles.actions}>
            <button 
              onClick={() => navigate('/workout-tracker')}
              style={styles.actionBtn}
            >
              📝 Log Another Workout
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              style={styles.actionBtn}
            >
              💪 View Workout Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#f5f5f5',
    padding: 'clamp(1rem, 4vw, 2rem)'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'clamp(1rem, 4vw, 2rem)',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    color: '#2c3e50',
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    marginBottom: '0.5rem',
    wordWrap: 'break-word'
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)'
  },
  backBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  timeframeCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  timeframeLabel: {
    color: '#555',
    fontWeight: '600',
    fontSize: '1rem'
  },
  timeframeButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  timeframeBtn: {
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  timeframeBtnActive: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    marginBottom: 'clamp(1rem, 4vw, 2rem)'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  statIcon: {
    fontSize: '2.5rem'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    color: '#2c3e50',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 0 0.25rem 0'
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: 0
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: 'clamp(1rem, 4vw, 2rem)',
    marginBottom: 'clamp(1rem, 4vw, 2rem)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box'
  },
  cardTitle: {
    color: '#2c3e50',
    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    wordWrap: 'break-word'
  },
  averagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
    gap: 'clamp(0.75rem, 2vw, 1rem)'
  },
  averageItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  averageLabel: {
    color: '#555',
    fontWeight: '500'
  },
  averageValue: {
    color: '#3498db',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem'
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    marginBottom: '1.5rem'
  },
  primaryBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  logCard: {
    border: '2px solid #ecf0f1',
    borderRadius: '10px',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa'
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #dee2e6',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logDay: {
    color: '#2c3e50',
    fontSize: '1.3rem',
    margin: '0 0 0.25rem 0',
    fontWeight: 'bold'
  },
  logDate: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: 0
  },
  logBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  completedBadge: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  moodBadge: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  logStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(120px, 100%), 1fr))',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    marginBottom: '1rem'
  },
  logStat: {
    display: 'flex',
    flexDirection: 'column'
  },
  logStatLabel: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
    marginBottom: '0.25rem'
  },
  logStatValue: {
    color: '#2c3e50',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  logRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  logRatingLabel: {
    color: '#555',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  stars: {
    display: 'flex',
    gap: '0.25rem'
  },
  star: {
    fontSize: '1rem',
    opacity: 0.3
  },
  starFilled: {
    opacity: 1
  },
  exercisesSummary: {
    marginBottom: '1rem'
  },
  exercisesSummaryTitle: {
    color: '#555',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  exercisesTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  exerciseTag: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.85rem'
  },
  logNotes: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '6px',
    marginTop: '1rem'
  },
  logNotesLabel: {
    color: '#555',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  logNotesText: {
    color: '#2c3e50',
    fontSize: '0.95rem',
    margin: 0,
    lineHeight: '1.5'
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
    backgroundColor: '#3498db',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default Progress;