import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { I18nProvider } from "./providers/I18nProvider";
import { LocaleProvider } from "./providers/LocaleProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import "@/app/globals.css";
import { siteConfig } from "./config";
import DynamicHead from "./providers/DynamicHead";
import "@fontsource/great-vibes";
import "@fontsource/dancing-script";
import "@fontsource/pacifico";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
const defaultLocale = "en";
const metadataMap = {
  cn: {
    title: "剪灵 - 🎬一款非线性视频剪辑软件，为每一帧注入灵魂",
    description: "剪灵 —— 🎬一款非线性视频剪辑软件，为每一帧注入灵魂。",
    openGraph: {
      title: "剪灵 - 🎬一款非线性视频剪辑软件，为每一帧注入灵魂",
      description: "剪灵 —— 🎬一款非线性视频剪辑软件，为每一帧注入灵魂。",
    },
  },
  en: {
    title:
      "SoulCut - 🎬An nonlinearity video diting software that breathes soul into every frame.",
    description:
      "🎬An nonlinearity video diting software that breathes soul into every frame.",
    openGraph: {
      title:
        "SoulCut - 🎬An nonlinearity video diting software that breathes soul into every frame.",
      description:
        "🎬An nonlinearity video diting software that breathes soul into every frame.",
    },
  },
};
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("preferredLocale")?.value;
  const locale =
    savedLocale && (savedLocale === "cn" || savedLocale === "en")
      ? (savedLocale as "cn" | "en")
      : defaultLocale;
  const t = metadataMap[locale];
  return {
    title: t.title,
    description: t.description,
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      type: "website",
      locale: locale === "cn" ? "zh_CN" : "en_US",
      siteName: siteConfig.name,
      title: t.openGraph.title,
      description: t.openGraph.description,
      images: [
        {
          url: "/banner_1.png",
          width: 1200,
          height: 630,
          alt: "SoulCut",
        },
      ],
    },
  };
}
interface RootLayoutProps {
  children: React.ReactNode;
}
export default async function RootLayout({ children }: RootLayoutProps) {
  // Read the preferred locale from the cookie on the server so the
  // first HTML render already uses the correct language (no flash).
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("preferredLocale")?.value;
  const initialLocale: "en" | "cn" = savedLocale === "cn" ? "cn" : "en";
  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider defaultLocale={initialLocale}>
          <ThemeProvider>
            <LocaleProvider>
              <DynamicHead />
              {children}
            </LocaleProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
