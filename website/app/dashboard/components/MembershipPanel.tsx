"use client";
import { Crown, Check, Sparkles, Zap, Shield, Rocket } from "lucide-react";
interface MembershipPanelProps {
  isCn: boolean;
}
/** Membership tier definition. */
interface Tier {
  id: string;
  nameZh: string;
  nameEn: string;
  priceZh: string;
  priceEn: string;
  icon: React.ReactNode;
  featuresZh: string[];
  featuresEn: string[];
  /** Highlight this tier visually. */
  popular?: boolean;
  /** Whether the current user is on this tier. */
  current?: boolean;
}
export default function MembershipPanel({ isCn }: MembershipPanelProps) {
  // Placeholder tiers. Replace with real plan data later.
  const tiers: Tier[] = [
    {
      id: "free",
      nameZh: "免费版",
      nameEn: "Free",
      priceZh: "¥0 / 月",
      priceEn: "¥0 / mo",
      icon: <Shield className="w-4 h-4" />,
      featuresZh: [
        "基础视频剪辑功能",
        "每月赠送 100 积分",
        "导出 720P 视频",
        "单项目最多 5 分钟",
      ],
      featuresEn: [
        "Basic video editing",
        "100 free points / month",
        "Export 720p video",
        "Up to 5 minutes per project",
      ],
      current: true,
    },
    {
      id: "pro",
      nameZh: "专业版",
      nameEn: "Pro",
      priceZh: "¥29 / 月",
      priceEn: "¥29 / mo",
      icon: <Zap className="w-4 h-4" />,
      featuresZh: [
        "全部剪辑功能",
        "每月赠送 1000 积分",
        "导出 4K 视频",
        "无时长限制",
        "优先 AI 队列",
      ],
      featuresEn: [
        "All editing features",
        "1000 free points / month",
        "Export 4K video",
        "No time limit",
        "Priority AI queue",
      ],
      popular: true,
    },
    {
      id: "team",
      nameZh: "团队版",
      nameEn: "Team",
      priceZh: "¥99 / 月",
      priceEn: "¥99 / mo",
      icon: <Rocket className="w-4 h-4" />,
      featuresZh: [
        "专业版全部功能",
        "每月赠送 5000 积分",
        "团队协作与共享素材",
        "最多 10 名成员",
        "专属客服支持",
      ],
      featuresEn: [
        "All Pro features",
        "5000 free points / month",
        "Team collaboration & shared assets",
        "Up to 10 members",
        "Dedicated support",
      ],
    },
  ];
  return (
    <div>
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-4 h-4 text-[#8c27e7]" />
        <h2 className="text-sm font-semibold tracking-tight">
          {isCn ? "会员中心" : "Membership"}
        </h2>
      </div>
      <p className="text-xs text-foreground/50 mb-4">
        {isCn
          ? "选择适合你的会员方案，解锁更多创作能力。"
          : "Choose a plan that fits your workflow and unlock more creative power."}
      </p>
      {/* Current status card */}
      <div className="flex items-center justify-between px-3.5 py-3 rounded-lg border border-[#8c27e7]/30 bg-[#8c27e7]/5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#8c27e7] to-[#b458e7] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-foreground">
              {isCn ? "当前方案" : "Current plan"}
            </div>
            <div className="text-[10px] text-foreground/50">
              {isCn ? "免费版 · 长期有效" : "Free · No expiry"}
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-foreground/50">
          {isCn ? "无限期" : "∞"}
        </div>
      </div>
      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tiers.map((t) => {
          const name = isCn ? t.nameZh : t.nameEn;
          const price = isCn ? t.priceZh : t.priceEn;
          const features = isCn ? t.featuresZh : t.featuresEn;
          return (
            <div
              key={t.id}
              className={`relative px-3.5 py-3 rounded-lg border transition-all duration-200 ${
                t.popular
                  ? "border-[#8c27e7] bg-[#8c27e7]/5 shadow-sm shadow-[#8c27e7]/10"
                  : "border-border bg-card"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-1.5 right-2 px-1.5 py-0.5 text-[9px] font-medium text-white bg-gradient-to-r from-[#8c27e7] to-[#b458e7] rounded-full">
                  {isCn ? "推荐" : "Popular"}
                </span>
              )}
              {/* Icon + name */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center ${
                    t.current
                      ? "bg-[#8c27e7] text-white"
                      : "bg-muted text-foreground/60"
                  }`}
                >
                  {t.icon}
                </div>
                <div className="text-xs font-semibold text-foreground">
                  {name}
                </div>
              </div>
              {/* Price */}
              <div className="text-base font-bold text-foreground mb-2">
                {price}
              </div>
              {/* Features */}
              <ul className="space-y-1 mb-3">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1 text-[10px] text-foreground/60"
                  >
                    <Check className="w-3 h-3 text-[#8c27e7] mt-0.5 shrink-0" />
                    <span className="leading-tight">{f}</span>
                  </li>
                ))}
              </ul>
              {/* CTA */}
              {t.current ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-1.5 rounded-md text-[10px] font-medium text-foreground/40 bg-muted cursor-not-allowed"
                >
                  {isCn ? "当前方案" : "Current"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => alert(isCn ? "即将支持" : "Coming soon")}
                  className="w-full py-1.5 rounded-md text-[10px] font-medium text-white bg-gradient-to-r from-[#8c27e7] to-[#b458e7] shadow-md shadow-[#8c27e7]/20 hover:shadow-[#8c27e7]/35 transition-all duration-200 cursor-pointer"
                >
                  {isCn ? "升级" : "Upgrade"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {/* Note */}
      <p className="mt-4 text-[10px] text-foreground/40">
        {isCn
          ? "会员方案按自然月计费，可随时取消。每月赠送积分将在订阅生效日自动发放。"
          : "Plans bill monthly and can be cancelled anytime. Monthly bonus points are credited on the billing date."}
      </p>
    </div>
  );
}
