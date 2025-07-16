// src/components/CheckpointSlider.js
import React from 'react';
import { motion } from 'framer-motion';
import '../mcss/CheckpointSlider.css';

const CheckpointSlider = ({ totalSteps = 8, currentStep = 2 }) => {
  const checkpoints = Array.from({ length: totalSteps });

  const stepPercentage = (currentStep - 1) / (totalSteps - 1) * 100;

  return (
    <div className="checkpoint-container">
      {/* Avatar */}
      <motion.div
        className="avatar"
        animate={{ left: `${stepPercentage}%` }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        🧑
      </motion.div>

      {/* Line + Dots */}
      <div className="line">
        {checkpoints.map((_, index) => (
          <div
            key={index}
            className={`dot ${index < currentStep ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckpointSlider;
