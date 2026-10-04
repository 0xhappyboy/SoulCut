"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
type Locale = "en" | "cn";
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}
const I18nContext = createContext<I18nContextType | undefined>(undefined);
interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}
function setLocaleCookie(locale: Locale) {
  document.cookie = `preferredLocale=${locale}; path=/; max-age=31536000`; // 1年有效期
}
export function I18nProvider({
  children,
  defaultLocale = "en",
}: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const cookieMatch = document.cookie.match(/preferredLocale=([^;]+)/);
    let savedLocale = cookieMatch ? (cookieMatch[1] as Locale) : null;
    if (!savedLocale) {
      savedLocale = localStorage.getItem("preferredLocale") as Locale;
    }
    if (savedLocale && (savedLocale === "en" || savedLocale === "cn")) {
      setLocale(savedLocale);
      setLocaleCookie(savedLocale);
    }
    setMounted(true);
  }, []);
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("preferredLocale", newLocale);
    setLocaleCookie(newLocale);
  };
  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
