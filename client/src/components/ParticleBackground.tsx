import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParticleLayer = ({ count, speed }: { count: number, speed: number }) => {
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 10000], [0, -(10000 * speed)]);
  
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);
  
  useEffect(() => {
    const colors = ['rgba(6, 182, 212, 0.6)', 'rgba(79, 70, 229, 0.6)', 'rgba(147, 51, 234, 0.6)'];
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <motion.div style={{ y: yOffset }} className="absolute inset-0 h-[200vh]">
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
          }}
        />
      ))}
    </motion.div>
  );
};

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* 3 layers of depth for true parallax */}
      <ParticleLayer count={15} speed={0.1} />  {/* Far (slow) */}
      <ParticleLayer count={10} speed={0.25} /> {/* Mid */}
      <ParticleLayer count={5} speed={0.5} />   {/* Near (fast) */}
    </div>
  );
};

export default ParticleBackground;