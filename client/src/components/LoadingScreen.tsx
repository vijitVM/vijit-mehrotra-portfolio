import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ isLoading, onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState("Portfolio");
  const [textIndex, setTextIndex] = useState(0);

  // Array of loading messages to cycle through
  const loadingMessages = [
    "Portfolio",
    "Skills",
    "Experience",
    "Projects",
    "Welcome"
  ];

  useEffect(() => {
    // Cycle through loading texts
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingMessages.length);
      setLoadingText(loadingMessages[textIndex]);
    }, 1500);

    return () => clearInterval(textInterval);
  }, [textIndex]);

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
      // Simulate loading progress with a more refined curve
      const interval = setInterval(() => {
        setProgress(prev => {
          // Create a more realistic loading experience
          const step = Math.random() * 0.7 + 0.3; // Random step between 0.3 and 1.0
          const slowdown = prev < 30 ? 1 : prev < 60 ? 0.8 : prev < 80 ? 0.4 : 0.1;
          const increment = step * slowdown;
          const newProgress = Math.min(prev + increment, 80);
          
          if (newProgress >= 80 && isLoading) {
            clearInterval(interval);
          }
          
          return newProgress;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isLoading, onLoadingComplete]);

  // Particles for background effect
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background animated particles */}
          {particles.map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-cyan-500/10"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.5,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 12,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                filter: "blur(1px)",
              }}
            />
          ))}

          {/* Animated gradient background */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{
              background: "radial-gradient(circle at center, rgba(6, 182, 212, 0.2) 0%, rgba(17, 24, 39, 0) 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main content container */}
          <motion.div 
            className="relative z-10 flex flex-col items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo container with animated effects */}
            <motion.div
              className="relative w-44 h-44 mb-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2 
              }}
            >
              {/* Animated rings */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-purple-500/20"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [180, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Core logo */}
              <motion.div
                className="absolute inset-4 flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Animated circular progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="48%"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.15)"
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
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="1, 10"
                    pathLength="1"
                    animate={{ 
                      rotate: [0, 360],
                      strokeDasharray: ["1, 10", "5, 10", "1, 10"],
                    }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="drop-shadow-glow"
                  />
                  <defs>
                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#9333EA" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              {/* Progress circle */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.3)"
                  strokeWidth="4"
                  pathLength="1"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Central logo with initials */}
              <motion.div
                className="absolute inset-8 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <motion.div
                  className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 opacity-90"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute inset-[3px] rounded-full bg-gray-900 flex items-center justify-center z-10"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                  >
                    VM
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Pulsing glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Progress percentage */}
            <motion.div
              className="text-2xl font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {progress.toFixed(0)}%
            </motion.div>
            
            {/* Loading text animation */}
            <div className="h-8 mt-4 relative overflow-hidden">
              <motion.div 
                className="text-lg text-gray-300 flex items-center absolute"
                key={loadingText}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span>Loading {loadingText}</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-1 h-5 ml-1 bg-cyan-400 inline-block rounded-full"
                />
              </motion.div>
            </div>

            {/* Powered by tech stack */}
            <motion.div 
              className="mt-10 text-xs text-gray-500 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <span>Powered by</span>
              <span className="text-cyan-400">React</span>
              <span>|</span>
              <span className="text-blue-400">TypeScript</span>
              <span>|</span>
              <span className="text-purple-400">Framer Motion</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;