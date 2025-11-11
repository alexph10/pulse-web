'use client';

import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, shaderMaterial } from '@react-three/drei';
import { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { AsciiEffect } from 'three-stdlib';

// Preload the model immediately to start fetching
useGLTF.preload('/Orange.glb');

// Custom gradient shader material
const GradientMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color('#3d2817'), // dark brown
    color2: new THREE.Color('#ff8c00')  // dark orange
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Animated gradient
      float mixValue = (sin(time * 0.5 + uv.y * 3.0) + 1.0) / 2.0;
      mixValue = mixValue * 0.7 + 0.15; // Keep it darker

      vec3 color = mix(color1, color2, mixValue);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ GradientMaterial });

// TypeScript support for extended material
declare module '@react-three/fiber' {
  interface ThreeElements {
    gradientMaterial: any;
  }
}

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#E8B86D" wireframe />
    </mesh>
  );
}

function AnimatedGradientBackground() {
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -5]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <gradientMaterial ref={materialRef} />
    </mesh>
  );
}

function OrangeModel() {
  const { scene } = useGLTF('/Orange.glb');
  
  // Optimize model performance
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enable frustum culling for better performance
        child.frustumCulled = true;
        // Cast shadows only if needed
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene]);
  
  return <primitive object={scene} />;
}

function AsciiEffectRenderer() {
  const { gl, scene, camera, size } = useThree();
  const effectRef = useRef<AsciiEffect | null>(null);

  useEffect(() => {
    const effect = new AsciiEffect(gl, ' .:-+*=%@#', { invert: true });
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.top = '0px';
    effect.domElement.style.left = '0px';
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';
    effect.domElement.style.lineHeight = '1';

    // Set initial size with valid integers
    const width = Math.floor(size.width);
    const height = Math.floor(size.height);
    if (width > 0 && height > 0) {
      effect.setSize(width, height);
    }

    gl.domElement.parentElement?.appendChild(effect.domElement);
    effectRef.current = effect;

    return () => {
      effect.domElement.remove();
    };
  }, [gl, size.width, size.height]);

  // Handle resize
  useEffect(() => {
    if (effectRef.current) {
      const width = Math.floor(size.width);
      const height = Math.floor(size.height);
      if (width > 0 && height > 0) {
        effectRef.current.setSize(width, height);
      }
    }
  }, [size.width, size.height]);

  useFrame(() => {
    if (effectRef.current) {
      effectRef.current.render(scene, camera);
    }
  }, 1);

  return null;
}

export default function Scene3D() {
  return (
    <div
      className="fixed inset-0"
      style={{
        width: '100%',
        height: '100%',
        border: '2px solid white',
        overflow: 'hidden',
        zIndex: 10
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 1.5]} // Limit pixel ratio for better performance
        performance={{ min: 0.5 }} // Allow frame rate to drop for smoother experience
      >
        {/* Animated Gradient Background */}
        <AnimatedGradientBackground />

        {/* Lights */}
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={1} />

        {/* Orange Model with Suspense for loading */}
        <Suspense fallback={<LoadingFallback />}>
          <Center>
            <OrangeModel />
          </Center>
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={3}
          enableDamping={true}
        />

        {/* ASCII Effect */}
        <AsciiEffectRenderer />
      </Canvas>
    </div>
  );
}
