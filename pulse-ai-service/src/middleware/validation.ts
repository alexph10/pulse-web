import { Request, Response, NextFunction } from 'express';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(str: string): boolean {
  return UUID_REGEX.test(str);
}

export function sanitizeString(input: string | null | undefined, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  let sanitized = input.replace(/\0/g, '');
  sanitized = sanitized.trim();
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

export function validateFileSize(size: number, maxSizeBytes: number): boolean {
  return size > 0 && size <= maxSizeBytes;
}

export function isValidAudioFile(file: { type: string }): boolean {
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

export const VALIDATION_LIMITS = {
  MAX_AUDIO_SIZE_MB: 10,
  MAX_AUDIO_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_TEXT_LENGTH: 100000,
  MAX_DAYS_RANGE: 365,
} as const;

