import React from 'react';
import { motion } from 'framer-motion';

const SettingsPanel = ({ onClose, soundOn, setSoundOn }) => {
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
          <h2>Settings ⚙️</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="panel-body">
          <label className="toggle-row">
            <span>Enable Sound</span>
            <input
              type="checkbox"
              checked={soundOn}
              onChange={() => setSoundOn(prev => !prev)}
            />
          </label>
          {/* Add more toggles here if needed */}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPanel;
