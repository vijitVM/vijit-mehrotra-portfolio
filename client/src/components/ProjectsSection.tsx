import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectsData } from "../data/data";
import { motion, useSpring } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Github, ExternalLink } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
}

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const scrollX = useSpring(0, { stiffness: 120, damping: 20, restDelta: 0.5 });
  const scrollProgress = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollX.on("change", (latest) => {
      scrollProgress.current = latest;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = latest;
      }
    });
    return () => unsubscribe();
  }, [scrollX]);

  const [visibleCardsCount, setVisibleCardsCount] = useState(1);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const getScrollMetrics = useCallback(() => {
    let currentVisibleCards = 1;
    if (window.innerWidth >= 1280) { // xl: 4 cards
      currentVisibleCards = 4;
    } else if (window.innerWidth >= 1024) { // lg: 3 cards
      currentVisibleCards = 3;
    } else if (window.innerWidth >= 768) { // md: 2 cards
      currentVisibleCards = 2;
    }
    return { cardsVisible: currentVisibleCards };
  }, []);

  useEffect(() => {
    const updateScrollStates = () => {
      const { cardsVisible } = getScrollMetrics();
      setVisibleCardsCount(cardsVisible);

      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsAtStart(scrollLeft <= 5); // Tolerance for start
        setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 5); // Tolerance for end
      }
    };

    updateScrollStates();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollStates();
    });
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }
    window.addEventListener("resize", updateScrollStates);

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsAtStart(scrollLeft <= 5);
        setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 5);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollStates);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [getScrollMetrics]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollProgress.current;
      const cards = Array.from(scrollContainerRef.current.querySelectorAll(".project-card-item")) as HTMLElement[];

      if (cards.length === 0) return;

      let targetScrollLeft = 0;
      for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].offsetLeft < currentScroll + 5) {
          const targetIndex = Math.max(0, i - visibleCardsCount);
          targetScrollLeft = cards[targetIndex].offsetLeft;
          break;
        }
      }
      scrollX.set(targetScrollLeft);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollProgress.current;
      const cards = Array.from(scrollContainerRef.current.querySelectorAll(".project-card-item")) as HTMLElement[];

      if (cards.length === 0) return;

      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      let targetScrollLeft = maxScroll;

      for (let i = 0; i < cards.length; i++) {
        if (cards[i].offsetLeft > currentScroll + 5) {
          targetScrollLeft = cards[i].offsetLeft;
          break;
        }
      }
      scrollX.set(targetScrollLeft);
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const projectVariants = {
    hidden: (i: number) => ({ opacity: 0, y: 50, scale: 0.95, rotateY: -5 }),
    visible: (i: number) => ({
      opacity: 1, y: 0, scale: 1, rotateY: 0,
      transition: { delay: 0.1 + i * 0.08, duration: 0.7, type: "spring", stiffness: 120, damping: 15, mass: 0.8 },
    }),
    hover: {
      y: -8, scale: 1.02, transition: { type: "spring", stiffness: 250, damping: 12 },
    },
  };

  const getProjectAccent = (projectId: number) => {
    const effectiveId = (projectId - 1) % 4;
    if (effectiveId === 0) return "cyan";
    if (effectiveId === 1) return "amber";
    if (effectiveId === 2) return "purple";
    return "blue";
  };

  const getProjectGradient = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "from-cyan-500/20 to-blue-600/20";
    if (accent === "amber") return "from-amber-500/20 to-orange-600/20";
    if (accent === "purple") return "from-purple-500/20 to-pink-600/20";
    return "from-blue-500/20 to-indigo-600/20";
  };

  const getProjectBorderColor = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "border-cyan-500/30";
    if (accent === "amber") return "border-amber-500/30";
    if (accent === "purple") return "border-purple-500/30";
    return "border-blue-500/30";
  };

  const getProjectTextColor = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "text-cyan-400";
    if (accent === "amber") return "text-amber-400";
    if (accent === "purple") return "text-purple-400";
    return "text-blue-400";
  };

  return (
    <section
      id="projects"
      className="w-full flex flex-col items-center justify-center py-12 pt-20 bg-gray-900/50 relative overflow-x-hidden"
      ref={sectionRef}
    >
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .scrollbar-hide {
          scrollbar-width: none;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto py-14 border-b-gray-800">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <motion.h2
            className="text-3xl font-bold mb-12 text-cyan-500 uppercase tracking-wider text-center"
            variants={headerVariants}
          >
            PROJECTS
          </motion.h2>
        </motion.div>

        <div className="relative w-full overflow-hidden">
          <motion.div
            ref={scrollContainerRef}
            className="flex overflow-x-scroll scrollbar-hide space-x-4 pb-0 snap-x snap-mandatory px-4"
          >
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
                  className={`flex-shrink-0 project-card-item snap-start
                    // Base case for 1 card (on very small screens before sm breakpoint).
                    w-[calc(100%-32px)]
                    // sm breakpoint: 1 card, same logic as above
                    sm:w-[calc(100%-32px)]
                    // md breakpoint: 2 cards. Available width: (100% - 32px outer padding - 16px inner gap) / 2
                    md:w-[calc((100%-32px-16px)/2)]
                    // lg breakpoint: 3 cards. Available width: (100% - 32px outer padding - 32px inner gaps) / 3
                    lg:w-[calc((100%-32px-32px)/3)]
                    // xl breakpoint: 4 cards. Available width: (100% - 32px outer padding - 48px inner gaps) / 4
                    // To avoid sliver of 5th card, subtract a tiny amount (e.g., 0.5px or 1px)
                    xl:w-[calc(((100%-32px-48px)/4) - 1.5px)] // Increased subtraction to 1.5px
                  `}
                >
                  <Card
                    className={`w-full p-3 xl:px-4 h-[500px] xl:py-3 rounded-lg flex flex-col bg-gray-800 bg-opacity-70 shadow-lg hover:shadow-xl hover:shadow-${projectAccent}-500/10 transition-all duration-300`}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${projectGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredProject === project.id ? 0.05 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    />

                    <div
                      className={`h-1 w-full bg-gradient-to-r ${
                        projectAccent === "cyan"
                          ? "from-cyan-500 to-blue-600"
                          : projectAccent === "amber"
                          ? "from-amber-500 to-orange-600"
                          : projectAccent === "purple"
                          ? "from-purple-500 to-pink-600"
                          : "from-blue-500 to-indigo-600"
                      }`}
                    />

                    <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-700">
                      <motion.div
                        className="w-full h-full relative"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          backgroundImage: `url(${project.image})`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      >
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
                            View on GitHub{" "}
                            <Github size={16} className="ml-2" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>

                    <div className="p-4 flex-grow flex flex-col">
                      <motion.h3
                        className={`text-lg font-semibold mb-2 ${projectText}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        {project.title}
                      </motion.h3>

                      <motion.p
                        className="text-gray-300 text-sm leading-relaxed mb-3 flex-grow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {project.description}
                      </motion.p>

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

                          {project.liveUrl && (
                            <motion.button
                              onClick={() => {
                                window.open(
                                  project.liveUrl,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-2 rounded-full ${projectBorder} hover:bg-gray-700 transition-colors`}
                            >
                              <ExternalLink
                                size={16}
                                className="text-gray-300"
                              />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation Arrows: Adjusted placement */}
        {/* Placed inside the max-w-7xl parent, but directly at its edges */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-7xl flex justify-between mx-auto px-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-700/50 hover:bg-gray-600/70 text-white rounded-full p-2"
            onClick={scrollLeft}
            disabled={isAtStart}
          >
            <ArrowLeft size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-700/50 hover:bg-gray-600/70 text-white rounded-full p-2"
            onClick={scrollRight}
            disabled={isAtEnd}
          >
            <ArrowRight size={24} />
          </Button>
        </div>

        {/* Bottom border */}
        <div className="w-full pt-0 pb-20 border-b-[1px] border-b-gray-800 px-4 sm:px-6 lg:px-8"></div>
      </div>
    </section>
  );
};

export default ProjectsSection;
