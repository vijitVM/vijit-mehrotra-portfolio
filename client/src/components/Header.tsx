import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import profilePic from "../attached_assets/Vijit_github_profile_pic.jpg";
import { useTheme } from "./ThemeProvider";

interface HeaderProps {
  activeSection: string;
}

const Header = ({ activeSection }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const prevScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Remove hash from URL on page load
  useEffect(() => {
    if (window.location.hash) {
      // Use history.pushState to remove hash without reloading page
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }, []);

  // Handle scroll direction to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header regardless of scroll direction
      setHeaderVisible(true);
      
      // Update scroll state for shadow and border
      setIsScrolled(currentScrollY > 10);

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (sectionId: string) => {
    console.log(`Navigation clicked for: ${sectionId}`);
    
    // Close mobile menu first
    setIsMobileMenuOpen(false);
    
    // Prevent default behavior to avoid full page reload
    
    // Get the element directly
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
      // More precise header offset calculation
      const headerHeight = headerRef.current?.offsetHeight || 80;
      
      // Get the actual element position relative to the viewport
      const elementRect = targetElement.getBoundingClientRect();
      
      // Apply a larger offset for the Skills section to ensure it's fully visible
      const extraOffset = sectionId === "skills" ? 40 : 10;
      
      // Calculate scroll position (current position + scroll offset - header height)
      // This ensures we scroll to the very top of the section, not the middle
      // Adding a padding to prevent it being right at the edge
      const scrollPosition = window.scrollY + elementRect.top - headerHeight - extraOffset;
      
      console.log(`Scrolling to section: ${sectionId}, position: ${scrollPosition}`);
      
      // Don't update URL hash, just scroll to the section
      
      // Scroll to position
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });

      // For the Skills section, force a second scroll with a slight delay to ensure everything is visible
      if (sectionId === "skills") {
        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      console.error(`Element with ID ${sectionId} not found`);
    }
  };

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "skills", label: "SKILLS" },
    { id: "experience", label: "EXPERIENCE" },
    { id: "projects", label: "PROJECTS" },
    { id: "education", label: "EDUCATION" },
    { id: "contact", label: "CONTACT" },
  ];

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    scrolledUp: {
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    scrolledDown: {
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const logoVariants = {
    initial: {
      rotate: -10,
      scale: 0.9,
      opacity: 0,
    },
    animate: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.05 * i,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const mobileNavItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Create a glow effect for active indicator
  const activeIndicatorVariants = {
    inactive: {
      width: 0,
      opacity: 0,
      x: 0,
    },
    active: {
      width: "100%",
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      opacity: 0.8,
      boxShadow: "0 0 8px rgba(6, 182, 212, 0.5)",
    },
  };

  return (
    <motion.header
      ref={headerRef}
      className={`sticky top-0 z-50 ${
        theme === 'dark' 
          ? 'bg-gray-900/95' 
          : 'bg-white/95 text-gray-800'
      } backdrop-blur-sm ${
        isScrolled
          ? "shadow-lg shadow-cyan-500/5 border-b border-cyan-500/10"
          : ""
      } transition-all duration-300`}
      initial="hidden"
      animate={headerVisible ? "visible" : "scrolledDown"}
      variants={headerVariants}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Name - Shown only when not in home section or when scrolled down */}
        <AnimatePresence>
          {(activeSection !== "home" || isScrolled) ? (
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              whileHover={{ x: -2 }}
            >
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 overflow-hidden flex items-center justify-center"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <img
                    src={profilePic}
                    alt="Vijit Mehrotra"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
              <div>
                <motion.h1
                  className="text-md md:text-lg font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Vijit Mehrotra
                </motion.h1>
                <motion.p
                  className="text-xs text-gray-400"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Data Science Specialist
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div className="w-32" initial={{ opacity: 0 }} animate={{ opacity: 0 }} />
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-8">
            {navItems.map((item, index) => (
              <motion.li
                key={item.id}
                custom={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2 py-1 ${
                    activeSection === item.id 
                      ? "text-cyan-400" 
                      : theme === 'dark' 
                        ? "text-white" 
                        : "text-gray-800"
                  } hover:text-cyan-400 transition-colors duration-300`}
                >
                  {item.label}

                  {/* Active navigation indicator */}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                      layoutId="activeIndicator"
                      initial="inactive"
                      animate="active"
                      variants={activeIndicatorVariants}
                      whileHover="hover"
                    />
                  )}

                  {/* Hover effect for inactive items */}
                  {hoveredItem === item.id && activeSection !== item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gray-400/30 w-full"
                      layoutId="hoverIndicator"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
            
            {/* Theme toggle in header */}
            <motion.li
              custom={navItems.length}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <motion.button
                onClick={toggleTheme}
                className={`relative px-2 py-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-cyan-400 transition-colors duration-300`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>
            </motion.li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            type="button"
            className={`p-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md active:bg-gray-100/10`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Simplified for better touch handling */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${
          theme === 'dark' ? 'bg-gray-800/95' : 'bg-gray-100/95'
        } backdrop-blur-md border-b border-gray-700/50`}>
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id} className="overflow-hidden">
                  <button
                    type="button"
                    className={`group flex items-center py-4 px-2 w-full text-left rounded-lg ${
                      activeSection === item.id
                        ? "text-cyan-400 bg-cyan-500/10"
                        : theme === 'dark'
                          ? "text-white"
                          : "text-gray-800"
                    } hover:text-cyan-400 active:bg-gray-700/20`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className={`mr-2 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`}>
                      <ChevronRight size={16} className="text-cyan-400" />
                    </span>

                    {item.label}

                    {activeSection === item.id && (
                      <span className="ml-2 h-px bg-gradient-to-r from-cyan-400 to-transparent flex-grow" />
                    )}
                  </button>
                </li>
              ))}
              
              {/* Theme toggle in mobile menu */}
              <li className="overflow-hidden border-t border-gray-700/20 mt-4 pt-4">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`group flex items-center py-4 px-2 w-full text-left rounded-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  } hover:text-cyan-400 active:bg-gray-700/20`}
                >
                  <span className="mr-2">
                    {theme === 'dark' ? (
                      <Sun size={16} className="text-cyan-400" />
                    ) : (
                      <Moon size={16} className="text-cyan-400" />
                    )}
                  </span>
                  Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Optional glow effect at the bottom of header when scrolled */}
      {isScrolled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.header>
  );
};

export default Header;
