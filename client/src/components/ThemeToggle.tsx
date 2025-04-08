import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  // Icon switch animation variants
  const iconVariants: Variants = {
    initial: { 
      rotate: -30, 
      opacity: 0, 
      scale: 0.5 
    },
    animate: { 
      rotate: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.175, 0.885, 0.32, 1.275] // Custom easing (bounce out)
      }
    },
    exit: { 
      rotate: 30, 
      opacity: 0, 
      scale: 0.5,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };

  // Button container animation
  const buttonVariants: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    darkHover: { 
      scale: 1.1,
      boxShadow: "0 0 15px 2px rgba(14, 165, 233, 0.5)",
      transition: { 
        scale: { type: "spring", stiffness: 400, damping: 10 },
        boxShadow: { duration: 0.2 }
      }
    },
    lightHover: { 
      scale: 1.1,
      boxShadow: "0 0 15px 2px rgba(251, 191, 36, 0.4)",
      transition: { 
        scale: { type: "spring", stiffness: 400, damping: 10 },
        boxShadow: { duration: 0.2 }
      }
    },
    tap: { 
      scale: 0.95,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    }
  };

  return (
    <motion.div 
      className="fixed right-4 top-20 z-50 flex items-center"
      initial="initial"
      animate="animate"
      variants={buttonVariants}
    >
      {/* Theme label indicator */}
      <motion.span
        className={`mr-2 text-sm font-medium px-3 py-1 rounded-full ${
          theme === 'dark' 
            ? 'bg-sky-500/20 text-sky-500' 
            : 'bg-amber-500/20 text-amber-500'
        }`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={theme} // Force animation on theme change
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {theme === 'dark' ? 'Dark' : 'Light'}
      </motion.span>

      {/* Theme toggle button */}
      <motion.button
        onClick={toggleTheme}
        className={`p-3 rounded-full ${
          theme === 'dark' 
            ? 'bg-gray-800 text-sky-500 shadow-md shadow-sky-500/20' 
            : 'bg-white text-amber-500 shadow-md shadow-amber-500/20'
        } transition-colors duration-500`}
        whileHover={theme === 'dark' ? "darkHover" : "lightHover"}
        whileTap="tap"
        variants={buttonVariants}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SunIcon className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MoonIcon className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default ThemeToggle;