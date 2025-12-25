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
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 25%, #2d7a5f 50%, #1a5f4a 75%, #0f4c3a 100%)',
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
    color: '#ffffff',
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    marginBottom: '0.5rem',
    wordWrap: 'break-word',
    fontWeight: '700',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  subtitle: {
    color: '#e8f5e9',
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
    opacity: 0.9
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    textAlign: 'center',
    border: '1px solid #ffcdd2'
  },
  timeframeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '1.5rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  timeframeLabel: {
    color: '#1a5f4a',
    fontWeight: '600',
    fontSize: '1rem'
  },
  timeframeButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  timeframeBtn: {
    backgroundColor: '#f1f8f4',
    color: '#1a5f4a',
    padding: '0.5rem 1rem',
    border: '2px solid #e8f5e9',
    borderRadius: '10px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  },
  timeframeBtnActive: {
    backgroundColor: '#4caf50',
    color: 'white',
    borderColor: '#4caf50',
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    marginBottom: 'clamp(1rem, 4vw, 2rem)'
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.3s ease'
  },
  statIcon: {
    fontSize: '2.5rem'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    color: '#1a5f4a',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.25rem 0'
  },
  statLabel: {
    color: '#555',
    fontSize: '0.9rem',
    margin: 0,
    fontWeight: '500'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: 'clamp(1rem, 4vw, 2rem)',
    marginBottom: 'clamp(1rem, 4vw, 2rem)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    width: '100%',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  cardTitle: {
    color: '#1a5f4a',
    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    wordWrap: 'break-word',
    fontWeight: '700'
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
    backgroundColor: '#f1f8f4',
    borderRadius: '12px',
    border: '1px solid rgba(76, 175, 80, 0.2)'
  },
  averageLabel: {
    color: '#555',
    fontWeight: '600'
  },
  averageValue: {
    color: '#4caf50',
    fontSize: '1.2rem',
    fontWeight: '700'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem'
  },
  emptyText: {
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: '1.5rem'
  },
  primaryBtn: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
    transition: 'all 0.3s ease'
  },
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  logCard: {
    border: '2px solid #e8f5e9',
    borderRadius: '16px',
    padding: '1.5rem',
    backgroundColor: '#f1f8f4',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(76, 175, 80, 0.2)',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logDay: {
    color: '#1a5f4a',
    fontSize: '1.3rem',
    margin: '0 0 0.25rem 0',
    fontWeight: '700'
  },
  logDate: {
    color: '#555',
    fontSize: '0.9rem',
    margin: 0
  },
  logBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  completedBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
  },
  moodBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
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
    color: '#555',
    fontSize: '0.85rem',
    marginBottom: '0.25rem',
    fontWeight: '500'
  },
  logStatValue: {
    color: '#1a5f4a',
    fontSize: '1.1rem',
    fontWeight: '700'
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
    fontWeight: '600'
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
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  exercisesTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  exerciseTag: {
    backgroundColor: '#e8f5e9',
    color: '#1a5f4a',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: '500',
    border: '1px solid rgba(76, 175, 80, 0.3)'
  },
  logNotes: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '10px',
    marginTop: '1rem',
    border: '1px solid #e8f5e9'
  },
  logNotesLabel: {
    color: '#1a5f4a',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  actionsTitle: {
    color: '#1a5f4a',
    fontSize: '1.3rem',
    marginBottom: '1rem',
    fontWeight: '700'
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  actionBtn: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
  }
};

export default Progress;