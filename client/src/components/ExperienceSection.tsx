import { useState, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { experienceData } from "../data/data";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Define types for the updated data structure
interface DetailItem {
  domain: string;
  text: string;
}

interface Position {
  id: number;
  role: string;
  period: string;
  details: (string | DetailItem)[];
}

interface CompanyExperience {
  id: number;
  company: string;
  companyPeriod: string;
  location: string;
  color: string;
  textColor: string;
  logo: string | any; // Updated to accept both string and image import
  logoType?: "image" | "text";
  positions: Position[];
  awards: string[];
}

const ExperienceSection = () => {
  const [expandedCompanies, setExpandedCompanies] = useState<number[]>([]);
  const [expandedPositions, setExpandedPositions] = useState<number[]>([]);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use a static value for experience as requested
  const experienceInfo = useMemo(() => {
    return {
      years: 3,
      timePeriod: "(2017 - Present)",
      experienceText: "3 Years 9 Months of Experience",
    };
  }, []);

  //   const experienceInfo = useMemo(() => {
  //   const monthMap = {
  //     Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  //     Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  //   };

  //   let totalMonths = 0;

  //   experienceData.forEach((company) => {
  //     company.positions.forEach((position) => {
  //       const [startStr, endStr] = position.period.split(" - ");
  //       const [startMonthStr, startYearStr] = startStr.split(" ");
  //       const startDate = new Date(parseInt(startYearStr), monthMap[startMonthStr as keyof typeof monthMap]);

  //       let endDate: Date;
  //       if (endStr === "Present") {
  //         endDate = new Date();
  //       } else {
  //         const [endMonthStr, endYearStr] = endStr.split(" ");
  //         endDate = new Date(parseInt(endYearStr), monthMap[endMonthStr as keyof typeof monthMap]);
  //       }

  //       const months =
  //         (endDate.getFullYear() - startDate.getFullYear()) * 12 +
  //         (endDate.getMonth() - startDate.getMonth());

  //       totalMonths += months;
  //     });
  //   });

  //   const years = Math.floor(totalMonths / 12);
  //   const months = totalMonths % 12;

  //   const earliestStart = experienceData
  //     .flatMap(company => company.positions)
  //     .map(position => {
  //       const [startStr] = position.period.split(" - ");
  //       const [startMonthStr, startYearStr] = startStr.split(" ");
  //       return new Date(parseInt(startYearStr), monthMap[startMonthStr as keyof typeof monthMap]);
  //     })
  //     .sort((a, b) => a.getTime() - b.getTime())[0];

  //   const timePeriod = earliestStart ? `(${earliestStart.getFullYear()} - Present)` : "";

  //   const experienceText = `${years} Year${years !== 1 ? "s" : ""}${
  //     months > 0 ? ` ${months} Month${months !== 1 ? "s" : ""}` : ""
  //   } of Experience`;

  //   return {
  //     years,
  //     timePeriod,
  //     experienceText,
  //   };
  // }, [experienceData]);

  const toggleCompany = (id: number) => {
    if (expandedCompanies.includes(id)) {
      setExpandedCompanies(
        expandedCompanies.filter((companyId) => companyId !== id),
      );
    } else {
      setExpandedCompanies([...expandedCompanies, id]);
    }
  };

  const togglePosition = (id: number) => {
    if (expandedPositions.includes(id)) {
      setExpandedPositions(expandedPositions.filter((posId) => posId !== id));
    } else {
      setExpandedPositions([...expandedPositions, id]);
    }
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const timelineVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "100%",
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 50,
        duration: 0.7,
      },
    },
  };

  // Add this function in your ExperienceSection component
  const parseFormattedText = (text: string) => {
    const parts = [];
    let currentIndex = 0;
    let boldStartIndex;

    while (currentIndex < text.length) {
      boldStartIndex = text.indexOf("[[", currentIndex);

      if (boldStartIndex === -1) {
        // No more bold parts, add the rest of the text
        parts.push(
          <span key={currentIndex}>{text.substring(currentIndex)}</span>,
        );
        break;
      }

      // Add normal text before the bold part
      if (boldStartIndex > currentIndex) {
        parts.push(
          <span key={currentIndex}>
            {text.substring(currentIndex, boldStartIndex)}
          </span>,
        );
      }

      // Find end of bold part
      const boldEndIndex = text.indexOf("]]", boldStartIndex);
      if (boldEndIndex === -1) {
        // No closing tag, treat as normal text
        parts.push(
          <span key={boldStartIndex}>{text.substring(boldStartIndex)}</span>,
        );
        break;
      }

      // Add bold text
      const boldText = text.substring(boldStartIndex + 2, boldEndIndex);
      parts.push(
        <span key={boldStartIndex} className="font-bold">
          {boldText}
        </span>,
      );

      currentIndex = boldEndIndex + 2;
    }

    return parts;
  };

  const positionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 50,
        duration: 0.5,
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: {
        delay: 0.2 + i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 15,
        duration: 0.4,
      },
    }),
  };

  return (
    <section
      id="experience"
      className="py-10 pt-12 overflow-x-hidden"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-4 text-center text-cyan-500 uppercase tracking-wider experience-title"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          EXPERIENCE
        </motion.h2>

        <motion.p
          className="text-xl text-center"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {experienceInfo.experienceText}
        </motion.p>

        <motion.p
          className="text-center text-gray-400 mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          {experienceInfo.timePeriod}
        </motion.p>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Timeline Line */}
          <motion.div
            className="absolute left-[25px] sm:left-[50px] h-full w-1 bg-gradient-to-b from-cyan-500 to-pink-500 timeline-line"
            variants={timelineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ top: 0, bottom: 0, zIndex: 0 }}
          />

          {experienceData.map((company, index) => (
            <motion.div
              key={company.id}
              className="relative mb-2"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              ref={(el) => (timelineRefs.current[index] = el)}
            >
              {/* Timeline Dot */}
              <motion.div
                className="absolute left-[25px] sm:left-[50px] transform -translate-x-1/2 h-3 w-3 sm:h-4 sm:w-4 rounded-full shadow-lg shadow-cyan-500/20 z-10 border-2 border-gray-900 timeline-dot"
                style={{
                  background: `linear-gradient(to right, rgb(6, 182, 212), rgb(124, 58, 237))`,
                  top: "30px",
                }}
                variants={dotVariants}
                custom={index}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              />

              {/* Company Card */}
              <motion.div
                className="ml-[45px] sm:ml-[75px] mr-2 sm:mr-4"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 shadow-xl shadow-cyan-500/5 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Company Header section */}
                    <div className="flex flex-wrap sm:flex-nowrap items-start p-4 sm:p-6">
                      {/* Company Logo */}
                      <motion.div
                        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 flex items-center justify-center overflow-hidden mr-3 sm:mr-4 shadow-lg shadow-purple-500/20 flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {company.logoType === "image" ? (
                          <motion.img
                            src={company.logo}
                            alt={`${company.company} logo`}
                            className="w-full h-full object-contain p-2 bg-white"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              console.error(`Failed to load logo for ${company.company}`);
                              // Fall back to first letter of company name
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const span = document.createElement('span');
                                span.className = 'text-white font-semibold text-lg';
                                span.textContent = company.company.charAt(0);
                                parent.appendChild(span);
                              }
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.4 + index * 0.1,
                              duration: 0.3,
                            }}
                          />
                        ) : (
                          <motion.div
                            className="text-white font-semibold text-lg"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.4 + index * 0.1,
                              duration: 0.3,
                            }}
                          >
                            {company.logo}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Company Info */}
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h3 className="text-base sm:text-lg font-semibold">
                          {company.company}
                        </h3>
                        <p className="text-xs sm:text-sm text-cyan-400">
                          <span>{company.companyPeriod}</span>
                          <span className="mx-1 sm:mx-2">•</span>
                          <span>{company.location}</span>
                        </p>
                      </div>

                      {/* Toggle Company Button */}
                      <Button
                        variant="link"
                        className="text-cyan-400 hover:text-cyan-300 focus:outline-none text-xs sm:text-sm p-0 h-auto flex items-center mt-1 sm:mt-0"
                        onClick={() => toggleCompany(company.id)}
                      >
                        {expandedCompanies.includes(company.id) ? (
                          <>
                            Hide{" "}
                            <span className="hidden sm:inline ml-1">
                              Details
                            </span>{" "}
                            <span className="ml-1">▴</span>
                          </>
                        ) : (
                          <>
                            Show{" "}
                            <span className="hidden sm:inline ml-1">
                              Details
                            </span>{" "}
                            <span className="ml-1">▾</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Expanded Company Details - Positions */}
                    <AnimatePresence>
                      {expandedCompanies.includes(company.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-700"
                        >
                          {/* Positions List */}
                          {company.positions.map((position, posIdx) => (
                            <motion.div
                              key={position.id}
                              variants={positionVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: posIdx * 0.1 }}
                              className="border-b border-gray-700/50 last:border-b-0"
                            >
                              {/* Position Header */}
                              <div className="p-3 sm:p-4 flex flex-wrap sm:flex-nowrap justify-between items-center">
                                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                                  <h4 className="font-medium text-white text-sm sm:text-base">
                                    {position.role}
                                  </h4>
                                  <p className="text-xs text-gray-400">
                                    {position.period}
                                  </p>
                                </div>

                                {/* Only show toggle if position has details */}
                                {position.details &&
                                  position.details.length > 0 && (
                                    <Button
                                      variant="link"
                                      className="text-cyan-400/80 hover:text-cyan-400 focus:outline-none text-xs p-0 h-auto flex items-center"
                                      onClick={() =>
                                        togglePosition(position.id)
                                      }
                                    >
                                      {expandedPositions.includes(
                                        position.id,
                                      ) ? (
                                        <>
                                          Hide <span className="ml-1">▴</span>
                                        </>
                                      ) : (
                                        <>
                                          Show <span className="ml-1">▾</span>
                                        </>
                                      )}
                                    </Button>
                                  )}
                              </div>

                              {/* Position Details */}
                              <AnimatePresence>
                                {expandedPositions.includes(position.id) &&
                                  position.details &&
                                  position.details.length > 0 && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="px-3 sm:px-5 pb-4"
                                    >
                                      <div className="space-y-4">
                                        {/* Process details and group by domain */}
                                        {(() => {
                                          let currentDomain = "";

                                          return position.details.map(
                                            (detail, idx) => {
                                              // Check if detail is a string or an object with domain
                                              if (typeof detail === "string") {
                                                // It's a regular string detail
                                                return (
                                                  <motion.div key={idx}>
                                                    <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-300">
                                                      <motion.li
                                                        initial={{
                                                          opacity: 0,
                                                          x: -10,
                                                        }}
                                                        animate={{
                                                          opacity: 1,
                                                          x: 0,
                                                        }}
                                                        transition={{
                                                          delay: 0.1 * idx,
                                                          duration: 0.3,
                                                        }}
                                                      >
                                                        {detail}
                                                      </motion.li>
                                                    </ul>
                                                  </motion.div>
                                                );
                                              } else {
                                                // It's a domain-based detail
                                                const showDomain =
                                                  detail.domain !== "";

                                                // Update current domain if a new one is provided
                                                if (showDomain) {
                                                  currentDomain = detail.domain;
                                                }

                                                return (
                                                  <motion.div
                                                    key={idx}
                                                    className="space-y-2"
                                                  >
                                                    {/* Show domain header if it's a new domain */}
                                                    {showDomain && (
                                                      <motion.h5
                                                        className="text-sm font-medium text-cyan-400 pt-1"
                                                        initial={{
                                                          opacity: 0,
                                                          y: -5,
                                                        }}
                                                        animate={{
                                                          opacity: 1,
                                                          y: 0,
                                                        }}
                                                        transition={{
                                                          delay: 0.05 * idx,
                                                          duration: 0.3,
                                                        }}
                                                      >
                                                        {detail.domain}
                                                      </motion.h5>
                                                    )}

                                                    {/* Detail text as bullet point */}
                                                    <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-300">
                                                      <motion.li
                                                        initial={{
                                                          opacity: 0,
                                                          x: -10,
                                                        }}
                                                        animate={{
                                                          opacity: 1,
                                                          x: 0,
                                                        }}
                                                        transition={{
                                                          delay: 0.1 * idx,
                                                          duration: 0.3,
                                                        }}
                                                      >
                                                        {parseFormattedText(
                                                          detail.text,
                                                        )}
                                                      </motion.li>
                                                    </ul>
                                                  </motion.div>
                                                );
                                              }
                                            },
                                          );
                                        })()}
                                      </div>
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </motion.div>
                          ))}

                          {/* Company Awards */}
                          {company.awards.length > 0 && (
                            <motion.div
                              className="p-3 sm:p-5 space-y-2 bg-gray-800/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                            >
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                                Awards & Recognition
                              </h4>
                              {company.awards.map((award, idx) => (
                                <motion.div
                                  key={idx}
                                  className="flex items-center text-xs sm:text-sm"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + idx * 0.1 }}
                                >
                                  <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-green-400 font-medium">
                                    {award}
                                  </span>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
