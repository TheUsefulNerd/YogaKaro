import React from 'react';
import { motion } from 'framer-motion';

const StatsPanel = ({ stats, onClose }) => {
  return (
    <motion.div 
      className="side-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="side-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <h2>Statistics 📊</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="panel-body">
          <p><strong>Today’s Focus:</strong> {stats.todayMinutes} min</p>
          <p><strong>Total Focus Time:</strong> {stats.totalFocusTime} min</p>
          <p><strong>Sessions Completed:</strong> {stats.sessionsCompleted}</p>
          <p><strong>Current Streak:</strong> {stats.currentStreak} days</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsPanel;
