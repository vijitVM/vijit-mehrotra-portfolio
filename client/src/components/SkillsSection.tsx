import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useSectionObserver } from "../hooks/use-section-observer";
import { useTheme } from "./ThemeProvider";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import RadarChart from "./RadarChart";
import SkillsThreeScene from "./SkillsThreeScene";
import { skillsData } from "../data/data";

const SkillsSection = () => {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  const { isInView } = useSectionObserver({
    ref: sectionRef,
    threshold: 0.2,
    once: true,
  });
  
  // State for selected category
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>("core");
  // Always use radar view (3D view toggle removed)
  const visualizationType = "radar";

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
      color: theme === 'dark' ? "text-cyan-500" : "text-cyan-600",
      bgHover: theme === 'dark' ? "hover:bg-cyan-500/20" : "hover:bg-cyan-200/40",
      borderColor2: theme === 'dark' ? "border-cyan-500/40" : "border-cyan-400/40",
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
      color: theme === 'dark' ? "text-amber-500" : "text-amber-600",
      bgHover: theme === 'dark' ? "hover:bg-amber-500/20" : "hover:bg-amber-200/40",
      borderColor2: theme === 'dark' ? "border-amber-500/40" : "border-amber-400/40",
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
      color: theme === 'dark' ? "text-purple-500" : "text-purple-600",
      bgHover: theme === 'dark' ? "hover:bg-purple-500/20" : "hover:bg-purple-200/40",
      borderColor2: theme === 'dark' ? "border-purple-500/40" : "border-purple-400/40",
    },
  ];

  // Get the currently selected category
  const selectedCategory = skillCategories.find(cat => cat.id === selectedSkillCategory) || skillCategories[0];

  // Toggle visualization function removed

  return (
    <section
      id="skills"
      className="w-full mx-auto items-center justify-center pt-20 bg-gray-900/50 relative"
      ref={sectionRef}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-3xl font-bold mb-2 text-center text-cyan-500 uppercase tracking-wider"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          SKILLS
        </motion.h2>

        {/* <motion.p
          className="text-xl text-center mb-4"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.1 }}
        >
          Core Competencies & Technical Proficiencies
        </motion.p>
         */}
{/* 3D View toggle removed */}

        {/* Category Tabs */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Tabs 
            defaultValue="core" 
            value={selectedSkillCategory}
            onValueChange={setSelectedSkillCategory}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
              {skillCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className={`data-[state=active]:${category.color} data-[state=active]:shadow-sm ${category.bgHover}`}
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Skills Visualization */}
        <motion.div
          className="w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: isInView ? 1 : 0, 
            scale: isInView ? 1 : 0.9 
          }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedSkillCategory}-${visualizationType}`}
              initial={{ opacity: 0, x: visualizationType === "radar" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: visualizationType === "radar" ? 20 : -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Card
                className={`w-full bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl border ${selectedCategory.borderColor2} overflow-hidden`}
              >
                <div
                  className={`h-1 w-full bg-gradient-to-r ${selectedCategory.gradient}`}
                />
                <CardContent className="p-6 overflow-visible">
                  <motion.h3
                    className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-6 text-center ${selectedCategory.color}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedCategory.title}
                  </motion.h3>
                  <motion.div
                    className="w-full h-auto pt-2 sm:pt-4 pb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: 0.4,
                        duration: 0.8,
                      },
                    }}
                  >
                    {visualizationType === "radar" ? (
                      <RadarChart
                        data={selectedCategory.data}
                        backgroundColor={selectedCategory.backgroundColor}
                        borderColor={selectedCategory.borderColor}
                        pointBackgroundColor={selectedCategory.pointBackgroundColor}
                      />
                    ) : (
                      <SkillsThreeScene categoryId={selectedCategory.id} />
                    )}

                    {/* Skill level indicator that appears below the chart */}
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 text-center text-sm font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span
                        className={`inline-block px-3 py-1 rounded-full ${selectedCategory.highlight} text-white text-xs`}
                      >
                        Average:{" "}
                        {(
                          selectedCategory.data.reduce(
                            (sum, skill) => sum + skill.value,
                            0,
                          ) / selectedCategory.data.length
                        ).toFixed(1)}{" "}
                        / 5
                      </span>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Skills List */}
        <motion.div 
          className="w-full max-w-4xl mx-auto mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.50 sm:gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {selectedCategory.data.map((skill, index) => (
            <motion.div 
              key={skill.name} 
              className={`p-1.5 sm:p-2 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-100/80'} rounded-lg ${selectedCategory.borderColor2} border`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.7 }}
              whileHover={{ 
                y: -5, 
                boxShadow: `0 8px 16px -2px ${selectedCategory.backgroundColor}`,
                transition: { duration: 0.2 } 
              }}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="font-medium text-sm sm:text-base truncate">{skill.name}</span>
                <span className={`px-2 py-1 rounded-md text-xs whitespace-nowrap ${selectedCategory.highlight} text-white`}>
                  {skill.value.toFixed(1)}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700/50 rounded-full mt-2 overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${selectedCategory.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(skill.value / 5) * 100}%` }}
                  transition={{ delay: 0.1 * index + 0.9, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
