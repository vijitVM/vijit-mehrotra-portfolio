import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ isLoading, onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Finish the progress bar quickly if loading is complete
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.2;
          
          if (newProgress >= 99.9) {
            clearInterval(interval);
            
            // Add small delay before hiding loading screen
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(onLoadingComplete, 500); // Call callback after exit animation
            }, 500);
            
            return 100;
          }
          
          return newProgress;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress(prev => {
          // Slow down as we approach 80%
          const increment = prev < 50 ? 2 : prev < 80 ? 0.5 : 0.1;
          const newProgress = Math.min(prev + increment, 80);
          
          if (newProgress >= 80 && isLoading) {
            clearInterval(interval);
          }
          
          return newProgress;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLoading, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="relative w-32 h-32 mb-8"
            initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
            animate={{ 
              rotate: 0, 
              scale: 1, 
              opacity: 1,
              transition: { 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2 
              }
            }}
          >
            {/* Logo animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <motion.div
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ 
                    rotateY: 0, 
                    opacity: 1,
                    transition: { 
                      delay: 0.6,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }}
                >
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-full h-full text-white"
                    fill="currentColor"
                  >
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fontSize="40"
                      fontWeight="bold"
                    >
                      M
                    </text>
                  </svg>
                </motion.div>
              </div>
            </div>
            
            {/* Animated circular progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <motion.circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeWidth="2"
                pathLength="1"
                className="drop-shadow-glow"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="url(#gradientStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="drop-shadow-glow"
              />
              <defs>
                <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Pulsing glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          {/* Progress text */}
          <motion.div
            className="text-xl font-medium text-cyan-400 tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {progress.toFixed(0)}%
          </motion.div>
          
          {/* Loading text with blinking cursor */}
          <motion.div 
            className="mt-4 text-gray-400 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span>Loading</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-4 ml-1 bg-cyan-400 inline-block"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;