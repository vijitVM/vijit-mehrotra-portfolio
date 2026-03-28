import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { educationData } from "../data/data";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FaGraduationCap } from "react-icons/fa";
import deepLearningLogo from "../attached_assets/DeepLearning.AI.svg";
import courseraLogo from "../attached_assets/coursera-logo.svg";
import HuggingFaceLogo from "../attached_assets/hf-logo.svg";
import Neo4jLogo from "../attached_assets/Neo4jLockup_Color.png";

const EducationSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" },
    }),
  };

  const getLogo = (logo: string) => {
    switch (logo) {
      case "N4J": return Neo4jLogo;
      case "DL": return deepLearningLogo;
      case "HF": return HuggingFaceLogo;
      case "CS": return courseraLogo;
      default: return undefined;
    }
  };

  return (
    <section id="education" className="w-full flex items-center justify-center py-12 pt-12 relative" ref={sectionRef}>
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
                          <h4 className="text-lg font-medium">{education.degree}</h4>
                          <Badge className="bg-cyan-600/20 text-white text-xs rounded border border-cyan-500/50 px-2">
                            {education.score}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{education.institution} ({education.period})</p>
                        <p className="text-sm text-gray-300 mt-3">{education.details}</p>
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

            <div className="w-full px-6 sm:px-10 mt-2">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-sm mx-auto sm:max-w-none"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {educationData.certifications.map((certification, index) => (
                    <CarouselItem key={certification.id} className="pl-2 md:pl-4 basis-full">
                      <motion.div
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="h-full transition-all duration-300"
                        whileHover={{ y: -4 }}
                      >
                        <Card className="h-full flex border-gray-700 bg-gray-800/80 backdrop-blur-sm overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                          <CardContent className="flex p-4 items-center w-full bg-transparent duration-300 rounded-lg cursor-pointer group hover:bg-gradient-to-r hover:from-cyan-900/50 hover:to-indigo-900/50">
                            <div className="flex items-center w-full">
                              <div
                                className="w-14 h-14 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center mr-4 p-1.5 shrink-0 border border-gray-700/50 group-hover:border-cyan-500/50 transition-colors"
                              >
                                {getLogo(certification.logo) ? (
                                  <img src={getLogo(certification.logo)} alt={certification.name} className="w-full h-full object-contain" />
                                ) : (
                                  <div className="h-full w-full bg-gray-700/50 flex items-center justify-center rounded-md">
                                    <FaGraduationCap className="text-gray-300 text-xl" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-gray-100 text-sm sm:text-base font-semibold leading-tight mb-1 truncate group-hover:text-cyan-400 transition-colors">{certification.name}</div>
                                <div className="text-cyan-500/80 text-xs font-medium">{certification.issuer}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-6 sm:-left-12 bg-gray-800 border-gray-700 text-cyan-500 hover:bg-cyan-500 hover:text-white" />
                <CarouselNext className="hidden sm:flex -right-6 sm:-right-12 bg-gray-800 border-gray-700 text-cyan-500 hover:bg-cyan-500 hover:text-white" />
              </Carousel>
              
              <div className="sm:hidden flex justify-center mt-4">
                 <p className="text-xs text-gray-500 italic">Swipe to see more</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full py-20 border-b-[1px] border-b-gray-800 sm:px-2 lgl:px-0"></div>
      </div>
    </section>
  );
};

export default EducationSection;
