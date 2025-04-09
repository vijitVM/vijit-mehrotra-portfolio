import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CurrentlyBuildingSection from "./components/CurrentlyBuildingSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from "./components/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Handle initial loading
  useEffect(() => {
    // Minimal loading time - just enough to show the logo briefly
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Reduced from 2500ms to 500ms

    return () => clearTimeout(loadingTimer);
  }, []);

  // Handle scroll detection for active section
  useEffect(() => {
    if (!appReady) return;

    const handleScroll = () => {
      const sections = [
        "home",
        "skills",
        "experience",
        "projects",
        "education",
        "contact"
      ];

      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust the detection area for more accurate section highlighting
          const triggerPoint = window.innerHeight * 0.3;
          return rect.top <= triggerPoint && rect.bottom >= triggerPoint;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
        
        // Don't update URL hash when scrolling
        // Just update active section state
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [appReady]);
  
  // Handle initial hash in URL (remove it to keep URL clean)
  useEffect(() => {
    if (!appReady) return;
    
    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Get the hash value without the # symbol
      const hash = window.location.hash.substring(1);
      
      // Find the element with this ID
      const element = document.getElementById(hash);
      
      if (element) {
        // Small timeout to ensure the page has loaded
        setTimeout(() => {
          // Scroll to the element
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight - 10;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update active section
          setActiveSection(hash);
          
          // Remove the hash from the URL without refreshing the page
          history.pushState(null, document.title, window.location.pathname + window.location.search);
        }, 500);
      } else {
        // If element not found, just remove the hash
        history.pushState(null, document.title, window.location.pathname + window.location.search);
      }
    }
  }, [appReady]);

  // Prevent scrolling until app is ready
  useEffect(() => {
    if (!appReady) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [appReady]);

  return (
    <>
      <LoadingScreen 
        isLoading={isLoading} 
        onLoadingComplete={() => setAppReady(true)} 
      />

      <AnimatePresence>
        {appReady && (
          <motion.div 
            className="min-h-screen bg-background text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Header activeSection={activeSection} />
            <main>
              <HeroSection />
              {/* CurrentlyBuildingSection moved into HeroSection to position it closer */}
              <SkillsSection />
              <ExperienceSection />
              <ProjectsSection />
              <EducationSection />
              <ContactSection />
            </main>
            <Footer />
            <Toaster />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
