"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useI18n } from "@/app/providers/I18nProvider";
import Sidebar, { DashboardTab } from "./components/Sidebar";
import UserCard from "./components/UserCard";
import VideoEditorPanel from "./components/VideoEditorPanel";
import MembershipPanel from "./components/MembershipPanel";
import PayPanel from "./components/PayPanel";
import { ApiError, userApi, UserBo } from "../api/user";
import { getToken } from "../api/auth";
import LLMPanel from "./components/LLMPanel";
/** Read the initial tab from the URL query (?tab=xxx). */
function readTabFromUrl(): DashboardTab {
  if (typeof window === "undefined") return "video-editor";
  const params = new URLSearchParams(window.location.search);
  const t = params.get("tab");
  if (
    t === "video-editor" ||
    t === "llm" ||
    t === "membership" ||
    t === "pay"
  ) {
    return t;
  }
  return "video-editor";
}
export default function DashboardPage() {
  const router = useRouter();
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const [user, setUser] = useState<UserBo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("video-editor");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab(readTabFromUrl());
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    userApi
      .me()
      .then((u) => setUser(u))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login");
        } else {
          setError(isCn ? "加载失败" : "Failed to load");
        }
      })
      .finally(() => setLoading(false));
  }, [router, isCn]);
  if (loading) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-foreground/50" />
        </div>
        <Footer />
      </div>
    );
  }
  if (error || !user) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs text-red-500">
            {error || (isCn ? "未登录" : "Not logged in")}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar
          active={activeTab}
          onChange={setActiveTab}
          isCn={isCn}
          user={user}
        />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-5 py-5">
            <UserCard user={user} isCn={isCn} />
            {activeTab === "video-editor" && (
              <VideoEditorPanel user={user} isCn={isCn} />
            )}
            {activeTab === "llm" && <LLMPanel isCn={isCn} />}
            {activeTab === "membership" && <MembershipPanel isCn={isCn} />}
            {activeTab === "pay" && <PayPanel isCn={isCn} />}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
