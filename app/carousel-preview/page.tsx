import CarouselCard from '../components/carousel-card/carousel-card';

export default function CarouselPreview() {
  return (
    <div style={{ 
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000',
      padding: '60px 0',
      overflowY: 'auto'
    }}>
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 40px'
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Gradient Gallery
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '18px',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          Explore different animated gradient patterns
        </p>

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}>
          {/* Pattern 1: Original Lava Lamp */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '500px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <CarouselCard variant="lavaLamp" />
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              left: '24px', 
              color: 'white', 
              fontSize: '18px',
              fontWeight: '700',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}>
              Lava Lamp
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              right: '24px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '13px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Organic flowing motion with rotation
            </div>
          </div>

          {/* Pattern 2: Dual Wave */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '500px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <CarouselCard variant="dualWave" />
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              left: '24px', 
              color: 'white', 
              fontSize: '18px',
              fontWeight: '700',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}>
              Dual Wave
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              right: '24px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '13px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Synchronized wave patterns
            </div>
          </div>

          {/* Pattern 3: Spiral */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '500px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <CarouselCard variant="spiral" />
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              left: '24px', 
              color: 'white', 
              fontSize: '18px',
              fontWeight: '700',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}>
              Spiral
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              right: '24px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '13px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Continuous rotating vortex
            </div>
          </div>

          {/* Pattern 4: Pulse */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '500px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <CarouselCard variant="pulse" />
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              left: '24px', 
              color: 'white', 
              fontSize: '18px',
              fontWeight: '700',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}>
              Pulse
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              right: '24px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '13px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Breathing meditation effect
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
