"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Music,
  LayoutGrid,
  Loader2,
  AlertCircle,
  Star,
  ArrowUp,
} from "lucide-react";
import { LlmProviderModels, LlmModelsAll, llmApi } from "@/app/api/llm";
import { LlmKind, LlmUsageSummary, llmUsageApi } from "@/app/api/user";
interface LLMPanelProps {
  isCn: boolean;
}
/** Tab identifiers: "all" plus the four concrete model kinds. */
type TabKey = "all" | LlmKind;
/** Metadata for each tab, used for the tab bar. */
interface TabMeta {
  key: TabKey;
  labelZh: string;
  labelEn: string;
  icon: React.ReactNode;
}
const TAB_META: TabMeta[] = [
  {
    key: "all",
    labelZh: "全部",
    labelEn: "All",
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
  },
  {
    key: "chat",
    labelZh: "对话",
    labelEn: "Chat",
    icon: <MessageSquare className="w-3.5 h-3.5" />,
  },
  {
    key: "image",
    labelZh: "图片",
    labelEn: "Image",
    icon: <ImageIcon className="w-3.5 h-3.5" />,
  },
  {
    key: "video",
    labelZh: "视频",
    labelEn: "Video",
    icon: <Video className="w-3.5 h-3.5" />,
  },
  {
    key: "audio",
    labelZh: "音频",
    labelEn: "Audio",
    icon: <Music className="w-3.5 h-3.5" />,
  },
];
/** The four concrete kinds, used when iterating. */
const KIND_ORDER: LlmKind[] = ["chat", "image", "video", "audio"];
/** Empty fallback for a kind when the backend returns nothing. */
const EMPTY_MODELS: Record<LlmKind, LlmProviderModels[]> = {
  chat: [],
  image: [],
  video: [],
  audio: [],
};
/** Empty usage fallback. */
const EMPTY_USAGE: LlmUsageSummary = {};
/**
 * Providers that should never be shown in the panel.
 */
function isHiddenProvider(providerId: string, providerName: string): boolean {
  const id = providerId.toLowerCase();
  const name = providerName.toLowerCase();
  return id === "custom" || name === "custom";
}
/** A tiny inline bar used for per-model usage. */
function ModelUsageBar({
  used,
  total,
}: {
  used: number;
  /** Sum of `used` across all models in the same kind; used as the denominator. */
  total: number;
}) {
  const safeTotal = total > 0 ? total : 1;
  const ratio = Math.min(1, Math.max(0, used / safeTotal));
  const percent = Math.round(ratio * 100);
  // Color shifts from violet to amber to red as the share grows.
  const color =
    percent >= 90
      ? "from-red-500 to-red-400"
      : percent >= 70
        ? "from-amber-500 to-amber-400"
        : "from-[#8c27e7] to-[#b458e7]";
  return (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-foreground/50 font-mono tabular-nums shrink-0 w-14 text-right">
        {used}
      </span>
    </div>
  );
}
function ProviderCard({
  provider,
  isCn,
  providerUsage,
  kindTotal,
}: {
  provider: LlmProviderModels;
  isCn: boolean;
  /** model_id -> tokens for this provider under the current kind. */
  providerUsage: Record<string, number>;
  /** Sum of tokens across all models in the current kind (bar denominator). */
  kindTotal: number;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card overflow-hidden h-64">
      {/* Provider header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/20 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-foreground truncate">
            {provider.provider_name}
          </span>
          <span className="text-[10px] text-foreground/40 shrink-0">
            {provider.vendor}
          </span>
        </div>
        <span className="text-[10px] text-foreground/40 font-mono shrink-0">
          {provider.models.length}
        </span>
      </div>
      {/* Provider description (fixed, may be clamped) */}
      <div className="px-3 pt-2 pb-1 shrink-0">
        <p className="text-[10px] text-foreground/50 leading-relaxed line-clamp-2">
          {isCn ? provider.description_zh : provider.description}
        </p>
      </div>
      {/* Scrollable model list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 space-y-1">
        {provider.models.map((m) => {
          const used = providerUsage[m.id] ?? 0;
          return (
            <div
              key={m.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-background/50 hover:bg-muted/40 transition-colors"
            >
              {/* Model name + recommended badge */}
              <div className="flex items-center gap-1.5 min-w-0 shrink-0 max-w-[45%]">
                <span className="text-[11px] text-foreground truncate">
                  {m.name}
                </span>
                {m.recommended && (
                  <Star className="w-2.5 h-2.5 text-[#8c27e7] fill-[#8c27e7] shrink-0" />
                )}
              </div>
              {/* Usage bar */}
              <ModelUsageBar used={used} total={kindTotal} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default function LLMPanel({ isCn }: LLMPanelProps) {
  const [models, setModels] = useState<LlmModelsAll | null>(null);
  const [usage, setUsage] = useState<LlmUsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabKey>("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  /** Ref to the nearest scrollable ancestor, used by the scroll-top button. */
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    llmApi
      .models()
      .then((m) => {
        if (cancelled) return;
        setModels(m);
        setLoading(false);
        llmUsageApi
          .summary()
          .then((u) => {
            if (cancelled) return;
            setUsage(u.usage ?? EMPTY_USAGE);
          })
          .catch(() => {
            if (cancelled) return;
            setUsage(EMPTY_USAGE);
          });
      })
      .catch(() => {
        if (cancelled) return;
        setError(isCn ? "模型列表加载失败" : "Failed to load models");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isCn]);
  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;
    // Find the first scrollable ancestor.
    let el: HTMLElement | null = root.parentElement;
    let scroller: HTMLElement | null = null;
    while (el) {
      const style = window.getComputedStyle(el);
      const oy = style.overflowY;
      if (
        (oy === "auto" || oy === "scroll") &&
        el.scrollHeight > el.clientHeight
      ) {
        scroller = el;
        break;
      }
      el = el.parentElement;
    }
    if (!scroller) return;
    const onScroll = () => {
      setShowScrollTop(scroller!.scrollTop > 300);
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller!.removeEventListener("scroll", onScroll);
  }, [loading]);
  /** Smoothly scroll the nearest scrollable ancestor back to the top. */
  const scrollToTop = () => {
    const root = scrollRootRef.current;
    if (!root) return;
    let el: HTMLElement | null = root.parentElement;
    while (el) {
      const style = window.getComputedStyle(el);
      const oy = style.overflowY;
      if (oy === "auto" || oy === "scroll") {
        el.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      el = el.parentElement;
    }
  };
  const safeModels = models ?? EMPTY_MODELS;
  const safeUsage = usage ?? EMPTY_USAGE;
  /** Kinds visible under the active tab. */
  const activeKinds: LlmKind[] = tab === "all" ? KIND_ORDER : [tab];
  /**
   * Total tokens per kind: sum of every model's used count. Used both
   * as the tab summary and as the per-model bar denominator.
   */
  const kindTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    KIND_ORDER.forEach((k) => {
      const byProvider = safeUsage[k] ?? {};
      let sum = 0;
      Object.values(byProvider).forEach((byModel) => {
        Object.values(byModel).forEach((tokens) => {
          sum += tokens;
        });
      });
      totals[k] = sum;
    });
    return totals;
  }, [safeUsage]);
  /** Total tokens across the kinds visible under the active tab. */
  const tabTotal = useMemo(
    () => activeKinds.reduce((acc, k) => acc + (kindTotals[k] ?? 0), 0),
    [activeKinds, kindTotals],
  );
  /** Total model count for the active tab, for the header summary. */
  const totalModels = useMemo(
    () =>
      activeKinds.reduce(
        (acc, k) =>
          acc + safeModels[k].reduce((a, p) => a + p.models.length, 0),
        0,
      ),
    [activeKinds, safeModels],
  );
  return (
    <div ref={scrollRootRef}>
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#8c27e7]" />
        <h2 className="text-sm font-semibold tracking-tight">
          {isCn ? "LLM 模型信息" : "LLM Models"}
        </h2>
      </div>
      <p className="text-xs text-foreground/50 mb-3">
        {isCn
          ? `按能力分类查看模型与用量（当前分类共 ${totalModels} 个模型）。用量按每个计费周期重置。`
          : `Browse models and usage by capability (${totalModels} in this view). Usage resets each billing cycle.`}
      </p>
      <div className="relative flex items-center gap-1 mb-4 border-b border-border overflow-x-auto">
        {TAB_META.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? "text-[#8c27e7]"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {t.icon}
              {isCn ? t.labelZh : t.labelEn}
              {/* Active indicator: only rendered on the selected tab */}
              {active && (
                <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-[#8c27e7]" />
              )}
            </button>
          );
        })}
      </div>
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
        </div>
      )}
      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-red-500/30 bg-red-500/5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
      {/* Body */}
      {!loading && !error && (
        <>
          {/* Overview card for the active tab */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-border bg-card mb-4">
            <div>
              <div className="text-[11px] text-foreground/50 mb-0.5">
                {isCn ? "本分类总用量" : "Total usage"}
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums leading-none">
                {tabTotal.toLocaleString()}
                <span className="text-[10px] font-normal text-foreground/40 ml-1">
                  tokens
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-foreground/50 mb-0.5">
                {isCn ? "模型数量" : "Models"}
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums leading-none">
                {totalModels}
              </div>
            </div>
          </div>
          {/* Sections per kind */}
          {activeKinds.map((kind) => {
            // Hide the "Custom" placeholder provider from the catalog.
            const providers = (safeModels[kind] ?? []).filter(
              (p) => !isHiddenProvider(p.provider_id, p.provider_name),
            );
            const kindUsage = safeUsage[kind] ?? {};
            const kindTotal = kindTotals[kind] ?? 0;
            return (
              <div key={kind} className="mb-5">
                {providers.length === 0 ? (
                  <div className="px-3 py-2 rounded-lg border border-dashed border-border text-[11px] text-foreground/40">
                    {isCn ? "暂无可用模型" : "No models available"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {providers.map((p) => (
                      <ProviderCard
                        key={`${kind}:${p.provider_id}`}
                        provider={p}
                        isCn={isCn}
                        providerUsage={kindUsage[p.provider_id] ?? {}}
                        kindTotal={kindTotal}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <p className="mt-2 text-[10px] text-foreground/40">
            {isCn
              ? "用量统计每 5 分钟刷新一次。如需提升配额，请前往「我的积分」充值或升级套餐。"
              : "Usage refreshes every 5 minutes. To increase quota, top up or upgrade your plan in Points."}
          </p>
        </>
      )}
      <button
        type="button"
        onClick={scrollToTop}
        className={`
          fixed bottom-8 right-8 z-50
          w-12 h-12 rounded-full
          bg-black text-white
          border border-gray-300
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          hover:bg-gray-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]
          active:bg-gray-900
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          cursor-pointer
          ${
            showScrollTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-16 pointer-events-none"
          }
        `}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
