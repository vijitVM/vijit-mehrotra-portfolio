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
import { useScreenSize } from "./hooks/use-screen-size";
import DisplayScalingProvider from "./components/DisplayScalingProvider";

function App() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const screenSize = useScreenSize();
  
  // Log screen size changes for debugging
  useEffect(() => {
    console.log("App detected screen size:", screenSize);
  }, [screenSize]);

  // Handle initial loading
  useEffect(() => {
    // Minimal loading time - just enough to show the logo briefly
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // Force set activeSection to "home" on initial load
      if (window.location.hash === '') {
        setActiveSection("home");
        console.log("Forcing active section to home on load");
      }
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

      // Adjust trigger point based on screen size
      let triggerPercentage = 0.3; // Default 30% of viewport height
      
      if (screenSize === 'largeDesktop') {
        // For 24-inch and larger displays, adjust the trigger point to be lower
        triggerPercentage = 0.25;
      } else if (screenSize === 'desktop') {
        triggerPercentage = 0.28;
      } else if (screenSize === 'laptop') {
        triggerPercentage = 0.3;
      } else {
        triggerPercentage = 0.35; // Mobile/tablet needs higher trigger point
      }
      
      const triggerPoint = window.innerHeight * triggerPercentage;
      console.log(`Using trigger point at ${Math.round(triggerPercentage * 100)}% of viewport height (${triggerPoint}px) for ${screenSize}`);

      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjusted detection area based on screen size
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
          // Scroll to the element with special handling for 'skills' section
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          let elementPosition = element.getBoundingClientRect().top + window.scrollY;
          
          // Apply scroll adjustments based on screen size
          let scrollAdjustment = 0;
          
          // For skills section, adjust the scroll position based on screen size
          if (hash === 'skills') {
            if (screenSize === 'largeDesktop') {
              // For 24-inch and larger monitors (1440px+)
              scrollAdjustment = 250;
              console.log('Using large desktop initial scroll adjustment for', hash);
            } else if (screenSize === 'desktop') {
              // For standard desktop displays (1024px-1440px)
              scrollAdjustment = 180;
              console.log('Using desktop initial scroll adjustment for', hash);
            } else if (screenSize === 'laptop') {
              // For laptop displays (768px-1024px)
              scrollAdjustment = 100;
              console.log('Using laptop initial scroll adjustment for', hash);
            } else {
              // For smaller screens (under 768px)
              scrollAdjustment = 50;
            }
            
            elementPosition = elementPosition + scrollAdjustment;
          }
          
          const offsetPosition = elementPosition - headerHeight - 10;
          
          console.log(`Initial scroll to section: ${hash}, position: ${offsetPosition}, screen size: ${screenSize}`);
          
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
  }, [appReady, screenSize]);

  // Prevent scrolling until app is ready and ensure activeSection is set to "home"
  useEffect(() => {
    if (!appReady) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      
      // Force "home" as active section when app becomes ready
      setActiveSection("home");
      console.log("App ready, setting active section to home");
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [appReady]);

  return (
    <DisplayScalingProvider>
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
            <Header activeSection={activeSection} screenSize={screenSize} />
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
    </DisplayScalingProvider>
  );
}

export default App;
