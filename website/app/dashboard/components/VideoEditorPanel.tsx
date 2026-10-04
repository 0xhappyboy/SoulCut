"use client";
import { UserBo } from "@/app/api/user";
import {
  Clapperboard,
  Clock,
  Film,
  HardDrive,
  Loader2,
  PlusCircle,
} from "lucide-react";
interface VideoEditorPanelProps {
  user: UserBo;
  isCn: boolean;
}
export default function VideoEditorPanel({
  user,
  isCn,
}: VideoEditorPanelProps) {
  const stats = [
    {
      icon: <Film className="w-3.5 h-3.5" />,
      label: isCn ? "项目数" : "Projects",
      value: "0",
    },
    {
      icon: <Clock className="w-3.5 h-3.5" />,
      label: isCn ? "总时长" : "Total length",
      value: "0h",
    },
    {
      icon: <HardDrive className="w-3.5 h-3.5" />,
      label: isCn ? "占用空间" : "Storage",
      value: "0 MB",
    },
  ];
  return (
    <div>
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <Clapperboard className="w-4 h-4 text-[#8c27e7]" />
        <h2 className="text-sm font-semibold tracking-tight">
          {isCn ? "视频编辑信息" : "Video Editor"}
        </h2>
      </div>
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="px-3 py-2.5 rounded-lg border border-border bg-card"
          >
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/50 mb-1">
              {s.icon}
              {s.label}
            </div>
            <div className="text-base font-semibold text-foreground">
              {s.value}
            </div>
          </div>
        ))}
      </div>
      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-10 rounded-lg border border-dashed border-border bg-card/40">
        <Loader2 className="w-5 h-5 text-foreground/20 mb-2" />
        <div className="text-xs text-foreground/50 mb-3">
          {isCn ? "还没有视频项目" : "No video projects yet"}
        </div>
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-[#8c27e7] to-[#b458e7] shadow-md shadow-[#8c27e7]/20 hover:shadow-[#8c27e7]/35 transition-all duration-200 cursor-pointer"
          onClick={() => alert(isCn ? "即将支持" : "Coming soon")}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          {isCn ? "新建项目" : "New project"}
        </button>
      </div>
    </div>
  );
}
