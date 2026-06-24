import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

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

// Lazy-load messages to avoid circular deps at module level
const messagesCache: Record<Locale, Record<string, string>> = {
  'zh-CN': {},
  'en-US': {},
};

async function loadMessages(locale: Locale) {
  if (Object.keys(messagesCache[locale]).length > 0) return;
  if (locale === 'zh-CN') {
    const mod = await import('./locales/zh-CN');
    messagesCache['zh-CN'] = mod.default;
  } else {
    const mod = await import('./locales/en-US');
    messagesCache['en-US'] = mod.default;
  }
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);
  const [messages, setMessages] = useState<Record<string, string>>({});

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

  const t = useCallback((key: string): string => {
    return messages[key] ?? key;
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
