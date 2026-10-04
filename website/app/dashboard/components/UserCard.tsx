"use client";
import { UserBo } from "@/app/api/user";
interface UserCardProps {
  user: UserBo;
  isCn: boolean;
}
export default function UserCard({ user, isCn }: UserCardProps) {
  const initial = (user.nickname || user.username || "?")
    .trim()
    .charAt(0)
    .toUpperCase();
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card mb-4">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#8c27e7] to-[#b458e7] text-white text-sm font-semibold flex items-center justify-center shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground truncate">
          {user.nickname || user.username}
        </div>
        <div className="text-xs text-foreground/50 truncate">
          @{user.username}
          {user.email ? ` · ${user.email}` : ""}
        </div>
      </div>
      <div className="hidden sm:block text-[10px] text-foreground/40 font-mono">
        ID {user.id}
      </div>
    </div>
  );
}
