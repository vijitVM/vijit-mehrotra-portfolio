import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from "./components/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Handle initial loading
  useEffect(() => {
    // Simulate resource loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

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
        
        // Update URL without triggering page reload (for better sharing and bookmarking)
        const url = window.location.origin + window.location.pathname + '#' + currentSection;
        window.history.replaceState(null, '', url);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [appReady]);
  
  // Handle initial hash in URL
  useEffect(() => {
    if (!appReady) return;
    
    // Check if there's a hash in the URL and scroll to that section
    const hash = window.location.hash.substring(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        // Small timeout to ensure the page has loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(hash);
        }, 500);
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
            <ThemeToggle />
            <Header activeSection={activeSection} />
            <main>
              <HeroSection />
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
