"use client";
import { useI18n } from "../providers/I18nProvider";
import { Monitor, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { WindowsIcon } from "../icons/WindwosIcon";
import { MacOSIcon } from "../icons/MacOSIcon";
import { LinuxIcon } from "../icons/LinuxIcon";
export default function SystemRequirements() {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const requirements = {
    windows: {
      os: isCn
        ? "Windows 10 或更高版本 (64位)"
        : "Windows 10 or later (64-bit)",
      cpu: isCn
        ? "Intel Core i5 / AMD Ryzen 5 或更高"
        : "Intel Core i5 / AMD Ryzen 5 or higher",
      memory: isCn ? "8 GB RAM (推荐 16 GB)" : "8 GB RAM (16 GB recommended)",
      storage: isCn ? "10 GB 可用空间" : "10 GB available space",
      gpu: isCn ? "支持 OpenGL 3.3 的显卡" : "GPU with OpenGL 3.3 support",
    },
    macos: {
      os: isCn ? "macOS 12 Monterey 或更高版本" : "macOS 12 Monterey or later",
      cpu: isCn
        ? "Apple Silicon 或 Intel Core i5 或更高"
        : "Apple Silicon or Intel Core i5 or higher",
      memory: isCn ? "8 GB RAM (推荐 16 GB)" : "8 GB RAM (16 GB recommended)",
      storage: isCn ? "10 GB 可用空间" : "10 GB available space",
      gpu: isCn ? "Metal 支持" : "Metal support",
    },
    linux: {
      os: isCn
        ? "Ubuntu 20.04 / Fedora 38 / Arch Linux 或更高"
        : "Ubuntu 20.04 / Fedora 38 / Arch Linux or later",
      cpu: isCn
        ? "Intel Core i5 / AMD Ryzen 5 或更高"
        : "Intel Core i5 / AMD Ryzen 5 or higher",
      memory: isCn ? "8 GB RAM (推荐 16 GB)" : "8 GB RAM (16 GB recommended)",
      storage: isCn ? "10 GB 可用空间" : "10 GB available space",
      gpu: isCn ? "支持 Vulkan 1.2 的显卡" : "GPU with Vulkan 1.2 support",
    },
  };
  const platforms = [
    { key: "windows" as const, label: "Windows", icon: WindowsIcon },
    { key: "macos" as const, label: "macOS", icon: MacOSIcon },
    { key: "linux" as const, label: "Linux", icon: LinuxIcon },
  ];
  const icons = {
    cpu: <Cpu className="w-3.5 h-3.5" />,
    memory: <MemoryStick className="w-3.5 h-3.5" />,
    storage: <HardDrive className="w-3.5 h-3.5" />,
    os: <Monitor className="w-3.5 h-3.5" />,
  };
  return (
    <section className="w-full py-5">
      <div className="mx-auto">
        {/* Header - 与 VideoShowcase 一致 */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isCn ? "系统要求" : "System Requirements"}
            </h2>
            <p className="text-xs text-foreground/40 mt-0.5">
              {isCn
                ? "运行 HippoxOS 的硬件配置要求"
                : "Hardware requirements to run HippoxOS"}
            </p>
          </div>
          {/* <div className="text-[10px] text-foreground/20 font-mono">
            {platforms.length} {isCn ? "个平台" : "platforms"}
          </div> */}
        </div>
        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {platforms.map((platform) => {
            const PlatformIcon = platform.icon;
            const req = requirements[platform.key];
            const items = [
              { label: isCn ? "系统" : "OS", value: req.os, icon: icons.os },
              {
                label: isCn ? "处理器" : "CPU",
                value: req.cpu,
                icon: icons.cpu,
              },
              {
                label: isCn ? "内存" : "RAM",
                value: req.memory,
                icon: icons.memory,
              },
              {
                label: isCn ? "存储" : "Storage",
                value: req.storage,
                icon: icons.storage,
              },
            ];
            return (
              <div
                key={platform.key}
                className="bg-background/30 backdrop-blur-sm border border-border/10 rounded-lg p-4 hover:border-border/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/10">
                  <PlatformIcon className="w-4 h-4 text-foreground/40" />
                  <span className="text-xs font-semibold text-foreground/60 tracking-wide">
                    {platform.label}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-foreground/40 mt-0.5 flex-shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <div className="text-[9px] text-foreground/40 font-mono uppercase tracking-wider">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-foreground/70 leading-tight">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
