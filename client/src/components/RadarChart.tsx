import { useEffect, useRef, useState } from "react";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController,
} from "chart.js";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface SkillData {
  name: string;
  value: number;
}

interface RadarChartProps {
  data: SkillData[];
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
}

// Register required ChartJS components
Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController,
);

const RadarChart = ({
  data,
  backgroundColor,
  borderColor,
  pointBackgroundColor,
}: RadarChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const animationCompleted = useRef<boolean>(false);
  const isMobile = useIsMobile();
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Animation for chart data
  const animateChart = (chart: Chart) => {
    const originalData = [...data.map((item) => item.value)];
    const startData = Array(originalData.length).fill(0);

    if (
      chart &&
      chart.data &&
      chart.data.datasets &&
      chart.data.datasets.length > 0
    ) {
      chart.data.datasets[0].data = startData;
      chart.update("none");

      const animationDuration = 1200; // total duration in ms
      const frameDuration = 1000 / 60; // ~60fps
      const totalFrames = Math.round(animationDuration / frameDuration);

      let frame = 0;

      const animateFrame = () => {
        if (frame < totalFrames && chartInstance.current) {
          frame++;
          const easingFactor = easeOutCubic(frame / totalFrames);

          const newData = originalData.map((target, i) => {
            return startData[i] + (target - startData[i]) * easingFactor;
          });

          if (
            chartInstance.current &&
            chartInstance.current.data &&
            chartInstance.current.data.datasets
          ) {
            chartInstance.current.data.datasets[0].data = newData;
            chartInstance.current.update("none");
            requestAnimationFrame(animateFrame);
          }
        } else {
          animationCompleted.current = true;
          setIsChartReady(true);
        }
      };

      requestAnimationFrame(animateFrame);
    }
  };

  // Easing function for smoother animation
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        // Destroy previous chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Set animation as not completed for new chart
        animationCompleted.current = false;
        setIsChartReady(false);

        // Define gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, backgroundColor);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");

        // Create new chart instance
        chartInstance.current = new Chart(ctx, {
          type: "radar",
          data: {
            labels: data.map((item) => item.name),
            datasets: [
              {
                label: "",
                data: data.map((item) => item.value),
                backgroundColor: gradient,
                borderColor: borderColor,
                pointBackgroundColor: pointBackgroundColor,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: borderColor,
                borderWidth: 2,
                pointRadius: (ctx) => {
                  const index = ctx.dataIndex;
                  return hoveredPoint === index ? 6 : 4;
                },
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              },
            },
            elements: {
              line: {
                tension: 0.2,
              },
            },
            scales: {
              r: {
                angleLines: {
                  color: "rgba(255, 255, 255, 0.1)",
                  lineWidth: 1,
                },
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                  circular: true,
                  lineWidth: 1,
                },
                pointLabels: {
                  color: "rgba(255, 255, 255, 0.85)",
                  font: {
                    size: isMobile ? 10 : 12,
                    weight: "bold",
                  },
                },
                ticks: {
                  backdropColor: "transparent",
                  color: "rgba(255, 255, 255, 0.6)",
                  showLabelBackdrop: false,
                  z: 1,
                  stepSize: 1,
                  font: {
                    size: 8,
                  },
                  padding: 4,
                  callback: (value) => value.toString(),
                },
                min: 0,
                max: 5,
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "white",
                bodyColor: "white",
                titleFont: {
                  size: 14,
                  weight: "bold",
                },
                bodyFont: {
                  size: 12,
                },
                padding: 10,
                cornerRadius: 6,
                displayColors: false,
                callbacks: {
                  title: (items) => {
                    if (items.length > 0) {
                      const dataIndex = items[0].dataIndex;
                      setHoveredPoint(dataIndex);
                      return data[dataIndex].name;
                    }
                    return "";
                  },
                  label: (context) => {
                    const value = context.parsed.r;
                    return `Proficiency: ${value} / 5`;
                  },
                  afterLabel: () => {
                    return "";
                  },
                },
              },
            },
            // Event handlers
            onHover: (_event, elements) => {
              if (elements.length === 0) {
                setHoveredPoint(null);
              }
            },
          },
        });

        // Start animation after chart is created
        if (!animationCompleted.current) {
          animateChart(chartInstance.current);
        }
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, backgroundColor, borderColor, pointBackgroundColor, isMobile]);

  return (
    <div className="relative w-full h-full">
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: isChartReady ? 1 : 0,
          scale: isChartReady ? 1 : 0.9,
        }}
        transition={{ duration: 0.5 }}
      >
        <canvas ref={chartRef} />
      </motion.div>

      {!isChartReady && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isChartReady ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 relative">
            <motion.span
              className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent"
              style={{
                borderLeftColor: borderColor,
                borderRightColor: borderColor,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RadarChart;
