import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

const ThreeScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, isTransitioning } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

    // Set background to transparent
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1200;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    const speedArray = new Float32Array(particlesCount);
    
    // Pick colors based on theme
    const particleColor = theme === 'dark' 
      ? new THREE.Color(0x00a2ff) // blue for dark theme
      : new THREE.Color(0xf59e0b); // amber for light theme
      
    const particleColorAlt = theme === 'dark'
      ? new THREE.Color(0x8b5cf6) // purple alt for dark theme
      : new THREE.Color(0xdc2626); // red alt for light theme
    
    // Create color array for particles
    const colorArray = new Float32Array(particlesCount * 3);
    
    // Fill position array with random coordinates
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Distribute particles in a spherical shape
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
      
      // Set random scale for each particle
      scaleArray[i / 3] = Math.random() * 2 + 0.5;
      
      // Set random speed for each particle
      speedArray[i / 3] = Math.random() * 0.4 + 0.2;
      
      // Determine if this particle uses the alternate color (20% chance)
      const useAltColor = Math.random() > 0.8;
      const color = useAltColor ? particleColorAlt : particleColor;
      
      // Set the RGB values
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Create material with color based on theme
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      vertexColors: true, // Use the color attribute
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation
    let time = 0;
    const animate = () => {
      time += 0.005;
      
      // Base rotation
      particleSystem.rotation.x += 0.0003;
      particleSystem.rotation.y += 0.0005;
      
      // Apply subtle influence of mouse position
      particleSystem.rotation.x += mouseY * 0.0005;
      particleSystem.rotation.y += mouseX * 0.0005;
      
      // Update particle positions for a "floating" effect
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Get the particle index
        const idx = i / 3;
        
        // Get the particle's speed
        const speed = speedArray[idx];
        
        // Create an oscillation effect
        const offsetX = Math.sin(time + idx) * 0.02 * speed;
        const offsetY = Math.cos(time + idx * 0.7) * 0.02 * speed;
        const offsetZ = Math.sin(time * 0.7 + idx * 0.3) * 0.02 * speed;
        
        // Apply the offsets
        positions[i] += offsetX;
        positions[i + 1] += offsetY;
        positions[i + 2] += offsetZ;
      }
      
      // Update the positions
      particlesGeometry.attributes.position.needsUpdate = true;
      
      // Render scene
      renderer.render(scene, camera);
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Mark as loaded and start animation
    setIsLoading(false);
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Stop animation frame
      cancelAnimationFrame(animationFrameId);
      
      // Remove renderer from DOM
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      particlesGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]); // Re-create when theme changes
  
  return (
    <motion.div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isLoading || isTransitioning ? 0 : 0.8,
        transition: { duration: 1.5, ease: "easeOut" }
      }}
      aria-hidden="true"
    />
  );
};

export default ThreeScene;