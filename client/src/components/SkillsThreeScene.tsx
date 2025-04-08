import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';
import { Text } from 'troika-three-text';
import { skillsData } from '../data/data';

interface SkillsThreeSceneProps {
  categoryId: string;
}

const SkillsThreeScene = ({ categoryId }: SkillsThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Get the proper skills data based on category
    let skills: { name: string; value: number }[] = [];
    if (categoryId === 'core') {
      skills = skillsData.coreSkills;
    } else if (categoryId === 'technical') {
      skills = skillsData.technicalSkills;
    } else if (categoryId === 'soft') {
      skills = skillsData.softSkills;
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    
    // Create skill objects
    const skillObjects: THREE.Object3D[] = [];
    const skillRadius = 4; // Radius of the circle on which skills are placed
    
    // Helper function to create color based on theme and category
    const getColor = () => {
      if (theme === 'dark') {
        if (categoryId === 'core') return new THREE.Color(0x06b6d4); // cyan-500
        if (categoryId === 'technical') return new THREE.Color(0xf59e0b); // amber-500
        return new THREE.Color(0xc026d3); // purple-600
      } else {
        if (categoryId === 'core') return new THREE.Color(0x0284c7); // sky-600
        if (categoryId === 'technical') return new THREE.Color(0xd97706); // amber-600
        return new THREE.Color(0x9333ea); // purple-600
      }
    };
    
    // Create a 3D structure of skill nodes
    skills.forEach((skill, index) => {
      // Calculate position on a circle
      const angle = (index / skills.length) * Math.PI * 2;
      const x = Math.cos(angle) * skillRadius;
      const y = Math.sin(angle) * skillRadius;
      const z = (Math.random() - 0.5) * 2; // Random z position for depth
      
      // Create sphere for skill with size based on skill value
      const geometry = new THREE.SphereGeometry(0.1 + (skill.value / 10), 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: getColor(),
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      sphere.userData = { skill };
      scene.add(sphere);
      skillObjects.push(sphere);
      
      // Create text label for skill name
      const myText = new Text();
      myText.text = skill.name;
      myText.fontSize = 0.2;
      myText.position.set(x * 1.2, y * 1.2, z);
      myText.color = theme === 'dark' ? 0xffffff : 0x1f2937;
      myText.sync();
      
      // Use as to treat as Object3D, which it actually is despite TypeScript type definition issues
      scene.add(myText as unknown as THREE.Object3D);
      // Don't add to skillObjects to avoid rotation issues with text
      
      // Create connecting lines between skills
      if (index > 0) {
        const prevSphere = skillObjects[index * 2 - 2] as THREE.Mesh;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          sphere.position,
          prevSphere.position
        ]);
        
        const lineMaterial = new THREE.LineBasicMaterial({
          color: getColor(),
          transparent: true,
          opacity: 0.3,
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        skillObjects.push(line);
      }
      
      // Connect last to first to complete the circle
      if (index === skills.length - 1) {
        const firstSphere = skillObjects[0] as THREE.Mesh;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          sphere.position,
          firstSphere.position
        ]);
        
        const lineMaterial = new THREE.LineBasicMaterial({
          color: getColor(),
          transparent: true,
          opacity: 0.3,
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        skillObjects.push(line);
      }
    });
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point light in center for glow effect
    const centerColor = getColor();
    const pointLight = new THREE.PointLight(centerColor, 1, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Create central orbital node
    const centralGeometry = new THREE.IcosahedronGeometry(0.5, 1);
    const centralMaterial = new THREE.MeshPhongMaterial({
      color: getColor(),
      emissive: getColor(),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
    });
    
    const centralNode = new THREE.Mesh(centralGeometry, centralMaterial);
    scene.add(centralNode);
    
    // Animation loop
    let animationFrameId: number;
    let rotation = 0;
    
    const animate = () => {
      rotation += 0.005;
      
      // Rotate the entire skill network slowly
      skillObjects.forEach((object) => {
        if (object instanceof THREE.Mesh) {
          object.rotation.x = rotation * 0.5;
          object.rotation.y = rotation * 0.5;
        }
      });
      
      // Rotate central node
      centralNode.rotation.x += 0.01;
      centralNode.rotation.y += 0.01;
      
      // Rotate based on mouse position
      scene.rotation.y = mouseX * 0.3;
      scene.rotation.x = mouseY * 0.3;
      
      // Pulse effect for central node
      const pulseScale = 1 + 0.1 * Math.sin(rotation * 5);
      centralNode.scale.set(pulseScale, pulseScale, pulseScale);
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      // Remove event listeners
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Stop animation frame
      cancelAnimationFrame(animationFrameId);
      
      // Dispose resources
      skillObjects.forEach((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        } else if (object instanceof THREE.Line) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      
      centralGeometry.dispose();
      centralMaterial.dispose();
      renderer.dispose();
    };
  }, [categoryId, theme]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-lg cursor-move"
      aria-label={`Interactive 3D visualization of ${categoryId} skills`}
    />
  );
};

export default SkillsThreeScene;