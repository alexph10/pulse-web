/**
 * AI Service Client
 * HTTP client for communicating with the separated AI service
 * Includes token caching, request timeouts, retry logic, and rate limit handling
 */

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3001';

// Token cache with expiration
interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // Refresh 5 minutes before expiry

/**
 * Get JWT token for AI service authentication
 * Caches token to avoid fetching on every request
 */
async function getAuthToken(): Promise<string | null> {
  // Check cache first
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const response = await fetch('/api/auth/ai-token', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      // Clear cache on auth failure
      tokenCache = null;
      return null;
    }

    const { token } = await response.json();
    
    // Cache token (JWT expires in 1 hour, refresh 5 min early)
    tokenCache = {
      token,
      expiresAt: Date.now() + (55 * 60 * 1000), // 55 minutes
    };

    return token;
  } catch (error) {
    console.error('Failed to get AI service token:', error);
    tokenCache = null;
    return null;
  }
}

/**
 * Clear token cache (e.g., on logout or 401 error)
 */
export function clearTokenCache(): void {
  tokenCache = null;
}

/**
 * Response type with rate limit information
 */
export interface AIResponse<T = any> {
  data: T;
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
}

/**
 * Request timeout configuration
 */
const TIMEOUTS = {
  AI_ENDPOINTS: 60000,      // 60 seconds for AI operations
  TRANSCRIBE: 30000,         // 30 seconds for transcription
  PATTERN_ANALYSIS: 120000,  // 120 seconds for pattern analysis (can be slow)
  TTS: 60000,                // 60 seconds for text-to-speech
} as const;

/**
 * Fetch with timeout, retry logic, and rate limit handling
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  timeout: number,
  maxRetries: number = 2
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Clear timeout on retry
      if (attempt > 0) {
        clearTimeout(timeoutId);
        const retryTimeoutId = setTimeout(() => controller.abort(), timeout);
        
        // Wait with exponential backoff before retry
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        clearTimeout(retryTimeoutId);
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Retry on 5xx errors (server errors)
      if (response.status >= 500 && attempt < maxRetries) {
        lastError = new Error(`Server error: ${response.status}`);
        continue;
      }

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        // Clear token cache on 401 (unauthorized)
        if (response.status === 401) {
          clearTokenCache();
        }
        clearTimeout(timeoutId);
        return response;
      }

      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Don't retry on abort (timeout) or network errors after max retries
      if (error.name === 'AbortError' || attempt >= maxRetries) {
        throw error;
      }

      lastError = error;
    }
  }

  throw lastError || new Error('Request failed after retries');
}

/**
 * Extract rate limit headers from response
 */
function extractRateLimitHeaders(response: Response): { remaining: number; resetTime: number } | undefined {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  if (remaining !== null && reset !== null) {
    return {
      remaining: parseInt(remaining, 10),
      resetTime: parseInt(reset, 10) * 1000, // Convert to milliseconds
    };
  }

  return undefined;
}

/**
 * Analyze mood from text
 */
export async function analyzeMood(text: string): Promise<AIResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetchWithRetry(
    `${AI_SERVICE_URL}/api/analyze-mood`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    },
    TIMEOUTS.AI_ENDPOINTS
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Mood analysis failed');
  }

  const data = await response.json();
  const rateLimit = extractRateLimitHeaders(response);

  return { data, rateLimit };
}

/**
 * Analyze patterns from journal entries
 */
export async function analyzePatterns(userId: string, days: number = 30): Promise<AIResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetchWithRetry(
    `${AI_SERVICE_URL}/api/analyze-patterns`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, days }),
    },
    TIMEOUTS.PATTERN_ANALYSIS
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Pattern analysis failed');
  }

  const data = await response.json();
  const rateLimit = extractRateLimitHeaders(response);

  return { data, rateLimit };
}

/**
 * Send chat message
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  recentEntries: Array<any> = []
): Promise<AIResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }

  try {
    const response = await fetchWithRetry(
      `${AI_SERVICE_URL}/api/chat`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
          recentEntries,
        }),
      },
      TIMEOUTS.AI_ENDPOINTS
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      
      // Handle specific error codes with user-friendly messages
      if (response.status === 429) {
        const retryAfter = errorData.retryAfter || 60;
        throw new Error(`Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`);
      }
      
      if (response.status === 400) {
        throw new Error(errorData.error || 'Invalid request. Please check your message and try again.');
      }
      
      if (response.status === 503 || response.status === 504) {
        throw new Error('AI service is temporarily unavailable. Please try again in a few moments.');
      }
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please refresh the page and try again.');
      }
      
      // Use the error message from the API if available
      throw new Error(errorData.error || 'Failed to send message. Please try again.');
    }

    const data = await response.json();
    const rateLimit = extractRateLimitHeaders(response);

    return { data, rateLimit };
  } catch (error: any) {
    // Re-throw with better context if it's a network error
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    if (error.message) {
      throw error; // Already has a good message
    }
    
    throw new Error('Failed to connect to AI service. Please check your internet connection.');
  }
}

/**
 * Transcribe audio file
 */
export async function transcribeAudio(audioFile: File): Promise<AIResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await fetchWithRetry(
    `${AI_SERVICE_URL}/api/transcribe`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    },
    TIMEOUTS.TRANSCRIBE
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Transcription failed');
  }

  const data = await response.json();
  const rateLimit = extractRateLimitHeaders(response);

  return { data, rateLimit };
}

/**
 * Convert text to speech
 */
export async function textToSpeech(text: string, voiceId?: string): Promise<Blob> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetchWithRetry(
    `${AI_SERVICE_URL}/api/tts`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voiceId }),
    },
    TIMEOUTS.TTS
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Text-to-speech failed');
  }

  return response.blob();
}
