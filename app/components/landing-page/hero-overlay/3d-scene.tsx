'use client'

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Pixelation } from '@react-three/postprocessing';
import * as THREE from 'three';
import { AsciiEffect } from 'three-stdlib';

// ASCII Effect Component
function AsciiRenderer({ 
  characters = ' .:-+*=%@#',
  invert = false,
  color = 'white',
  backgroundColor = 'black',
  resolution = 0.15,
  useColor = false
}: {
  characters?: string;
  invert?: boolean;
  color?: string;
  backgroundColor?: string;
  resolution?: number;
  useColor?: boolean;
}) {
  const { gl, scene, camera, size } = useThree();
  const effectRef = useRef<AsciiEffect | null>(null);

  useEffect(() => {
    // Create ASCII effect with color support
    const effect = new AsciiEffect(gl, characters, { invert, resolution, color: useColor });
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.top = '0px';
    effect.domElement.style.left = '0px';
    
    if (!useColor) {
      effect.domElement.style.color = color;
      effect.domElement.style.backgroundColor = backgroundColor;
    }
    
    effect.domElement.style.pointerEvents = 'none';
    effect.domElement.style.cursor = 'none';

    // Add to DOM
    const container = gl.domElement.parentElement;
    if (container) {
      container.appendChild(effect.domElement);
    }

    effectRef.current = effect;

    // Handle resize
    const handleResize = () => {
      effect.setSize(size.width, size.height);
    };
    handleResize();

    return () => {
      if (effect.domElement && container) {
        container.removeChild(effect.domElement);
      }
    };
  }, [gl, characters, invert, color, backgroundColor, resolution, size]);

  useFrame(() => {
    if (effectRef.current) {
      effectRef.current.render(scene, camera);
    }
  }, 1); // Render priority

  return null;
}

// Dangerous Beauty Scene Component
function DangerousBeautyScene({ autoRotate = true }: { autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the GLB model
  const { scene } = useGLTF('/dangerous_beauty_-_diorama.glb');
  
  // Clone the scene to avoid multiple instances sharing the same material
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Optional: Animate the model (rotate slowly)
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.25; // Moderate rotation
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={0.5} position={[-0, -300, -500]} />
    </group>
  );
}

// Loading fallback component
function Loader() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
  );
}

// Main 3D Scene Component
export default function Scene3D() {
  const [autoRotate] = useState(false);
  const [pixelGranularity, setPixelGranularity] = useState(5);

  // Animate pixelation granularity
  useEffect(() => {
    let animationId: number;
    const startTime = Date.now();
    let lastUpdate = 0;
    
    const animate = (currentTime: number) => {
      // Throttle updates to every 16ms (60fps)
      if (currentTime - lastUpdate > 16) {
        const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
        const newGranularity = 5 + Math.sin(elapsed * 2) * 2; // Oscillates between 3 and 7
        setPixelGranularity(newGranularity);
        lastUpdate = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          preserveDrawingBuffer: true
        }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 3, 5]} fov={50} />
        
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={1.2} color="#ffa500" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        
        {/* Environment for better lighting */}
        <Environment preset="sunset" />
        
        {/* Ground Shadows */}
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />
        
        {/* 3D Model with Suspense for loading */}
        <Suspense fallback={<Loader />}>
          <DangerousBeautyScene autoRotate={autoRotate} />
        </Suspense>
        
        {/* Bloom and Pixelation Post-Processing */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Pixelation granularity={pixelGranularity} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Preload the model for better performance
useGLTF.preload('/dangerous_beauty_-_diorama.glb');