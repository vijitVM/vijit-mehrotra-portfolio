import { Button } from "@/components/ui/button";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ParticleBackground from "./ParticleBackground";
import ThreeScene from "./ThreeScene";
import MouseFollowEffect from "./MouseFollowEffect";
import { useTheme } from "./ThemeProvider";
import profilePic from "../attached_assets/Vijit_github_profile_pic.jpg";
import CurrentlyBuildingSection from "./CurrentlyBuildingSection";

const HeroSection = () => {
  const { theme } = useTheme();
  const titles = [
    "Generative AI Specialist",
    "Team Player",
    "Data Science Consultant",
    "AI Engineer",
  ];
  const [typedText, setTypedText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mouse position for hover effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for interactive elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // Typing effect logic
  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const speed = isDeleting ? 50 : 120;
    const fullPause = 1000;
    const clearPause = 300;

    const timeout = setTimeout(
      () => {
        if (!isDeleting && typedText.length < currentTitle.length) {
          setTypedText(currentTitle.substring(0, typedText.length + 1));
        } else if (isDeleting && typedText.length > 0) {
          setTypedText(currentTitle.substring(0, typedText.length - 1));
        } else if (!isDeleting && typedText === currentTitle) {
          setTimeout(() => setIsDeleting(true), fullPause);
        } else if (isDeleting && typedText === "") {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      },
      typedText === currentTitle && !isDeleting ? fullPause : speed,
    );

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, titleIndex]);

  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      const yOffset = -80;
      const y =
        contactSection.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  // Interactive profile border effect
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleProfileHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (heroRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Convert to rotation degrees (-7 to 7 degrees)
      const rotX = ((y - centerY) / centerY) * -7;
      const rotY = ((x - centerX) / centerX) * 7;

      rotateX.set(rotX);
      rotateY.set(rotY);
    }
  };

  const handleProfileLeave = () => {
    // Reset rotation when mouse leaves
    rotateX.set(0);
    rotateY.set(0);
  };

  // Create a motion template for transform
  const profileTransform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  return (
    <section
      id="home"
      className="min-h-[88vh] flex items-center py-6 md:py-10 overflow-hidden relative"
      ref={heroRef}
      onMouseMove={handleMouseMove}
    >
      <ParticleBackground />
      <ThreeScene />

      <MouseFollowEffect>
        <div className="container mx-auto px-4 relative z-10">
          {/* Header name on left like in screenshot 2 */}
          <div className="flex items-center mb-4 md:mb-8">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-amber-400 mr-2 md:mr-3">
                <img src={profilePic} alt="Vijit Mehrotra" className="w-full h-full object-cover" />
              </div> */}
              {/* <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Vijit Mehrotra
                </h2>
                <p className="text-xs md:text-sm text-gray-400">
                  Data Science Specialist
                </p>
              </div> */}
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col md:flex-row gap-12 items-center justify-between max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex-shrink-0"
              variants={profileVariants}
              onMouseMove={handleProfileHover}
              onMouseLeave={handleProfileLeave}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className={`w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 rounded-lg bg-transparent border-2 border-dashed ${
                  theme === "dark" ? "border-cyan-700" : "border-amber-300"
                } flex items-center justify-center overflow-hidden ${
                  theme === "dark"
                    ? "shadow-2xl shadow-cyan-700/20"
                    : "shadow-2xl shadow-amber-500/20"
                } transition-colors duration-300`}
                style={{
                  transform: profileTransform,
                }}
              >
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={profilePic}
                    alt="Vijit Mehrotra"
                    className="w-full h-full object-cover"
                  />

                  {/* Hover glow effect */}
                  <motion.div
                    className={`absolute inset-0 opacity-0 hover:opacity-40 ${
                      theme === "dark"
                        ? "bg-gradient-to-tr from-cyan-500/30 to-purple-500/30"
                        : "bg-gradient-to-tr from-amber-500/30 to-orange-500/30"
                    } transition-opacity duration-300 pointer-events-none`}
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="max-w-2xl md:px-4"
              variants={containerVariants}
            >
              <motion.h1
                className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r ${
                  theme === "dark"
                    ? "from-cyan-400 to-purple-500"
                    : "from-amber-400 to-orange-500"
                } text-transparent bg-clip-text mb-4 md:text-left text-center transition-colors duration-300`}
                variants={itemVariants}
              >
                Vijit Mehrotra
              </motion.h1>

              <motion.h2
                className="text-xl font-medium text-gray-300 mb-6 md:flex md:justify-start flex justify-center h-8"
                variants={itemVariants}
              >
                <span
                  className={`min-h-[1.5rem] bg-gradient-to-r ${
                    theme === "dark"
                      ? "from-amber-300 to-pink-500"
                      : "from-cyan-400 to-blue-500"
                  } text-transparent bg-clip-text font-semibold text-xl sm:text-2xl transition-colors duration-300`}
                >
                  {typedText}
                </span>
                <span
                  className={`${
                    theme === "dark" ? "text-cyan-500" : "text-amber-500"
                  } font-bold ml-1 transition-all duration-300 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  |
                </span>
              </motion.h2>

              <motion.p
                className="text-gray-300 mb-6 md:text-left text-center text-sm sm:text-base"
                variants={itemVariants}
              >
                Data Scientist and AI Engineer with 4 years of experience,
                specializing in Generative AI solutions. At Quation Solutions, I
                lead projects leveraging AI to streamline processes and drive
                innovation. Passionate about developing advanced AI applications
                that solve complex problems and enhance decision-making.
              </motion.p>

              <motion.div
                className="flex space-x-4 md:justify-start justify-center"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outline"
                    className={`${
                      theme === "dark"
                        ? "bg-gray-800/50 hover:bg-cyan-500/80 text-white border-gray-700 hover:border-cyan-400"
                        : "bg-gray-200/50 hover:bg-amber-500/80 text-gray-800 border-gray-300 hover:border-amber-400"
                    } font-medium py-2 px-4 sm:px-6 text-sm sm:text-base rounded-md border transition-all duration-300`}
                    onClick={() => {
                      window.open(
                        "https://drive.google.com/file/d/1WkeEQTbrMFvOXnGTz_GuNwRu-IPJwq9K/view?usp=sharing",
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                  >
                    RÉSUMÉ
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className={`bg-gradient-to-r ${
                      theme === "dark"
                        ? "from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/20"
                        : "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20"
                    } text-white font-medium py-2 px-4 sm:px-6 text-sm sm:text-base rounded-md transition-all duration-300`}
                    onClick={scrollToContact}
                  >
                    CONTACT
                  </Button>
                </motion.div>
              </motion.div>

              {/* Currently Building Section moved below buttons */}
              <motion.div className="mt-5 w-full" variants={itemVariants}>
                <CurrentlyBuildingSection />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </MouseFollowEffect>
    </section>
  );
};

export default HeroSection;
