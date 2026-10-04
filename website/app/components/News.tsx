"use client";
import { useState, useRef, useEffect } from "react";
import { useI18n } from "../providers/I18nProvider";
import { Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
interface NewsItem {
  id: string;
  title: string;
  titleZh: string;
  date: string;
  summary: string;
  summaryZh: string;
  content: string;
  contentZh: string;
  url: string;
  tag: string;
  tagZh: string;
  image?: string;
}
const getHardcodedDateFolders = (): string[] => {
  return ["20260905", "20260820", "20260801"];
};
const parseNewsContent = (
  cnContent: string | null,
  enContent: string | null,
  dateStr: string,
): NewsItem | null => {
  let titleZh = "";
  let summaryZh = "";
  let contentZh = "";
  let imageZh: string | undefined = undefined;
  let tagZh = "更新";
  if (cnContent) {
    const lines = cnContent.split("\n").filter((line) => line.trim());
    if (lines.length > 0) {
      titleZh = lines[0].replace(/^#+\s*/, "").trim();
      const imageMatch = cnContent.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch) {
        imageZh = imageMatch[1];
      }
      const contentWithoutTitle = cnContent
        .split("\n")
        .slice(1)
        .filter((line) => line.trim() && !line.match(/!\[.*?\]\(.*?\)/))
        .join("\n")
        .trim();
      summaryZh = contentWithoutTitle.split("\n")[0] || "";
      contentZh = contentWithoutTitle;
      const tagMatch = cnContent.match(/\[标签[：:]\s*([^\n\]]+)\]/);
      if (tagMatch) {
        tagZh = tagMatch[1].trim();
      }
    }
  }
  let title = "";
  let summary = "";
  let content = "";
  let image: string | undefined = undefined;
  let tag = "Update";
  if (enContent) {
    const lines = enContent.split("\n").filter((line) => line.trim());
    if (lines.length > 0) {
      title = lines[0].replace(/^#+\s*/, "").trim();
      const imageMatch = enContent.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch) {
        image = imageMatch[1];
      }
      const contentWithoutTitle = enContent
        .split("\n")
        .slice(1)
        .filter((line) => line.trim() && !line.match(/!\[.*?\]\(.*?\)/))
        .join("\n")
        .trim();
      summary = contentWithoutTitle.split("\n")[0] || "";
      content = contentWithoutTitle;
      const tagMatch = enContent.match(/\[Tag[：:]\s*([^\n\]]+)\]/);
      if (tagMatch) {
        tag = tagMatch[1].trim();
      }
    }
  }
  if (!titleZh && !title) return null;
  const imageUrl = image || imageZh;
  const hasImage = !!imageUrl;
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const displayDate = `${year}-${month}-${day}`;
  return {
    id: dateStr,
    title: title || titleZh,
    titleZh: titleZh || title,
    date: displayDate,
    summary: summary || summaryZh,
    summaryZh: summaryZh || summary,
    content: content || summary,
    contentZh: contentZh || summaryZh,
    url: `/news/${dateStr}/`,
    tag: tag || "Update",
    tagZh: tagZh || "更新",
    image: hasImage ? imageUrl : undefined,
  };
};
// Get fallback gradient based on tag
const getFallbackImage = (tag: string) => {
  const colors: Record<string, string> = {
    Release: "from-emerald-500/20 to-emerald-900/20",
    Update: "from-blue-500/20 to-blue-900/20",
    Announcement: "from-purple-500/20 to-purple-900/20",
  };
  return colors[tag] || "from-indigo-500/20 to-indigo-900/20";
};
// News Card Component - 完整渲染 Markdown
const NewsCard = ({ item }: { item: NewsItem }) => {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const [imgError, setImgError] = useState(false);
  const title = isCn ? item.titleZh : item.title;
  const content = isCn ? item.contentZh : item.content;
  const summary = isCn ? item.summaryZh : item.summary;
  const tag = isCn ? item.tagZh : item.tag;
  const hasImage = item.image && !imgError;
  // ReactMarkdown 组件配置
  const markdownComponents = {
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/50 hover:text-foreground/80 underline"
      >
        {children}
      </a>
    ),
  };
  const markdownComponentsNoImage = {
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/40 hover:text-foreground/70 underline"
      >
        {children}
      </a>
    ),
  };
  return (
    <div className="group relative rounded-lg overflow-hidden bg-background border border-border/40 transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:shadow-foreground/5 flex-shrink-0 w-[280px]">
      {hasImage ? (
        // 有图片：图片在上，文字在下
        <>
          <div className="relative aspect-video bg-gradient-to-br from-background/80 to-background/40 overflow-hidden">
            <img
              src={item.image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            {/* Tag badge - top left */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </div>
            {/* Date badge - bottom right */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white backdrop-blur-sm">
              {new Date(item.date).toLocaleDateString()}
            </div>
          </div>
          {/* Content */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-foreground/90 line-clamp-1">
              {title}
            </h4>
            <div className="text-xs text-foreground/40 mt-1 line-clamp-3 prose prose-sm max-w-none prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-ul:pl-4 prose-li:text-foreground/40">
              <ReactMarkdown components={markdownComponents}>
                {content || summary}
              </ReactMarkdown>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-foreground/20">
              <span>{isCn ? "本地新闻" : "Local news"}</span>
            </div>
          </div>
        </>
      ) : (
        // 无图片：Markdown 填充整个卡片
        <div className="relative p-4 min-h-[220px] flex flex-col justify-between">
          {/* 背景渐变 */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getFallbackImage(
              item.tag,
            )} -z-10`}
          />
          <div>
            {/* Tag and Date */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium text-foreground/40 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
              <span className="text-[10px] text-foreground/25">·</span>
              <span className="text-[10px] text-foreground/40 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
            {/* Title */}
            <h4 className="text-base font-semibold text-foreground/90 line-clamp-2">
              {title}
            </h4>
            {/* Content - 完整 Markdown 渲染 */}
            <div className="text-xs text-foreground/45 mt-2 line-clamp-6 prose prose-sm max-w-none prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-ul:pl-4 prose-li:text-foreground/45">
              <ReactMarkdown components={markdownComponentsNoImage}>
                {content || summary}
              </ReactMarkdown>
            </div>
          </div>
          <div className="text-[10px] text-foreground/20 mt-3">
            {isCn ? "本地新闻" : "Local news"}
          </div>
        </div>
      )}
    </div>
  );
};
// Main News Component
export default function News() {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {}, []);
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300;
    const target =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: target, behavior: "smooth" });
  };
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 20);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 20,
    );
  };
  if (loading) {
    return (
      <section className="w-full py-5">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isCn ? "最新动态" : "News"}
            </h2>
          </div>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[280px] rounded-lg bg-background/50 border border-border/40 animate-pulse"
              style={{ aspectRatio: "16/11" }}
            />
          ))}
        </div>
      </section>
    );
  }
  if (news.length === 0) {
    return (
      <section className="w-full py-5">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isCn ? "最新动态" : "News"}
            </h2>
          </div>
        </div>
        <div className="text-center py-12 text-foreground/30 text-sm border border-border/40 rounded-lg">
          {isCn ? "暂无新闻" : "No news available"}
        </div>
      </section>
    );
  }
  return (
    <section className="w-full py-5">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isCn ? "最新动态" : "News"}
            </h2>
            <p className="text-xs text-foreground/40 mt-0.5">
              {isCn
                ? "HippoxOS 的最新版本和更新"
                : "Latest releases and updates"}
            </p>
          </div>
          <div className="text-[10px] text-foreground/20 font-mono">
            {news.length} {isCn ? "条动态" : "posts"}
          </div>
        </div>
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-[38px] h-[38px] rounded-full bg-background/90 backdrop-blur-sm border border-border/40 shadow-lg flex items-center justify-center hover:bg-background hover:border-border/60 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-foreground/70" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-[38px] h-[38px] rounded-full bg-background/90 backdrop-blur-sm border border-border/40 shadow-lg flex items-center justify-center hover:bg-background hover:border-border/60 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-foreground/70" />
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 hide-scrollbar"
            onScroll={handleScroll}
          >
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
