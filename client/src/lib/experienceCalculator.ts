import { experienceData } from "../data/data";

interface Interval {
  start: Date;
  end: Date;
}

// Cross-browser month name lookup (new Date("May 2025") fails on mobile Safari/WebKit)
const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

// Helper function to safely parse "MMM YYYY" into a Date (cross-browser safe)
function parseDateStr(dateStr: string): Date {
  const cleanStr = dateStr.trim().toLowerCase();
  if (cleanStr === "present") {
    return new Date();
  }

  // Explicitly parse "May 2025", "April 2024", etc.
  const parts = cleanStr.split(/\s+/);
  if (parts.length === 2) {
    const monthIdx = MONTH_MAP[parts[0]];
    const year = parseInt(parts[1], 10);
    if (monthIdx !== undefined && !isNaN(year)) {
      return new Date(year, monthIdx, 1);
    }
  }

  // Fallback: try native parsing, then default to now
  const parsed = new Date(dateStr.trim());
  if (isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

export function calculateTotalExperience() {
  const intervals: Interval[] = [];

  // 1. Extract all intervals from experience data
  experienceData.forEach((company) => {
    company.positions.forEach((position) => {
      // Period format usually: "May 2025 - Present" or "Jan 2022 - Apr 2022"
      const parts = position.period.split("-");
      
      if (parts.length === 2) {
        const start = parseDateStr(parts[0]);
        let end = parseDateStr(parts[1]);
        
        // If end date is a specific month (e.g. "Apr 2022"), it means worked THROUGH April.
        // We push the internal end date to the 1st of the next month (May 1st) 
        // to make absolute time arithmetic perfectly capture the ending month.
        if (parts[1].trim().toLowerCase() !== "present") {
            end.setMonth(end.getMonth() + 1); 
        }

        intervals.push({ start, end });
      }
    });
  });

  if (intervals.length === 0) {
    return { 
      years: 0, 
      months: 0, 
      experienceText: "0 Years 0 Months Experience", 
      timeSpan: "(Present)" 
    };
  }

  // 2. Sort intervals chronologically by start date
  intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Capture the absolute earliest start year for the "(2017 - Present)" subheader
  const earliestYear = intervals[0].start.getFullYear();

  // 3. Merge Phase: Handle overlapping periods
  const merged: Interval[] = [];
  let current = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    
    // If the next job starts before or exactly when the current one ends, they overlap.
    if (next.start <= current.end) {
      // Merge by taking the maximum end date of the two
      if (next.end > current.end) {
        current.end = next.end;
      }
    } else {
      // No overlap: pushed distinct block and set next as current checking interval
      merged.push(current);
      current = next;
    }
  }
  // Push the final block
  merged.push(current);

  // 4. Calculate total mathematically valid months
  let totalMonths = 0;
  
  merged.forEach((interval) => {
    const diffYears = interval.end.getFullYear() - interval.start.getFullYear();
    const diffMonths = interval.end.getMonth() - interval.start.getMonth();
    totalMonths += (diffYears * 12) + diffMonths;
  });

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  // Render format string gracefully
  let text = "";
  if (years > 0) text += `${years} Year${years !== 1 ? "s" : ""} `;
  if (remainingMonths > 0) text += `${remainingMonths} Month${remainingMonths !== 1 ? "s" : ""} `;
  text += "Experience";

  return {
    years,
    months: remainingMonths,
    experienceText: text.trim(),
    timeSpan: `(${earliestYear} - Present)`
  };
}
