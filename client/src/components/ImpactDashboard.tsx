import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { Sparkles, Zap, Target, Cpu } from "lucide-react";

interface MetricItem {
  value: string;
  label: string;
  context: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  glowClass: string;
  lightGlowClass: string;
}

const ImpactDashboard = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const metrics: MetricItem[] = [
    {
      value: "90%",
      label: "Signal Accuracy",
      context: "Competitive Listening",
      desc: "Stateful LangGraph multi-agent system scaled Twitter processing to 15K records/day.",
      icon: Sparkles,
      glowClass: "from-cyan-500/20 to-blue-500/20 group-hover:border-cyan-500/40",
      lightGlowClass: "from-cyan-100 to-blue-100 group-hover:border-cyan-400/60",
    },
    {
      value: "60-70%",
      label: "Lookup Savings",
      context: "Field Intelligence RAG",
      desc: "Healthcare LLM assistant query-automation with Redshift context and sub-10s latency.",
      icon: Zap,
      glowClass: "from-amber-500/20 to-orange-500/20 group-hover:border-amber-500/40",
      lightGlowClass: "from-amber-100 to-orange-100 group-hover:border-amber-400/60",
    },
    {
      value: "95%",
      label: "Ingestion Accuracy",
      context: "Workflow Automation",
      desc: "PO and invoice automated email attachment parsing using robust Java/Python.",
      icon: Target,
      glowClass: "from-purple-500/20 to-pink-500/20 group-hover:border-purple-500/40",
      lightGlowClass: "from-purple-100 to-pink-100 group-hover:border-purple-400/60",
    },
    {
      value: "60%",
      label: "Speed Optimization",
      context: "Batch Agent Crews",
      desc: "High-throughput validation of growth bets utilizing CrewAI autonomous crews.",
      icon: Cpu,
      glowClass: "from-blue-500/20 to-indigo-500/20 group-hover:border-blue-500/40",
      lightGlowClass: "from-blue-100 to-indigo-100 group-hover:border-blue-400/60",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-3 mb-2" ref={containerRef}>
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
            theme === "dark"
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
          }`}
        >
          Forward Deployed Impact Showcase
        </span>
      </motion.div>

      <motion.div
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-x-visible py-2.5 px-1.5 pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory"
        style={{ 
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none"
        }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden flex flex-col justify-between min-h-[175px] sm:min-h-[155px] shadow-lg shrink-0 w-[82%] min-w-[270px] max-w-[320px] sm:w-auto sm:min-w-0 sm:max-w-none snap-center ${
                theme === "dark"
                  ? "bg-[#0D1117]/80 backdrop-blur-md border-gray-800 hover:shadow-cyan-950/20"
                  : "bg-white/80 backdrop-blur-md border-gray-200 hover:shadow-amber-200/40"
              }`}
            >
              {/* Subtle background gradient hover glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr ${
                  theme === "dark" ? metric.glowClass : metric.lightGlowClass
                }`}
              />

              <div className="flex justify-between items-start mb-1.5 relative z-10">
                <span
                  className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    theme === "dark"
                      ? "bg-gray-800/80 text-gray-400 border border-gray-700/50"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {metric.context}
                </span>
                <div
                  className={`p-1.5 rounded-lg ${
                    theme === "dark"
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>

              <div className="mt-auto relative z-10 space-y-0.5">
                <div
                  className={`text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "from-cyan-400 to-blue-500"
                      : "from-amber-500 to-orange-600"
                  }`}
                >
                  {metric.value}
                </div>
                <div
                  className={`text-xs sm:text-sm font-bold tracking-wide uppercase ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {metric.label}
                </div>
                <p
                  className={`text-[10px] sm:text-xs leading-relaxed mt-1 font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {metric.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ImpactDashboard;
