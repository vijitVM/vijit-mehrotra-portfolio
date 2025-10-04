import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectsData } from "../data/data";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { ProjectPitchGeneratorModal } from "./ProjectPitchGeneratorModal"; // Changed import

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const projectVariants = {
    hidden: (i: number) => ({ opacity: 0, y: 50, scale: 0.95, rotateY: -5 }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    }),
    hover: {
      y: -8,
      scale: 1.02,
      transition: { type: "spring", stiffness: 200, damping: 10 },
    },
  };

  const getProjectAccent = (id: number) => {
    const i = (id - 1) % 4;
    return ["cyan", "amber", "purple", "blue"][i];
  };

  const getProjectGradient = (id: number) => {
    const a = getProjectAccent(id);
    return {
      cyan: "from-cyan-500/20 to-blue-600/20",
      amber: "from-amber-500/20 to-orange-600/20",
      purple: "from-purple-500/20 to-pink-600/20",
      blue: "from-blue-500/20 to-indigo-600/20",
    }[a];
  };

  const getProjectBorderColor = (id: number) => {
    const a = getProjectAccent(id);
    return {
      cyan: "border-cyan-500/30",
      amber: "border-amber-500/30",
      purple: "border-purple-500/30",
      blue: "border-blue-500/30",
    }[a];
  };

  const getProjectTextColor = (id: number) => {
    const a = getProjectAccent(id);
    return {
      cyan: "text-cyan-400",
      amber: "text-amber-400",
      purple: "text-purple-400",
      blue: "text-blue-400",
    }[a];
  };

  return (
    <section
      id="projects"
      className="w-full flex flex-col items-center justify-center py-12 pt-20 bg-gray-900/50 relative overflow-x-hidden"
      ref={sectionRef}
    >
      <div className="w-full px-4 max-w-7xl mx-auto py-14 border-b border-gray-800">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full flex flex-col items-center justify-center"
        >
          <motion.h2
            className="text-3xl font-bold mb-4 text-cyan-500 uppercase tracking-wider text-center"
            variants={headerVariants}
          >
            PROJECTS
          </motion.h2>
           <ProjectPitchGeneratorModal />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-8">
          {projectsData.map((project, index) => {
            const accent = getProjectAccent(project.id);
            const gradient = getProjectGradient(project.id);
            const border = getProjectBorderColor(project.id);
            const textColor = getProjectTextColor(project.id);

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
                  className={`relative w-full p-3 xl:px-4 h-[350px] xl:py-3 rounded-lg flex flex-col bg-gray-800 bg-opacity-70 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-${accent}-500/10`}
                >
                  {/* Hover background highlight */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 0.05 : 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Top Accent Bar */}
                  <div
                    className={`h-1 w-full bg-gradient-to-r ${
                      accent === "cyan"
                        ? "from-cyan-500 to-blue-600"
                        : accent === "amber"
                        ? "from-amber-500 to-orange-600"
                        : accent === "purple"
                        ? "from-purple-500 to-pink-600"
                        : "from-blue-500 to-indigo-600"
                    }`}
                  />

                  {/* Image */}
                  <div className="h-40 w-full overflow-hidden relative">
                    <motion.div
                      className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"
                      style={{
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-black bg-opacity-30 opacity-0 flex items-center justify-center transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                          onClick={() => window.open(project.githubUrl, "_blank", "noopener,noreferrer")}
                        >
                          View on GitHub <ArrowUpRight size={16} className="ml-2" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-grow flex flex-col">
                    <motion.h3
                      className={`text-lg font-semibold mb-2 ${textColor}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {project.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-300 text-xs leading-relaxed mb-3 flex-grow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {project.description}
                    </motion.p>

                    {/* Links */}
                    <div className="flex justify-end items-center mt-auto pt-2">
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => window.open(project.githubUrl, "_blank", "noopener,noreferrer")}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-full ${border} hover:bg-gray-700 transition-colors`}
                        >
                          <Github size={16} className="text-gray-300" />
                        </motion.button>
                        {project.liveUrl && (
                          <motion.button
                            onClick={() => window.open(project.liveUrl, "_blank", "noopener,noreferrer")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 rounded-full ${border} hover:bg-gray-700 transition-colors`}
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
      </div>
    </section>
  );
};

export default ProjectsSection;
