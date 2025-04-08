import { Card, CardContent } from "@/components/ui/card";
import RadarChart from "./RadarChart";
import { skillsData } from "../data/data";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useSectionObserver } from "../hooks/use-section-observer";

const SkillsSection = () => {
  const sectionRef = useRef(null);
  const { isInView } = useSectionObserver({
    ref: sectionRef,
    threshold: 0.2,
    once: true,
  });
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<
    string | null
  >(null);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 30,
      scale: 0.9,
      rotateY: -15,
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        delay: 0.2 + i * 0.15,
        duration: 0.7,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(6, 182, 212, 0.1), 0 10px 10px -5px rgba(6, 182, 212, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const skillCategories = [
    {
      id: "core",
      title: "Core Competencies",
      data: skillsData.coreSkills,
      backgroundColor: "rgba(6, 182, 212, 0.25)",
      borderColor: "rgba(6, 182, 212, 1)",
      pointBackgroundColor: "rgba(6, 182, 212, 1)",
      gradient: "from-cyan-500 to-blue-600",
      highlight: "bg-cyan-500/10",
    },
    {
      id: "technical",
      title: "Technical Skills",
      data: skillsData.technicalSkills,
      backgroundColor: "rgba(245, 158, 11, 0.25)",
      borderColor: "rgba(245, 158, 11, 1)",
      pointBackgroundColor: "rgba(245, 158, 11, 1)",
      gradient: "from-amber-500 to-orange-600",
      highlight: "bg-amber-500/10",
    },
    {
      id: "soft",
      title: "Soft Skills",
      data: skillsData.softSkills,
      backgroundColor: "rgba(196, 94, 219, 0.25)",
      borderColor: "rgba(196, 94, 219, 1)",
      pointBackgroundColor: "rgba(196, 94, 219, 1)",
      gradient: "from-purple-500 to-pink-600",
      highlight: "bg-purple-500/10",
    },
  ];

  return (
    <section
      id="skills"
      className="py-20 bg-gray-900/50 relative"
      ref={sectionRef}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      />

      <div className="container mx-auto px-auto relative z-10">
        <motion.h2
          className="text-3xl font-bold mb-4 text-center text-cyan-500 uppercase tracking-wider"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          SKILLS
        </motion.h2>

        <motion.p
          className="text-xl text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.1 }}
        >
          Core Competencies & Technical Proficiencies
        </motion.p>

        {/* Skills Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-auto mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover="hover"
              className="flex"
            >
              <Card
                className={`w-full bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 shadow-${category.id === "core" ? "cyan" : category.id === "technical" ? "amber" : "purple"}-500/10 overflow-hidden`}
              >
                <div
                  className={`h-1 w-full bg-gradient-to-r ${category.gradient}`}
                />
                <CardContent className="p-6 overflow-visible">
                  <motion.h3
                    className="text-xl font-semibold mb-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                  >
                    {category.title}
                  </motion.h3>
                  <motion.div
                    className="w-full h-80 relative pt-4 pb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: 0.4 + index * 0.15,
                        duration: 0.8,
                      },
                    }}
                  >
                    <RadarChart
                      data={category.data}
                      backgroundColor={category.backgroundColor}
                      borderColor={category.borderColor}
                      pointBackgroundColor={category.pointBackgroundColor}
                    />

                    {/* Skill level indicator that appears when hovering */}
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 text-center text-sm font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.15 }}
                    >
                      <span
                        className={`inline-block px-3 py-1 rounded-full ${category.highlight} text-white text-xs`}
                      >
                        Average:{" "}
                        {(
                          category.data.reduce(
                            (sum, skill) => sum + skill.value,
                            0,
                          ) / category.data.length
                        ).toFixed(1)}{" "}
                        / 5
                      </span>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
