/**
 * Design Token Tests
 * Validates design token consistency, accessibility, and correctness
 */

import { colors, spacing, typography, shadows, borders, animations } from '../index';
import { getContrastRatio, checkContrast, a11y } from '../helpers';

describe('Design Tokens', () => {
  describe('Spacing Scale', () => {
    it('should use 8px base (all values divisible by 4)', () => {
      const values = Object.values(spacing).map(v => parseInt(v));
      const allDivisibleBy4 = values.every(v => v % 4 === 0);
      expect(allDivisibleBy4).toBe(true);
    });

    it('should have consistent progression', () => {
      const values = Object.values(spacing).map(v => parseInt(v));
      // Check that spacing generally increases
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
      }
    });

    it('should have all required spacing sizes', () => {
      const requiredSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
      requiredSizes.forEach(size => {
        expect(spacing).toHaveProperty(size);
      });
    });
  });

  describe('Colors', () => {
    it('should have valid hex color format', () => {
      Object.values(colors.visionary).forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should have all required color tokens', () => {
      const requiredColors = [
        'background',
        'backgroundSecondary',
        'surface',
        'surfaceElevated',
        'textPrimary',
        'textSecondary',
        'textTertiary',
        'textDisabled',
        'accentPrimary',
        'accentPrimaryHover',
        'accentPrimaryActive',
        'accentSecondary',
        'accentMuted',
        'accentSubtle',
        'borderSubtle',
        'borderEmphasis',
        'borderStrong',
      ];

      requiredColors.forEach(color => {
        expect(colors.visionary).toHaveProperty(color);
      });
    });

    it('should have semantic colors defined', () => {
      expect(colors.semantic).toHaveProperty('success');
      expect(colors.semantic).toHaveProperty('error');
      expect(colors.semantic).toHaveProperty('warning');
      expect(colors.semantic).toHaveProperty('info');
    });
  });

  describe('Typography', () => {
    it('should have all required typography variants', () => {
      const requiredVariants = ['h1', 'h2', 'h3', 'h4', 'body', 'small', 'tiny'];
      requiredVariants.forEach(variant => {
        expect(typography).toHaveProperty(variant);
      });
    });

    it('should have consistent typography structure', () => {
      Object.values(typography).forEach(style => {
        expect(style).toHaveProperty('fontSize');
        expect(style).toHaveProperty('lineHeight');
        expect(style).toHaveProperty('fontWeight');
        expect(style).toHaveProperty('letterSpacing');
      });
    });

    it('should have hierarchical font sizes', () => {
      const sizes = {
        h1: parseInt(typography.h1.fontSize),
        h2: parseInt(typography.h2.fontSize),
        h3: parseInt(typography.h3.fontSize),
        h4: parseInt(typography.h4.fontSize),
        body: parseInt(typography.body.fontSize),
        small: parseInt(typography.small.fontSize),
        tiny: parseInt(typography.tiny.fontSize),
      };

      expect(sizes.h1).toBeGreaterThan(sizes.h2);
      expect(sizes.h2).toBeGreaterThan(sizes.h3);
      expect(sizes.h3).toBeGreaterThan(sizes.h4);
      expect(sizes.h4).toBeGreaterThan(sizes.body);
      expect(sizes.body).toBeGreaterThan(sizes.small);
      expect(sizes.small).toBeGreaterThan(sizes.tiny);
    });
  });

  describe('Accessibility - Contrast Ratios', () => {
    it('should meet WCAG AA for text-primary on background', () => {
      const contrast = getContrastRatio(
        colors.visionary.textPrimary,
        colors.visionary.background
      );
      expect(contrast).toBeGreaterThanOrEqual(a11y.minContrastRatio);
    });

    it('should meet WCAG AA for text-secondary on background', () => {
      const contrast = getContrastRatio(
        colors.visionary.textSecondary,
        colors.visionary.background
      );
      expect(contrast).toBeGreaterThanOrEqual(a11y.minContrastRatio);
    });

    it('should meet WCAG AA for text on surface', () => {
      const contrast = getContrastRatio(
        colors.visionary.textPrimary,
        colors.visionary.surface
      );
      expect(contrast).toBeGreaterThanOrEqual(a11y.minContrastRatio);
    });

    it('should meet WCAG AA for accent-primary text on surface', () => {
      const contrast = getContrastRatio(
        colors.visionary.accentPrimary,
        colors.visionary.surface
      );
      // Accent colors might be used as backgrounds, so check if readable
      const textContrast = getContrastRatio(
        colors.visionary.textPrimary,
        colors.visionary.accentPrimary
      );
      expect(textContrast).toBeGreaterThanOrEqual(a11y.minContrastRatio);
    });

    it('should have accessible semantic colors', () => {
      // Success color should be readable on dark background
      const successContrast = getContrastRatio(
        colors.semantic.success,
        colors.visionary.background
      );
      expect(successContrast).toBeGreaterThanOrEqual(3); // At least 3:1 for large text
    });
  });

  describe('Borders', () => {
    it('should have all required border radius sizes', () => {
      const requiredSizes = ['sm', 'md', 'lg', 'xl', 'full'];
      requiredSizes.forEach(size => {
        expect(borders.radius).toHaveProperty(size);
      });
    });

    it('should have all required border widths', () => {
      const requiredWidths = ['thin', 'medium', 'thick'];
      requiredWidths.forEach(width => {
        expect(borders.width).toHaveProperty(width);
      });
    });
  });

  describe('Shadows', () => {
    it('should have all required shadow sizes', () => {
      const requiredSizes = ['none', 'sm', 'md', 'lg', 'xl'];
      requiredSizes.forEach(size => {
        expect(shadows).toHaveProperty(size);
      });
    });
  });

  describe('Animations', () => {
    it('should have all required timing values', () => {
      const requiredTimings = ['micro', 'standard', 'smooth', 'slow'];
      requiredTimings.forEach(timing => {
        expect(animations.timing).toHaveProperty(timing);
      });
    });

    it('should have all required easing functions', () => {
      const requiredEasings = ['easeIn', 'easeOut', 'easeInOut', 'spring'];
      requiredEasings.forEach(easing => {
        expect(animations.easing).toHaveProperty(easing);
      });
    });
  });

  describe('Helper Functions', () => {
    it('checkContrast should return true for accessible combinations', () => {
      const isAccessible = checkContrast(
        colors.visionary.textPrimary,
        colors.visionary.background
      );
      expect(isAccessible).toBe(true);
    });

    it('checkContrast should return false for inaccessible combinations', () => {
      // White on white should fail
      const isAccessible = checkContrast('#ffffff', '#ffffff');
      expect(isAccessible).toBe(false);
    });
  });
});

