import { useState, useEffect } from 'react';

export type ScreenSize = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'largeDesktop';

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>('laptop');

  useEffect(() => {
    // Check if window is available (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      // Function to determine screen size
      const determineScreenSize = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setScreenSize('mobile');
        } else if (width < 768) {
          setScreenSize('tablet');
        } else if (width < 1024) {
          setScreenSize('laptop');
        } else if (width < 1440) {
          setScreenSize('desktop');
        } else {
          setScreenSize('largeDesktop'); // For 24-inch and larger displays
        }
      };

      // Initial check
      determineScreenSize();

      // Event handler for window resize
      const handleResize = () => {
        determineScreenSize();
      };

      // Set up event listener
      window.addEventListener('resize', handleResize);

      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }
    
    return undefined;
  }, []);

  return screenSize;
}