"use client";
import { useI18n } from "../providers/I18nProvider";
import { useEffect, useRef, useState } from "react";
// LLM Provider data
const llmProviders = [
  { id: "openai", name: "OpenAI", nameZh: "OpenAI", color: "#10a37f" },
  { id: "anthropic", name: "Anthropic", nameZh: "Anthropic", color: "#d97757" },
  {
    id: "google",
    name: "Google Gemini",
    nameZh: "Google Gemini",
    color: "#4285f4",
  },
  { id: "deepseek", name: "DeepSeek", nameZh: "DeepSeek", color: "#4d6bfe" },
  { id: "mistral", name: "Mistral AI", nameZh: "Mistral AI", color: "#f7a600" },
  { id: "groq", name: "Groq", nameZh: "Groq", color: "#f55036" },
  {
    id: "together",
    name: "Together AI",
    nameZh: "Together AI",
    color: "#7c3aed",
  },
  { id: "baidu", name: "Baidu ERNIE", nameZh: "百度 ERNIE", color: "#2932e1" },
  {
    id: "alibaba",
    name: "Alibaba Qwen",
    nameZh: "阿里 Qwen",
    color: "#ff6a00",
  },
  {
    id: "tencent",
    name: "Tencent Hunyuan",
    nameZh: "腾讯混元",
    color: "#07c160",
  },
  { id: "zhipu", name: "Zhipu GLM", nameZh: "智谱 GLM", color: "#4f46e5" },
  {
    id: "moonshot",
    name: "Moonshot Kimi",
    nameZh: "月之暗面 Kimi",
    color: "#f59e0b",
  },
  {
    id: "minimax",
    name: "MiniMax Abab",
    nameZh: "MiniMax Abab",
    color: "#8b5cf6",
  },
  { id: "baichuan", name: "Baichuan AI", nameZh: "百川智能", color: "#dc2626" },
  { id: "yi", name: "Yi AI", nameZh: "零一万物 Yi", color: "#14b8a6" },
  { id: "cohere", name: "Cohere", nameZh: "Cohere", color: "#e53e3e" },
  {
    id: "perplexity",
    name: "Perplexity AI",
    nameZh: "Perplexity AI",
    color: "#1a1a2e",
  },
  {
    id: "huggingface",
    name: "HuggingFace",
    nameZh: "HuggingFace",
    color: "#ffd21e",
  },
  { id: "replicate", name: "Replicate", nameZh: "Replicate", color: "#6b4fbb" },
  {
    id: "fireworks",
    name: "Fireworks AI",
    nameZh: "Fireworks AI",
    color: "#f97316",
  },
  {
    id: "azure",
    name: "Azure OpenAI",
    nameZh: "Azure OpenAI",
    color: "#0078d4",
  },
  { id: "custom", name: "Custom LLM", nameZh: "自定义 LLM", color: "#6b7280" },
];
// Duplicate for seamless loop
const duplicatedItems = [...llmProviders, ...llmProviders];
export default function LLMList() {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const speedRef = useRef(0.5); // pixels per frame
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Get the first child to measure width
    const firstChild = container.children[0] as HTMLElement;
    if (!firstChild) return;
    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      if (!isPaused) {
        // Move position based on delta time for consistent speed
        positionRef.current += speedRef.current * (delta / 16);
        // Reset position when half the content has scrolled
        const itemWidth = firstChild.offsetWidth + 24; // width + gap
        const halfWidth = (llmProviders.length * itemWidth) / 2;
        if (positionRef.current >= halfWidth) {
          positionRef.current -= halfWidth;
        }
        container.style.transform = `translateX(-${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPaused]);
  return (
    <section className="w-full py-4 overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/20" />
        <span className="text-[9px] font-medium text-foreground/30 tracking-[0.2em] uppercase">
          {isCn ? "支持的 LLM" : "Supported LLMs"}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/20" />
      </div>
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={containerRef}
          className="flex gap-6 will-change-transform"
          style={{ transform: "translateX(0)" }}
        >
          {duplicatedItems.map((provider, index) => (
            <div
              key={`${provider.id}-${index}`}
              className="flex-shrink-0 flex items-center gap-2.5 py-1.5 px-4 rounded-[5px] border border-border/10 bg-background/30 backdrop-blur-sm"
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: provider.color }}
              />
              <span className="text-xs font-medium text-foreground/70 whitespace-nowrap">
                {isCn ? provider.nameZh : provider.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
