/**
 * Validate Design Token Usage
 * Scans CSS files for hardcoded values that should use design tokens
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface Violation {
  file: string;
  line: number;
  type: 'hex-color' | 'hardcoded-pixel' | 'rgb-color' | 'hardcoded-font-size';
  value: string;
  suggestion: string;
}

const violations: Violation[] = [];

// Patterns to detect
const HEX_COLOR_PATTERN = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
const RGB_COLOR_PATTERN = /rgba?\([^)]+\)/g;
const HARDCODED_PIXEL_PATTERN = /\b([2-9]|\d{2,})px\b/g; // Exclude 0px, 1px (borders)
const HARDCODED_FONT_SIZE = /font-size:\s*(\d{2,})px/g; // Exclude small sizes like 12px, 14px

function scanFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Skip comments
      if (line.trim().startsWith('/*') || line.trim().startsWith('//')) {
        return;
      }

      // Check for hex colors
      const hexMatches = line.matchAll(HEX_COLOR_PATTERN);
      for (const match of hexMatches) {
        // Allow in comments and certain contexts
        if (!line.includes('/*') && !line.includes('//')) {
          violations.push({
            file: filePath,
            line: lineNum,
            type: 'hex-color',
            value: match[0],
            suggestion: `Use var(--accent-primary) or appropriate design token instead of ${match[0]}`,
          });
        }
      }

      // Check for RGB colors
      const rgbMatches = line.matchAll(RGB_COLOR_PATTERN);
      for (const match of rgbMatches) {
        if (!line.includes('/*') && !line.includes('//') && !match[0].includes('var(')) {
          violations.push({
            file: filePath,
            line: lineNum,
            type: 'rgb-color',
            value: match[0],
            suggestion: `Use design token CSS variable instead of ${match[0]}`,
          });
        }
      }

      // Check for hardcoded pixels (spacing, dimensions)
      const pixelMatches = line.matchAll(HARDCODED_PIXEL_PATTERN);
      for (const match of pixelMatches) {
        const value = match[0];
        const numValue = parseInt(value);
        
        // Skip if it's a border width (1px, 2px, 3px) or 0px
        if (numValue <= 3 || numValue === 0) continue;
        
        // Check if it's in a property that should use spacing tokens
        const spacingProps = ['padding', 'margin', 'gap', 'top', 'right', 'bottom', 'left'];
        const isSpacingProp = spacingProps.some(prop => line.includes(`${prop}:`) || line.includes(`${prop} `));
        
        if (isSpacingProp && !line.includes('var(--spacing')) {
          const token = getSpacingToken(numValue);
          violations.push({
            file: filePath,
            line: lineNum,
            type: 'hardcoded-pixel',
            value: value,
            suggestion: `Use var(--spacing-${token}) instead of ${value}`,
          });
        }
      }

      // Check for hardcoded font sizes
      const fontSizeMatch = line.match(HARDCODED_FONT_SIZE);
      if (fontSizeMatch && !line.includes('var(--font-size')) {
        const size = fontSizeMatch[1];
        const token = getFontSizeToken(parseInt(size));
        violations.push({
          file: filePath,
          line: lineNum,
          type: 'hardcoded-font-size',
          value: `${size}px`,
          suggestion: `Use var(--font-size-${token}) instead of ${size}px`,
        });
      }
    });
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
}

function getSpacingToken(value: number): string {
  const spacingMap: Record<number, string> = {
    4: 'xs',
    8: 'sm',
    12: 'md',
    16: 'lg',
    24: 'xl',
    32: '2xl',
    48: '3xl',
    64: '4xl',
    96: '5xl',
  };
  return spacingMap[value] || 'lg'; // Default to lg if not exact match
}

function getFontSizeToken(value: number): string {
  const fontSizeMap: Record<number, string> = {
    12: 'tiny',
    14: 'small',
    16: 'body',
    20: 'h4',
    24: 'h3',
    36: 'h2',
    48: 'h1',
  };
  return fontSizeMap[value] || 'body';
}

function findCSSFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, dist, build
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        findCSSFiles(filePath, fileList);
      }
    } else if (extname(file) === '.css' || file.endsWith('.module.css')) {
      // Skip generated files
      if (!file.includes('generated-tokens')) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Main execution
const projectRoot = process.cwd();
const cssFiles = findCSSFiles(join(projectRoot, 'app'));

console.log(`Scanning ${cssFiles.length} CSS files for design token violations...\n`);

cssFiles.forEach(scanFile);

if (violations.length > 0) {
  console.error(`Found ${violations.length} design system violations:\n`);
  
  // Group by file
  const violationsByFile = violations.reduce((acc, v) => {
    if (!acc[v.file]) acc[v.file] = [];
    acc[v.file].push(v);
    return acc;
  }, {} as Record<string, Violation[]>);

  Object.entries(violationsByFile).forEach(([file, fileViolations]) => {
    console.error(`\n${file}`);
    fileViolations.forEach((v) => {
      console.error(`   Line ${v.line}: ${v.type}`);
      console.error(`   Found: ${v.value}`);
      console.error(`   Fix: ${v.suggestion}\n`);
    });
  });

  console.error('\nTip: Run `npm run design:generate` to see available design tokens');
  process.exit(1);
} else {
  console.log('No design system violations found!');
  process.exit(0);
}

