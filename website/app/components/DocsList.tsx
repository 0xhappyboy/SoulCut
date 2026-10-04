"use client";
import { useI18n } from "../providers/I18nProvider";
import cnMessages from "@/messages/cn.json";
import enMessages from "@/messages/en.json";
const docsData = {
  cn: [
    {
      id: 1,
      title: "README (英文)",
      description:
        "HippoX 项目的中文版说明文档，包含核心原理、工作流模式和原子技能清单",
      url: "https://github.com/0xhappyboy/hippox/blob/main/README.md",
    },
    {
      id: 2,
      title: "README (中文)",
      description:
        "HippoX 项目的中文版说明文档，包含核心原理、工作流模式和原子技能清单",
      url: "https://github.com/0xhappyboy/hippox/blob/main/README_zh-CN.md",
    },
    {
      id: 3,
      title: "HippoX 英文文档",
      description: "HippoX 项目完整英文文档",
      url: "https://hippox-docs-en.vercel.app/",
    },
  ],
  en: [
    {
      id: 1,
      title: "README (English)",
      description:
        "HippoX project documentation in English, including core principles, workflow modes and atomic skill list",
      url: "https://github.com/0xhappyboy/hippox/blob/main/README.md",
    },
    {
      id: 2,
      title: "README (Chinese)",
      description:
        "HippoX project documentation in English, including core principles, workflow modes and atomic skill list",
      url: "https://github.com/0xhappyboy/hippox/blob/main/README_zh-CN.md",
    },
    {
      id: 3,
      title: "HippoX English Documentation",
      description: "Complete English documentation for the HippoX project",
      url: "https://hippox-docs-en.vercel.app/",
    },
  ],
};
interface DocsListProps {
  onSelectDoc?: (doc: (typeof docsData.cn)[0]) => void;
}
export default function DocsList({ onSelectDoc }: DocsListProps) {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const t = isCn ? cnMessages.HomePage : enMessages.HomePage;
  const docs = isCn ? docsData.cn : docsData.en;
  const handleDocClick = (doc: (typeof docsData.cn)[0]) => {
    if (onSelectDoc) {
      onSelectDoc(doc);
    }
    window.open(doc.url, "_blank");
  };
  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };
  const scrollbarStyles = `
    .docs-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .docs-scrollbar::-webkit-scrollbar-track {
      background: var(--muted);
      border-radius: 10px;
    }
    .docs-scrollbar::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 10px;
    }
    .docs-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--muted-foreground);
    }
  `;
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-3">
      <style>{scrollbarStyles}</style>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          {isCn ? "文档中心" : "Documentation"}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {docs.length} docs
        </span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto docs-scrollbar pr-1">
        {docs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleDocClick(doc)}
            className="group p-2 rounded transition-all cursor-pointer hover:bg-muted"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {doc.title}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                  {doc.description}
                </p>
              </div>
              <button
                onClick={(e) => handleLinkClick(e, doc.url)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted-foreground/20"
                title={isCn ? "前往文档" : "Go to doc"}
              >
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
