import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useSectionObserver } from "../hooks/use-section-observer";
import { useTheme } from "./ThemeProvider";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import RadarChart from "./RadarChart";
import SkillsThreeScene from "./SkillsThreeScene";
import { skillsData, getCompactTier } from "../data/data";
import { 
  Database, 
  Cpu, 
  Server,
  Activity, 
  GitMerge
} from "lucide-react";

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

  // State for active pipeline stage
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

  // Pipeline stages data
  const pipelineStages = [
    {
      title: "Data Ingestion & Extraction",
      shortTitle: "Ingestion",
      icon: Server,
      focus: "High-Throughput Parsing",
      desc: "Architecting high-frequency scraping and extraction pipelines that feed clean context into downstream models, avoiding unstructured data noise.",
      techStack: ["Python", "Playwright", "Java", "ETL Pipelines", "Scheduled Triggers"],
      systemStandard: "95%+ parsing success rate across non-standard PDF tables, email attachments, and multi-nested DOM pages."
    },
    {
      title: "Agentic Orchestration",
      shortTitle: "Orchestration",
      icon: Cpu,
      focus: "Stateful Graph Execution",
      desc: "Engineering multi-agent crews and stateful DAG graphs that run tool validations, automated query routing, and parallel task execution.",
      techStack: ["LangGraph", "CrewAI", "LangChain", "DSPy Prompt Compilation", "OpenAI / LLaMA"],
      systemStandard: "Linear pipelines are replaced with self-correcting agent state machines to handle edge-cases dynamically."
    },
    {
      title: "Storage & Index Optimization",
      shortTitle: "Context Storage",
      icon: Database,
      focus: "Hybrid Semantic Search",
      desc: "Configuring high-dimensional vector search indices, metadata catalogs, and graph schemas for sub-second, highly relevant information retrieval.",
      techStack: ["PGVector", "Milvus", "ChromaDB", "Neo4j Graph DB", "HNSW Indexing", "FlashRank Reranking"],
      systemStandard: "Combining graph structures with vector similarity to eliminate hallucinations and resolve sparse taxonomy problems."
    },
    {
      title: "LLMOps & Telemetry Guardrails",
      shortTitle: "Telemetry",
      icon: Activity,
      focus: "Observability & Guardrails",
      desc: "Instrumenting full execution tracing, latency breakdown, cost budgets, and automated outputs validation checks directly in the production CI/CD loop.",
      techStack: ["Langfuse Tracing", "GitLab CI/CD Pipelines", "System Test Assertions", "Cost & Latency Telemetry"],
      systemStandard: "Real-time trace logs mapped to custom evaluation metrics, maintaining safe, cost-bounded operations."
    }
  ];

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
      focusLabel: "Focus: GenAI & Orchestration Pipelines",
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
      focusLabel: "Focus: Core Languages & Vector Databases",
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
      focusLabel: "Focus: Leadership & Agile Collaboration",
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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-4 overflow-visible">
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
                        className={`inline-block px-4 py-1.5 rounded-full ${selectedCategory.highlight} ${selectedCategory.color} border ${selectedCategory.borderColor2} backdrop-blur-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider`}
                      >
                        {selectedCategory.focusLabel}
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
                  className={`w-48 sm:w-56 p-3.5 sm:p-4 ${theme === 'dark' ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-gray-100/90'} rounded-xl ${selectedCategory.borderColor2} border hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 shadow-lg shrink-0`}
                >
                  <div className="flex flex-col gap-2">
                    <span className={`font-semibold text-sm sm:text-base truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {skill.name}
                    </span>
                    <div className="flex justify-between items-center gap-2.5 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${selectedCategory.gradient}`}
                          style={{ width: `${(skill.value / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] whitespace-nowrap font-bold uppercase tracking-wider ${selectedCategory.highlight} ${selectedCategory.color} border ${selectedCategory.borderColor2}`}>
                        {getCompactTier(skill.value)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Production Pipeline Blueprint Section */}
        <motion.div
          className="w-full max-w-6xl mx-auto mt-10 pt-8 border-t border-gray-800/60"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
              theme === "dark"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
            }`}>
              Production Architecture Stack
            </span>
            <h3 className={`text-2xl sm:text-3xl font-bold mt-4 tracking-tight ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}>
              AI Systems Pipeline Blueprint
            </h3>
            <p className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              A functional blueprint showing how my engineering skills connect to orchestrate, optimize, and secure commercial LLM solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Interactive Pipeline Stages Selector */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-thin">
              {pipelineStages.map((stage, idx) => {
                const StageIcon = stage.icon;
                const isActive = activePipelineStage === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActivePipelineStage(idx)}
                    className={`flex items-center gap-4 p-4 rounded-xl text-left border transition-all duration-300 min-w-[200px] lg:min-w-0 shrink-0 ${
                      isActive
                        ? (theme === 'dark' 
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                            : 'bg-amber-500/10 border-amber-500/40 text-amber-700 shadow-[0_0_15px_rgba(245,158,11,0.1)]')
                        : (theme === 'dark'
                            ? 'bg-[#161B22]/40 hover:bg-[#161B22]/70 border-gray-800/80 text-gray-400 hover:border-gray-700'
                            : 'bg-gray-50/80 hover:bg-gray-100/90 border-gray-200 text-gray-600 hover:border-gray-300')
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg border ${
                      isActive
                        ? (theme === 'dark' ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-amber-500/20 border-amber-500/30')
                        : (theme === 'dark' ? 'bg-gray-800/40 border-gray-700/40' : 'bg-gray-200/50 border-gray-350/50')
                    }`}>
                      <StageIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase font-mono tracking-widest opacity-60 leading-none">
                        STAGE 0{idx + 1}
                      </div>
                      <div className="font-bold text-xs sm:text-sm mt-1 leading-tight">
                        {stage.shortTitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pipeline Stage Details Console */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePipelineStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-2xl border flex flex-col justify-between h-full relative overflow-hidden shadow-xl ${
                    theme === 'dark'
                      ? 'bg-[#0D1117]/60 border-gray-800 hover:border-cyan-500/20'
                      : 'bg-white border-gray-200 hover:border-amber-500/20'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header bar */}
                    <div className="flex justify-between items-start border-b border-gray-800/40 pb-4">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                        }`}>
                          {pipelineStages[activePipelineStage].focus}
                        </span>
                        <h4 className={`text-lg sm:text-xl font-bold mt-2 ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                        }`}>
                          {pipelineStages[activePipelineStage].title}
                        </h4>
                      </div>
                      <div className="text-3xl font-black font-mono opacity-15 leading-none">
                        0{activePipelineStage + 1}
                      </div>
                    </div>

                    {/* Desc */}
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {pipelineStages[activePipelineStage].desc}
                    </p>

                    {/* Tech Stacks */}
                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Core Tech Stack
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pipelineStages[activePipelineStage].techStack.map((tech) => (
                          <span
                            key={tech}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              theme === 'dark'
                                ? 'bg-gray-800/40 border-gray-700/60 text-gray-300'
                                : 'bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Standard guidelines */}
                  <div className={`mt-6 p-4 rounded-xl border flex gap-3.5 items-start ${
                    theme === 'dark'
                      ? 'bg-cyan-950/10 border-cyan-800/20'
                      : 'bg-amber-50/20 border-amber-200/30'
                  }`}>
                    <div className={`p-1.5 rounded-lg border shrink-0 ${
                      theme === 'dark'
                        ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-700'
                    }`}>
                      <GitMerge className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 leading-none">
                        Production System Guideline
                      </div>
                      <p className={`text-[11px] sm:text-xs leading-relaxed font-medium mt-1 ${
                        theme === 'dark' ? 'text-cyan-200' : 'text-amber-900'
                      }`}>
                        {pipelineStages[activePipelineStage].systemStandard}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="w-full py-10 border-b-[1px] border-b-gray-800 sm:px-2 lgl:px-0"></div>
      </div>
    </section>
  );
};
export default SkillsSection;
