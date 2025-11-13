/**
 * Input validation utilities
 */

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate UUID format
 */
export function isValidUUID(str: string): boolean {
  return UUID_REGEX.test(str);
}

/**
 * Validate userId format
 */
export function validateUserId(userId: string | null | undefined): boolean {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  return isValidUUID(userId);
}

/**
 * Sanitize string input (remove null bytes, trim)
 */
export function sanitizeString(input: string | null | undefined, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(size: number, maxSizeBytes: number): boolean {
  return size > 0 && size <= maxSizeBytes;
}

/**
 * Validate audio file type
 */
export function isValidAudioFile(file: File): boolean {
  const validTypes = [
    'audio/webm',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/x-m4a',
  ];
  
  return validTypes.includes(file.type);
}

/**
 * Constants for validation
 */
export const VALIDATION_LIMITS = {
  MAX_AUDIO_SIZE_MB: 10,
  MAX_AUDIO_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_TEXT_LENGTH: 100000, // 100k characters for journal entries
  MAX_DAYS_RANGE: 365, // Maximum days for pattern analysis
} as const;

