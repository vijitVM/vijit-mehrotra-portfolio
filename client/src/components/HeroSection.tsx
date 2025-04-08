import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";
import ThreeScene from "./ThreeScene";
import profilePic from "../attached_assets/Vijit_github_profile_pic.jpg";

const HeroSection = () => {
  const titles = [
    "Generative AI Specialist",
    "Team Player",
    "Data Science Consultant",
    "AI Engineer",
  ];
  const [typedText, setTypedText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <section
      id="home"
      className="min-h-screen flex items-center py-20 overflow-hidden relative"
    >
      <ParticleBackground />
      <ThreeScene />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row gap-8 items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex-shrink-0" variants={profileVariants}>
            <div className="w-72 h-72 rounded-lg bg-transparent border-2 border-dashed border-gray-600 flex items-center justify-center">
              <img
                src={profilePic}
                alt="Vijit Mehrotra"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div className="max-w-2xl" variants={containerVariants}>
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text mb-4 text-center"
              variants={itemVariants}
            >
              Vijit Mehrotra
            </motion.h1>

            <motion.h2
              className="text-xl font-medium text-gray-300 mb-6 flex justify-center h-8"
              variants={itemVariants}
            >
              <span className="min-h-[1.5rem] bg-gradient-to-r from-amber-300 to-pink-500 text-transparent bg-clip-text font-semibold text-2xl">
                {typedText}
              </span>
              <span
                className={`text-cyan-500 font-bold ml-1 transition-opacity duration-200 ${
                  cursorVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                |
              </span>
            </motion.h2>

            <motion.p
              className="text-gray-300 mb-8 text-center"
              variants={itemVariants}
            >
              I am a Data Scientist and AI Engineer with 4+ years of experience,
              specializing in Generative AI solutions. Currently at Quation
              Solutions Private Limited, I lead projects that leverage AI to
              streamline processes and drive innovation. My focus is on
              developing advanced AI applications that solve complex problems
              and enhance decision-making. Passionate about pushing the
              boundaries of AI, I'm dedicated to delivering impactful,
              data-driven solutions.
            </motion.p>

            <motion.div
              className="flex space-x-4 justify-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  className="bg-gray-800/50 hover:bg-cyan-500/80 text-white font-medium py-2 px-6 rounded-md border border-gray-700 hover:border-cyan-400 transition-all duration-300"
                  onClick={() => {
                    // Using window.open with proper attributes can help avoid antivirus warnings
                    window.open(
                      "https://drive.google.com/drive/folders/1ADhXSG5hcN3QJ8G_DA5z39YGUuHWGerU", 
                      "_blank", 
                      "noopener,noreferrer"
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
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 shadow-lg shadow-cyan-500/20"
                  onClick={scrollToContact}
                >
                  CONTACT
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
