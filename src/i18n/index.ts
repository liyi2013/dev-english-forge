import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

export type Locale = 'zh-CN' | 'en-US';

const messages: Record<Locale, Record<string, string>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

const STORAGE_KEY = 'devenglish_locale';

function getSavedLocale(): Locale {
  if (typeof window === 'undefined') return 'zh-CN';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en-US' || saved === 'zh-CN') return saved;
  return 'zh-CN';
}

let currentLocale: Locale = getSavedLocale();

const listeners: Set<() => void> = new Set();

export function t(key: string): string {
  return messages[currentLocale]?.[key] ?? key;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale);
  }
  listeners.forEach((fn) => fn());
}

export function onLocaleChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
