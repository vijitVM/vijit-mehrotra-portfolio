import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experienceData } from "../data/data";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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
  logoType?: string; // Added to differentiate between text and image logos
  positions: Position[];
  awards: string[];
}

// HTML parsing helper
const parseFormattedText = (text: string) => {
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

const ExperienceSection: React.FC = () => {
  const [expandedCompanies, setExpandedCompanies] = useState<number[]>([]);
  const [expandedPositions, setExpandedPositions] = useState<number[]>([]);

  // Calculate total experience dynamically
  const experienceInfo = useMemo(() => {
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    let totalMonths = 0;
    let minDate = null;
    let maxDate = null;

    experienceData.forEach((company) => {
      company.positions.forEach((position) => {
        const [startStr, endStr] = position.period.split(" - ");

        const [startMonthStr, startYearStr] = startStr.split(" ");
        const startDate = new Date(parseInt(startYearStr), monthMap[startMonthStr as keyof typeof monthMap]);

        let endDate;
        if (endStr === "Present") {
          endDate = new Date();
        } else {
          const [endMonthStr, endYearStr] = endStr.split(" ");
          endDate = new Date(parseInt(endYearStr), monthMap[endMonthStr as keyof typeof monthMap]);
        }

        if (!minDate || startDate < minDate) minDate = startDate;
        if (!maxDate || endDate > maxDate) maxDate = endDate;

        const months =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());

        totalMonths += months;
      });
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const timePeriod = minDate && maxDate
      ? `(${minDate.getFullYear()} - ${maxDate.getFullYear() === new Date().getFullYear() ? 'Present' : maxDate.getFullYear()})`
      : "";

    const experienceText = `${years} Year${years !== 1 ? "s" : ""}${
      months > 0 ? ` ${months} Month${months !== 1 ? "s" : ""}` : ""
    } of Experience`;

    return {
      years,
      timePeriod,
      experienceText,
    };
  }, []);

  useEffect(() => {
    // Expand the first company by default
    setExpandedCompanies([experienceData[0]?.id || 0]);
    
    // Also expand the first position of the first company
    const firstPosition = experienceData[0]?.positions[0]?.id;
    if (firstPosition) {
      setExpandedPositions([firstPosition]);
    }
  }, []);

  const toggleCompany = (companyId: number) => {
    setExpandedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const togglePosition = (positionId: number) => {
    setExpandedPositions((prev) =>
      prev.includes(positionId)
        ? prev.filter((id) => id !== positionId)
        : [...prev, positionId]
    );
  };

  return (
    <section id="experience" className="py-16 md:py-20 bg-background/50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            Professional Experience
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3"
          >
            <span className="text-xl font-semibold text-primary">
              {experienceInfo.experienceText}
            </span>
            <span className="text-gray-400 text-lg">
              {experienceInfo.timePeriod}
            </span>
          </motion.div>
          <Separator className="mt-6 mb-8 mx-auto w-24 bg-primary" />
        </div>

        <div className="space-y-8">
          {experienceData.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div
                initial={{ opacity: 0.4 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Card className="overflow-hidden relative">
                  <CardContent className="p-0">
                    {/* Company Header */}
                    <div
                      className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer ${company.color} bg-opacity-10`}
                      onClick={() => toggleCompany(company.id)}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                        {/* Logo - support both text and image */}
                        <div className="flex-shrink-0">
                          {company.logoType === "image" ? (
                            <img
                              src={company.logo}
                              alt={company.company}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${company.color} text-white`}
                            >
                              {company.company.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Company Info */}
                        <div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold">
                            {company.company}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-gray-400">
                            <span>{company.companyPeriod}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{company.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Icon */}
                      <div
                        className={`${
                          company.textColor
                        } transition-transform duration-300 ${
                          expandedCompanies.includes(company.id)
                            ? "rotate-180"
                            : ""
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Positions Section */}
                    <AnimatePresence>
                      {expandedCompanies.includes(company.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-card"
                        >
                          {/* Map through positions */}
                          {company.positions.map((position) => (
                            <motion.div
                              key={position.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="border-b border-gray-700 last:border-b-0"
                            >
                              <div
                                className="p-3 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-gray-800/50"
                                onClick={() => togglePosition(position.id)}
                              >
                                <div>
                                  <h4 className="text-sm sm:text-base font-semibold">
                                    {position.role}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-400">
                                    {position.period}
                                  </p>
                                </div>

                                {/* Toggle button for details */}
                                {position.details && position.details.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs sm:text-sm p-1 h-auto"
                                  >
                                    {expandedPositions.includes(position.id) ? (
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
