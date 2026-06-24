import { Languages } from "lucide-react";
import { useI18n } from "@/i18n";

export function LanguageSwitcher() {
  const { t, locale, setLocale } = useI18n();

  const toggle = () => {
    setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN');
  };

  return (
    <button
      onClick={toggle}
      className="h-8 inline-flex items-center gap-1.5 px-2.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      aria-label={t("common.switchLanguage")}
    >
      <Languages className="w-3.5 h-3.5" />
      <span>{locale === 'zh-CN' ? 'EN' : '中文'}</span>
    </button>
  );
}
