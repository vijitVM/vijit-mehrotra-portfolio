import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { educationData } from "../data/data";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FaGraduationCap } from "react-icons/fa";
import deepLearningLogo from "../attached_assets/DeepLearning.AI.jpg";
import courseraLogo from "../attached_assets/coursera-logo.svg";

const EducationSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 + i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const certCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 + i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      id="education"
      className="py-10 pt-12 overflow-hidden bg-[#111827]"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center text-cyan-500 uppercase tracking-wider education-title"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          EDUCATION
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Formal Education */}
          <div>
            <motion.h3
              className="text-xl font-semibold mb-6 text-center"
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              Formal Education
            </motion.h3>

            <div className="space-y-6">
              {educationData.formal.map((education, index) => (
                <motion.div
                  key={education.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <Card className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-medium">
                            {education.degree}
                          </h4>
                          <Badge className="bg-cyan-600/20 text-white text-xs rounded border border-cyan-500/50 px-2">
                            {education.score}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {education.institution} ({education.period})
                        </p>
                        <p className="text-sm text-gray-300 mt-3">
                          {education.details}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <motion.h3
              className="text-xl font-semibold mb-6 text-center"
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              Certifications
            </motion.h3>

            <div className="space-y-4">
              {educationData.certifications.map((certification, index) => (
                <motion.div
                  key={certification.id}
                  custom={index}
                  variants={certCardVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="mb-1.0"
                >
                  <Card className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-pink-500/50 transition-all duration-300 shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <motion.div
                         className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mr-4 shadow-md border-2"
                          style={{
                            borderColor:
                              certification.colorClass === "bg-gray-700"
                                ? "#ff0080"
                                : "#22d3ee",
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          }}
                        >
                          {certification.logo === "DL" ? (
                            <img
                              src={deepLearningLogo}
                              alt="DeepLearning.AI"
                              className="w-full h-full object-cover"
                            />
                          ) : certification.logo === "CS" ? (
                            <img
                              src={courseraLogo}
                              alt="Coursera"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <FaGraduationCap className="text-white text-xl" />
                            </div>
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">
                            {certification.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {certification.issuer}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
