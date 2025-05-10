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
    <div ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-lg px-3 py-1.5 w-full max-w-xl mx-auto shadow-xl"
      >
        {/* Terminal header */}
        <div className="flex items-center pb-1 border-b border-gray-700 mb-1">
          <div className="flex space-x-1.5 mr-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm font-mono text-[10px]">
            ~/dev/currently-working-on
          </div>
        </div>

        {/* Terminal content */}
        <div className="font-mono text-sm space-y-0.5">
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
              className="flex items-start"
            >
              <div className="flex items-center min-w-[100px] text-gray-400 text-sm">
                <span className="mr-1">{getIcon(item.type)}</span>
                <span>{getLabel(item.type)}</span>
              </div>
              <div className={`${getColor(item.type)} flex-1 text-sm`}>
                {typedTexts[i]}
                {i === currentItemIndex && cursorVisible && (
                  <span className="text-white">|</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CurrentlyBuildingSection;
