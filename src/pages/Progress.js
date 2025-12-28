import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressAPI } from '../utils/api';
import Loading from '../components/Loading';
import { useTheme } from '../context/ThemeContext';

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

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState(30); // days
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  // Get dynamic styles based on current theme
  const styles = useMemo(() => {
    const bgPrimary = getCSSVar('--theme-bg-primary', '#f5f7fa');
    const bgSecondary = getCSSVar('--theme-bg-secondary', '#e8edf2');
    const textPrimary = getCSSVar('--theme-text-primary', '#2c3e50');
    const textSecondary = getCSSVar('--theme-text-secondary', '#5a6c7d');
    const accent = getCSSVar('--theme-accent', '#a8c5d9');
    const cardBg = getCSSVar('--theme-card-bg', '#ffffff');
    const border = getCSSVar('--theme-border', '#d1d9e0');
    const shadow = getCSSVar('--theme-shadow', 'rgba(0, 0, 0, 0.1)');
    const buttonPrimary = getCSSVar('--theme-button-primary', accent);
    const buttonPrimaryText = getCSSVar('--theme-button-primary-text', textPrimary);

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'clamp(1rem, 4vw, 2rem)',
        flexWrap: 'wrap',
        gap: '1rem'
      },
      title: {
        color: textPrimary,
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
        marginBottom: '0.5rem',
        wordWrap: 'break-word',
        fontWeight: '700',
        textShadow: `0 2px 10px ${shadow}`,
        transition: 'color 0.3s ease'
      },
      subtitle: {
        color: textSecondary,
        fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
        opacity: 0.9,
        transition: 'color 0.3s ease'
      },
      backBtn: {
        backgroundColor: bgSecondary,
        color: textPrimary,
        padding: '0.75rem 1.5rem',
        border: `1px solid ${border}`,
        borderRadius: '10px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease'
      },
      error: {
        backgroundColor: '#2d1a1a',
        color: '#ff6b6b',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        textAlign: 'center',
        border: '1px solid #ff6b6b'
      },
      timeframeCard: {
        backgroundColor: cardBg,
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        boxShadow: `0 8px 32px ${shadow}`,
        border: `1px solid ${border}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      },
      timeframeLabel: {
        color: textPrimary,
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'color 0.3s ease'
      },
      timeframeButtons: {
        display: 'flex',
        gap: '0.5rem'
      },
      timeframeBtn: {
        backgroundColor: bgSecondary,
        color: textPrimary,
        padding: '0.5rem 1rem',
        border: `1px solid ${border}`,
        borderRadius: '8px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: '500'
      },
      timeframeBtnActive: {
        backgroundColor: buttonPrimary,
        color: buttonPrimaryText,
        borderColor: buttonPrimary,
        fontWeight: '700'
      },
      statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
        gap: 'clamp(1rem, 3vw, 1.5rem)',
        marginBottom: '2rem'
      },
      statCard: {
        backgroundColor: cardBg,
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: `0 8px 32px ${shadow}`,
        border: `1px solid ${border}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      },
      statLabel: {
        color: textSecondary,
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        fontWeight: '500',
        transition: 'color 0.3s ease'
      },
      statValue: {
        color: accent,
        fontSize: '2rem',
        fontWeight: '700',
        transition: 'color 0.3s ease'
      },
      logsCard: {
        backgroundColor: cardBg,
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: `0 8px 32px ${shadow}`,
        border: `1px solid ${border}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      },
      logItem: {
        padding: '1rem',
        borderBottom: `1px solid ${border}`,
        transition: 'border-color 0.3s ease'
      },
      logDate: {
        color: textSecondary,
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        transition: 'color 0.3s ease'
      },
      logWorkout: {
        color: textPrimary,
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.25rem',
        transition: 'color 0.3s ease'
      },
      logDetails: {
        color: textSecondary,
        fontSize: '0.85rem',
        transition: 'color 0.3s ease'
      }
    };
  }, [currentTheme]);

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

export default Progress;
