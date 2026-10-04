/* eslint-disable @next/next/no-img-element */
"use client";
import { useI18n } from "../providers/I18nProvider";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Download,
  ArrowUpRight,
  Star,
  GitFork,
  ChevronDown,
} from "lucide-react";
import { LinuxIcon } from "../icons/LinuxIcon";
import { MacOSIcon } from "../icons/MacOSIcon";
import { WindowsIcon } from "../icons/WindwosIcon";
import { GitHubIcon } from "../icons/GitHubIcon";
import { useTheme } from "../providers/ThemeProvider";
import ArtText from "./arts/ArtText";
import { ReactIcon } from "../icons/ReactIcon";
import { RustIcon } from "../icons/RustIcon";
import { TypeScriptIcon } from "../icons/TyprscriptIcon";
import { TauriIcon } from "../icons/TauriIcon";
// Platform configuration with download details - one file per platform
const platformConfig = {
  windows: {
    label: "Windows",
    icon: <WindowsIcon className="w-4 h-4" />,
    assetPattern: "windows",
  },
  macos: {
    label: "macOS",
    icon: <MacOSIcon className="w-4 h-4" />,
    assetPattern: "macos",
  },
  linux: {
    label: "Linux",
    icon: <LinuxIcon className="w-4 h-4" />,
    assetPattern: "linux",
  },
};
// Download packages per platform. {version} is replaced at runtime.
// The first entry in each array is the default/primary download.
const platformPackages: Record<string, { label: string; file: string }[]> = {
  windows: [
    {
      label: "Installer (.msi)",
      file: "SoulCut_windows_x86_64.msi",
    },
    {
      label: "Installer (.exe)",
      file: "SoulCut_windows_x86_64.exe",
    },
  ],
  macos: [
    { label: "Intel (.dmg)", file: "SoulCut_macos_x86_64.dmg" },
    {
      label: "Apple Silicon (.dmg)",
      file: "SoulCut_macos_aarch64.dmg",
    },
  ],
  linux: [
    {
      label: "AppImage (.AppImage)",
      file: "SoulCut_linux_x86_64.AppImage",
    },
    { label: "Debian (.deb)", file: "SoulCut_linux_x86_64.deb" },
    { label: "RedHat (.rpm)", file: "SoulCut_linux_x86_64.rpm" },
  ],
};
// GitHub repository URL
const GITHUB_REPO = "https://github.com/0xhappyboy/SoulCut";
const GITHUB_API = "https://api.github.com/repos/0xhappyboy/SoulCut";
const GITHUB_LATEST_RELEASE = `${GITHUB_API}/releases/latest`;
const GITHUB_RELEASES = `${GITHUB_API}/releases?per_page=100`;
// Background asset grid.
// Grid density: 6x6 = 36 cells. Each cell auto-sizes via CSS grid `fr` units,
// so the whole block stays responsive to the hero height without hard-coded
// pixel values.
// NOTE: These are placeholder test images. Replace with your own assets.
const GRID_SIZE = 6;
const gridAssets: { type: "video" | "image"; src: string }[] = [
  { type: "image", src: "/grid/grid_1.jpg" },
  { type: "image", src: "/grid/grid_2.jpg" },
  { type: "image", src: "/grid/grid_3.jpg" },
  { type: "image", src: "/grid/grid_4.jpg" },
  { type: "image", src: "/grid/grid_5.jpg" },
  { type: "image", src: "/grid/grid_6.jpg" },
  { type: "image", src: "/grid/grid_7.jpg" },
  { type: "image", src: "/grid/grid_8.jpg" },
  { type: "image", src: "/grid/grid_9.jpg" },
  { type: "image", src: "/grid/grid_10.jpg" },
  { type: "image", src: "/grid/grid_11.jpg" },
  { type: "image", src: "/grid/grid_12.jpg" },
  { type: "image", src: "/grid/grid_13.jpg" },
  { type: "image", src: "/grid/grid_14.jpg" },
  { type: "image", src: "/grid/grid_15.jpg" },
  { type: "image", src: "/grid/grid_16.jpg" },
  { type: "image", src: "/grid/grid_17.jpg" },
  { type: "image", src: "/grid/grid_18.jpg" },
  { type: "image", src: "/grid/grid_19.jpg" },
  { type: "image", src: "/grid/grid_20.jpg" },
  { type: "image", src: "/grid/grid_21.jpg" },
  { type: "image", src: "/grid/grid_22.jpg" },
  { type: "image", src: "/grid/grid_23.jpg" },
  { type: "image", src: "/grid/grid_24.jpg" },
  { type: "image", src: "/grid/grid_25.jpg" },
  { type: "image", src: "/grid/grid_26.jpg" },
  { type: "image", src: "/grid/grid_27.jpg" },
  { type: "image", src: "/grid/grid_28.jpg" },
  { type: "image", src: "/grid/grid_29.jpg" },
  { type: "image", src: "/grid/grid_30.jpg" },
  { type: "image", src: "/grid/grid_31.jpg" },
  { type: "image", src: "/grid/grid_32.jpg" },
  { type: "image", src: "/grid/grid_33.jpg" },
  { type: "image", src: "/grid/grid_34.jpg" },
  { type: "image", src: "/grid/grid_35.jpg" },
  { type: "image", src: "/grid/grid_36.jpg" },
];
interface ReleaseAsset {
  name: string;
  download_count: number;
  browser_download_url: string;
}
interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
  published_at: string;
}
export default function Hero() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const isCn = locale === "cn";
  const isDark = theme === "dark";
  const [activePlatform, setActivePlatform] = useState<
    "windows" | "macos" | "linux"
  >("windows");
  const [githubStats, setGithubStats] = useState<{
    stars: string;
    forks: string;
    totalDownloads: string;
  }>({
    stars: "0",
    forks: "0",
    totalDownloads: "0",
  });
  // Full tag name as returned by GitHub, e.g. "v0.2.0".
  // Kept empty until the first successful fetch so we can distinguish
  // "not loaded yet" from a real version.
  const [version, setVersion] = useState<string>("");
  const [loading, setLoading] = useState(true);
  // Controls the dropdown showing all packages for the active platform
  const [showPackageMenu, setShowPackageMenu] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packageMenuRef = useRef<HTMLDivElement>(null);
  // Fetch GitHub repository data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        // Repo stats (stars / forks)
        const response = await fetch(GITHUB_API);
        if (response.ok) {
          const data = await response.json();
          setGithubStats((prev) => ({
            ...prev,
            stars: data.stargazers_count?.toLocaleString() || "0",
            forks: data.forks_count?.toLocaleString() || "0",
          }));
        }
        // Latest release: tag_name here is the exact tag used in
        // /releases/download/<tag>/<asset>, so it always matches.
        const latestResponse = await fetch(GITHUB_LATEST_RELEASE);
        if (latestResponse.ok) {
          const latest = await latestResponse.json();
          setVersion(latest.tag_name || "");
        }
        // Total downloads across all releases
        const releasesResponse = await fetch(GITHUB_RELEASES);
        if (releasesResponse.ok) {
          const releases: Release[] = await releasesResponse.json();
          let totalDownloads = 0;
          for (const release of releases) {
            for (const asset of release.assets) {
              totalDownloads += asset.download_count;
            }
          }
          setGithubStats((prev) => ({
            ...prev,
            totalDownloads:
              totalDownloads >= 1000
                ? (totalDownloads / 1000).toFixed(1) + "K"
                : totalDownloads.toString(),
          }));
        }
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGitHubData();
  }, []);
  // Shooting star / light streak animation. Kept subtle: a soft violet-white
  // streak that glides across the top area as a gentle accent.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 0);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 0);
    interface Star {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
      width: number;
      angle: number;
      active: boolean;
    }
    const stars: Star[] = [];
    const numStars = 5;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: -50 - Math.random() * 300,
        y: Math.random() * height * 0.7,
        speed: 4 + Math.random() * 3,
        length: 90 + Math.random() * 140,
        opacity: 0.18 + Math.random() * 0.25,
        width: 1 + Math.random() * 1.2,
        angle: 0.1 + Math.random() * 0.12,
        active: i < 2,
      });
    }
    let time = 0;
    let animationId: number;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!star.active) {
          if (Math.random() < 0.035) {
            star.active = true;
            star.x = -50 - Math.random() * 200;
            star.y = 10 + Math.random() * height * 0.6;
            star.speed = 4 + Math.random() * 4;
            star.length = 90 + Math.random() * 160;
            star.opacity = 0.18 + Math.random() * 0.25;
            star.angle = 0.08 + Math.random() * 0.12;
          }
          continue;
        }
        star.x += star.speed;
        star.y += star.speed * star.angle;
        if (star.x > width + 200 || star.y > height + 100) {
          star.active = false;
          continue;
        }
        // Soft violet-white in dark mode, soft violet in light mode
        const base = isDark ? "196, 168, 255" : "148, 110, 220";
        const alpha =
          star.opacity * (0.75 + 0.25 * Math.sin(time * 0.03 + star.x * 0.01));
        const grad = ctx.createLinearGradient(
          star.x - star.length,
          star.y - star.length * star.angle,
          star.x,
          star.y,
        );
        grad.addColorStop(0, `rgba(${base}, 0)`);
        grad.addColorStop(0.5, `rgba(${base}, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${base}, ${alpha})`);
        ctx.beginPath();
        ctx.moveTo(star.x - star.length, star.y - star.length * star.angle);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = star.width;
        ctx.lineCap = "round";
        ctx.stroke();
        // Very light head glow, no harsh bloom
        const glowGrad = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.width * 9,
        );
        glowGrad.addColorStop(0, `rgba(${base}, ${alpha * 0.45})`);
        glowGrad.addColorStop(1, `rgba(${base}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.width * 9, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark]);
  // Close package dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        packageMenuRef.current &&
        !packageMenuRef.current.contains(e.target as Node)
      ) {
        setShowPackageMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const currentPlatform = platformConfig[activePlatform];
  const currentPackages = platformPackages[activePlatform];
  // Build a download URL for a given file using the exact release tag.
  // `version` already contains the tag as returned by GitHub (e.g. "v0.2.0"),
  // so we must NOT prepend another "v".
  const buildDownloadUrl = (fileName: string) => {
    return `https://github.com/0xhappyboy/SoulCut/releases/download/${version}/${fileName}`;
  };
  // Primary download link = first package of the active platform.
  const primaryDownloadUrl = buildDownloadUrl(currentPackages[0].file);
  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser perform a real download. Do NOT preventDefault.
    // If the version is not resolved yet, fall back to the releases page.
    if (!version) {
      e.preventDefault();
      window.open(
        "https://github.com/0xhappyboy/SoulCut/releases/latest",
        "_blank",
        "noopener,noreferrer",
      );
    }
  };
  // Switch platform and close any open package dropdown in the same handler
  // to avoid a setState-in-effect cascading render.
  const handlePlatformChange = (key: "windows" | "macos" | "linux") => {
    setActivePlatform(key);
    setShowPackageMenu(false);
  };
  const artTextColor = isDark ? "#ece7f7" : "#221833";
  const artLightColor = "#8c27e7";
  // Displayed version without the leading "v" for a cleaner look.
  const displayVersion = version ? version.replace(/^v/, "") : "0.0.0";
  return (
    <section className="relative w-full flex items-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ display: "block" }}
      />
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Base background: near-black with a subtle violet cast in dark mode,
            near-white with a subtle violet cast in light mode. */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-zinc-900/10" />
        {/* Two very soft ambient glows, low opacity, no harsh neon */}
        <div className="absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full bg-[#8c27e7]/10 blur-[130px]" />
        <div className="absolute -bottom-32 -right-24 w-[24rem] h-[24rem] rounded-full bg-[#e727c9]/8 blur-[130px]" />
        {/* Faint dotted grid overlay for texture, barely visible */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(140,39,231,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(140,39,231,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0">
          {/* Left-to-right fade keeps the copy readable while the grid shows through.
              Softened so more of the grid is visible on the right. */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/35 to-transparent z-10" />
          {/* Very light top/bottom fade so the grid is not washed out */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/15 via-transparent to-background/10 z-10" />
          {/* Responsive 6x6 asset grid. Each cell fills evenly via `fr` units,
              so the whole block scales with the hero height automatically. */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 h-full aspect-square opacity-100"
            style={{
              maskImage:
                "linear-gradient(to left, black 20%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, black 20%, transparent 100%)",
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              gap: "1px",
            }}
          >
            {gridAssets.map((asset, i) => (
              <div key={i} className="relative w-full h-full overflow-hidden">
                {asset.type === "video" ? (
                  <video
                    src={asset.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={asset.src}
                    alt={`SoulCut asset ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          {/* Neutral white wash over the grid to soften it slightly without tinting.
              Kept very light so the images stay readable. */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 h-full aspect-square z-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)",
              maskImage:
                "linear-gradient(to left, black 20%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, black 20%, transparent 100%)",
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
      </div>
      <div className="relative w-full max-w-[calc(100%-200px)] mx-auto px-6 py-8 lg:py-12 z-30">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#8c27e7]/70" />
              <span className="text-xs font-medium text-foreground/55 tracking-wider uppercase">
                {isCn
                  ? "非线性视频剪辑软件"
                  : "Nonlinear Video Editing Software"}
              </span>
            </div>
            <div className="w-full">
              <ArtText
                text="SoulCut"
                fontSize={72}
                fontWeight="300"
                letterSpacing={4}
                textColor={artTextColor}
                lightColor={artLightColor}
                animationDuration={3}
                glowSize={0}
                fontFamily="'Great Vibes', 'Sacramento', 'Dancing Script', 'Brush Script MT', cursive"
                align="left"
              />
            </div>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl leading-relaxed">
              {isCn
                ? "非线性多轨剪辑，实时预览、精准对齐，内置 15 种滤镜、78 种视觉特效、15 种运镜效果与 26 种转场特效，为每一帧注入灵魂。AI 对话式剪辑作为辅助，一句话即可完成粗剪与节奏对齐。"
                : "Nonlinear multi-track editing with real-time preview and precise alignment, packing 15 filters, 78 visual effects, 15 camera motions, and 26 transitions to breathe soul into every frame. AI conversational editing lends a hand — describe your intent and rough cuts plus rhythm alignment are done."}
              <a
                href="https://x.com/search?q=%23SoulCut&f=live"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-foreground/40 hover:text-[#8c27e7] transition-colors ml-1 group"
              >
                <span className="underline decoration-foreground/20 hover:decoration-[#8c27e7]/60 underline-offset-2">
                  #SoulCut
                </span>
                <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-80 transition-opacity" />
              </a>
            </p>
            <div className="flex items-center gap-6 text-xs text-foreground/40">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground/70 transition-colors"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>{loading ? "..." : githubStats.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                <span>{loading ? "..." : githubStats.forks}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{loading ? "..." : githubStats.totalDownloads}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  Object.keys(platformConfig) as Array<
                    keyof typeof platformConfig
                  >
                ).map((key) => (
                  <button
                    key={key}
                    onClick={() => handlePlatformChange(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activePlatform === key
                        ? "bg-[#8c27e7]/12 text-foreground border border-[#8c27e7]/35"
                        : "text-foreground/60 hover:text-foreground hover:bg-[#8c27e7]/8 border border-transparent"
                    }`}
                  >
                    {platformConfig[key].icon}
                    {platformConfig[key].label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* Download button with split dropdown for multiple packages */}
                <div className="relative inline-flex" ref={packageMenuRef}>
                  <a
                    href={primaryDownloadUrl}
                    onClick={handleDownloadClick}
                    className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-l-lg text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-[#8c27e7]/20 hover:shadow-[#8c27e7]/35 cursor-pointer bg-gradient-to-r from-[#8c27e7] to-[#b458e7]"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isCn ? "下载" : "Download"} {currentPlatform.label}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowPackageMenu((v) => !v)}
                    aria-label="Show all packages"
                    className="inline-flex items-center justify-center px-2.5 py-3 rounded-r-lg text-white border-l border-white/20 transition-all duration-200 shadow-lg shadow-[#8c27e7]/20 cursor-pointer bg-gradient-to-r from-[#b458e7] to-[#8c27e7]"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showPackageMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showPackageMenu && (
                    <div
                      className="absolute left-0 top-full mt-2 min-w-[240px] rounded-lg border shadow-2xl backdrop-blur-sm z-50 overflow-hidden"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(18, 12, 28, 0.98)"
                          : "rgba(255, 255, 255, 0.98)",
                        borderColor: isDark
                          ? "rgba(140,39,231,0.22)"
                          : "rgba(140,39,231,0.15)",
                        boxShadow: isDark
                          ? "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(140,39,231,0.18)"
                          : "0 20px 50px rgba(0,0,0,0.10), 0 0 30px rgba(140,39,231,0.10)",
                      }}
                    >
                      {currentPackages.map((pkg) => (
                        <a
                          key={pkg.file}
                          href={buildDownloadUrl(pkg.file)}
                          onClick={handleDownloadClick}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-[#8c27e7]/8 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 opacity-60" />
                          <span>{pkg.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {/* <a
                  href="https://hippoxos-docs.vercel.app/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  {isCn ? "查看文档" : "Read Docs"}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a> */}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-foreground/40 font-mono">
                <span>
                  {isCn ? "版本" : "Version"}: v{displayVersion}
                </span>
              </div>
              <p className="text-xs text-foreground/45">
                {isCn
                  ? "支持 Windows · macOS · Linux"
                  : "Available on Windows · macOS · Linux"}
              </p>
              <div className="flex items-center gap-4 text-xs text-foreground/45 pt-1">
                <a
                  href="https://github.com/0xhappyboy/SoulCut/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground/60 transition-colors group"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Issues</span>
                </a>
                <span className="text-foreground/10">·</span>
                <a
                  href="https://github.com/0xhappyboy/SoulCut/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground/60 transition-colors group"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Discussions</span>
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-foreground/30 font-mono">
                <RustIcon className="w-4 h-4 text-foreground/45" />
                <TauriIcon className="w-3.5 h-3.5 text-foreground/45" />
                <TypeScriptIcon className="w-3.5 h-3.5 text-foreground/45" />
                <ReactIcon className="w-4 h-4 text-foreground/45" />
              </div>
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
