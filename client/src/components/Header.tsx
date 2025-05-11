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
      // Calculate header height more precisely with padding to ensure the entire section is visible
      const headerHeight = (headerRef.current?.offsetHeight ?? 80) + 10;

      // Get the actual element position relative to the viewport
      const elementRect = targetElement.getBoundingClientRect();

      // Check if we're using an Acer monitor (previously detected in DisplayScalingProvider)
      const isAcerMonitor =
        document.documentElement.classList.contains("acer-monitor");

      // Adjust scroll behavior based on screen size, section, and monitor type
      let scrollAdjustment = 0;

      // Apply different scroll adjustments based on screen size, monitor type, and section
      if (isAcerMonitor) {
        // Special adjustments for Acer monitors
        console.log("Using Acer monitor scroll adjustments");

        switch (sectionId) {
          case "home":
          case "hero":
            scrollAdjustment = 0;
            break;
          case "experience":
            scrollAdjustment = -80;
            break;
          case "education":
            scrollAdjustment = -80;
            break;
          case "skills":
            scrollAdjustment = -80;
            break;
          case "projects":
            scrollAdjustment = -80;
            break;
          case "contact":
            scrollAdjustment = -80;
            break;
          default:
            scrollAdjustment = -60;
        }
      } else if (screenSize === "largeDesktop") {
        // For 24-inch and larger displays (non-Acer)
        switch (sectionId) {
          case "home":
          case "hero":
            scrollAdjustment = 0;
            break;
          case "skills":
            scrollAdjustment = -100;
            break;
          case "experience":
            scrollAdjustment = -90;
            break;
          case "education":
            scrollAdjustment = -90;
            break;
          case "projects":
            scrollAdjustment = -90;
            break;
          case "contact":
            scrollAdjustment = -90;
            break;
          default:
            scrollAdjustment = -80;
        }
        console.log("Using large desktop scroll adjustments");
      } else if (screenSize === "desktop") {
        // For standard desktop displays
        switch (sectionId) {
          case "home":
          case "hero":
            scrollAdjustment = 0;
            break;
          case "skills":
            scrollAdjustment = -100;
            break;
          default:
            scrollAdjustment = -90;
        }
        console.log("Using desktop scroll adjustments");
      } else if (screenSize === "laptop") {
        // For laptop displays
        switch (sectionId) {
          case "home":
          case "hero":
            scrollAdjustment = 0;
            break;
          case "skills":
            scrollAdjustment = -80;
            break;
          default:
            scrollAdjustment = -70;
        }
        console.log("Using laptop scroll adjustments");
      } else {
        // For smaller screens
        switch (sectionId) {
         case "home":
          case "hero":
            scrollAdjustment = 0;
            break;
          case "skills":
            scrollAdjustment = -130;
            break;
          case "experience":
            scrollAdjustment = -120;
            break;
          case "education":
            scrollAdjustment = -100;
            break;
          case "projects":
            scrollAdjustment = -100;
            break;
          case "contact":
            scrollAdjustment = -100;
            break;
          default:
            scrollAdjustment = -100;
        }
      }

      // Calculate final scroll position with screen-specific adjustments
      const scrollPosition =
        window.scrollY + elementRect.top - headerHeight + scrollAdjustment;

      console.log(
        `Scrolling to section: ${sectionId}, position: ${scrollPosition}, screen size: ${screenSize}, isAcerMonitor: ${isAcerMonitor}, adjustment: ${scrollAdjustment}`,
      );

      // Scroll to position
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });

      // Implementation of a multi-step scroll to ensure proper positioning
      // First quick adjustment, followed by fine-tuning after content has settled
      setTimeout(() => {
        // Quick adjustment after initial scroll
        const quickAdjustRect = targetElement.getBoundingClientRect();
        const quickAdjustPosition =
          window.scrollY +
          quickAdjustRect.top -
          headerHeight +
          scrollAdjustment;

        window.scrollTo({
          top: quickAdjustPosition,
          behavior: "smooth",
        });

        // Final adjustment after all content and animations have settled
        setTimeout(() => {
          // Recalculate final position
          const finalAdjustRect = targetElement.getBoundingClientRect();
          const finalScrollPosition =
            window.scrollY +
            finalAdjustRect.top -
            headerHeight +
            scrollAdjustment;

          window.scrollTo({
            top: finalScrollPosition,
            behavior: "smooth",
          });

          console.log(
            `Final adjustment for ${sectionId}, position: ${finalScrollPosition}`,
          );
        }, 300);
      }, 100);
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
      <div className="flex itens-center w-full px-8 flex justify-between">
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
                className={`relative px-2 py-1 ${theme === "dark" ? "text-white" : "text-gray-800"} hover:text-cyan-400 transition-colors duration-300`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
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
            className={`p-3 ${theme === "dark" ? "text-white" : "text-gray-800"} focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md active:bg-gray-100/10`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Simplified for better touch handling */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${
            theme === "dark" ? "bg-gray-800/95" : "bg-gray-100/95"
          } backdrop-blur-md border-b border-gray-700/50`}
        >
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id} className="overflow-hidden">
                  <button
                    type="button"
                    className={`group flex items-center py-4 px-2 w-full text-left rounded-lg ${
                      activeSection === item.id
                        ? "text-cyan-400 bg-cyan-500/10"
                        : theme === "dark"
                          ? "text-white"
                          : "text-gray-800"
                    } hover:text-cyan-400 active:bg-gray-700/20`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span
                      className={`mr-2 ${activeSection === item.id ? "opacity-100" : "opacity-0"}`}
                    >
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
                    theme === "dark" ? "text-white" : "text-gray-800"
                  } hover:text-cyan-400 active:bg-gray-700/20`}
                >
                  <span className="mr-2">
                    {theme === "dark" ? (
                      <Sun size={16} className="text-cyan-400" />
                    ) : (
                      <Moon size={16} className="text-cyan-400" />
                    )}
                  </span>
                  Toggle {theme === "dark" ? "Light" : "Dark"} Mode
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
