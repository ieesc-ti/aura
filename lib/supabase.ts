import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  url: ['aura_supabase_url', 'supabase_url', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL', 'supabaseUrl'],
  anonKey: ['aura_supabase_anon_key', 'supabase_anon_key', 'supabase_key', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY', 'supabaseKey'],
};

// Default / fallback environment variables (supports Next.js and Vite)
const ENV_URL =
  (typeof process !== 'undefined' &&
    (process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      process.env.SUPABASE_URL)) ||
  '';
const ENV_ANON_KEY =
  (typeof process !== 'undefined' &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY)) ||
  '';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'custom' | 'none';
}

export function getSupabaseConfig(): SupabaseConfig {
  if (typeof window !== 'undefined') {
    for (const uKey of STORAGE_KEYS.url) {
      const customUrl = localStorage.getItem(uKey);
      if (customUrl) {
        for (const kKey of STORAGE_KEYS.anonKey) {
          const customKey = localStorage.getItem(kKey);
          if (customKey) {
            return {
              url: customUrl.trim(),
              anonKey: customKey.trim(),
              isConfigured: true,
              source: 'custom',
            };
          }
        }
      }
    }
  }

  if (ENV_URL && ENV_ANON_KEY) {
    return {
      url: ENV_URL.trim(),
      anonKey: ENV_ANON_KEY.trim(),
      isConfigured: true,
      source: 'env',
    };
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
    source: 'none',
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (trimmedUrl && trimmedKey) {
      STORAGE_KEYS.url.forEach((k) => localStorage.setItem(k, trimmedUrl));
      STORAGE_KEYS.anonKey.forEach((k) => localStorage.setItem(k, trimmedKey));
    } else {
      STORAGE_KEYS.url.forEach((k) => localStorage.removeItem(k));
      STORAGE_KEYS.anonKey.forEach((k) => localStorage.removeItem(k));
    }
  }
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (error) {
    console.error('[Supabase] Failed to initialize client:', error);
    return null;
  }
}
