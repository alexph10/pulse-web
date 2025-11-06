'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    // Create ASCII Effect
    const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    effect.setSize(width, height);
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';
    effect.domElement.style.lineHeight = '1';
    container.appendChild(effect.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Load GLTF model
    const loader = new GLTFLoader();

    loader.load(
      '/orange (1).glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1 / maxDim;
        model.scale.setScalar(scale);
        
        scene.add(model);
        console.log('Model loaded successfully');
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Controls
    const controls = new OrbitControls(camera, effect.domElement);
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.enableDamping = true;

    // Handle resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      effect.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      effect.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(effect.domElement)) {
        container.removeChild(effect.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: '90%',
        height: '90%',
        border: '2px solid white',
        borderRadius: '24px',
        overflow: 'hidden',
        zIndex: 10
      }}
    />
  );
}
