"use client";
import { useEffect } from "react";
import { useI18n } from "@/app/providers/I18nProvider";
export default function DynamicHead() {
  const { locale } = useI18n();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
