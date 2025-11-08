'use client'

import React from 'react';
import Scene3D from './3d-scene';

export default function HeroOverlay() {
  return (
    <div className="relative w-full h-screen z-0 flex items-center justify-center">
      <div className="relative w-full h-full overflow-hidden" style={{ 
        backgroundColor: '#3d2817'
      }}>
        {/* 3D frame effect - top-left light edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
        }}></div>
        
        {/* 3D frame effect - bottom-right dark edge */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)'
        }}></div>
        
        <Scene3D />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl text-center px-8"
            style={{ 
              fontFamily: 'Manier, sans-serif', 
              fontWeight: 300,
              letterSpacing: '0.02em',
              color: '#FFFFE3'
            }}
          >
            Easy, Steadfast Mental Organization
          </h1>
        </div>
      </div>
    </div>
  );
}
