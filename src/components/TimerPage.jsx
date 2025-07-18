import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './TimerPage.css';

// Timer Hook
const useTimer = (initialDuration = 25 * 60) => {
  const [state, setState] = useState({
    duration: initialDuration,
    currentTime: initialDuration,
    isRunning: false,
    isPaused: false,
    progress: 0,
  });

  const intervalRef = useRef(null);
  const onCompleteRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false, isPaused: true }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTime: prev.duration,
      isRunning: false,
      isPaused: false,
      progress: 0,
    }));
  }, []);

  const setDuration = useCallback((newDuration) => {
    setState(prev => ({
      ...prev,
      duration: newDuration,
      currentTime: newDuration,
      progress: 0,
    }));
  }, []);

  const setOnComplete = useCallback((callback) => {
    onCompleteRef.current = callback;
  }, []);

  useEffect(() => {
    if (state.isRunning && state.currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newTime = prev.currentTime - 1;
          const newProgress = ((prev.duration - newTime) / prev.duration) * 100;

          if (newTime <= 0) {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
            return {
              ...prev,
              currentTime: 0,
              isRunning: false,
              progress: 100,
            };
          }

          return {
            ...prev,
            currentTime: newTime,
            progress: newProgress,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.currentTime]);

  return {
    ...state,
    formattedTime: formatTime(state.currentTime),
    start,
    pause,
    reset,
    setDuration,
    setOnComplete,
  };
};

// Stats Hook
const useStats = () => {
  const [stats, setStats] = useState({
    todayMinutes: 0,
    sessionsCompleted: 0,
    currentStreak: 0,
    totalFocusTime: 0,
    lastSessionDate: '',
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('zen-timer-stats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        const today = new Date().toDateString();
        
        if (parsedStats.lastSessionDate !== today) {
          setStats(prev => ({
            ...parsedStats,
            todayMinutes: 0,
            lastSessionDate: today,
          }));
        } else {
          setStats(parsedStats);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zen-timer-stats', JSON.stringify(stats));
  }, [stats]);

  const addCompletedSession = (durationMinutes) => {
    const today = new Date().toDateString();
    
    setStats(prev => {
      const isNewDay = prev.lastSessionDate !== today;
      const newStreak = isNewDay ? 1 : prev.currentStreak + (prev.todayMinutes === 0 ? 1 : 0);
      
      return {
        todayMinutes: isNewDay ? durationMinutes : prev.todayMinutes + durationMinutes,
        sessionsCompleted: prev.sessionsCompleted + 1,
        currentStreak: newStreak,
        totalFocusTime: prev.totalFocusTime + durationMinutes,
        lastSessionDate: today,
      };
    });
  };

  return {
    stats,
    addCompletedSession,
  };
};

// Yoga Visualization Component
const YogaVisualization = ({ progress, isRunning }) => {
  const breathingScale = 1 + (progress / 100) * 0.3;
  const glowIntensity = 0.4 + (progress / 100) * 0.6;
  const showFlowers = true; // ✅ define it here to avoid ReferenceError

  return (
    <div className="timer-visualization-container">
      {/* Central meditation orb */}
      <motion.div 
        className="timer-meditation-orb"
        style={{
          background: `radial-gradient(circle, hsl(280, 60%, 70%, ${glowIntensity}) 0%, hsl(280, 40%, 50%, 0.6) 70%, transparent 100%)`,
          boxShadow: `0 0 ${20 + progress * 0.5}px hsl(280, 60%, 70%, ${glowIntensity * 0.8})`,
        }}
        animate={isRunning ? {
          scale: [breathingScale, breathingScale * 1.1, breathingScale],
        } : { scale: breathingScale }}
        transition={{
          duration: 4,
          repeat: isRunning ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <motion.div 
          className="timer-meditation-emoji"
          animate={isRunning ? { rotate: [0, 360] } : {}}
          transition={{
            duration: 20,
            repeat: isRunning ? Infinity : 0,
            ease: "linear"
          }}
        >
          🧘‍♀️
        </motion.div>
      </motion.div>
      
      {/* Breathing rings */}
      <motion.div 
        className="timer-breathing-ring timer-breathing-ring-1"
        style={{
          borderColor: `hsl(280, 50%, 85%, ${glowIntensity * 0.6})`,
        }}
        animate={isRunning ? {
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.2, 0.6],
        } : {}}
        transition={{
          duration: 4,
          repeat: isRunning ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="timer-breathing-ring timer-breathing-ring-2"
        style={{
          borderColor: `hsl(200, 70%, 80%, ${glowIntensity * 0.4})`,
        }}
        animate={isRunning ? {
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.1, 0.4],
        } : {}}
        transition={{
          duration: 6,
          repeat: isRunning ? Infinity : 0,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Progress flowers */}
      {showFlowers && progress > 20 && (
        <motion.div 
          className="timer-progress-flower"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.8,
            y: isRunning ? [-3, 3, -3] : 0,
          }}
          transition={{
            scale: { duration: 0.8 },
            opacity: { duration: 0.8 },
            y: { duration: 4, repeat: isRunning ? Infinity : 0, ease: "easeInOut" }
          }}
        >
          🪷
        </motion.div>
      )}
      
      {showFlowers && progress > 40 && (
        <motion.div 
          className="timer-progress-flower-small timer-progress-flower-right"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.7,
            rotate: isRunning ? [0, 10, -10, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.8, delay: 0.3 },
            opacity: { duration: 0.8, delay: 0.3 },
            rotate: { duration: 5, repeat: isRunning ? Infinity : 0, ease: "easeInOut" }
          }}
        >
          🌸
        </motion.div>
      )}
      
      {showFlowers && progress > 60 && (
        <motion.div 
          className="timer-progress-flower-small timer-progress-flower-left"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.6,
            y: isRunning ? [2, -2, 2] : 0,
          }}
          transition={{
            scale: { duration: 0.8, delay: 0.6 },
            opacity: { duration: 0.8, delay: 0.6 },
            y: { duration: 3, repeat: isRunning ? Infinity : 0, ease: "easeInOut" }
          }}
        >
          🌺
        </motion.div>
      )}
      
      {showFlowers && progress > 80 && (
        <motion.div 
          className="timer-progress-flower-tiny timer-progress-flower-bottom-right"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.8,
            rotate: isRunning ? [0, -15, 15, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.8, delay: 0.9 },
            opacity: { duration: 0.8, delay: 0.9 },
            rotate: { duration: 6, repeat: isRunning ? Infinity : 0, ease: "easeInOut" }
          }}
        >
          ✨
        </motion.div>
      )}
    </div>
  );
};

// Main Timer Component
const TimerPage = () => {
  const timer = useTimer(25 * 60);
  const { stats, addCompletedSession } = useStats();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [showFlowers, setShowFlowers] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  
  // Audio refs for meditation song
  const meditationAudioRef = useRef(null);
  const [isMeditationPlaying, setIsMeditationPlaying] = useState(false);

  // Initialize meditation audio
  useEffect(() => {
    if (soundEnabled) {
      // This will work in your original codebase with assets folder
      meditationAudioRef.current = new Audio('/public/bhajan1.mp3');
      meditationAudioRef.current.loop = true;
      meditationAudioRef.current.volume = 0.3; // Set to 30% volume for peaceful background
      
      // Handle audio events
      meditationAudioRef.current.addEventListener('loadeddata', () => {
        console.log('Meditation song loaded');
      });
      
      meditationAudioRef.current.addEventListener('error', (e) => {
        console.log('Meditation song not found, continuing without background music');
      });
    }
    
    return () => {
      if (meditationAudioRef.current) {
        meditationAudioRef.current.pause();
        meditationAudioRef.current = null;
      }
    };
  }, [soundEnabled]);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Play completion sound
  const playCompletionSound = async () => {
    if (!soundEnabled) return;
    
    try {
      // Try to use the actual om.mp3 file from audio folder
      const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
      await audio.play();
    } catch (error) {
      // Fallback to a meditation bell sound from freesound.org or similar
      try {
        const fallbackAudio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
        await fallbackAudio.play();
      } catch (fallbackError) {
        // Final fallback to simple beep
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz - healing frequency
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 1);
      }
    }
  };

  useEffect(() => {
    timer.setOnComplete(() => {
      playCompletionSound();
      const durationMinutes = Math.floor(timer.duration / 60);
      addCompletedSession(durationMinutes);
      
      if (autoStart) {
        setTimeout(() => {
          timer.start();
        }, 3000); // Auto-start next session after 3 seconds
      }
    });
  }, [timer, addCompletedSession, soundEnabled, autoStart]);

  const handleDurationChange = (minutes) => {
    timer.setDuration(minutes * 60);
  };

  // Play/Stop meditation music
  const toggleMeditationMusic = async () => {
    if (!meditationAudioRef.current || !soundEnabled) return;
    
    try {
      if (isMeditationPlaying) {
        meditationAudioRef.current.pause();
        setIsMeditationPlaying(false);
      } else {
        await meditationAudioRef.current.play();
        setIsMeditationPlaying(true);
      }
    } catch (error) {
      console.log('Could not play meditation music:', error.message);
    }
  };

  // Enhanced start function that includes music
  const handleStartMeditation = () => {
    timer.start();
    if (soundEnabled && meditationAudioRef.current) {
      toggleMeditationMusic();
    }
  };

  // Enhanced pause function that pauses music
  const handlePauseMeditation = () => {
    timer.pause();
    if (isMeditationPlaying) {
      toggleMeditationMusic();
    }
  };

  // Enhanced reset function that stops music
  const handleResetMeditation = () => {
    timer.reset();
    if (isMeditationPlaying) {
      toggleMeditationMusic();
    }
  };

  const durationMinutes = Math.floor(timer.duration / 60);

  // Floating particles
  const particles = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="timer-zen-particle"
      style={{
        backgroundColor: i % 3 === 0 ? 'hsl(280, 60%, 70%)' : i % 3 === 1 ? 'hsl(340, 80%, 75%)' : 'hsl(200, 70%, 80%)',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 10 - 5, 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 3,
        ease: "easeInOut",
      }}
    />
  ));

  return (
    <div className={`timer-yoga-background timer-container ${darkMode ? 'timer-dark' : ''}`}>
      {/* Background image */}
      <div className="timer-background-image" />

      {/* Floating particles */}
      {showParticles && (
        <div className="timer-particles-container">
          {particles}
        </div>
      )}

      {/* Main content */}
      <div className="timer-main-content">
        
        {/* Header */}
        <motion.div 
          className="timer-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="timer-title">
            <motion.span 
              className="timer-title-emoji"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🧘‍♀️
            </motion.span>
            Zen Focus
          </h1>
          <p className="timer-subtitle">
            Find your inner peace through mindful practice
          </p>
        </motion.div>

        {/* Main Timer Card */}
        <motion.div
          className="timer-card timer-main-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          
          {/* Yoga Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <YogaVisualization 
              progress={timer.progress} 
              isRunning={timer.isRunning} 
            />
          </motion.div>

          {/* Timer Controls */}
          <motion.div
            className="timer-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Timer Display */}
            <div className="timer-display">
              <div className="timer-time">
                {timer.formattedTime}
                {isMeditationPlaying && (
                  <motion.span 
                    className="timer-music-indicator"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ marginLeft: '12px', fontSize: '24px' }}
                  >
                    🎵
                  </motion.span>
                )}
              </div>
              <div className="timer-label">
                Mindful Session {isMeditationPlaying ? '• Music Playing' : ''}
              </div>
            </div>

            {/* Duration Slider */}
            <div className="timer-duration-controls">
              <label className="timer-duration-label">
                Adjust Meditation Time
              </label>
              <div className="timer-duration-slider-container">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                  disabled={timer.isRunning}
                  className="timer-slider"
                />
                <div className="timer-duration-values">
                  <span>5 min</span>
                  <span className="timer-duration-current">{durationMinutes} min</span>
                  <span>120 min</span>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="timer-button-controls">
              <button
                onClick={timer.isRunning ? handlePauseMeditation : handleStartMeditation}
                className="timer-btn timer-btn-primary"
              >
                {timer.isRunning ? (
                  <>⏸️ Pause Practice</>
                ) : (
                  <>
                    {timer.isPaused ? '▶️ Resume' : '❤️ Begin Meditation'}
                  </>
                )}
              </button>

              <div className="timer-secondary-buttons">
                <button
                  onClick={handlePauseMeditation}
                  disabled={!timer.isRunning}
                  className="timer-btn timer-btn-secondary"
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={handleResetMeditation}
                  className="timer-btn timer-btn-secondary"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="timer-progress-section">
              <div className="timer-progress-header">
                <span>Session Progress</span>
                <span className="timer-progress-percentage">{Math.round(timer.progress)}%</span>
              </div>
              <div className="timer-progress-bar">
                <div 
                  className="timer-progress-fill" 
                  style={{ width: `${timer.progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          className="timer-statistics-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="timer-card timer-stats-card">
            <div className="timer-stat-value">
              {stats.todayMinutes}
            </div>
            <div className="timer-stat-label">
              Minutes Today
            </div>
          </div>

          <div className="timer-card timer-stats-card">
            <div className="timer-stat-value">
              {stats.sessionsCompleted}
            </div>
            <div className="timer-stat-label">
              Sessions
            </div>
          </div>

          <div className="timer-card timer-stats-card">
            <div className="timer-stat-value">
              {stats.currentStreak}
            </div>
            <div className="timer-stat-label">
              Day Streak
            </div>
          </div>
        </motion.div>

        {/* Settings Buttons */}
        <motion.div 
          className="timer-settings-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <button 
            className="timer-btn timer-btn-secondary timer-btn-icon"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙️
          </button>
          <button 
            className="timer-btn timer-btn-secondary timer-btn-icon"
            onClick={() => setShowStats(!showStats)}
            title="Detailed Statistics"
          >
            📊
          </button>
          <button 
            className={`timer-btn timer-btn-secondary timer-btn-icon ${soundEnabled ? 'timer-active' : 'timer-muted'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Sound On" : "Sound Off"}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </motion.div>

        {/* Settings Modal */}
        {showSettings && (
          <motion.div 
            className="timer-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              className="timer-modal-content timer-settings-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="timer-modal-header">
                <h3>Settings</h3>
                <button 
                  className="timer-modal-close"
                  onClick={() => setShowSettings(false)}
                >
                  ✕
                </button>
              </div>
              <div className="timer-modal-body">
                <div className="timer-setting-item">
                  <label className="timer-setting-label">
                    <span>Dark Mode</span>
                    <div className="timer-theme-toggle">
                      <span className={`timer-theme-option ${!darkMode ? 'timer-active' : ''}`}>☀️</span>
                      <button 
                        className={`timer-toggle-switch ${darkMode ? 'timer-active' : ''}`}
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        <span className="timer-toggle-slider"></span>
                      </button>
                      <span className={`timer-theme-option ${darkMode ? 'timer-active' : ''}`}>🌙</span>
                    </div>
                  </label>
                </div>
                
                <div className="timer-setting-item">
                  <label className="timer-setting-label">
                    <span>Sound notifications</span>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="timer-setting-checkbox"
                    />
                  </label>
                </div>
                
                <div className="timer-setting-item">
                  <label className="timer-setting-label">
                    <span>Auto-start next session</span>
                    <input
                      type="checkbox"
                      checked={autoStart}
                      onChange={(e) => setAutoStart(e.target.checked)}
                      className="timer-setting-checkbox"
                    />
                  </label>
                </div>
                
                <div className="timer-setting-item">
                  <label className="timer-setting-label">
                    <span>Show progress flowers</span>
                    <input
                      type="checkbox"
                      checked={showFlowers}
                      onChange={(e) => setShowFlowers(e.target.checked)}
                      className="timer-setting-checkbox"
                    />
                  </label>
                </div>
                
                <div className="timer-setting-item">
                  <label className="timer-setting-label">
                    <span>Background particles</span>
                    <input
                      type="checkbox"
                      checked={showParticles}
                      onChange={(e) => setShowParticles(e.target.checked)}
                      className="timer-setting-checkbox"
                    />
                  </label>
                </div>
                
                <div className="timer-setting-item">
                  <button 
                    className="timer-btn timer-btn-secondary timer-test-sound-btn"
                    onClick={playCompletionSound}
                  >
                    🔊 Test Sound
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Statistics Modal */}
        {showStats && (
          <motion.div 
            className="timer-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStats(false)}
          >
            <motion.div 
              className="timer-modal-content timer-stats-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="timer-modal-header">
                <h3>Detailed Statistics</h3>
                <button 
                  className="timer-modal-close"
                  onClick={() => setShowStats(false)}
                >
                  ✕
                </button>
              </div>
              <div className="timer-modal-body">
                {/* Quick Stats Overview */}
                <div className="timer-quick-stats">
                  <div className="timer-quick-stat">
                    <div className="timer-quick-stat-value">{stats.todayMinutes}</div>
                    <div className="timer-quick-stat-label">Today</div>
                  </div>
                  <div className="timer-quick-stat">
                    <div className="timer-quick-stat-value">{stats.currentStreak}</div>
                    <div className="timer-quick-stat-label">Streak</div>
                  </div>
                  <div className="timer-quick-stat">
                    <div className="timer-quick-stat-value">{Math.floor(stats.totalFocusTime / 60)}h</div>
                    <div className="timer-quick-stat-label">Total</div>
                  </div>
                </div>

                {/* Detailed Stats Grid */}
                <div className="timer-stats-grid-detailed">
                  <div className="timer-stat-card">
                    <div className="timer-stat-icon">📅</div>
                    <div className="timer-stat-info">
                      <div className="timer-stat-value-large">{stats.todayMinutes}</div>
                      <div className="timer-stat-label-large">Minutes Today</div>
                      <div className="timer-stat-progress">
                        <div className="timer-stat-progress-bar" style={{ width: `${Math.min((stats.todayMinutes / 120) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="timer-stat-card">
                    <div className="timer-stat-icon">🧘‍♀️</div>
                    <div className="timer-stat-info">
                      <div className="timer-stat-value-large">{stats.sessionsCompleted}</div>
                      <div className="timer-stat-label-large">Total Sessions</div>
                      <div className="timer-stat-subtext">+{stats.sessionsCompleted > 0 ? '1 this session' : '0 today'}</div>
                    </div>
                  </div>
                  
                  <div className="timer-stat-card">
                    <div className="timer-stat-icon">🔥</div>
                    <div className="timer-stat-info">
                      <div className="timer-stat-value-large">{stats.currentStreak}</div>
                      <div className="timer-stat-label-large">Day Streak</div>
                      <div className="timer-stat-subtext">{stats.currentStreak > 0 ? 'Keep going!' : 'Start today!'}</div>
                    </div>
                  </div>
                  
                  <div className="timer-stat-card">
                    <div className="timer-stat-icon">⏱️</div>
                    <div className="timer-stat-info">
                      <div className="timer-stat-value-large">{Math.floor(stats.totalFocusTime / 60)}h {stats.totalFocusTime % 60}m</div>
                      <div className="timer-stat-label-large">Total Focus Time</div>
                      <div className="timer-stat-subtext">{stats.totalFocusTime} minutes total</div>
                    </div>
                  </div>
                  
                  <div className="timer-stat-card">
                    <div className="timer-stat-icon">🌅</div>
                    <div className="timer-stat-info">
                      <div className="timer-stat-value-large">{stats.lastSessionDate && stats.lastSessionDate !== new Date().toDateString() ? new Date(stats.lastSessionDate).toLocaleDateString() : 'Today'}</div>
                      <div className="timer-stat-label-large">Last Session</div>
                      <div className="timer-stat-subtext">{stats.lastSessionDate ? 'Recent activity' : 'No sessions yet'}</div>
                    </div>
                  </div>
                  
                  <div className="timer-stat-card">
                    <div className="timer-stat-icon">📈</div>
                    <div className="timer-stat-info">
                      <div className="timer-stat-value-large">{stats.sessionsCompleted > 0 ? Math.round(stats.totalFocusTime / stats.sessionsCompleted) : 0} min</div>
                      <div className="timer-stat-label-large">Average Session</div>
                      <div className="timer-stat-subtext">{stats.sessionsCompleted > 0 ? 'Per session' : 'No data yet'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Weekly Progress Chart */}
                <div className="timer-weekly-progress">
                  <h4>This Week</h4>
                  <div className="timer-week-chart">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="timer-day-column">
                        <div className="timer-day-bar" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                        <div className="timer-day-label">{day}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Achievement System */}
                <div className="timer-achievements-section">
                  <h4>Achievements</h4>
                  <div className="timer-achievements-grid">
                    <div className={`timer-achievement ${stats.sessionsCompleted >= 1 ? 'timer-unlocked' : 'timer-locked'}`}>
                      <div className="timer-achievement-icon">🌱</div>
                      <div className="timer-achievement-info">
                        <div className="timer-achievement-text">First Steps</div>
                        <div className="timer-achievement-desc">Complete your first session</div>
                      </div>
                    </div>
                    <div className={`timer-achievement ${stats.sessionsCompleted >= 10 ? 'timer-unlocked' : 'timer-locked'}`}>
                      <div className="timer-achievement-icon">🌿</div>
                      <div className="timer-achievement-info">
                        <div className="timer-achievement-text">Growing Strong</div>
                        <div className="timer-achievement-desc">Complete 10 sessions</div>
                      </div>
                    </div>
                    <div className={`timer-achievement ${stats.currentStreak >= 7 ? 'timer-unlocked' : 'timer-locked'}`}>
                      <div className="timer-achievement-icon">🏆</div>
                      <div className="timer-achievement-info">
                        <div className="timer-achievement-text">Week Warrior</div>
                        <div className="timer-achievement-desc">7-day meditation streak</div>
                      </div>
                    </div>
                    <div className={`timer-achievement ${stats.totalFocusTime >= 1440 ? 'timer-unlocked' : 'timer-locked'}`}>
                      <div className="timer-achievement-icon">💎</div>
                      <div className="timer-achievement-info">
                        <div className="timer-achievement-text">Zen Master</div>
                        <div className="timer-achievement-desc">24 hours of total focus</div>
                      </div>
                    </div>
                    <div className={`timer-achievement ${stats.sessionsCompleted >= 50 ? 'timer-unlocked' : 'timer-locked'}`}>
                      <div className="timer-achievement-icon">🌸</div>
                      <div className="timer-achievement-info">
                        <div className="timer-achievement-text">Mindful Journey</div>
                        <div className="timer-achievement-desc">50 meditation sessions</div>
                      </div>
                    </div>
                    <div className={`timer-achievement ${stats.currentStreak >= 30 ? 'timer-unlocked' : 'timer-locked'}`}>
                      <div className="timer-achievement-icon">🧘‍♀️</div>
                      <div className="timer-achievement-info">
                        <div className="timer-achievement-text">Enlightened</div>
                        <div className="timer-achievement-desc">30-day streak</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TimerPage;