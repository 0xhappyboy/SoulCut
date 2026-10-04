"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useI18n } from "@/app/providers/I18nProvider";
import { ApiError } from "next/dist/server/api-utils";
import { setToken } from "../api/auth";
import { userApi } from "../api/user";
export default function LoginPage() {
  const router = useRouter();
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError(
        isCn ? "请输入用户名和密码" : "Please enter username and password",
      );
      return;
    }
    setLoading(true);
    try {
      // Call the API through the unified client.
      const resp = await userApi.login({ username, password });
      // Store only the JWT; everything else comes from /user/me.
      setToken(resp.token);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(isCn ? "网络错误，请重试" : "Network error, please retry");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 text-center">
            {isCn ? "登录" : "Login"}
          </h1>
          <p className="text-sm text-foreground/50 mb-8 text-center">
            {isCn ? "欢迎回到剪灵" : "Welcome back to SoulCut"}
          </p>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "用户名" : "Username"}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isCn ? "请输入用户名" : "Enter your username"}
                autoComplete="username"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "密码" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isCn ? "请输入密码" : "Enter your password"}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {/* Error */}
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {/* Submit — styled to match the Hero download button. */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-medium text-sm bg-gradient-to-r from-[#8c27e7] to-[#b458e7] shadow-lg shadow-[#8c27e7]/20 hover:shadow-[#8c27e7]/35 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading
                ? isCn
                  ? "登录中..."
                  : "Logging in..."
                : isCn
                  ? "登录"
                  : "Login"}
            </button>
          </form>
          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-foreground/50">
            {isCn ? "还没有账号？" : "Don't have an account?"}{" "}
            <a
              href="/register"
              className="text-[#8c27e7] hover:text-[#b458e7] hover:underline font-medium transition-colors"
            >
              {isCn ? "立即注册" : "Sign up"}
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
