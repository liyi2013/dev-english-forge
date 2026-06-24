import { Languages } from "lucide-react";
import { getLocale, setLocale, type Locale } from "@/i18n";
import { useState } from "react";

export function LanguageSwitcher() {
  const [locale, setLocaleState] = useState<Locale>(getLocale());

  const toggle = () => {
    const next: Locale = locale === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLocale(next);
    setLocaleState(next);
  };

  return (
    <button
      onClick={toggle}
      className="h-8 inline-flex items-center gap-1.5 px-2.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      aria-label="Switch language"
    >
      <Languages className="w-3.5 h-3.5" />
      <span>{locale === 'zh-CN' ? 'EN' : '中文'}</span>
    </button>
  );
}
