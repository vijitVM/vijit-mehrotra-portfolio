import React, { createContext, useContext, useEffect, useState } from 'react';

interface DisplayDensity {
  dpr: number;                  // Device pixel ratio
  isHighDensity: boolean;       // Is this a high-DPI display?
  isExternalMonitor: boolean;   // Best guess if this is an external monitor
  isAcerMonitor: boolean;       // Specifically detect Acer monitors based on resolution
  screenWidth: number;          // Current screen width
  screenHeight: number;         // Current screen height
  aspectRatio: number;          // Screen aspect ratio
}

interface DisplayScalingContextType {
  displayDensity: DisplayDensity;
  applyTextScaling: (baseSize: number) => string; // Function to get appropriate font size
  isExternalMonitor: boolean;   // Convenience access to this common check
}

// Default values
const defaultDisplayDensity: DisplayDensity = {
  dpr: 1,
  isHighDensity: false,
  isExternalMonitor: false,
  isAcerMonitor: false,
  screenWidth: 1920,
  screenHeight: 1080,
  aspectRatio: 16/9
};

// Create context
const DisplayScalingContext = createContext<DisplayScalingContextType>({
  displayDensity: defaultDisplayDensity,
  applyTextScaling: (size: number) => `${size}px`, // Default implementation returns pixel size
  isExternalMonitor: false
});

export const useDisplayScaling = () => useContext(DisplayScalingContext);

interface DisplayScalingProviderProps {
  children: React.ReactNode;
}

export const DisplayScalingProvider: React.FC<DisplayScalingProviderProps> = ({ children }) => {
  const [displayDensity, setDisplayDensity] = useState<DisplayDensity>(defaultDisplayDensity);
  
  // Add a CSS class to the document root for external monitor detection
  useEffect(() => {
    if (displayDensity.isExternalMonitor) {
      document.documentElement.classList.add('external-monitor');
      
      if (displayDensity.isAcerMonitor) {
        document.documentElement.classList.add('acer-monitor');
      }
    } else {
      document.documentElement.classList.remove('external-monitor');
      document.documentElement.classList.remove('acer-monitor');
    }
  }, [displayDensity.isExternalMonitor, displayDensity.isAcerMonitor]);

  useEffect(() => {
    // Function to detect display characteristics
    const detectDisplayCharacteristics = () => {
      const dpr = window.devicePixelRatio || 1;
      // --- CHANGE: Use viewport size (innerWidth/innerHeight) instead of screen size ---
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const aspectRatio = screenWidth / screenHeight;
      
      // Determine if this is likely a high density display
      const isHighDensity = dpr > 1.5;
      
      // Check for common external monitor resolutions/sizes using viewport dimensions
      // This is a heuristic that works well for large desktop windows
      const isLikelyExternal = 
        (screenWidth >= 1920 && screenHeight >= 1080 && dpr <= 1.5) || // Common desktop monitor
        (screenWidth === 2560 && screenHeight === 1440) || // QHD
        (screenWidth === 3840 && screenHeight === 2160); // 4K

      // Specific detection for Acer monitor patterns
      const isAcerMonitor = 
        (screenWidth === 1920 && screenHeight === 1080 && dpr === 1 && 
         Math.abs(aspectRatio - (16/9)) < 0.01); // Use exact 16/9 ratio check
      
      setDisplayDensity({
        dpr,
        isHighDensity,
        isExternalMonitor: isLikelyExternal,
        isAcerMonitor,
        screenWidth, 
        screenHeight,
        aspectRatio
      });
      
      // Log for debugging
      console.log('Display scaling detected (using viewport size):', {
        dpr,
        isHighDensity,
        isExternalMonitor: isLikelyExternal,
        isAcerMonitor,
        screenWidth,
        screenHeight,
        aspectRatio
      });
    };

    // Run detection
    detectDisplayCharacteristics();

    // Re-detect on resize in case of display change
    window.addEventListener('resize', detectDisplayCharacteristics);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', detectDisplayCharacteristics);
    };
  }, []); // Empty dependency array means this runs only on mount/unmount

  // Function to calculate the appropriate text size based on display characteristics
  const applyTextScaling = (baseSize: number): string => {
    const { isHighDensity, isExternalMonitor, isAcerMonitor, screenWidth } = displayDensity;
    
    let scaleFactor = 1;
    
    if (isHighDensity) {
      scaleFactor = 0.95;
    } else if (isExternalMonitor) {
      if (isAcerMonitor) {
        // Specific adjustment for Acer monitors - slightly smaller text
        scaleFactor = 0.92;
      } else if (screenWidth >= 2560) {
        // Larger monitors (1440p+)
        scaleFactor = 1.08;
      } else if (screenWidth >= 1920) {
        // Standard 1080p monitors
        scaleFactor = 1;
      }
    }
    
    // Apply scaling, convert to rem
    return `${(baseSize * scaleFactor) / 16}rem`;
  };

  return (
    <DisplayScalingContext.Provider value={{ 
      displayDensity, 
      applyTextScaling,
      isExternalMonitor: displayDensity.isExternalMonitor
    }}>
      {children}
    </DisplayScalingContext.Provider>
  );
};

export default DisplayScalingProvider;
