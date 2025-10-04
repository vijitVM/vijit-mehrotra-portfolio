import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import profilePic from "../attached_assets/Vijit_github_profile_pic.jpg";
import { useTheme } from "./ThemeProvider";
import { ScreenSize } from "../hooks/use-screen-size";

interface HeaderProps {
  activeSection: string;
  screenSize?: ScreenSize;
}

const Header = ({ activeSection, screenSize = "laptop" }: HeaderProps) => {
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
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search,
      );
    }

    // Debug the active section
    console.log("Current active section:", activeSection);
  }, [activeSection]);

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

  // Log current screen size for debugging
  useEffect(() => {
    console.log("Current screen size:", screenSize);
  }, [screenSize]);

  const handleNavClick = (sectionId: string) => {
    console.log(`Navigation clicked for: ${sectionId}`);

    // Close mobile menu first
    setIsMobileMenuOpen(false);

    // Get the element directly
    const targetElement = document.getElementById(sectionId);

    if (targetElement) {
      // Calculate header height automatically
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      
      // Get viewport dimensions
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Get element dimensions and position
      const elementRect = targetElement.getBoundingClientRect();
      const elementHeight = elementRect.height;
      
      /* 
       * Intelligent scroll positioning:
       * - Calculate an appropriate scroll position based on element size and viewport
       * - Special handling for 'home' section (always go to top)
       * - For other sections, position them based on their size and the viewport size
       */
      let scrollAdjustment = 0;
      
      // Home/hero section always scrolls to top
      if (sectionId === "home" || sectionId === "hero") {
        scrollAdjustment = 0;
      } else {
        // Calculate dynamic adjustment based on:
        // 1. Header size
        // 2. Element size 
        // 3. Viewport size
        
        // Basic adjustment is header height + a small buffer
        const baseAdjustment = headerHeight + 20;
        
        // Calculate what percentage of the viewport the element takes up
        const elementViewportRatio = elementHeight / viewportHeight;
        
        // Add additional adjustment based on element size and viewport:
        // - Smaller elements (like skills headings) need more negative adjustment
        // - Larger elements need less adjustment
        // Element takes up more than 80% of viewport - minimal adjustment
        if (elementViewportRatio > 0.8) {
          scrollAdjustment = -baseAdjustment * 0.5;
        } 
        // Element takes up 40-80% of viewport - medium adjustment
        else if (elementViewportRatio > 0.4) {
          scrollAdjustment = -baseAdjustment;
        }
        // Element takes up less than 40% of viewport - larger adjustment
        else {
          scrollAdjustment = -baseAdjustment * 1.5;
        }
        
        // Add viewport width factor - larger screens need more adjustment 
        if (viewportWidth > 1440) { // Large desktop
          scrollAdjustment *= 1.2;
        } else if (viewportWidth > 1024) { // Desktop
          scrollAdjustment *= 1.1;
        } else if (viewportWidth <= 768) { // Mobile/tablet
          scrollAdjustment *= 0.8;
        }
        
        // Add special adjustments for Acer monitors (they need more space)
        const isAcerMonitor = document.documentElement.classList.contains("acer-monitor");
        if (isAcerMonitor) {
          scrollAdjustment *= 1.3;
        }
      }

      // Apply clamping to prevent extreme values
      scrollAdjustment = Math.max(Math.min(scrollAdjustment, 0), -150);
      
      // Calculate final scroll position 
      const scrollPosition =
        window.scrollY + elementRect.top + scrollAdjustment;

      console.log(
        `Auto-scrolling to ${sectionId}: adjustment=${scrollAdjustment.toFixed(2)}, element height=${elementHeight}, viewport=${viewportWidth}x${viewportHeight}`,
      );

      // Initial scroll
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });

      // Use IntersectionObserver to check if element is properly visible after scrolling
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          
          // Element is not properly visible - needs adjustment
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
            const finalRect = targetElement.getBoundingClientRect();
            // Calculate better position
            const improvedPosition = window.scrollY + finalRect.top + scrollAdjustment - 20;
            
            window.scrollTo({
              top: improvedPosition,
              behavior: "smooth",
            });
            
            console.log(`Visibility adjustment for ${sectionId}`);
          }
          
          // Disconnect observer after check
          observer.disconnect();
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: [0.1, 0.5, 0.9], // Check multiple thresholds
        }
      );
      
      // Start observing target after initial scroll completes
      setTimeout(() => {
        observer.observe(targetElement);
      }, 500);
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
      className={`w-full lgl:h-18 lg:h-18 sm:h-14 sticky top-0 z-50 flex items-center justify-end font-titleFont backdrop-blur-sm transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900/95" : "bg-white/95 text-gray-800"
      } ${
        isScrolled
          ? "shadow-lg shadow-cyan-500/5 border-b border-cyan-500/10"
          : ""
      } transition-all duration-300`}
      initial="hidden"
      animate={headerVisible ? "visible" : "scrolledDown"}
      variants={headerVariants}
    >
      <div className="flex items-center max-w-full px-8 flex justify-between">
        {/* Logo and Name - Only shown in non-home sections */}
        <AnimatePresence>
          {activeSection !== "home" && activeSection !== "" ? (
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
                  className="text-sm sm:text-xl font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Vijit Mehrotra
                </motion.h1>
                <motion.p
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Data Science Specialist
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="w-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center">
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
                  className={`relative px-2 py-1 text-xs ${
                    activeSection === item.id
                      ? "text-cyan-400"
                      : theme === "dark"
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
                className="p-1 rounded-md focus:outline-none"
                whileTap={{ scale: 0.95 }}
              >
                {theme === "dark" ? (
                  <Sun className="text-cyan-400 w-4 h-4" />
                ) : (
                  <Moon className="text-cyan-600 w-4 h-4" />
                )}
              </motion.button>
            </motion.li>
          </ul>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center sm:hidden">
          {/* Theme toggle for mobile */}
          <motion.button
            onClick={toggleTheme}
            className={`p-3 ${theme === "dark" ? "text-white" : "text-gray-800"} focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md active:bg-gray-100/10`}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button
            className={`p-2 rounded-md z-50 ${
              theme === "dark" ? "bg-gray-800/95" : "bg-gray-100/95"
            } backdrop-blur-md border-b border-gray-700/50`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            >
              <motion.div
                className={`absolute top-16 right-3 w-3/4 max-w-xs rounded-lg shadow-xl p-4 pt-0 ${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                }`}
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <ul className="pt-2">
                  {navItems.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={mobileNavItemVariants}
                      className="my-1"
                    >
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center w-full py-3 px-4 rounded-md ${
                      activeSection === item.id
                        ? "text-cyan-400 bg-cyan-500/10"
                        : theme === "dark"
                          ? "text-white"
                          : "text-gray-800"
                    } hover:text-cyan-400 active:bg-gray-700/20`}
                      >
                        <div className="flex items-center flex-1">
                          <div
                            className={`mr-2 ${activeSection === item.id ? "opacity-100" : "opacity-0"}`}
                          >
                            <ChevronRight size={16} className="text-cyan-400" />
                          </div>
                          <span>{item.label}</span>
                          <span className="ml-2 h-px bg-gradient-to-r from-cyan-400 to-transparent flex-grow" />
                        </div>
                      </button>
                    </motion.li>
                  ))}

                  {/* Theme toggle in mobile menu */}
                  <motion.li className="overflow-hidden border-t border-gray-700/20 mt-4 pt-4">
                    <button
                      onClick={toggleTheme}
                      className={`flex items-center justify-between w-full py-3 px-4 rounded-md ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      } hover:text-cyan-400 active:bg-gray-700/20`}
                    >
                      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      {theme === "dark" ? (
                        <Sun size={16} className="text-cyan-400" />
                      ) : (
                        <Moon size={16} className="text-cyan-400" />
                      )}
                    </button>
                  </motion.li>
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual divider for header bottom */}
      {isScrolled && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
        />
      )}
    </motion.header>
  );
};

export default Header;
