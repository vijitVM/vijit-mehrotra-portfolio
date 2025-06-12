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

  // Tuned stiffness and damping for a snappier, but still smooth feel
  // Higher stiffness makes it faster. Higher damping makes it less bouncy.
  // restDelta helps it "snap" to the end value faster if it's very close.
  const scrollX = useSpring(0, { stiffness: 120, damping: 20, restDelta: 0.5 }); // Adjusted values

  // Use a ref for scroll progress to avoid re-renders on every scroll update
  const scrollProgress = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollX.on("change", (latest) => {
      scrollProgress.current = latest;
      if (scrollContainerRef.current) {
        // Explicitly set scrollLeft, letting Framer Motion manage the animation
        scrollContainerRef.current.scrollLeft = latest;
      }
    });
    return () => unsubscribe();
  }, [scrollX]);

  const [visibleCardsCount, setVisibleCardsCount] = useState(1); // Default to 1 card
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Function to calculate the number of cards visible and the scroll distance
  const getScrollMetrics = useCallback(() => {
    if (!scrollContainerRef.current) {
      return { cardsVisible: 1, cardWidth: 0, gapWidth: 0 };
    }

    const container = scrollContainerRef.current;
    const firstCard = container.querySelector(".project-card-item") as HTMLElement;

    if (firstCard) {
      const cardWidth = firstCard.offsetWidth; // Use offsetWidth for total width including padding/border
      const gapWidth = 16; // Tailwind's space-x-4 = 16px

      let currentVisibleCards = 1;
      if (window.innerWidth >= 1024) {
        currentVisibleCards = 4;
      } else if (window.innerWidth >= 768) {
        currentVisibleCards = 2;
      }

      // Instead of calculating a fixed page scroll amount,
      // we'll rely on knowing how many cards are visible and
      // directly target the next set of cards based on their offset.
      return { cardsVisible: currentVisibleCards, cardWidth, gapWidth };
    }
    return { cardsVisible: 1, cardWidth: 0, gapWidth: 0 };
  }, []);

  useEffect(() => {
    const updateScrollStates = () => {
      const { cardsVisible } = getScrollMetrics();
      setVisibleCardsCount(cardsVisible); // Update state for visible cards

      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsAtStart(scrollLeft <= 5); // Small buffer for start
        // Check if nearly at the end, considering floating point inaccuracies
        setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 5);
      }
    };

    updateScrollStates(); // Initial calculation on mount

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
      let foundTarget = false;

      // Find the first card that is fully visible, then scroll back by `visibleCardsCount`
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].offsetLeft >= currentScroll - 10 && cards[i].offsetLeft <= currentScroll + 10) { // Check if current card is near current scroll start
          // If at the start of a snapped card, calculate new target by moving back by visibleCardsCount
          const previousPageIndex = Math.max(0, i - visibleCardsCount);
          targetScrollLeft = cards[previousPageIndex].offsetLeft;
          foundTarget = true;
          break;
        } else if (cards[i].offsetLeft < currentScroll) {
          // If we've passed the current snapped card, and haven't found a match,
          // this is the last candidate for the "previous page"
          targetScrollLeft = cards[i].offsetLeft;
        }
      }

      // If no exact snap point found, just move back by a visible amount
      if (!foundTarget) {
        targetScrollLeft = Math.max(0, currentScroll - (cards[0].offsetWidth * visibleCardsCount + (visibleCardsCount - 1) * 16));
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

      let targetScrollLeft = maxScroll; // Default to end
      let foundTarget = false;

      // Find the first card that is currently partially or fully off-screen to the right
      for (let i = 0; i < cards.length; i++) {
        // If the card's start is beyond the current visible area's start + a buffer
        if (cards[i].offsetLeft > currentScroll + 5) {
          targetScrollLeft = cards[i].offsetLeft;
          foundTarget = true;
          break;
        }
      }

      // If we didn't find a clear next snap point (e.g., at the end of the scroll),
      // just try to scroll by a "page" amount
      if (!foundTarget) {
         targetScrollLeft = Math.min(maxScroll, currentScroll + (cards[0].offsetWidth * visibleCardsCount + (visibleCardsCount - 1) * 16));
      }


      scrollX.set(targetScrollLeft);
    }
  };

  // Animation variants (slightly adjusted for spring feel)
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const projectVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 50,
      scale: 0.95,
      rotateY: -5,
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        delay: 0.1 + i * 0.08, // Slightly reduced delay for faster reveal
        duration: 0.7, // Slightly increased duration for a bit more "pop"
        type: "spring",
        stiffness: 120, // Slightly higher stiffness for more immediate feel
        damping: 15,    // Maintained damping for good balance
        mass: 0.8       // Added mass for a heavier, more impactful feel
      },
    }),
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 250, // More reactive on hover
        damping: 12,
      },
    },
  };

  // Determine project accent color (adjusted for 4 cards)
  const getProjectAccent = (projectId: number) => {
    // Using (projectId - 1) % 4 ensures that project 1 gets the first color, etc.
    // Assuming projectId starts from 1 based on typical data structures.
    const effectiveId = (projectId - 1) % 4;
    if (effectiveId === 0) return "cyan";
    if (effectiveId === 1) return "amber";
    if (effectiveId === 2) return "purple";
    return "blue"; // The fourth color
  };

  // Get gradient based on project accent (remain the same, with added blue)
  const getProjectGradient = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "from-cyan-500/20 to-blue-600/20";
    if (accent === "amber") return "from-amber-500/20 to-orange-600/20";
    if (accent === "purple") return "from-purple-500/20 to-pink-600/20";
    return "from-blue-500/20 to-indigo-600/20";
  };

  // Get border color based on project accent (remain the same, with added blue)
  const getProjectBorderColor = (projectId: number) => {
    const accent = getProjectAccent(projectId);
    if (accent === "cyan") return "border-cyan-500/30";
    if (accent === "amber") return "border-amber-500/30";
    if (accent === "purple") return "border-purple-500/30";
    return "border-blue-500/30";
  };

  // Get text color based on project accent (remain the same, with added blue)
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
      className="w-full flex flex-col items-center justify-center py-12 pt-20 bg-gray-900/50 relative"
      ref={sectionRef}
    >
      <div className="sm:w-full px-0 sm:px-2 lg:w-11/12 xl:w-5/6 py-14 border-b-gray-800">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full flex items-center justify-center"
        >
          <motion.h2
            className="text-3xl font-bold mb-12 text-cyan-500 uppercase tracking-wider text-center"
            variants={headerVariants}
          >
            PROJECTS
          </motion.h2>
        </motion.div>

        {/* Outer wrapper to contain the scrollable area and hide overflow */}
        {/* Changed px-4 md:px-0 to px-4 for consistent inner padding which might affect alignment */}
        <div className="relative w-full overflow-hidden px-4">
          <motion.div
            ref={scrollContainerRef}
            // `overflow-x-scroll` is necessary for the content to be scrollable.
            // `scrollbar-hide` should hide the visual scrollbar.
            // `snap-x snap-mandatory` makes scrolling "snap" to cards.
            className="flex overflow-x-scroll scrollbar-hide space-x-4 pb-4 snap-x snap-mandatory"
            style={{ width: '100%', height: 'auto' }}
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
                  // Updated calc for 4 cards on lg screens
                  className={`flex-shrink-0 project-card-item w-full md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] snap-start`}
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
                        className="w-full h-full relative" // Removed gradient from here, now just a container
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          backgroundImage: `url(${project.image})`,
                          backgroundSize: "cover", // To make it fill the space as per image
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
                        className="text-gray-300 text-xs leading-relaxed mb-3 flex-grow"
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

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-0 z-10">
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
        </div>

        <div className="w-full py-20 border-b-[1px] border-b-gray-800 sm:px-2 lgl:px-0"></div>
      </div>
    </section>
  );
};

export default ProjectsSection;
