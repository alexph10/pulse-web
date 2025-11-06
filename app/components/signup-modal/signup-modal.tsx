'use client'

import React from 'react';
import styles from './signup-modal.module.css';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Left column */}
        <div className={styles.leftColumn}>
          {/* Content for left column */}
        </div>
        
        {/* Divider line */}
        <div className={styles.divider}></div>
        
        {/* Right column */}
        <div className={styles.rightColumn}>
          {/* Content for right column */}
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
