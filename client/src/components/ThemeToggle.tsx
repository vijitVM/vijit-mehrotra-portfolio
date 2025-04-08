import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed right-4 top-4 z-50 p-2 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-800 shadow-lg shadow-black/10 dark:shadow-white/10"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;