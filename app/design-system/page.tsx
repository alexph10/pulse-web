/**
 * Design System Reference Page
 * Internal page showcasing all design tokens and components
 * Accessible at /design-system (development only)
 */

'use client'

import { tokens, typographyStyles } from '@/lib/design-tokens/helpers';
import { cardPatterns, statusPatterns } from '@/lib/design-system/component-patterns';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';

export default function DesignSystemPage() {
  return (
    <div style={{ padding: tokens.spacing('4xl'), background: tokens.color('background'), minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={typographyStyles.h1}>Pulse Design System</h1>
        <p style={{ ...typographyStyles.body, marginTop: tokens.spacing('lg'), color: tokens.color('text-secondary') }}>
          Reference guide for all design tokens and component patterns
        </p>

        {/* Colors Section */}
        <section style={{ marginTop: tokens.spacing('4xl') }}>
          <h2 style={typographyStyles.h2}>Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: tokens.spacing('lg'), marginTop: tokens.spacing('xl') }}>
            {Object.entries({
              'accent-primary': tokens.color('accent-primary'),
              'accent-secondary': tokens.color('accent-secondary'),
              'text-primary': tokens.color('text-primary'),
              'text-secondary': tokens.color('text-secondary'),
              'surface': tokens.color('surface'),
              'surface-elevated': tokens.color('surface-elevated'),
              'success': tokens.color('success'),
              'error': tokens.color('error'),
              'warning': tokens.color('warning'),
              'info': tokens.color('info'),
            }).map(([name, color]) => (
              <div key={name} style={{ ...cardPatterns.default, padding: tokens.spacing('md') }}>
                <div style={{ width: '100%', height: '60px', background: color, borderRadius: tokens.borderRadius('sm'), marginBottom: tokens.spacing('sm') }} />
                <div style={typographyStyles.small}>{name}</div>
                <div style={{ ...typographyStyles.small, color: tokens.color('text-tertiary'), marginTop: tokens.spacing('xs') }}>
                  {color}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing Section */}
        <section style={{ marginTop: tokens.spacing('4xl') }}>
          <h2 style={typographyStyles.h2}>Spacing</h2>
          <div style={{ marginTop: tokens.spacing('xl') }}>
            {Object.entries({
              xs: tokens.spacing('xs'),
              sm: tokens.spacing('sm'),
              md: tokens.spacing('md'),
              lg: tokens.spacing('lg'),
              xl: tokens.spacing('xl'),
              '2xl': tokens.spacing('2xl'),
              '3xl': tokens.spacing('3xl'),
            }).map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing('md'), marginBottom: tokens.spacing('md') }}>
                <div style={{ width: '100px', ...typographyStyles.small }}>{name}</div>
                <div style={{ height: '20px', background: tokens.color('accent-primary'), width: value }} />
                <div style={{ ...typographyStyles.small, color: tokens.color('text-tertiary') }}>{value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section style={{ marginTop: tokens.spacing('4xl') }}>
          <h2 style={typographyStyles.h2}>Typography</h2>
          <div style={{ marginTop: tokens.spacing('xl') }}>
            <div style={{ ...typographyStyles.h1, marginBottom: tokens.spacing('lg') }}>Heading 1</div>
            <div style={{ ...typographyStyles.h2, marginBottom: tokens.spacing('lg') }}>Heading 2</div>
            <div style={{ ...typographyStyles.h3, marginBottom: tokens.spacing('lg') }}>Heading 3</div>
            <div style={{ ...typographyStyles.h4, marginBottom: tokens.spacing('lg') }}>Heading 4</div>
            <div style={{ ...typographyStyles.body, marginBottom: tokens.spacing('lg') }}>Body text - The quick brown fox jumps over the lazy dog</div>
            <div style={{ ...typographyStyles.small, marginBottom: tokens.spacing('lg') }}>Small text - The quick brown fox jumps over the lazy dog</div>
            <div style={{ ...typographyStyles.small }}>Small text - The quick brown fox jumps over the lazy dog</div>
          </div>
        </section>

        {/* Components Section */}
        <section style={{ marginTop: tokens.spacing('4xl') }}>
          <h2 style={typographyStyles.h2}>Components</h2>
          
          <div style={{ marginTop: tokens.spacing('xl') }}>
            <h3 style={typographyStyles.h3}>Buttons</h3>
            <div style={{ display: 'flex', gap: tokens.spacing('md'), marginTop: tokens.spacing('lg'), flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          <div style={{ marginTop: tokens.spacing('3xl') }}>
            <h3 style={typographyStyles.h3}>Cards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: tokens.spacing('lg'), marginTop: tokens.spacing('lg') }}>
              <Card elevation={1}>
                <h4 style={typographyStyles.h4}>Default Card</h4>
                <p style={typographyStyles.body}>Card content goes here</p>
              </Card>
              <Card elevation={2} hoverable>
                <h4 style={typographyStyles.h4}>Elevated Card</h4>
                <p style={typographyStyles.body}>Hover to see elevation</p>
              </Card>
            </div>
          </div>

          <div style={{ marginTop: tokens.spacing('3xl') }}>
            <h3 style={typographyStyles.h3}>Forms</h3>
            <div style={{ maxWidth: '500px', marginTop: tokens.spacing('lg') }}>
              <Input placeholder="Enter text" />
              <Textarea placeholder="Enter longer text" style={{ marginTop: tokens.spacing('md') }} />
            </div>
          </div>

          <div style={{ marginTop: tokens.spacing('3xl') }}>
            <h3 style={typographyStyles.h3}>Status Badges</h3>
            <div style={{ display: 'flex', gap: tokens.spacing('md'), marginTop: tokens.spacing('lg'), flexWrap: 'wrap' }}>
              <span style={statusPatterns.success}>Success</span>
              <span style={statusPatterns.error}>Error</span>
              <span style={statusPatterns.warning}>Warning</span>
              <span style={statusPatterns.info}>Info</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

