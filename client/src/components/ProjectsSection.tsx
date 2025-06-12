import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectsData } from "../data/data";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  liveUrl: string; // Add this line
}

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const projectVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 50,
      scale: 0.95,
      rotateY: -5
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        delay: 0.1 + (i * 0.1),
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }),
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };


  // Determine project accent color
  const getProjectAccent = (projectId: number) => {
    // Modified to cycle through 4 colors for better visual distinction if you have many projects
    const effectiveId = (projectId - 1) % 4; // Use 4 for 4 distinct colors
    if (effectiveId === 0) return "cyan";
    if (effectiveId === 1) return "amber";
    if (effectiveId === 2) return "purple";
    return "blue"; // Add a fourth color
  };

  // Get gradient based on project accent
  const getProjectGradient = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "from-cyan-500/20 to-blue-600/20";
    if (accent === "amber") return "from-amber-500/20 to-orange-600/20";
    if (accent === "purple") return "from-purple-500/20 to-pink-600/20";
    return "from-blue-500/20 to-indigo-600/20"; // Add gradient for the fourth color
  };

  // Get border color based on project accent
  const getProjectBorderColor = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "border-cyan-500/30";
    if (accent === "amber") return "border-amber-500/30";
    if (accent === "purple") return "border-purple-500/30";
    return "border-blue-500/30"; // Add border color for the fourth color
  };

  // Get text color based on project accent
  const getProjectTextColor = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "text-cyan-400";
    if (accent === "amber") return "text-amber-400";
    if (accent === "purple") return "text-purple-400";
    return "text-blue-400"; // Add text color for the fourth color
  };

  return (
    <section id="projects" className="w-full flex flex-col items-center justify-center py-12 pt-20 bg-gray-900/50 relative" ref={sectionRef}>
      <div className="sm:w-full px-0 sm:px-2 lg:w-11/12 xl:w-5/6 py-14 border-b-gray-800">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full flex items-center justify-center"
        >
          <motion.h2
            className="text-3xl text font-bold mb-12 text-cyan-500 uppercase tracking-wider text-center"
            variants={headerVariants}
          >
            PROJECTS
          </motion.h2>
        </motion.div>

        {/* Changed grid-cols-3 to grid-cols-4 for xl breakpoint */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {projectsData.map((project, index) => {
            const projectAccent = getProjectAccent(project.id);
            const projectGradient = getProjectGradient(project.id);
            const projectBorder = getProjectBorderColor(project.id);
            const projectText = getProjectTextColor(project.id);

            return (
              <motion.div
                key={project.id}
                custom={index}
                variants={projectVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover="hover"
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="h-full"
              >
                <Card
                  className={`w-full p-3 xl:px-4 h-[500px] xl:py-3 rounded-lg flex flex-col bg-gray-800 bg-opacity-70 shadow-lg hover:shadow-xl hover:shadow-${projectAccent}-500/10 transition-all duration-300`}
                >
                  {/* Animated highlight on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${projectGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 0.05 : 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Top border accent */}
                  <div className={`h-1 w-full bg-gradient-to-r ${
                    projectAccent === "cyan" ? "from-cyan-500 to-blue-600" :
                    projectAccent === "amber" ? "from-amber-500 to-orange-600" :
                    projectAccent === "purple" ? "from-purple-500 to-pink-600" :
                    "from-blue-500 to-indigo-600" // Added for the fourth color cycle
                  }`} />

                  {/* Project image */}
                  <div className="h-40 overflow-hidden">
                    <motion.div
                      className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 relative"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Image overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                          onClick={() => {
                            window.open(
                              project.githubUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                        >
                          View on GitHub <ArrowUpRight size={16} className="ml-2" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Project content */}
                  <div className="p-4 flex-grow flex flex-col">
                    <motion.h3
                      className={`text-lg font-semibold mb-2 ${projectText}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                    >
                      {project.title}
                    </motion.h3>

                    {/* Project description */}
                    <motion.p
                      className="text-gray-300 text-xs leading-relaxed mb-3 flex-grow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      {project.description}
                    </motion.p>

                    {/* Project links */}
                    <div className="flex justify-end items-center mt-auto pt-2">
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => {
                            window.open(
                              project.githubUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-full ${projectBorder} hover:bg-gray-700 transition-colors`}
                        >
                          <Github size={16} className="text-gray-300" />
                        </motion.button>

                        {/* Live Site Button (conditionally rendered) */}
                        {project.liveUrl && (
                          <motion.button
                            onClick={() => {
                              window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 rounded-full ${projectBorder} hover:bg-gray-700 transition-colors`}
                          >
                            <ExternalLink size={16} className="text-gray-300" />
                          </motion.button>
                        )}

                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <div className="w-full py-20 border-b-[1px] border-b-gray-800 sm:px-2 lgl:px-0"></div>
      </div>
    </section>
  );
};

export default ProjectsSection;
