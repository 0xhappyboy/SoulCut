/* eslint-disable @next/next/no-img-element */
"use client";
import { useI18n } from "../providers/I18nProvider";
import { useTheme } from "../providers/ThemeProvider";
import { useState, useRef, useEffect } from "react";
import {
  Moon,
  Sun,
  Send,
  Globe,
  ChevronDown,
  QrCode,
  LogOut,
  Wallet,
  User as UserIcon,
  LayoutDashboard,
  Coins,
  Calendar,
  Clock,
  Mail,
} from "lucide-react";
import { DiscordIcon } from "../icons/DiscordIcon";
import { MediumIcon } from "../icons/MediumIcon";
import { BlueskyIcon } from "../icons/BlueskyIcon";
import { WeChatIcon } from "../icons/WeChatIcon";
import { QQIcon } from "../icons/QQIcon";
import { GitHubIcon } from "../icons/GitHubIcon";
import { XIcon } from "../icons/XIcon";
import { FacebookIcon } from "../icons/FacebookIcon";
import { YouTubeIcon } from "../icons/YouTubeIcon";
import HuggingFaceIcon from "../icons/HuggingfaceIcon";
import { RedditIcon } from "../icons/RedditIcon";
import { getToken, clearToken } from "../api/auth";
import { ApiError } from "../api/client";
import { UserBo, userApi } from "../api/user";
const TOOLBAR_BTN =
  "h-8 px-3 rounded-lg border border-border hover:border-muted-foreground " +
  "transition-colors cursor-pointer text-sm font-medium text-muted-foreground " +
  "flex items-center gap-1 leading-none";
// Pull the user from the backend, not from localStorage.
export default function Header() {
  const { locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isZh = locale === "cn";
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showWechatPopup, setShowWechatPopup] = useState(false);
  const [showQQPopup, setShowQQPopup] = useState(false);
  const wechatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const qqTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  // Auth state
  const [user, setUser] = useState<UserBo | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  // Points (placeholder, replace with real wallet API later)
  const [points, setPoints] = useState(0);
  const fmt = (n: number) => n.toLocaleString();
  // On mount, read the JWT from localStorage and fetch /user/me.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getToken()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      setAuthLoading(false);
      return;
    }
    userApi
      .me()
      .then(setUser)
      .catch((err) => {
        // 401 already clears the token inside the client.
        if (!(err instanceof ApiError && err.status === 401)) {
          console.error("fetch /user/me failed:", err);
        }
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);
  // Close user menu when clicking outside.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleLangMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setShowLangDropdown(true);
  };
  const handleLangMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowLangDropdown(false);
    }, 150);
  };
  const handleGithubClick = () =>
    window.open("https://github.com/0xhappyboy/SoulCut", "_blank");
  const handleHuggingFaceClick = () =>
    window.open("https://huggingface.co/HippoxHQ", "_blank");
  const handleXClick = () => window.open("https://x.com/HippoxAI", "_blank");
  const handleYouTubeClick = () =>
    window.open("https://www.youtube.com/@HippoxOS", "_blank");
  const handleBlueskyClick = () =>
    window.open("https://bsky.app/profile/hippoxai.bsky.social", "_blank");
  const handleMediumClick = () =>
    window.open("https://hippox.medium.com/", "_blank");
  const handleDiscordClick = () =>
    window.open("https://discord.gg/R7hrkJRAdE", "_blank");
  const handleTelegramClick = () =>
    window.open("https://t.me/hippoxAI", "_blank");
  const handleCargoClick = () =>
    window.open("https://crates.io/crates/hippox", "_blank");
  const handleFacebookClick = () =>
    window.open("https://www.facebook.com/groups/5510896799134952", "_blank");
  const handleRedditClick = () =>
    window.open("https://www.reddit.com/r/Hippox/", "_blank");
  const handleLoginClick = () => (window.location.href = "/login");
  const handleRegisterClick = () => (window.location.href = "/register");
  /** Log out: clear the token, reset state, go home. */
  const handleLogout = () => {
    clearToken();
    setUser(null);
    setShowUserMenu(false);
    window.location.href = "/";
  };
  /** Navigate to the user dashboard. */
  const handleDashboardClick = () => (window.location.href = "/dashboard");
  /** Navigate to the recharge panel inside the dashboard. */
  const handleRechargeClick = () => {
    setShowUserMenu(false);
    window.location.href = "/dashboard?tab=pay";
  };
  /** Initial shown in the avatar placeholder. */
  const initial = (user?.nickname || user?.username || "?")
    .trim()
    .charAt(0)
    .toUpperCase();
  /** Format an ISO date as a short local date, or "—" when null. */
  const fmtDate = (iso: string | null | undefined) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    } catch {
      return "—";
    }
  };
  const handleWechatMouseEnter = () => {
    if (wechatTimeoutRef.current) {
      clearTimeout(wechatTimeoutRef.current);
      wechatTimeoutRef.current = null;
    }
    setShowWechatPopup(true);
  };
  const handleWechatMouseLeave = () => {
    wechatTimeoutRef.current = setTimeout(() => {
      setShowWechatPopup(false);
    }, 200);
  };
  const handleQQMouseEnter = () => {
    if (qqTimeoutRef.current) {
      clearTimeout(qqTimeoutRef.current);
      qqTimeoutRef.current = null;
    }
    setShowQQPopup(true);
  };
  const handleQQMouseLeave = () => {
    qqTimeoutRef.current = setTimeout(() => {
      setShowQQPopup(false);
    }, 200);
  };
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src="/logo.png"
              alt="SoulCut Logo"
              className="w-7 h-7 rounded object-cover"
            />
            <span className="font-bold text-foreground text-base">
              {isZh ? "剪灵" : "SoulCut"}
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2.5">
          {windowWidth >= 700 && (
            <div
              className="relative"
              onMouseEnter={handleWechatMouseEnter}
              onMouseLeave={handleWechatMouseLeave}
            >
              <button
                type="button"
                className={TOOLBAR_BTN}
                aria-label="WeChat"
                title={isZh ? "微信" : "WeChat"}
              >
                <WeChatIcon className="w-4 h-4" />
              </button>
              {showWechatPopup && (
                <div
                  className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-4 text-center"
                  onMouseEnter={handleWechatMouseEnter}
                  onMouseLeave={handleWechatMouseLeave}
                >
                  <div className="aspect-square w-full max-w-[160px] mx-auto bg-muted rounded flex items-center justify-center">
                    <div className="text-xs text-muted-foreground flex flex-col items-center gap-1">
                      <QrCode className="w-12 h-12 opacity-50" />
                      <span>{isZh ? "微信二维码" : "WeChat QR Code"}</span>
                      <span className="text-[10px] opacity-60">
                        {isZh ? "（预留）" : "(Placeholder)"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isZh ? "扫码关注公众号" : "Scan to follow"}
                  </div>
                </div>
              )}
            </div>
          )}
          {windowWidth >= 700 && (
            <div
              className="relative"
              onMouseEnter={handleQQMouseEnter}
              onMouseLeave={handleQQMouseLeave}
            >
              <button
                type="button"
                className={TOOLBAR_BTN}
                aria-label="QQ"
                title={isZh ? "QQ" : "QQ"}
              >
                <QQIcon className="w-4 h-4" />
              </button>
              {showQQPopup && (
                <div
                  className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-4 text-center"
                  onMouseEnter={handleQQMouseEnter}
                  onMouseLeave={handleQQMouseLeave}
                >
                  <div className="aspect-square w-full max-w-[160px] mx-auto bg-muted rounded flex items-center justify-center">
                    <div className="text-xs text-muted-foreground flex flex-col items-center gap-1">
                      <QrCode className="w-12 h-12 opacity-50" />
                      <span>{isZh ? "QQ 二维码" : "QQ QR Code"}</span>
                      <span className="text-[10px] opacity-60">
                        {isZh ? "（预留）" : "(Placeholder)"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isZh ? "扫码加群" : "Scan to join group"}
                  </div>
                </div>
              )}
            </div>
          )}
          {windowWidth >= 550 && (
            <button
              type="button"
              onClick={handleGithubClick}
              className={TOOLBAR_BTN}
              aria-label="GitHub"
              title={isZh ? "访问 GitHub" : "Visit GitHub organization"}
            >
              <GitHubIcon className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className={TOOLBAR_BTN}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <div
            className="relative"
            onMouseEnter={handleLangMouseEnter}
            onMouseLeave={handleLangMouseLeave}
          >
            <button type="button" className={TOOLBAR_BTN}>
              <Globe className="w-3.5 h-3.5" />
              {isZh ? "CN" : "EN"}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showLangDropdown && (
              <div
                className="absolute right-0 mt-1 w-24 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                onMouseEnter={handleLangMouseEnter}
                onMouseLeave={handleLangMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLocale("cn");
                    setShowLangDropdown(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  中文
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocale("en");
                    setShowLangDropdown(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  English
                </button>
              </div>
            )}
          </div>
          {authLoading ? (
            // Placeholder while we don't know the auth state yet.
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDashboardClick}
                className={TOOLBAR_BTN}
                title={isZh ? "进入控制台" : "Open dashboard"}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{isZh ? "控制台" : "Dashboard"}</span>
              </button>
              <div className="relative" ref={userMenuRef}>
                {/* Points chip next to the avatar — same styling as other toolbar buttons. */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRechargeClick}
                    className={`${TOOLBAR_BTN} hidden sm:flex`}
                    title={isZh ? "我的积分" : "My points"}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span className="tabular-nums">
                      {isZh ? "积分" : "Points"}: {fmt(points)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="relative w-8 h-8 rounded-full overflow-hidden border border-[#8c27e7]/30 hover:border-[#8c27e7]/60 transition-colors cursor-pointer flex items-center justify-center bg-gradient-to-br from-[#8c27e7] to-[#b458e7] text-white text-xs font-semibold"
                    aria-label="User menu"
                    title={user.nickname || user.username}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </button>
                </div>
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-lg border shadow-xl z-50 overflow-hidden"
                    style={{
                      backgroundColor: "var(--card, #fff)",
                      borderColor: "var(--border, #e5e7eb)",
                    }}
                  >
                    {/* User card: avatar + name + email */}
                    <div className="px-4 py-3 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#8c27e7] to-[#b458e7] text-white text-sm font-semibold flex items-center justify-center shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{initial}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground truncate">
                            {user.nickname || user.username}
                          </div>
                          <div className="text-xs text-foreground/50 truncate">
                            @{user.username}
                          </div>
                          {user.email && (
                            <div className="flex items-center gap-1 text-[11px] text-foreground/40 truncate mt-0.5">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Points block */}
                    <div className="px-4 py-3 border-b border-border/60">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/70">
                          <Coins className="w-3.5 h-3.5 text-[#8c27e7]" />
                          {isZh ? "我的积分" : "My Points"}
                        </div>
                        <button
                          type="button"
                          onClick={handleRechargeClick}
                          className="text-[11px] font-medium text-[#8c27e7] hover:text-[#b458e7] transition-colors cursor-pointer"
                        >
                          {isZh ? "充值 →" : "Top up →"}
                        </button>
                      </div>
                      <div className="text-2xl font-bold text-foreground tabular-nums">
                        {fmt(points)}
                      </div>
                    </div>
                    {/* Meta info: ID, joined time, last login */}
                    <div className="px-4 py-3 border-b border-border/60 space-y-1.5 text-xs text-foreground/60 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-foreground/40">
                          <UserIcon className="w-3 h-3" />
                          ID
                        </span>
                        <span>{user.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-foreground/40">
                          <Calendar className="w-3 h-3" />
                          {isZh ? "注册时间" : "Joined"}
                        </span>
                        <span>{fmtDate(user.create_time)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-foreground/40">
                          <Clock className="w-3 h-3" />
                          {isZh ? "上次登录" : "Last login"}
                        </span>
                        <span>{fmtDate(user.last_login_time)}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          window.location.href = "/dashboard";
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {isZh ? "控制台" : "Dashboard"}
                      </button>
                      <button
                        type="button"
                        onClick={handleRechargeClick}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Wallet className="w-4 h-4" />
                        {isZh ? "我的积分" : "My Points"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          window.location.href = "/profile";
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4" />
                        {isZh ? "个人资料" : "Profile"}
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        {isZh ? "退出登录" : "Log out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <button
                type="button"
                onClick={handleLoginClick}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground bg-[#8c27e7]/8 hover:bg-[#8c27e7]/15 border border-[#8c27e7]/20 hover:border-[#8c27e7]/35 transition-all duration-200 cursor-pointer"
              >
                {isZh ? "登录" : "Login"}
              </button>
              <button
                type="button"
                onClick={handleRegisterClick}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#8c27e7] to-[#b458e7] shadow-lg shadow-[#8c27e7]/20 hover:shadow-[#8c27e7]/35 transition-all duration-200 cursor-pointer"
              >
                {isZh ? "注册" : "Sign Up"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
