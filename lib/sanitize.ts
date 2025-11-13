/**
 * XSS protection utilities using DOMPurify
 * Note: React automatically escapes strings, but this provides additional safety
 * for cases where HTML might be rendered or for future use
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks
 * Use this if you ever need to render HTML content
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (React will escape it)
    return dirty;
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed by default
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize HTML but allow basic formatting tags
 * Use sparingly and only for trusted content
 */
export function sanitizeHTMLWithFormatting(dirty: string): string {
  if (typeof window === 'undefined') {
    return dirty;
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Escape HTML entities (additional safety layer)
 * React does this automatically, but useful for non-React contexts
 */
export function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

