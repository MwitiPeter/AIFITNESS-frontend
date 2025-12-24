import React, { useState, useEffect } from 'react';

const VoicePlayer = ({ exercise }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isSupported, setIsSupported] = useState(true);

  // Check if browser supports speech synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      console.warn('Speech synthesis not supported in this browser');
    }
  }, []);

  // Build the text to be spoken
  const buildSpeechText = () => {
    let text = `Exercise: ${exercise.name}. `;
    text += `${exercise.sets} sets of ${exercise.reps} repetitions. `;
    if (exercise.restTime) {
      text += `Rest for ${exercise.restTime} seconds between sets. `;
    }
    if (exercise.instructions) {
      text += `Instructions: ${exercise.instructions}`;
    }
    return text;
  };

  // Handle speaking
  const handleSpeak = () => {
    if (!isSupported) {
      alert('Voice instructions are not supported in your browser. Please try Chrome, Safari, or Edge.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // If already speaking, just resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // Create new speech utterance
    const utterance = new SpeechSynthesisUtterance(buildSpeechText());
    
    // Configure speech
    utterance.rate = speed; // Speed: 0.1 to 10
    utterance.pitch = 1; // Pitch: 0 to 2
    utterance.volume = 1; // Volume: 0 to 1
    
    // Set language (you can make this dynamic later)
    utterance.lang = 'en-US';

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  };

  // Handle pause
  const handlePause = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  // Handle stop
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Handle speed change
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    // Save preference to localStorage
    localStorage.setItem('voiceSpeed', newSpeed);
    
    // If currently speaking, restart with new speed
    if (isSpeaking || isPaused) {
      handleStop();
      setTimeout(() => {
        handleSpeak();
      }, 100);
    }
  };

  // Load saved speed preference on mount
  useEffect(() => {
    const savedSpeed = localStorage.getItem('voiceSpeed');
    if (savedSpeed) {
      setSpeed(parseFloat(savedSpeed));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!isSupported) {
    return null; // Don't show anything if not supported
  }

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        {/* Play/Resume button */}
        {!isSpeaking && !isPaused && (
          <button 
            onClick={handleSpeak} 
            style={styles.button}
            title="Listen to instructions"
          >
            🔊 Listen
          </button>
        )}

        {/* Resume button (when paused) */}
        {isPaused && (
          <button 
            onClick={handleSpeak} 
            style={{...styles.button, ...styles.resumeButton}}
            title="Resume"
          >
            ▶️ Resume
          </button>
        )}

        {/* Pause button (when speaking) */}
        {isSpeaking && (
          <button 
            onClick={handlePause} 
            style={{...styles.button, ...styles.pauseButton}}
            title="Pause"
          >
            ⏸️ Pause
          </button>
        )}

        {/* Stop button (when speaking or paused) */}
        {(isSpeaking || isPaused) && (
          <button 
            onClick={handleStop} 
            style={{...styles.button, ...styles.stopButton}}
            title="Stop"
          >
            ⏹️ Stop
          </button>
        )}

        {/* Speed selector */}
        <select 
          value={speed} 
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          style={styles.speedSelect}
          title="Speech speed"
        >
          <option value="0.8">0.8x (Slow)</option>
          <option value="1.0">1.0x (Normal)</option>
          <option value="1.2">1.2x (Fast)</option>
        </select>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div style={styles.indicator}>
          <span style={styles.wave}>🔊</span>
          <span style={styles.speakingText}>Speaking...</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  controls: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: '#3498db',
    color: 'white',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  resumeButton: {
    backgroundColor: '#27ae60'
  },
  pauseButton: {
    backgroundColor: '#f39c12'
  },
  stopButton: {
    backgroundColor: '#e74c3c'
  },
  speedSelect: {
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.85rem',
    cursor: 'pointer',
    backgroundColor: 'white'
  },
  indicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
    fontSize: '0.9rem'
  },
  wave: {
    animation: 'pulse 1s ease-in-out infinite',
    fontSize: '1.2rem'
  },
  speakingText: {
    color: '#1976d2',
    fontWeight: '500'
  }
};

// Add pulse animation to document
const styleSheet = document.styleSheets[0];
try {
  const keyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
  `;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Animation may already exist
}

export default VoicePlayer;