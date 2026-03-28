import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Terminal, Code, Sparkles, Target } from "lucide-react";
import { buildingData, BuildingItem } from "../data/buildingData";

const CurrentlyBuildingSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [typedTexts, setTypedTexts] = useState<string[]>(
    Array(buildingData.length).fill(""),
  );
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Typing animation
  useEffect(() => {
    if (!isInView) return;

    const currentItem = buildingData[currentItemIndex];

    if (currentCharIndex < currentItem.content.length) {
      const timer = setTimeout(
        () => {
          setTypedTexts((prev) => {
            const newTexts = [...prev];
            newTexts[currentItemIndex] = currentItem.content.substring(
              0,
              currentCharIndex + 1,
            );
            return newTexts;
          });
          setCurrentCharIndex((prev) => prev + 1);
        },
        50 + Math.random() * 30,
      ); // Random delay for realistic typing effect

      return () => clearTimeout(timer);
    } else if (currentItemIndex < buildingData.length - 1) {
      const timer = setTimeout(() => {
        setCurrentItemIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentItemIndex, currentCharIndex, isInView]);

  // Blinking cursor effect
  useEffect(() => {
    if (!isInView) return;

    const timer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(timer);
  }, [isInView]);

  // Get icon based on type
  const getIcon = (type: BuildingItem["type"]) => {
    switch (type) {
      case "building":
        return <Terminal className="h-4 w-4" />;
      case "exploring":
        return <Sparkles className="h-4 w-4" />;
      case "learning":
        return <Target className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  // Get label based on type
  const getLabel = (type: BuildingItem["type"]) => {
    switch (type) {
      case "building":
        return "Currently Building:";
      case "exploring":
        return "Tech Exploring:";
      case "learning":
        return "Learning Goal:";
      default:
        return "Working On:";
    }
  };

  // Get color based on type
  const getColor = (type: BuildingItem["type"]) => {
    switch (type) {
      case "building":
        return "text-cyan-400";
      case "exploring":
        return "text-amber-400";
      case "learning":
        return "text-purple-400";
      default:
        return "text-white";
    }
  };

  return (
    <div ref={sectionRef} className="w-full flex justify-center my-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#0D1117] border border-gray-800 rounded-xl overflow-hidden w-full max-w-2xl shadow-2xl shadow-cyan-900/20"
      >
        {/* MacOS Style Terminal Header */}
        <div className="flex items-center px-4 py-3 bg-gray-900/80 border-b border-gray-800">
          <div className="flex space-x-2 mr-4">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-sm"></div>
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
            <div className="h-3 w-3 rounded-full bg-[#27C93F] shadow-sm"></div>
          </div>
          <div className="flex-1 text-center text-gray-400 font-mono text-xs tracking-wider opacity-80">
            vijit@portfolio: ~/ai-lab/active-projects
          </div>
          <div className="w-10"></div> {/* Spacer to keep title centered */}
        </div>

        {/* Terminal Window Content */}
        <div className="p-5 sm:p-6 font-mono text-sm sm:text-base space-y-3 bg-[#0D1117]">
          {buildingData.map((item: BuildingItem, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={
                isInView && typedTexts[i]
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -10 }
              }
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex flex-col sm:flex-row sm:items-start tracking-tight"
            >
              {/* Bash Prompt */}
              <div className="flex items-center text-green-400 mr-3 mb-1 sm:mb-0 shrink-0 select-none">
                <span className="text-cyan-500 font-bold mr-2">➜</span>
                <span className="flex items-center opacity-80 text-xs sm:text-sm">
                   <span className="mr-1.5">{getIcon(item.type)}</span>
                   {getLabel(item.type)}
                </span>
              </div>

              {/* Typed Content */}
              <div className={`${getColor(item.type)} flex-1 leading-relaxed`}>
                {typedTexts[i]}
                {i === currentItemIndex && cursorVisible && (
                  <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-cyan-400 ml-1 animate-pulse align-middle shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Waiting Terminal Line After Typing Finances */}
          {currentItemIndex >= buildingData.length - 1 && typedTexts[buildingData.length - 1].length === buildingData[buildingData.length - 1].content.length && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="flex items-center text-green-400 pt-2 shrink-0 select-none"
            >
                <span className="text-cyan-500 font-bold mr-3">➜</span>
                <span className="text-gray-500 text-xs sm:text-sm">~/ai-lab/active-projects</span>
                {cursorVisible && (
                  <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-cyan-400 ml-2 animate-pulse align-middle shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CurrentlyBuildingSection;
