"use client";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Sparkles,
  LayoutDashboard,
  Coins,
  Crown,
  ArrowRight,
} from "lucide-react";
import { UserBo } from "@/app/api/user";
/** Dashboard tab identifiers. */
export type DashboardTab = "video-editor" | "llm" | "membership" | "pay";
interface SidebarProps {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  isCn: boolean;
  user: UserBo;
}
interface NavItem {
  id: DashboardTab;
  labelZh: string;
  labelEn: string;
  icon: React.ReactNode;
}
const NAV_ITEMS: NavItem[] = [
  {
    id: "video-editor",
    labelZh: "我的项目",
    labelEn: "My Projects",
    icon: <Clapperboard className="w-3.5 h-3.5" />,
  },
  {
    id: "llm",
    labelZh: "模型信息",
    labelEn: "Models",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  {
    id: "membership",
    labelZh: "会员中心",
    labelEn: "Membership",
    icon: <Crown className="w-3.5 h-3.5" />,
  },
  {
    id: "pay",
    labelZh: "积分充值",
    labelEn: "Top Up",
    icon: <Coins className="w-3.5 h-3.5" />,
  },
];
export default function Sidebar({
  active,
  onChange,
  isCn,
  user,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const ACTION_BTN =
    "p-1.5 rounded-lg text-foreground/50 hover:text-foreground " +
    "hover:bg-muted transition-colors cursor-pointer";
  const points = 0;
  const fmt = (n: number) => n.toLocaleString();
  return (
    <aside
      className={`h-full shrink-0 border-r border-border bg-card/40 transition-all duration-200 flex flex-col ${
        collapsed ? "w-10" : "w-52"
      }`}
    >
      {/* Top row */}
      <div
        className={`flex items-center h-11 shrink-0 border-b border-border ${
          collapsed ? "justify-center px-0" : "justify-between px-3"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0 text-foreground/80">
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-semibold truncate">
              {isCn ? "控制台" : "Console"}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={ACTION_BTN}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      {/* Nav items */}
      <nav className="flex-1 min-h-0 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          const label = isCn ? item.labelZh : item.labelEn;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center transition-colors cursor-pointer ${
                collapsed ? "justify-center py-2" : "gap-2 px-3 py-2"
              } text-xs ${
                isActive
                  ? "text-[#8c27e7] bg-[#8c27e7]/8 border-r-2 border-[#8c27e7]"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted/60"
              }`}
              title={collapsed ? label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="truncate font-medium">{label}</span>
              )}
            </button>
          );
        })}
      </nav>
      {/* Bottom: points card */}
      <div className="border-t border-border shrink-0">
        {collapsed ? (
          <button
            type="button"
            onClick={() => onChange("pay")}
            className="w-full flex flex-col items-center gap-1 py-2.5 hover:bg-muted/60 transition-colors cursor-pointer"
            title={isCn ? "我的积分" : "My Points"}
            aria-label={isCn ? "我的积分" : "My Points"}
          >
            <div className="w-6 h-6 rounded-md bg-[#8c27e7]/10 text-[#8c27e7] flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </button>
        ) : (
          <div className="p-2.5">
            <div className="rounded-lg border border-border bg-background/60 p-2.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-[10px] font-medium text-foreground/70">
                  <Coins className="w-3 h-3 text-[#8c27e7]" />
                  {isCn ? "我的积分" : "My Points"}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-lg font-bold text-foreground tabular-nums">
                  {fmt(points)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChange("pay")}
                className="w-full flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-medium text-white bg-gradient-to-r from-[#8c27e7] to-[#b458e7] shadow-md shadow-[#8c27e7]/20 hover:shadow-[#8c27e7]/35 transition-all duration-200 cursor-pointer"
              >
                {isCn ? "充值" : "Top Up"}
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
