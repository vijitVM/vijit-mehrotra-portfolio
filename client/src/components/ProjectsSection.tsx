import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectsData } from "../data/data";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Github, ExternalLink } from "lucide-react";

const ProjectsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    const { current } = scrollRef;
    if (!current) return;

    const scrollAmount = current.offsetWidth * 0.9; // Scroll 90% of container
    current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const getProjectAccent = (projectId: number) => {
    if (projectId % 3 === 0) return "cyan";
    if (projectId % 3 === 1) return "amber";
    return "purple";
  };

  const getProjectGradient = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "from-cyan-500/20 to-blue-600/20";
    if (accent === "amber") return "from-amber-500/20 to-orange-600/20";
    return "from-purple-500/20 to-pink-600/20";
  };

  const getProjectBorderColor = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "border-cyan-500/30";
    if (accent === "amber") return "border-amber-500/30";
    return "border-purple-500/30";
  };

  const getProjectTextColor = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "text-cyan-400";
    if (accent === "amber") return "text-amber-400";
    return "text-purple-400";
  };

  return (
    <section
      id="projects"
      className="w-full flex flex-col items-center justify-center py-20 bg-gray-900/50 relative"
    >
      <h2 className="text-3xl font-bold mb-12 text-cyan-500 uppercase tracking-wider text-center">
        Projects
      </h2>

      {/* Arrows */}
      <div className="relative w-full max-w-7xl px-4">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 z-10"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth no-scrollbar px-10"
        >
          {projectsData.map((project, index) => {
            const projectAccent = getProjectAccent(project.id);
            const projectGradient = getProjectGradient(project.id);
            const projectBorder = getProjectBorderColor(project.id);
            const projectText = getProjectTextColor(project.id);

            return (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.03, y: -5 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="flex-shrink-0 w-[280px] md:w-[300px] xl:w-[340px]"
              >
                <Card
                  className={`relative p-3 h-[460px] flex flex-col bg-gray-800 bg-opacity-70 shadow-lg border ${projectBorder} transition-all duration-300`}
                >
                  {/* Background Highlight */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${projectGradient} opacity-0 transition-opacity duration-500 pointer-events-none rounded-lg`}
                    animate={{ opacity: hoveredProject === project.id ? 0.05 : 0 }}
                  />

                  {/* Image */}
                  <div className="h-36 overflow-hidden rounded-md relative mb-3">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                  </div>

                  {/* Title */}
                  <motion.h3
                    className={`text-md font-semibold mb-1 ${projectText}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    {project.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-gray-300 text-sm leading-snug mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Buttons */}
                  <div className="mt-auto flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`border ${projectBorder} hover:bg-gray-700`}
                      onClick={() =>
                        window.open(project.githubUrl, "_blank", "noopener,noreferrer")
                      }
                    >
                      <Github className="text-gray-300" size={16} />
                    </Button>
                    {project.liveUrl && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`border ${projectBorder} hover:bg-gray-700`}
                        onClick={() =>
                          window.open(project.liveUrl, "_blank", "noopener,noreferrer")
                        }
                      >
                        <ExternalLink className="text-gray-300" size={16} />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 z-10"
        >
          <ArrowRight className="text-white" size={20} />
        </button>
      </div>
    </section>
  );
};

export default ProjectsSection;
