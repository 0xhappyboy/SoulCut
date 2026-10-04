"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useI18n } from "@/app/providers/I18nProvider";
import { getToken } from "../api/auth";
import { ApiError } from "../api/client";
import { UserBo, userApi } from "../api/user";
export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const [user, setUser] = useState<UserBo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Editable form state.
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signature, setSignature] = useState("");
  const [gender, setGender] = useState(0);
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    userApi
      .me()
      .then((u) => {
        setUser(u);
        setNickname(u.nickname ?? "");
        setEmail(u.email ?? "");
        setPhone(u.phone ?? "");
        setSignature(u.signature ?? "");
        setGender(u.gender ?? 0);
        setBirthday(u.birthday ?? "");
        setCountry(u.country ?? "");
        setProvince(u.province ?? "");
        setCity(u.city ?? "");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login");
        } else {
          setError(isCn ? "加载失败" : "Failed to load");
        }
      })
      .finally(() => setLoading(false));
  }, [router, isCn]);
  const handleSave = async () => {
    if (!user) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await userApi.update(user.id, {
        nickname: nickname || undefined,
        email: email || undefined,
        phone: phone || undefined,
        signature: signature || undefined,
        gender,
        birthday: birthday || undefined,
        country: country || undefined,
        province: province || undefined,
        city: city || undefined,
      });
      // Reload from backend to reflect the latest values.
      const fresh = await userApi.me();
      setUser(fresh);
      setSuccess(isCn ? "保存成功" : "Saved");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : isCn
            ? "保存失败"
            : "Save failed",
      );
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-foreground/50" />
        </div>
        <Footer />
      </div>
    );
  }
  if (!user) return null;
  const initial = (user.nickname || user.username || "?")
    .trim()
    .charAt(0)
    .toUpperCase();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Title */}
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {isCn ? "个人资料" : "Profile"}
          </h1>
          <p className="text-sm text-foreground/50 mb-8">
            {isCn ? "管理你的账号信息" : "Manage your account information"}
          </p>
          {/* Avatar row */}
          <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#8c27e7] to-[#b458e7] text-white text-xl font-semibold flex items-center justify-center shrink-0">
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
            <div>
              <div className="text-base font-medium text-foreground">
                {user.nickname || user.username}
              </div>
              <div className="text-xs text-foreground/50 font-mono">
                ID {user.id}
              </div>
            </div>
          </div>
          {/* Form */}
          <div className="space-y-5">
            {/* Username (readonly) */}
            <Field
              label={isCn ? "用户名" : "Username"}
              icon={<UserIcon className="w-4 h-4" />}
              readonly
            >
              <input
                type="text"
                value={user.username}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-border bg-muted/40 text-foreground/60 text-sm outline-none cursor-not-allowed"
              />
            </Field>
            {/* Nickname */}
            <Field label={isCn ? "昵称" : "Nickname"}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={isCn ? "你的昵称" : "Your nickname"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </Field>
            {/* Email */}
            <Field
              label={isCn ? "邮箱" : "Email"}
              icon={<Mail className="w-4 h-4" />}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </Field>
            {/* Phone */}
            <Field
              label={isCn ? "手机号" : "Phone"}
              icon={<Phone className="w-4 h-4" />}
            >
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isCn ? "手机号" : "Phone number"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
              />
            </Field>
            {/* Gender */}
            <Field label={isCn ? "性别" : "Gender"}>
              <select
                value={gender}
                onChange={(e) => setGender(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors cursor-pointer"
              >
                <option value={0}>{isCn ? "未知" : "Unknown"}</option>
                <option value={1}>{isCn ? "男" : "Male"}</option>
                <option value={2}>{isCn ? "女" : "Female"}</option>
                <option value={3}>{isCn ? "其他" : "Other"}</option>
              </select>
            </Field>
            {/* Birthday */}
            <Field
              label={isCn ? "生日" : "Birthday"}
              icon={<Calendar className="w-4 h-4" />}
            >
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors cursor-pointer"
              />
            </Field>
            {/* Region */}
            <Field
              label={isCn ? "地区" : "Region"}
              icon={<MapPin className="w-4 h-4" />}
            >
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder={isCn ? "国家" : "Country"}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
                />
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder={isCn ? "省" : "Province"}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={isCn ? "城市" : "City"}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors"
                />
              </div>
            </Field>
            {/* Signature */}
            <Field label={isCn ? "个性签名" : "Signature"}>
              <textarea
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                rows={3}
                placeholder={isCn ? "介绍一下自己" : "Say something about you"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-[#8c27e7] transition-colors resize-none"
              />
            </Field>
          </div>
          {/* Messages */}
          {error && (
            <div className="mt-6 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              {success}
            </div>
          )}
          {/* Submit */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full py-2.5 rounded-lg text-white font-medium text-sm bg-gradient-to-r from-[#8c27e7] to-[#b458e7] shadow-lg shadow-[#8c27e7]/20 hover:shadow-[#8c27e7]/35 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving
              ? isCn
                ? "保存中..."
                : "Saving..."
              : isCn
                ? "保存"
                : "Save"}
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}
/** Small labelled field wrapper. */
function Field({
  label,
  icon,
  readonly,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  readonly?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 mb-1.5">
        {icon}
        {label}
        {readonly && (
          <span className="text-xs text-foreground/40 ml-1">(read-only)</span>
        )}
      </label>
      {children}
    </div>
  );
}
