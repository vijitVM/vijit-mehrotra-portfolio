import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ isLoading, onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Complete loading very quickly
  useEffect(() => {
    if (!isLoading) {
      // Add minimal delay before hiding loading screen
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onLoadingComplete, 300); // Call callback after exit animation
      }, 200);
    }
  }, [isLoading, onLoadingComplete]);

  // Skip loading screen completely for most visitors
  useEffect(() => {
    // Skip loading animation for subsequent visits
    const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');
    
    if (hasVisitedBefore) {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 0);
    } else {
      sessionStorage.setItem('hasVisitedBefore', 'true');
    }
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Simple fade in/out logo */}
          <motion.div 
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Central logo with initials */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <div className="text-2xl font-bold text-white">VM</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;