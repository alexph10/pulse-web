'use client'

import '../../components/ui/design-system.css'
import styles from './reference.module.css'

export default function DesignSystemReference() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className="ds-text-display">Pulse Design System</h1>
          <p className="ds-text-body">Component patterns based on the signature card design</p>
        </header>

        {/* Colors Section */}
        <section className={styles.section}>
          <h2 className="ds-text-title">Colors</h2>
          <div className={styles.colorGrid}>
            <div className={styles.colorSwatch}>
              <div className={styles.colorBox} style={{ background: '#252c2c' }} />
              <span className="ds-text-label">Card Background</span>
              <span className="ds-text-label">#252c2c</span>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.colorBox} style={{ background: '#e4ddd3' }} />
              <span className="ds-text-label">Text Primary</span>
              <span className="ds-text-label">#e4ddd3</span>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.colorBox} style={{ background: '#a39d96' }} />
              <span className="ds-text-label">Text Secondary</span>
              <span className="ds-text-label">#a39d96</span>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.colorBox} style={{ background: '#2d5a3d' }} />
              <span className="ds-text-label">Data Green</span>
              <span className="ds-text-label">#2d5a3d</span>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.colorBox} style={{ background: '#d4774a' }} />
              <span className="ds-text-label">Data Orange</span>
              <span className="ds-text-label">#d4774a</span>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.colorBox} style={{ background: '#8a9199' }} />
              <span className="ds-text-label">Data Gray</span>
              <span className="ds-text-label">#8a9199</span>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className={styles.section}>
          <h2 className="ds-text-title">Typography Scale</h2>
          <div className={styles.typeStack}>
            <div className="ds-text-display">75% Display</div>
            <div className="ds-text-metric">24 Metric</div>
            <div className="ds-text-title">Section Title</div>
            <div className="ds-text-body">Body text for descriptions and content</div>
            <div className="ds-text-label">SMALL LABEL TEXT</div>
          </div>
        </section>

        {/* Card Pattern */}
        <section className={styles.section}>
          <h2 className="ds-text-title">Card Pattern</h2>
          <div className="ds-card">
            <div className={styles.cardHeader}>
              <h3 className="ds-text-title">Weekly Task Completion</h3>
              <div className="ds-text-display">75%</div>
            </div>
            
            <div className={styles.categories}>
              <div className={styles.category}>
                <div className={styles.categoryHeader}>
                  <span className="ds-dot ds-dot-green"></span>
                  <span className="ds-text-label">Journal Entries<br />Completed</span>
                </div>
                <div className="ds-text-metric" style={{ marginLeft: '16px' }}>35%</div>
              </div>
              
              <div className={styles.category}>
                <div className={styles.categoryHeader}>
                  <span className="ds-dot ds-dot-orange"></span>
                  <span className="ds-text-label">Goals<br />Completed</span>
                </div>
                <div className="ds-text-metric" style={{ marginLeft: '16px' }}>45%</div>
              </div>
              
              <div className={styles.category}>
                <div className={styles.categoryHeader}>
                  <span className="ds-dot ds-dot-gray"></span>
                  <span className="ds-text-label">Daily<br />Check-ins</span>
                </div>
                <div className="ds-text-metric" style={{ marginLeft: '16px' }}>20%</div>
              </div>
            </div>

            <div className={styles.barContainer}>
              <div className={styles.bar}>
                <div className={styles.barSegment} style={{ width: '35%', background: '#2d5a3d' }} />
                <div className={styles.barSegment} style={{ width: '45%', background: '#d4774a' }} />
                <div className={styles.barSegment} style={{ width: '20%', background: '#8a9199' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className={styles.section}>
          <h2 className="ds-text-title">Spacing Scale</h2>
          <div className={styles.spacingStack}>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: '4px' }} />
              <span className="ds-text-label">4px (xs)</span>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: '8px' }} />
              <span className="ds-text-label">8px (sm)</span>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: '16px' }} />
              <span className="ds-text-label">16px (md)</span>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: '20px' }} />
              <span className="ds-text-label">20px (lg)</span>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: '24px' }} />
              <span className="ds-text-label">24px (xl)</span>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: '32px' }} />
              <span className="ds-text-label">32px (2xl)</span>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: '40px' }} />
              <span className="ds-text-label">40px (3xl)</span>
            </div>
          </div>
        </section>

        {/* Dot Indicators */}
        <section className={styles.section}>
          <h2 className="ds-text-title">Dot Indicators</h2>
          <div className={styles.dotRow}>
            <div className={styles.dotExample}>
              <span className="ds-dot ds-dot-green"></span>
              <span className="ds-text-label">Green</span>
            </div>
            <div className={styles.dotExample}>
              <span className="ds-dot ds-dot-orange"></span>
              <span className="ds-text-label">Orange</span>
            </div>
            <div className={styles.dotExample}>
              <span className="ds-dot ds-dot-gray"></span>
              <span className="ds-text-label">Gray</span>
            </div>
          </div>
        </section>

        {/* Dividers */}
        <section className={styles.section}>
          <h2 className="ds-text-title">Dividers</h2>
          <div className={styles.dividerExample}>
            <span className="ds-text-body">Content above</span>
            <div className="ds-divider" style={{ margin: '16px 0' }}></div>
            <span className="ds-text-body">Content below</span>
          </div>
        </section>

        {/* Usage Notes */}
        <section className={styles.section}>
          <h2 className="ds-text-title">Usage Guidelines</h2>
          <div className="ds-card" style={{ padding: '24px' }}>
            <ul className={styles.list}>
              <li className="ds-text-body">Use <code>#252c2c</code> for all card backgrounds</li>
              <li className="ds-text-body">Primary text: <code>#e4ddd3</code> (warm cream)</li>
              <li className="ds-text-body">Secondary text: <code>#a39d96</code> (muted tan)</li>
              <li className="ds-text-body">Padding: <code>32px-40px</code> for large components</li>
              <li className="ds-text-body">Border radius: <code>0</code> for cards, <code>2px-4px</code> for small elements</li>
              <li className="ds-text-body">Data colors: Green (journal), Orange (goals), Gray (meta)</li>
              <li className="ds-text-body">Transitions: <code>0.2s-0.3s ease</code></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

