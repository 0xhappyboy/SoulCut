"use client";
import { useI18n } from "./I18nProvider";
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n();
  return (
    <div
      lang={locale}
      dir="ltr"
      className="min-h-screen transition-colors duration-300"
    >
      {children}
    </div>
  );
}
