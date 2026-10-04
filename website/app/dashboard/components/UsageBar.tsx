"use client";
interface UsageBarProps {
  used: number;
  quota: number;
}
/**
 * A simple horizontal usage bar.
 * Renders a violet gradient fill proportional to used / quota.
 */
export default function UsageBar({ used, quota }: UsageBarProps) {
  const safeQuota = quota > 0 ? quota : 1;
  const ratio = Math.min(1, Math.max(0, used / safeQuota));
  const percent = Math.round(ratio * 100);
  return (
    <div className="w-full">
      <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#8c27e7] to-[#b458e7] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-0.5 text-[10px] text-foreground/40 text-right font-mono">
        {percent}%
      </div>
    </div>
  );
}
