import React, { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import zhCNMessages from './locales/zh-CN';

type Locale = 'zh-CN' | 'en-US';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'devenglish_locale';

function getSavedLocale(): Locale {
  if (typeof window === 'undefined') return 'zh-CN';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en-US' || saved === 'zh-CN') return saved;
  return 'zh-CN';
}

const messagesCache: Record<Locale, Record<string, string>> = {
  'zh-CN': zhCNMessages,
  'en-US': {},
};

async function loadMessages(locale: Locale) {
  if (Object.keys(messagesCache[locale]).length > 0) return;
  if (locale === 'en-US') {
    const mod = await import('./locales/en-US');
    messagesCache['en-US'] = mod.default;
  }
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const initialLocale = getSavedLocale();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Record<string, string>>(
    () => ({ ...messagesCache[initialLocale] })
  );
  const enUSRef = useRef<Record<string, string>>({});

  useEffect(() => {
    loadMessages(locale).then(() => {
      setMessages({ ...messagesCache[locale] });
    });
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }, []);

  // Preload en-US in background so fallback is always available
  useEffect(() => {
    loadMessages('en-US').then(() => {
      enUSRef.current = messagesCache['en-US'];
    });
  }, []);

  const t = useCallback((key: string): string => {
    const val = messages[key];
    if (val !== undefined && val !== '') return val;
    if (enUSRef.current[key]) return enUSRef.current[key];
    return key;
  }, [messages]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type { Locale };
