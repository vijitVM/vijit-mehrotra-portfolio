import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ isLoading, onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  // Professional phrases that showcase skills
  const phrases = [
    { text: "Initializing Portfolio", color: "#06B6D4" },
    { text: "Loading Data Science Skills", color: "#3B82F6" },
    { text: "Preparing Visualizations", color: "#8B5CF6" },
    { text: "Importing Experience", color: "#EC4899" },
    { text: "Setting Up Projects", color: "#10B981" },
    { text: "Welcome to My Portfolio", color: "#F59E0B" }
  ];

  // Canvas animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas && ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Particle system
    const particlesArray: Particle[] = [];
    const maxParticles = 200;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        
        // Use colors from phrases array with some randomness in opacity
        const colorIndex = Math.floor(Math.random() * phrases.length);
        this.color = phrases[colorIndex].color;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 0;
        this.maxLife = 100 + Math.random() * 150;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Add some organic movement
        this.speedX += (Math.random() - 0.5) * 0.01;
        this.speedY += (Math.random() - 0.5) * 0.01;
        
        // Slow down over time
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // Increase life
        this.life++;
        
        // Fade out as particle ages
        if (this.life >= this.maxLife / 2) {
          this.opacity = Math.max(0, this.opacity - 0.005);
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }

      isAlive() {
        return this.life < this.maxLife && this.opacity > 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles / 2; i++) {
      particlesArray.push(new Particle());
    }

    // Connection lines between particles
    const connectParticles = () => {
      const maxDistance = 100;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2 * 
                           particlesArray[a].opacity * 
                           particlesArray[b].opacity;
            
            // Create gradient for line
            const gradient = ctx.createLinearGradient(
              particlesArray[a].x, 
              particlesArray[a].y, 
              particlesArray[b].x, 
              particlesArray[b].y
            );
            
            gradient.addColorStop(0, particlesArray[a].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, particlesArray[b].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas with a slight trail effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Randomly add particles
      if (particlesArray.length < maxParticles && Math.random() > 0.95) {
        particlesArray.push(new Particle());
      }
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx);
      }
      
      // Remove dead particles
      for (let i = particlesArray.length - 1; i >= 0; i--) {
        if (!particlesArray[i].isAlive()) {
          particlesArray.splice(i, 1);
        }
      }
      
      // Draw connections
      connectParticles();
      
      // Call next frame
      rafRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Cycle through phrases
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(phraseInterval);
  }, []);

  // Progress management
  useEffect(() => {
    if (!isLoading) {
      // Finish the progress bar quickly if loading is complete
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.2;
          
          if (newProgress >= 99.9) {
            clearInterval(interval);
            
            // Add delay before hiding loading screen
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(onLoadingComplete, 800); // Call callback after exit animation
            }, 800);
            
            return 100;
          }
          
          return newProgress;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      // Simulate loading progress with a more realistic curve
      const interval = setInterval(() => {
        setProgress(prev => {
          // Create a more realistic loading experience
          const step = Math.random() * 0.7 + 0.3; // Random step between 0.3 and 1.0
          const slowdown = prev < 30 ? 1 : prev < 60 ? 0.7 : prev < 80 ? 0.3 : 0.1;
          const increment = step * slowdown;
          const newProgress = Math.min(prev + increment, 80);
          
          if (newProgress >= 80 && isLoading) {
            clearInterval(interval);
          }
          
          return newProgress;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [isLoading, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Canvas background for particle animation */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />

          {/* Radial gradient overlay */}
          <div 
            className="absolute inset-0 bg-gradient-radial from-transparent via-gray-900/50 to-gray-900 z-10"
          />

          {/* Central content */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Profile animated logo */}
            <motion.div
              className="relative h-48 w-48 mb-12"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2 
              }}
            >
              {/* Outer spinning ring with gradient and dots */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                {/* Create 12 dots around the circle */}
                {Array.from({ length: 12 }).map((_, index) => {
                  const angle = (index / 12) * Math.PI * 2;
                  const x = 50 + 46 * Math.cos(angle);
                  const y = 50 + 46 * Math.sin(angle);
                  
                  return (
                    <motion.div 
                      key={index} 
                      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`, 
                        transform: 'translate(-50%, -50%)' 
                      }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: index * 0.2, 
                        repeat: Infinity,
                        repeatDelay: 1 
                      }}
                    />
                  );
                })}
                
                {/* Spinning gradient arc */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="spinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#9333EA" />
                    </linearGradient>
                  </defs>
                  
                  <motion.path
                    d="M 50,2 A 48,48 0 1 1 49.9,2"
                    fill="none"
                    stroke="url(#spinGradient)"
                    strokeWidth="2"
                    strokeDasharray="20,10"
                    animate={{ 
                      strokeDasharray: ["20,10", "10,20", "5,10", "20,10"],
                    }}
                    transition={{ 
                      duration: 10, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                </svg>
              </motion.div>
              
              {/* Middle interactive ring */}
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-purple-500/40"
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.05, 1], 
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{ 
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Interactive particles around middle ring */}
                {Array.from({ length: 8 }).map((_, index) => {
                  const delay = index * 0.25;
                  const size = Math.random() * 3 + 2;
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      style={{ 
                        width: size, 
                        height: size,
                        boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)'
                      }}
                      animate={{ 
                        top: [
                          `${10 + Math.random() * 80}%`, 
                          `${10 + Math.random() * 80}%`, 
                          `${10 + Math.random() * 80}%`
                        ],
                        left: [
                          `${10 + Math.random() * 80}%`, 
                          `${10 + Math.random() * 80}%`, 
                          `${10 + Math.random() * 80}%`
                        ],
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{ 
                        duration: 5 + Math.random() * 5, 
                        repeat: Infinity, 
                        delay,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
              </motion.div>
              
              {/* Progress circle */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.2)"
                  strokeWidth="4"
                  pathLength="1"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Central logo with initials */}
              <motion.div
                className="absolute inset-12 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden shadow-lg shadow-purple-600/20"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 opacity-80"
                  animate={{
                    background: [
                      "linear-gradient(135deg, rgba(6,182,212,0.8) 0%, rgba(59,130,246,0.8) 50%, rgba(147,51,234,0.8) 100%)",
                      "linear-gradient(225deg, rgba(6,182,212,0.8) 0%, rgba(59,130,246,0.8) 50%, rgba(147,51,234,0.8) 100%)",
                      "linear-gradient(315deg, rgba(6,182,212,0.8) 0%, rgba(59,130,246,0.8) 50%, rgba(147,51,234,0.8) 100%)",
                      "linear-gradient(45deg, rgba(6,182,212,0.8) 0%, rgba(59,130,246,0.8) 50%, rgba(147,51,234,0.8) 100%)",
                    ]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Inner circle */}
                <motion.div
                  className="absolute inset-[3px] rounded-full bg-gray-900 flex items-center justify-center z-10"
                >
                  {/* VM text with glowing effect */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  >
                    VM
                  </motion.div>
                  
                  {/* Subtle glow around text */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                      boxShadow: [
                        "inset 0 0 15px rgba(6,182,212,0)",
                        "inset 0 0 15px rgba(6,182,212,0.3)",
                        "inset 0 0 15px rgba(6,182,212,0)"
                      ] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Outer glow effect */}
              <motion.div 
                className="absolute -inset-4 rounded-full opacity-20 blur-xl"
                style={{
                  background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(17,24,39,0) 70%)"
                }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
            
            {/* Progress percentage with animated gradient */}
            <motion.div
              className="flex items-center justify-center w-24 h-10 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-md -z-10"
                  animate={{ opacity: [0.7, 0.9, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="font-mono text-2xl font-bold text-white px-2 py-1 backdrop-blur-sm rounded-md">
                  {progress.toFixed(0)}%
                </div>
              </div>
            </motion.div>
            
            {/* Dynamic loading messages */}
            <motion.div 
              className="h-10 mb-8 overflow-hidden relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhrase}
                  className="absolute left-0 right-0 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-lg font-medium" style={{ color: phrases[currentPhrase].color }}>
                    {phrases[currentPhrase].text}
                    <motion.span
                      className="inline-block w-2 h-5 ml-1 bg-current rounded-full"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Professional "powered by" footer */}
            <motion.div
              className="relative flex items-center space-x-6 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {/* React */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="text-cyan-400 mb-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
                    <path d="M12 22.5c-1.9 0-3.5-1.6-3.5-3.5a3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5c0 1.9-1.6 3.5-3.5 3.5Zm0-5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm9.5-7.8c-.9-1.8-6-7.2-9.3-7.2-3.4 0-8.4 5.4-9.3 7.2-1 1.8-1 4.9 0 6.7.8 1.8 5.9 7.3 9.3 7.3 3.4 0 8.4-5.4 9.3-7.2 1-1.9 1-5 0-6.8Zm-1.4 6.1c-.8 1.5-5.2 6.2-8.1 6.2s-7.3-4.7-8.1-6.2c-.8-1.5-.8-4.1 0-5.6.8-1.5 5.2-6.2 8.1-6.2s7.3 4.7 8.1 6.2c.8 1.5.8 4.1 0 5.6Z"/>
                  </svg>
                </motion.div>
                <span className="text-xs text-gray-400">React</span>
              </motion.div>
              
              {/* TypeScript */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-blue-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h18v18H3V3zm14.5 12.5v-2.1h-6v2.1h1.9v5.4h2.2v-5.4h1.9zm-8 1.5v-1.8c0-.5 0-.9-.1-1.2 0-.3-.1-.6-.3-.8-.1-.2-.3-.4-.5-.5-.2-.1-.5-.2-.9-.2-.3 0-.6.1-.8.2-.2.1-.4.3-.6.5l.7.7c.1-.1.2-.2.3-.3s.3-.1.4-.1c.2 0 .3 0 .4.1l.3.3c.1.1.1.2.1.4v.3h-.7c-.4 0-.7 0-.9.1-.3.1-.5.2-.7.3-.2.1-.3.3-.4.5-.1.2-.1.4-.1.7 0 .2 0 .4.1.6.1.2.2.3.3.5.1.1.3.2.5.3.2.1.4.1.7.1.3 0 .6-.1.8-.2.2-.1.5-.3.6-.6h.1v.6H10V17h-.5z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">TypeScript</span>
              </motion.div>
              
              {/* Framer Motion */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-purple-500 mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21V9l-8 8h8zm0-12V3H4v6l8-8z"/>
                    <path d="M20 3h-8v6h8V3zM4 15v6h8v-6H4z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Framer Motion</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;