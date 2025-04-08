import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Simplified particle background with static particles
const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);
  
  useEffect(() => {
    // Create some static particles - no animation for now
    const colors = ['rgba(6, 182, 212, 0.4)', 'rgba(79, 70, 229, 0.4)', 'rgba(147, 51, 234, 0.4)'];
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage of width
      y: Math.random() * 100, // percentage of height
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setParticles(newParticles);
  }, []);
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size + 'px',
            height: particle.size + 'px',
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;