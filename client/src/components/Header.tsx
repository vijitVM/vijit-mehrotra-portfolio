import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
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
  const { theme } = useTheme();

  // Handle scroll direction to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header at the top of the page
      if (currentScrollY < 50) {
        setHeaderVisible(true);
        setIsScrolled(false);
        prevScrollY.current = currentScrollY;
        return;
      }

      // Show/hide based on scroll direction
      if (prevScrollY.current < currentScrollY) {
        // Scrolling down
        setHeaderVisible(false);
      } else {
        // Scrolling up
        setHeaderVisible(true);
      }

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
    setIsMobileMenuOpen(false);

    // Mark as active immediately for a more responsive feel
    const element = document.getElementById(sectionId);
    if (element) {
      // Add a small vibration effect to the header when navigating
      if (headerRef.current) {
        headerRef.current.style.transform = "translateY(-2px)";
        setTimeout(() => {
          if (headerRef.current) {
            headerRef.current.style.transform = "translateY(0)";
          }
        }, 150);
      }

      // Calculate offset considering header height
      const headerHeight = headerRef.current?.offsetHeight || 80;
      const yOffset = -headerHeight;

      // Get the target position
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + yOffset;

      // Scroll to the section
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL without page reload
      const newUrl =
        window.location.origin + window.location.pathname + "#" + sectionId;
      window.history.pushState({ path: newUrl }, "", newUrl);
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
        <nav className="hidden md:flex">
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
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className={`md:hidden relative ${theme === 'dark' ? 'text-white' : 'text-gray-800'} focus:outline-none`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`md:hidden ${
              theme === 'dark'
                ? 'bg-gray-800/95'
                : 'bg-gray-100/95'
            } backdrop-blur-md border-b border-gray-700/50 overflow-hidden`}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.nav
              className="container mx-auto px-4 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ul className="space-y-3">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    variants={mobileNavItemVariants}
                    className="overflow-hidden"
                  >
                    <motion.button
                      onClick={() => handleNavClick(item.id)}
                      className={`group flex items-center py-2 w-full text-left ${
                        activeSection === item.id
                          ? "text-cyan-400"
                          : theme === 'dark'
                            ? "text-white"
                            : "text-gray-800"
                      } hover:text-cyan-400 transition-colors duration-300`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{
                          opacity: activeSection === item.id ? 1 : 0,
                          x: activeSection === item.id ? 0 : -5,
                        }}
                        className="mr-2"
                      >
                        <ChevronRight size={16} className="text-cyan-400" />
                      </motion.span>

                      {item.label}

                      {activeSection === item.id && (
                        <motion.span
                          className="ml-2 h-px bg-gradient-to-r from-cyan-400 to-transparent flex-grow"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

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
