# Visual Regression Testing Setup

## Overview

Visual regression testing ensures UI changes don't break existing designs. This document outlines the setup for visual testing.

## Recommended Tools

### Option 1: Chromatic (Recommended for Storybook)
- **Cost**: Free for open source, paid for private
- **Setup**: Integrates with Storybook
- **Best for**: Component-level testing

### Option 2: Percy
- **Cost**: Free tier available
- **Setup**: Works with any framework
- **Best for**: Full page testing

### Option 3: Playwright Visual Comparisons
- **Cost**: Free (open source)
- **Setup**: Built into Playwright
- **Best for**: E2E + visual testing

## Quick Start with Playwright

### 1. Install Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Create Visual Test

Create `tests/visual/design-system.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Design System Visual Tests', () => {
  test('button variants should match design', async ({ page }) => {
    await page.goto('/design-system');
    await expect(page.locator('[data-testid="button-primary"]')).toHaveScreenshot('button-primary.png');
    await expect(page.locator('[data-testid="button-secondary"]')).toHaveScreenshot('button-secondary.png');
  });

  test('card components should match design', async ({ page }) => {
    await page.goto('/design-system');
    await expect(page.locator('[data-testid="card-default"]')).toHaveScreenshot('card-default.png');
  });
});
```

### 3. Run Tests

```bash
npx playwright test --update-snapshots  # Update baseline
npx playwright test                    # Run comparisons
```

## Design System Reference Page

Create `app/design-system/page.tsx` to showcase all components for visual testing.

## Best Practices

1. **Test in multiple viewports**: Mobile, tablet, desktop
2. **Test in both themes**: Light and dark mode
3. **Test interactive states**: Hover, focus, active
4. **Update snapshots** when design intentionally changes
5. **Review diffs** before accepting changes

## CI Integration

Add to GitHub Actions:

```yaml
- name: Visual Regression Tests
  run: npx playwright test
```

## Next Steps

1. Set up Playwright
2. Create design system showcase page
3. Add visual tests for critical components
4. Integrate into CI/CD pipeline

