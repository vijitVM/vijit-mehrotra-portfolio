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

  // Log screen size changes
  useEffect(() => {
    console.log("App detected screen size:", screenSize);
  }, [screenSize]);

  // Handle initial loading
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      console.log("Loading complete, appReady can start");
    }, 500); // minimal loading

    return () => clearTimeout(loadingTimer);
  }, []);

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

  // Scroll listener for updating activeSection
  useEffect(() => {
    if (!appReady) return;

    const sections = [
      "home",
      "skills",
      "experience",
      "projects",
      "education",
      "contact",
    ];

    const handleScroll = () => {
      // Adjust trigger based on screen size
      let triggerPercentage = 0.3;
      if (screenSize === "largeDesktop") triggerPercentage = 0.25;
      else if (screenSize === "desktop") triggerPercentage = 0.28;
      else if (screenSize === "laptop") triggerPercentage = 0.3;
      else triggerPercentage = 0.35;

      const triggerPoint = window.innerHeight * triggerPercentage;

      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= triggerPoint && rect.bottom >= triggerPoint;
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // call once on mount to set initial active section

    return () => window.removeEventListener("scroll", handleScroll);
  }, [appReady, screenSize, activeSection]);

  // Handle initial hash in URL (remove it)
  useEffect(() => {
    if (!appReady) return;

    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 80;
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });

          setActiveSection(hash);
          history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
          );
        }, 500);
      } else {
        history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search
        );
      }
    }
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
              <CurrentlyBuildingSection />
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
