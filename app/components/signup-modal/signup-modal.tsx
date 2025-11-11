'use client'

import React from 'react';
import { motion } from 'motion/react';
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
        {/* Left Column - Form */}
        <div className={styles.leftColumn}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Email</label>
              <input 
                type="email" 
                placeholder="Johndoe@gmail.com" 
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={styles.input}
              />
            </div>
            
            <div className={styles.options}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Keep me logged in</span>
              </label>
              <a href="#" className={styles.forgotPassword}>Forgot Password</a>
            </div>
            
            <button type="submit" className={styles.loginButton}>
              Sign in
            </button>
            
            <div className={styles.socialButtons}>
              <button type="button" className={styles.googleButton}>
                <span className={styles.googleIcon}>G</span>
              </button>
              <button type="button" className={styles.googleButton}>
                <span className={styles.googleIcon}>GH</span>
              </button>
              <button type="button" className={styles.googleButton}>
                <span className={styles.googleIcon}>f</span>
              </button>
            </div>
          </form>
        </div>
        
        {/* Right Column - Animated Gradient */}
        <div className={styles.rightColumn}>
          <motion.div
            className={styles.gradientLayer1}
            animate={{
              x: [0, 150, -100, 0],
              y: [0, -80, 120, 0],
              scale: [1, 1.2, 0.9, 1],
              rotate: [0, 90, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={styles.gradientLayer2}
            animate={{
              x: [0, -120, 100, 0],
              y: [0, 100, -90, 0],
              scale: [1, 0.9, 1.3, 1],
              rotate: [0, -120, -240, -360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={styles.gradientLayer3}
            animate={{
              x: [0, -80, 60, 0],
              y: [0, -120, 80, 0],
              scale: [1, 1.15, 0.95, 1],
              rotate: [0, 60, 120, 180],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
