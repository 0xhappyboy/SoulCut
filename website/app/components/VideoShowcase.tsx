"use client";
import { useState, useRef, useEffect } from "react";
import { useI18n } from "../providers/I18nProvider";
import { Play, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { YouTubeIcon } from "../icons/YouTubeIcon";

interface VideoItem {
  id: string;
  title: string;
  titleZh: string;
  platform: "youtube" | "bilibili" | "acfun";
  embedUrl: string;
  watchUrl: string;
  channel: string;
  channelZh: string;
  duration: string;
}

// English video list - Add new videos here
const enVideos: VideoItem[] = [
  {
    id: "1",
    title:
      "🎉HippoxOS The Initial Version v0.5.0 Is Now Officially Released.#Hippox #HippoxOS #llm #ai",
    titleZh:
      "🎉HippoxOS 初始版本 v0.5.0 現已正式發布. #Hippox #HippoxOS #llm #ai",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/99AMkXpNZkE?si=zGXEy3mwfxV-onco",
    watchUrl: "https://www.youtube.com/watch?v=99AMkXpNZkE",
    channel: "HippoxOS",
    channelZh: "HippoxOS",
    duration: "1.05",
  },
  {
    id: "2",
    title: "HippoxOS - What Does System-Level LLM Control Actually Look Like?",
    titleZh: "HippoxOS - 所謂的「系統級LLM控制」, 實際長什麼樣？",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/AztnqP6RXjo?si=3RvCK7dLWx0JSk3T",
    watchUrl: "https://www.youtube.com/watch?v=AztnqP6RXjo",
    channel: "HippoxOS",
    channelZh: "HippoxOS",
    duration: "1.32",
  },
  {
    id: "3",
    title:
      "HippoxOS - AI Video&Audio workspace, Turn videos from across the web into your own content library.",
    titleZh: "HippoxOS - AI 影音工作台，讓全網影片都變成你的內容素材庫",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/oUVGXS3poOA?si=avDIYWsKrXdWo5R_",
    watchUrl: "https://www.youtube.com/watch?v=oUVGXS3poOA",
    channel: "HippoxOS",
    channelZh: "HippoxOS",
    duration: "56",
  },
];

// Chinese video list - Add new videos here
const cnVideos: VideoItem[] = [
  {
    id: "1",
    title:
      "🎉HippoxOS The Initial Version v0.5.0 Is Now Officially Released.#Hippox #HippoxOS #llm #ai",
    titleZh:
      "🎉HippoxOS 初始版本 v0.5.0 現已正式發布. #Hippox #HippoxOS #llm #ai",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/6C_zMgOUJXY?si=8S1S1ep2hnXC7Rae",
    watchUrl: "https://www.youtube.com/watch?v=6C_zMgOUJXY",
    channel: "HippoxOS",
    channelZh: "HippoxOS",
    duration: "1.05",
  },
  {
    id: "2",
    title: "HippoxOS - LLM-Native Operating System Overview",
    titleZh: "HippoxOS - 所謂的「系統級LLM控制」, 實際長什麼樣？",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/XZwXXc2r6rg?si=8JlX6oG4n2Mu41f5",
    watchUrl: "https://www.youtube.com/watch?v=XZwXXc2r6rg",
    channel: "HippoxOS",
    channelZh: "HippoxOS",
    duration: "1.32",
  },
  {
    id: "3",
    title:
      "HippoxOS - AI Video&Audio workspace, Turn videos from across the web into your own content library.",
    titleZh: "HippoxOS - AI 影音工作台，讓全網影片都變成你的內容素材庫",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/NUfeDu1-dHU?si=i8vmosph0xybvHmT",
    watchUrl: "https://www.youtube.com/watch?v=NUfeDu1-dHU",
    channel: "HippoxOS",
    channelZh: "HippoxOS",
    duration: "56",
  },
];

const platformLabels = {
  youtube: "YouTube",
  bilibili: "B站",
  acfun: "A站",
};

// Video Card Component
// Clicking the card opens the video in a new tab instead of playing inline.
const VideoCard = ({ video, width }: { video: VideoItem; width?: string }) => {
  const { locale } = useI18n();
  const isCn = locale === "cn";

  const handleOpen = () => {
    window.open(video.watchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`group relative rounded-lg overflow-hidden cursor-pointer bg-background border border-border/40 transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:shadow-foreground/5 flex-shrink-0 ${width || "w-[280px]"}`}
      onClick={handleOpen}
    >
      <div className="relative aspect-video bg-black">
        <iframe
          src={video.embedUrl}
          className="w-full h-full pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
        {/* Hover overlay hints that the card links out to the platform */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-background shadow-2xl transform scale-90 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 ml-0.5" />
          </div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
          <span>{platformLabels[video.platform]}</span>
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white backdrop-blur-sm">
          {video.duration}
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-medium text-foreground/90 line-clamp-1">
          {isCn ? video.titleZh : video.title}
        </h4>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-foreground/40">
            {isCn ? video.channelZh : video.channel}
          </p>
          <ExternalLink className="w-3 h-3 text-foreground/30 group-hover:text-foreground/60 transition-colors" />
        </div>
      </div>
    </div>
  );
};

// Main VideoShowcase Component
export default function VideoShowcase() {
  const { locale } = useI18n();
  const isCn = locale === "cn";

  // Get the appropriate video list based on current locale
  const currentVideos = isCn ? cnVideos : enVideos;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Determine layout mode based on video count
  const videoCount = currentVideos.length;
  const isSingleVideo = videoCount === 1;
  const isTwoVideos = videoCount === 2;
  const isThreeVideos = videoCount === 3;
  const isFourOrMore = videoCount >= 4;

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300;
    const target =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({
      left: target,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 20);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 20,
    );
  };

  // Update scroll button visibility when videos change or window resizes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isFourOrMore) {
      handleScroll();
    }
  }, [currentVideos, isFourOrMore]);

  // Render videos in grid or scroll layout
  const renderVideos = () => {
    if (isSingleVideo || isTwoVideos || isThreeVideos) {
      // Grid layout with equal width distribution
      return (
        <div
          className={`grid gap-4 ${isSingleVideo ? "grid-cols-1" : isTwoVideos ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {currentVideos.map((video) => (
            <VideoCard key={video.id} video={video} width="w-full" />
          ))}
        </div>
      );
    }

    // Scroll layout for 4 or more videos
    return (
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
          {currentVideos.map((video) => (
            <VideoCard key={video.id} video={video} width="w-[280px]" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full py-5">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {isCn ? "视频展示" : "Video Showcase"}
          </h2>
          <p className="text-xs text-foreground/40 mt-0.5">
            {isCn
              ? "观看 HippoxOS 的相关视频和教程"
              : "Watch HippoxOS videos and tutorials"}
          </p>
        </div>
        <div className="text-[10px] text-foreground/20 font-mono">
          {currentVideos.length} {isCn ? "个视频" : "videos"}
        </div>
      </div>

      {renderVideos()}

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
