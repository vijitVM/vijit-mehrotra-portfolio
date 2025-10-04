import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AiAssistant from "./components/AiAssistant/AiAssistant"; // Import the new component
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

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      if (window.location.hash === '') {
        setActiveSection("home");
      }
    }, 500);
    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (!appReady) return;

    const handleScroll = () => {
      const sections = ["home", "skills", "experience", "projects", "education", "contact"];
      let triggerPercentage = 0.3;
      if (screenSize === 'largeDesktop') triggerPercentage = 0.25;
      else if (screenSize === 'desktop') triggerPercentage = 0.28;
      else if (screenSize === 'laptop') triggerPercentage = 0.3;
      else triggerPercentage = 0.35;
      
      const triggerPoint = window.innerHeight * triggerPercentage;
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= triggerPoint && rect.bottom >= triggerPoint;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [appReady, screenSize]);

  useEffect(() => {
    if (!appReady) return;
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          let elementPosition = element.getBoundingClientRect().top + window.scrollY;
          let scrollAdjustment = 0;
          if (hash === 'skills') {
            if (screenSize === 'largeDesktop') scrollAdjustment = 250;
            else if (screenSize === 'desktop') scrollAdjustment = 180;
            else if (screenSize === 'laptop') scrollAdjustment = 100;
            else scrollAdjustment = 50;
            elementPosition = elementPosition + scrollAdjustment;
          }
          const offsetPosition = elementPosition - headerHeight - 10;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          setActiveSection(hash);
          history.pushState(null, document.title, window.location.pathname + window.location.search);
        }, 500);
      } else {
        history.pushState(null, document.title, window.location.pathname + window.location.search);
      }
    }
  }, [appReady, screenSize]);

  useEffect(() => {
    document.body.style.overflow = appReady ? "" : "hidden";
    if (appReady) setActiveSection("home");
    return () => { document.body.style.overflow = ""; };
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
              <SkillsSection />
              <ExperienceSection />
              <ProjectsSection />
              <EducationSection />
              <ContactSection />
            </main>
            <Footer />
            <Toaster />
            <AiAssistant /> {/* Add the AI Assistant here */}
          </motion.div>
        )}
      </AnimatePresence>
    </DisplayScalingProvider>
  );
}

export default App;
