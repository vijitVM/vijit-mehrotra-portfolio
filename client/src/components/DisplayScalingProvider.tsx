import React, { createContext, useContext, useEffect, useState } from 'react';

interface DisplayDensity {
  dpr: number;                  // Device pixel ratio
  isHighDensity: boolean;       // Is this a high-DPI display?
  isExternalMonitor: boolean;   // Best guess if this is an external monitor
  screenWidth: number;          // Current screen width
  screenHeight: number;         // Current screen height
}

interface DisplayScalingContextType {
  displayDensity: DisplayDensity;
  applyTextScaling: (baseSize: number) => string; // Function to get appropriate font size
}

// Default values
const defaultDisplayDensity: DisplayDensity = {
  dpr: 1,
  isHighDensity: false,
  isExternalMonitor: false,
  screenWidth: 1920,
  screenHeight: 1080
};

// Create context
const DisplayScalingContext = createContext<DisplayScalingContextType>({
  displayDensity: defaultDisplayDensity,
  applyTextScaling: (size: number) => `${size}px`, // Default implementation returns pixel size
});

export const useDisplayScaling = () => useContext(DisplayScalingContext);

interface DisplayScalingProviderProps {
  children: React.ReactNode;
}

export const DisplayScalingProvider: React.FC<DisplayScalingProviderProps> = ({ children }) => {
  const [displayDensity, setDisplayDensity] = useState<DisplayDensity>(defaultDisplayDensity);

  useEffect(() => {
    // Function to detect display characteristics
    const detectDisplayCharacteristics = () => {
      const dpr = window.devicePixelRatio || 1;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      
      // Determine if this is likely a high density display
      const isHighDensity = dpr > 1.5;
      
      // Make a best guess if this is an external monitor based on size and ratio
      // This isn't foolproof but can help with common setups
      // Larger displays with common desktop resolutions are likely external
      const isLikelyExternal = 
        (screenWidth >= 1920 && screenHeight >= 1080) || // Common external monitor res
        (screenWidth === 2560 && screenHeight === 1440) || // QHD
        (screenWidth === 3840 && screenHeight === 2160); // 4K

      setDisplayDensity({
        dpr,
        isHighDensity,
        isExternalMonitor: isLikelyExternal && !isHighDensity, // Most external monitors aren't high-DPI
        screenWidth,
        screenHeight
      });
      
      // Log for debugging
      console.log('Display scaling detected:', {
        dpr,
        isHighDensity,
        isExternalMonitor: isLikelyExternal && !isHighDensity,
        screenWidth,
        screenHeight
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
  }, []);

  // Function to calculate the appropriate text size based on display characteristics
  const applyTextScaling = (baseSize: number): string => {
    const { dpr, isHighDensity, isExternalMonitor, screenWidth } = displayDensity;
    
    // Basic scaling factor based on device pixel ratio
    let scaleFactor = 1;
    
    // Different scaling approaches based on display type
    if (isHighDensity) {
      // For high-DPI displays (like Retina), we need to scale down slightly
      // because the physical size is smaller despite high resolution
      scaleFactor = 0.95;
    } else if (isExternalMonitor) {
      // For external monitors, adjust scaling based on width
      if (screenWidth >= 2560) {
        // For larger 4K or QHD monitors
        scaleFactor = 1.1;
      } else if (screenWidth >= 1920) {
        // For typical 1080p external monitors
        scaleFactor = 1.05;
      }
    }
    
    // Calculate the scaled size, maintaining consistent physical size
    // We use rem for better accessibility and browser scaling support
    return `${(baseSize * scaleFactor) / 16}rem`;
  };

  return (
    <DisplayScalingContext.Provider value={{ displayDensity, applyTextScaling }}>
      {children}
    </DisplayScalingContext.Provider>
  );
};

export default DisplayScalingProvider;