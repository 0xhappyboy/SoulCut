"use client";
import { useState, useRef, useEffect } from "react";
import { useI18n } from "../providers/I18nProvider";

// SoulCut feature modules with video backgrounds.
// Each module highlights one facet of the nonlinear video editor.
// NOTE: video paths point to the existing files under /public.
const subsystems = [
  {
    id: "multitrack-editing",
    name: "Multi-Track Editing",
    nameZh: "多轨剪辑",
    description: "Multi-track · Multi-Camera · Real-time Preview",
    descriptionZh: "多轨道 · 多机位 · 实时预览",
    detail:
      "A full nonlinear editing timeline with unlimited video, audio, and overlay tracks. Render multiple camera angles at once, and play several track blocks together inside a single frame. Precise time alignment, frame-accurate trimming, and real-time preview.",
    detailZh:
      "完整的非线性编辑时间线，支持无限视频轨、音频轨与叠加轨。支持多机位渲染，多个轨道块可在同一画面中同时播放。精准时间对齐、逐帧裁剪，实时预览所见即所得。",
    video: "/multi_camera_editing.mp4",
    color: "#8c27e7",
  },
  {
    id: "filters-effects",
    name: "Filters & Effects",
    nameZh: "滤镜与特效",
    description: "15 Filters · 78 Visual Effects",
    descriptionZh: "15 种滤镜 · 78 种视觉特效",
    detail:
      "15 built-in filters and 78 visual effects, from cinematic color grading to stylized looks. Apply, stack, and fine-tune every parameter in real time.",
    detailZh:
      "内置 15 种滤镜与 78 种视觉特效，从电影级调色到风格化外观一应俱全。可实时叠加、逐项微调，参数即时生效。",
    video: "/filters_and_effects.mp4",
    color: "#e727c9",
  },
  {
    id: "transitions",
    name: "Transitions",
    nameZh: "转场特效",
    description: "26 Professional Transitions",
    descriptionZh: "26 种专业转场",
    detail:
      "26 professionally designed transitions — cuts, dissolves, wipes, motion blur, and more. Drag onto the timeline and adjust duration with a single click.",
    detailZh:
      "26 种专业设计的转场效果 —— 硬切、溶解、划像、运动模糊等。拖入时间线即可使用，一键调整时长与参数。",
    video: "/transition.mp4",
    color: "#27b0e7",
  },
  {
    id: "camera-motion",
    name: "Camera Motion",
    nameZh: "运镜效果",
    description: "15 Camera Motions · Keyframe Control",
    descriptionZh: "15 种运镜 · 关键帧控制",
    detail:
      "15 camera motion presets — push in, pull out, pan, tilt, orbit, and more. Combine with keyframes for fully custom movement on any clip.",
    detailZh:
      "15 种运镜预设 —— 推、拉、摇、移、环绕等。可结合关键帧实现任意自定义镜头运动，让静态画面动起来。",
    video: "/camera_movement.mp4",
    color: "#e7a127",
  },
  {
    id: "text-to-media",
    name: "Text to Audio & 3D",
    nameZh: "文字生音频 · 文字生 3D",
    description: "Type a line, get a sound or a scene",
    descriptionZh: "写下一句话，得到声音或场景",
    detail:
      "Turn written words into audio or a three-dimensional scene, then drop the result straight onto the timeline as another piece of your edit.",
    detailZh:
      "把写下的文字变成音频或三维场景，生成结果可直接放进时间线，成为剪辑中的一块素材。",
    video: "/3d_generation.mp4",
    color: "#a855f7",
  },
  {
    id: "web-material-download",
    name: "Web Material Download",
    nameZh: "网络素材下载",
    description: "Bring material in from the web",
    descriptionZh: "把网上的素材带进来",
    detail:
      "Pull images, audio, and video from the web into your project without leaving the editor, so reference material and source assets are ready where you need them.",
    detailZh:
      "无需离开编辑器，即可把网络上的图片、音频与视频引入项目，让参考素材与原始资源直接出现在你需要的位置。",
    video: "/download.mp4",
    color: "#ec4899",
  },
  {
    id: "audio-processing",
    name: "Audio Processing",
    nameZh: "音频处理",
    description: "Sound that stays clean",
    descriptionZh: "让声音始终干净",
    detail:
      "Audio sits comfortably alongside the picture, so dialogue, music, and ambience stay balanced without extra fiddling.",
    detailZh:
      "声音与画面自然贴合，对白、音乐与环境音始终保持舒适平衡，无需额外折腾。",
    video: "/audio.mp4",
    color: "#34d399",
  },
  {
    id: "one-click-export",
    name: "One-Click Export",
    nameZh: "一键导出",
    description: "From timeline to finished file",
    descriptionZh: "从时间线，到成片",
    detail:
      "When the cut feels right, export it and be done. No detours through settings you never wanted to touch in the first place.",
    detailZh:
      "当剪辑感觉对了，导出即可收工。不必绕进那些你原本就不想碰的设置里。",
    video: "/exrport.mp4",
    color: "#f59e0b",
  },
];

// Video card component with autoplay and dense content
// Card height is fixed at 300px, text shows more lines
const FunctionCard = ({ subsystem }: { subsystem: (typeof subsystems)[0] }) => {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Auto-play video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  const name = isCn ? subsystem.nameZh : subsystem.name;
  const description = isCn ? subsystem.descriptionZh : subsystem.description;
  const detail = isCn ? subsystem.detailZh : subsystem.detail;

  return (
    <div className="relative group h-[300px] bg-background border border-border/40 rounded-lg cursor-pointer transition-all duration-300 hover:bg-background/80 hover:shadow-xl overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full">
        {!videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src={subsystem.video} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-background/80 to-background/40"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 50%, ${subsystem.color}15, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* Gradient overlay - more gradual for more text visibility */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-transparent via-15% to-background/90" />

      {/* Content - right aligned with more text visible */}
      <div className="absolute inset-0 flex items-center justify-end px-6 md:px-10">
        <div className="flex-1 max-w-[75%] md:max-w-[80%] text-right relative z-10 min-w-0">
          {/* Color dot */}
          <div
            className="w-2 h-2 rounded-full mb-2 md:mb-2.5 ml-auto flex-shrink-0"
            style={{ backgroundColor: subsystem.color }}
          />

          {/* Title - always visible, never truncates */}
          <h3 className="text-xl md:text-2xl font-semibold text-foreground/90 tracking-tight mb-1 md:mb-2 whitespace-nowrap">
            {name}
          </h3>

          {/* Description - shows more text, truncates only on very small screens */}
          <p className="text-xs md:text-sm text-foreground/60 leading-relaxed mb-1.5 md:mb-2 line-clamp-2 md:line-clamp-2">
            {description}
          </p>

          {/* Detail - shows 2-3 lines, truncates with ellipsis on small screens */}
          <p className="text-[10px] md:text-xs text-foreground/45 leading-relaxed max-w-lg ml-auto line-clamp-2 md:line-clamp-3">
            {detail}
          </p>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div
        className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ backgroundColor: `${subsystem.color}10` }}
      />
    </div>
  );
};

// Main FunctionList component
export default function FunctionList() {
  const { locale } = useI18n();
  const isCn = locale === "cn";

  return (
    <section className="w-full py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {isCn ? "核心功能" : "Core Functions"}
          </h2>
          <p className="text-sm text-foreground/40 mt-1">
            {isCn
              ? "SoulCut 的核心剪辑能力，覆盖从剪辑到导出的全流程"
              : "SoulCut core editing capabilities, covering the full workflow from cut to export"}
          </p>
        </div>
      </div>

      {/* Cards grid - responsive columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subsystems.map((subsystem) => (
          <FunctionCard key={subsystem.id} subsystem={subsystem} />
        ))}
      </div>
    </section>
  );
}
