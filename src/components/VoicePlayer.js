import React, { useState, useEffect, useRef } from 'react';

const VoicePlayer = ({ exercise }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isSupported, setIsSupported] = useState(true);
  
  // Use a ref to track the current utterance to prevent garbage collection issues
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    
    // Prime the voices (Chrome fix)
    window.speechSynthesis.getVoices();
  }, []);

  // 1. SANITIZE TEXT: Remove emojis (🔥, ⏹️, etc.) that crash the engine
  const buildSpeechText = () => {
    let text = `Exercise: ${exercise.name}. `;
    text += `${exercise.sets} sets of ${exercise.reps} repetitions. `;
    if (exercise.restTime) {
      text += `Rest for ${exercise.restTime} seconds between sets. `;
    }
    if (exercise.instructions) {
      text += `Instructions: ${exercise.instructions}`;
    }

    // Regex to remove emojis and special symbols
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  };

  const handleSpeak = () => {
    if (!isSupported) return;

    // 2. CLEAR QUEUE: Always cancel before starting
    window.speechSynthesis.cancel();

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // 3. ASYNC DELAY: Small timeout ensures the 'cancel' above finished 
    // and the audio hardware is released.
    setTimeout(() => {
      const cleanText = buildSpeechText();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      // Select a local voice to avoid 'network' synthesis errors
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google')) || voices[0];
      
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.rate = speed;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        // Only log if it's not a manual 'interrupted' or 'canceled' event
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error('SpeechSynthesis Error:', event.error);
        }
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 100); 
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    localStorage.setItem('voiceSpeed', newSpeed);
    
    // Restart if currently active
    if (isSpeaking || isPaused) {
      handleStop();
      setTimeout(() => handleSpeak(), 200);
    }
  };

  useEffect(() => {
    const savedSpeed = localStorage.getItem('voiceSpeed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));
    
    return () => window.speechSynthesis.cancel();
  }, []);

  if (!isSupported) return null;

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        {!isSpeaking && !isPaused && (
          <button onClick={handleSpeak} style={styles.button}>🔊 Listen</button>
        )}
        {isPaused && (
          <button onClick={handleSpeak} style={{...styles.button, ...styles.resumeButton}}>▶️ Resume</button>
        )}
        {isSpeaking && (
          <button onClick={handlePause} style={{...styles.button, ...styles.pauseButton}}>⏸️ Pause</button>
        )}
        {(isSpeaking || isPaused) && (
          <button onClick={handleStop} style={{...styles.button, ...styles.stopButton}}>⏹️ Stop</button>
        )}

        <select 
          value={speed} 
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          style={styles.speedSelect}
        >
          <option value="0.8">0.8x</option>
          <option value="1.0">1.0x</option>
          <option value="1.2">1.2x</option>
        </select>
      </div>

      {isSpeaking && (
        <div style={styles.indicator}>
          <span style={styles.wave}>🔊</span>
          <span style={styles.speakingText}>Speaking...</span>
        </div>
      )}
    </div>
  );
};

// ... Styles remain the same as your original code
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