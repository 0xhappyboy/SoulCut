"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useI18n } from "@/app/providers/I18nProvider";
import { ApiError } from "next/dist/server/api-utils";
import { userApi } from "../api/user";
export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    if (username.length < 3) {
      setError(
        isCn ? "用户名至少 3 个字符" : "Username must be at least 3 characters",
      );
      return;
    }
    if (password.length < 6) {
      setError(
        isCn ? "密码至少 6 位" : "Password must be at least 6 characters",
      );
      return;
    }
    if (password !== confirmPwd) {
      setError(isCn ? "两次输入的密码不一致" : "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await userApi.register({
        username,
        password,
        nickname: nickname || undefined,
        email: email || undefined,
        phone: phone || undefined,
      });
      // Success: redirect to login.
      router.push("/login");
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
            {isCn ? "注册" : "Sign Up"}
          </h1>
          <p className="text-sm text-foreground/50 mb-8 text-center">
            {isCn ? "创建你的剪灵账号" : "Create your SoulCut account"}
          </p>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "用户名" : "Username"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isCn ? "3-64 个字符" : "3-64 characters"}
                autoComplete="username"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "密码" : "Password"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isCn ? "至少 6 位" : "At least 6 characters"}
                  autoComplete="new-password"
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
            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "确认密码" : "Confirm Password"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={showPwd ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder={isCn ? "再次输入密码" : "Re-enter your password"}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </div>
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "昵称" : "Nickname"}{" "}
                <span className="text-foreground/40 text-xs">
                  ({isCn ? "选填" : "optional"})
                </span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={
                  isCn ? "你希望别人怎么称呼你" : "How should we call you"
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "邮箱" : "Email"}{" "}
                <span className="text-foreground/40 text-xs">
                  ({isCn ? "选填" : "optional"})
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {isCn ? "手机号" : "Phone"}{" "}
                <span className="text-foreground/40 text-xs">
                  ({isCn ? "选填" : "optional"})
                </span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isCn ? "手机号" : "Phone number"}
                autoComplete="tel"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
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
                  ? "注册中..."
                  : "Signing up..."
                : isCn
                  ? "注册"
                  : "Sign Up"}
            </button>
          </form>
          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-foreground/50">
            {isCn ? "已有账号？" : "Already have an account?"}{" "}
            <a
              href="/login"
              className="text-[#8c27e7] hover:text-[#b458e7] hover:underline font-medium transition-colors"
            >
              {isCn ? "立即登录" : "Login"}
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
