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
      className="w-full mx-auto items-center justify-center py-8 pt-20 bg-gray-900/50 relative"
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
          className="text-3xl font-bold mb-8 text-center text-cyan-500 uppercase tracking-wider"
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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-4">
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
                    className="w-full h-64 sm:h-72 md:h-80 relative pt-2 sm:pt-4 pb-6"
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

        {/* Skills Infinite Marquee */}
        <motion.div 
          className="w-full max-w-6xl mx-auto mt-6 overflow-hidden relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {/* Gradient Edges for seamless fade */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r ${theme === 'dark' ? 'from-gray-900/80' : 'from-white'} to-transparent z-10 pointer-events-none`}></div>
          <div className={`absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l ${theme === 'dark' ? 'from-gray-900/80' : 'from-white'} to-transparent z-10 pointer-events-none`}></div>
          
          <div className="flex w-full group pb-4 pt-2">
            <motion.div
              className="flex space-x-4 min-w-max pl-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 35,
                  ease: "linear",
                },
              }}
            >
              {/* Double the array for seamless infinity loop */}
              {[...selectedCategory.data, ...selectedCategory.data].map((skill, index) => (
                <div
                  key={`${skill.name}-${index}`}
                  className={`w-44 sm:w-56 p-3 sm:p-4 ${theme === 'dark' ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-gray-100/90'} rounded-xl ${selectedCategory.borderColor2} border hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 shadow-lg shrink-0`}
                >
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <span className={`font-semibold text-sm sm:text-base truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{skill.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-xs whitespace-nowrap ${selectedCategory.highlight} ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-medium`}>
                      {skill.value.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedCategory.gradient}`}
                      style={{ width: `${(skill.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
        <div className="w-full py-20 border-b-[1px] border-b-gray-800 sm:px-2 lgl:px-0"></div>
      </div>
    </section>
  );
};
export default SkillsSection;
