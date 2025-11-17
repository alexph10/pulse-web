'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

interface FractalGlassPlaneProps {
  imageUrl?: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  config?: {
    lerpFactor?: number;
    parallaxStrength?: number;
    distortionMultiplier?: number;
    glassStrength?: number;
    glassSmoothness?: number;
    stripesFrequency?: number;
    edgePadding?: number;
  };
  enabled?: boolean;
}

const defaultConfig = {
  lerpFactor: 0.035,
  parallaxStrength: 0.1,
  distortionMultiplier: 10,
  glassStrength: 2.0,
  glassSmoothness: 0.0001,
  stripesFrequency: 35,
  edgePadding: 0.1,
};

export default function FractalGlassPlane({
  imageUrl = '/hero.jpg',
  position = [0, 0, -10],
  scale = [20, 20, 1],
  config = {},
  enabled = true,
}: FractalGlassPlaneProps) {
  // All hooks must be called before any conditional returns
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  
  const finalConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [textureSize, setTextureSize] = useState({ x: 1, y: 1 });

  // Load texture
  useEffect(() => {
    if (!enabled) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
        setTextureSize({
          x: loadedTexture.image.width || 1,
          y: loadedTexture.image.height || 1,
        });
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );
  }, [imageUrl, enabled]);

  // Mouse tracking
  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  // Create shader material
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: {
          value: new THREE.Vector2(size.width, size.height),
        },
        uTextureSize: {
          value: new THREE.Vector2(textureSize.x, textureSize.y),
        },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uParallaxStrength: { value: finalConfig.parallaxStrength },
        uDistortionMultiplier: { value: finalConfig.distortionMultiplier },
        uGlassStrength: { value: finalConfig.glassStrength },
        ustripesFrequency: { value: finalConfig.stripesFrequency },
        uglassSmoothness: { value: finalConfig.glassSmoothness },
        uEdgePadding: { value: finalConfig.edgePadding },
      },
      vertexShader,
      fragmentShader,
    });
    materialRef.current = mat;
    return mat;
  }, [size.width, size.height, textureSize, finalConfig]);

  // Update texture in material
  useEffect(() => {
    if (material && texture) {
      material.uniforms.uTexture.value = texture;
      material.uniforms.uTextureSize.value.set(textureSize.x, textureSize.y);
    }
  }, [material, texture, textureSize]);

  // Update resolution on resize
  useEffect(() => {
    if (material) {
      material.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [material, size.width, size.height]);

  // Animation loop with lerp
  useFrame(() => {
    if (!materialRef.current || !enabled) return;

    // Smooth mouse interpolation
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    mouseRef.current = {
      x: lerp(mouseRef.current.x, targetMouseRef.current.x, finalConfig.lerpFactor),
      y: lerp(mouseRef.current.y, targetMouseRef.current.y, finalConfig.lerpFactor),
    };

    // Update mouse uniform
    materialRef.current.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  // Conditional return after all hooks
  if (!enabled) return null;

  return (
    <mesh ref={meshRef} position={position} scale={scale} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

