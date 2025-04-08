import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define theme type
type Theme = 'dark' | 'light';

// Create context with default values
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  isTransitioning: false,
});

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

// Theme transition overlay component
const ThemeTransitionOverlay = ({ isVisible, theme }: { isVisible: boolean; theme: Theme }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <div 
            className={`absolute inset-0 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-sky-900 to-sky-800' 
                : 'bg-gradient-to-r from-amber-50 to-amber-100'
            } opacity-60`}
          />
          <motion.div
            className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-sky-500'
                : 'bg-amber-400'
            }`}
            style={{ mixBlendMode: 'overlay' }}
            initial={{ scale: 0, borderRadius: '100%', x: '50%', y: '50%' }}
            animate={{ scale: 2.5, borderRadius: '0%', x: '0%', y: '0%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get theme from localStorage or use system preference or dark as fallback
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      
      // Check system preference as fallback
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    // Default to dark
    return 'dark';
  });
  
  // Track theme transition state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isTransitioning) {
      // After a slight delay to let the transition animation start
      const timer = setTimeout(() => {
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
      }, 100);
      
      // End the transition after animation completes
      const endTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(endTimer);
      };
    } else {
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if user hasn't explicitly chosen a theme
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isTransitioning]);

  // Toggle between dark and light theme with transition
  const toggleTheme = () => {
    setIsTransitioning(true);
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    toggleTheme,
    isTransitioning,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeTransitionOverlay isVisible={isTransitioning} theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
};