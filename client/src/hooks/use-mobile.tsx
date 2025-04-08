import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      // Initial check
      setIsMobile(window.innerWidth < 768);

      // Event handler for window resize
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // Set up event listener
      window.addEventListener('resize', handleResize);

      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }
    
    return undefined;
  }, []);

  return isMobile;
}