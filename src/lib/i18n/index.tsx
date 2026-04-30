'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';

type Locale = 'pt-BR' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Locale, Record<string, any>> = {
  'pt-BR': ptBR,
  'en': en,
};

const COOKIE_NAME = 'judite-locale';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
}

function detectLocale(): Locale {
  // 1. Check cookie
  const cookieLocale = getCookie(COOKIE_NAME);
  if (cookieLocale === 'en' || cookieLocale === 'pt-BR') return cookieLocale;

  // 2. Check browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language || (navigator as any).userLanguage || '';
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('en')) return 'en';
  }

  // 3. Default to PT-BR
  return 'pt-BR';
}

/** Resolve a dot-notation key from a nested dictionary. */
function resolve(dict: Record<string, any>, key: string): string {
  const parts = key.split('.');
  let current: any = dict;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key;
    current = current[part];
  }
  return typeof current === 'string' ? current : key;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'pt-BR',
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt-BR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie(COOKIE_NAME, newLocale);
    // Update the <html lang> attribute
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback((key: string): string => {
    const dict = dictionaries[locale];
    const value = resolve(dict, key);
    // Fallback to PT-BR if key not found in current locale
    if (value === key && locale !== 'pt-BR') {
      return resolve(dictionaries['pt-BR'], key);
    }
    return value;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  // Avoid hydration mismatch: render children immediately but with PT-BR defaults
  // The useEffect will correct the locale on mount
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale() {
  return useContext(I18nContext);
}

/** Globe toggle component — minimal, reusable */
export function LocaleToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  const handleToggle = () => {
    const newLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
    setLocale(newLocale);
    // Force Server Components to re-render with new locale cookie
    window.location.reload();
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10 text-slate-400 hover:text-white ${className}`}
      title={locale === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
      aria-label="Toggle language"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
      <span className="uppercase tracking-wider font-bold">{locale === 'pt-BR' ? 'EN' : 'PT'}</span>
    </button>
  );
}
