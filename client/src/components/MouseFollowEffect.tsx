import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface MouseFollowEffectProps {
  children?: React.ReactNode;
}

const MouseFollowEffect = ({ children }: MouseFollowEffectProps) => {
  const { theme } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Add spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 100 };
  const followX = useSpring(mouseX, springConfig);
  const followY = useSpring(mouseY, springConfig);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });

  useEffect(() => {
    // Get container dimensions and position
    const updateContainerDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top
        });
      }
    };

    // Update initial dimensions
    updateContainerDimensions();

    // Add window resize event listener
    window.addEventListener('resize', updateContainerDimensions);
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to the container
      const { clientX, clientY } = e;
      const { left, top } = containerDimensions;
      
      // Convert to percentage values (-50 to 50)
      const relativeX = ((clientX - left) / containerDimensions.width - 0.5) * 100;
      const relativeY = ((clientY - top) / containerDimensions.height - 0.5) * 100;
      
      // Update motion values with limits
      mouseX.set(Math.min(Math.max(relativeX, -50), 50));
      mouseY.set(Math.min(Math.max(relativeY, -50), 50));
    };

    // Add mouse move event listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateContainerDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, containerDimensions]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Background glow effect that follows mouse */}
      <motion.div 
        className={`absolute w-[80vh] h-[80vh] rounded-full blur-[120px] opacity-30 pointer-events-none mix-blend-soft-light`}
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(59, 130, 246, 0.2) 70%, rgba(0, 0, 0, 0) 100%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, rgba(249, 115, 22, 0.2) 70%, rgba(255, 255, 255, 0) 100%)',
          x: followX,
          y: followY,
          left: 'calc(50% - 40vh)',
          top: 'calc(50% - 40vh)',
        }}
      />
      
      {/* Content */}
      {children}
    </div>
  );
};

export default MouseFollowEffect;