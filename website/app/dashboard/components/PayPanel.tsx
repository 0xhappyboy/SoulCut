"use client";
import { useState } from "react";
import { Coins, Check, QrCode, ShieldCheck } from "lucide-react";
interface PayPanelProps {
  isCn: boolean;
}
interface Preset {
  id: string;
  price: number;
  points: number;
  bonus: number;
  popular?: boolean;
}
const PRESETS: Preset[] = [
  { id: "p10", price: 10, points: 100, bonus: 0 },
  { id: "p50", price: 50, points: 520, bonus: 20 },
  { id: "p100", price: 100, points: 1100, bonus: 100, popular: true },
  { id: "p200", price: 200, points: 2300, bonus: 300 },
  { id: "p500", price: 500, points: 6000, bonus: 1000 },
  { id: "p1000", price: 1000, points: 13000, bonus: 3000 },
];
type PayMethod = "wechat" | "alipay";
export default function PayPanel({ isCn }: PayPanelProps) {
  const [selected, setSelected] = useState<Preset>(PRESETS[2]);
  const [method, setMethod] = useState<PayMethod>("wechat");
  const points = 0;
  const fmt = (n: number) => n.toLocaleString();
  return (
    <div>
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <Coins className="w-4 h-4 text-[#8c27e7]" />
        <h2 className="text-sm font-semibold tracking-tight">
          {isCn ? "充值积分" : "Top Up Points"}
        </h2>
      </div>
      <p className="text-xs text-foreground/50 mb-4">
        {isCn
          ? "积分用于调用 AI 模型与高级功能，充值后立即到账。"
          : "Points are used for AI models and premium features. Credited instantly."}
      </p>
      {/* Current balance */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border bg-card mb-4">
        <div className="flex items-center gap-1.5 text-xs text-foreground/60">
          <Coins className="w-3.5 h-3.5 text-[#8c27e7]" />
          {isCn ? "当前积分" : "Current points"}
        </div>
        <div className="text-base font-bold tabular-nums">{fmt(points)}</div>
      </div>
      {/* Step 1 */}
      <h3 className="text-xs font-semibold text-foreground/80 mb-2">
        {isCn ? "1. 选择金额" : "1. Choose an amount"}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {PRESETS.map((p) => {
          const isSelected = p.id === selected.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className={`relative text-left px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[#8c27e7] bg-[#8c27e7]/5 shadow-sm shadow-[#8c27e7]/10"
                  : "border-border bg-card hover:border-[#8c27e7]/40"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-medium text-white bg-gradient-to-r from-[#8c27e7] to-[#b458e7] rounded-full">
                  {isCn ? "热门" : "Popular"}
                </span>
              )}
              <div className="flex items-baseline gap-0.5 mb-0.5">
                <span className="text-[10px] text-foreground/60">¥</span>
                <span className="text-base font-bold text-foreground">
                  {p.price}
                </span>
              </div>
              <div className="text-[10px] text-foreground/50">
                <span className="font-medium text-[#8c27e7]">
                  {fmt(p.points)}
                </span>{" "}
                {isCn ? "积分" : "pts"}
                {p.bonus > 0 && (
                  <span className="ml-1 text-[9px] text-green-600">
                    +{fmt(p.bonus)}
                  </span>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8c27e7] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Step 2 */}
      <h3 className="text-xs font-semibold text-foreground/80 mb-2">
        {isCn ? "2. 选择支付方式" : "2. Choose payment method"}
      </h3>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <button
          type="button"
          onClick={() => setMethod("wechat")}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            method === "wechat"
              ? "border-[#09bb07] bg-[#09bb07]/5"
              : "border-border bg-card hover:border-[#09bb07]/40"
          }`}
        >
          <div className="w-7 h-7 rounded-md bg-[#09bb07] flex items-center justify-center text-white text-xs font-bold">
            微
          </div>
          <div className="text-left flex-1">
            <div className="text-xs font-medium">
              {isCn ? "微信支付" : "WeChat Pay"}
            </div>
            <div className="text-[10px] text-foreground/50">
              {isCn ? "扫码支付" : "QR code"}
            </div>
          </div>
          {method === "wechat" && (
            <Check className="w-3.5 h-3.5 text-[#09bb07]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setMethod("alipay")}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            method === "alipay"
              ? "border-[#1677ff] bg-[#1677ff]/5"
              : "border-border bg-card hover:border-[#1677ff]/40"
          }`}
        >
          <div className="w-7 h-7 rounded-md bg-[#1677ff] flex items-center justify-center text-white text-xs font-bold">
            支
          </div>
          <div className="text-left flex-1">
            <div className="text-xs font-medium">
              {isCn ? "支付宝" : "Alipay"}
            </div>
            <div className="text-[10px] text-foreground/50">
              {isCn ? "扫码支付" : "QR code"}
            </div>
          </div>
          {method === "alipay" && (
            <Check className="w-3.5 h-3.5 text-[#1677ff]" />
          )}
        </button>
      </div>
      {/* Step 3 */}
      <h3 className="text-xs font-semibold text-foreground/80 mb-2">
        {isCn ? "3. 扫码支付" : "3. Scan to pay"}
      </h3>
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-foreground/60">
            {isCn ? "应付金额" : "Amount"}
          </div>
          <div className="text-lg font-bold text-foreground">
            ¥{selected.price}
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-foreground/60">
            {isCn ? "将获得积分" : "Points to receive"}
          </div>
          <div className="text-sm font-semibold text-[#8c27e7] tabular-nums">
            +{fmt(selected.points)}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center mb-2">
            <div className="text-center">
              <QrCode className="w-9 h-9 mx-auto text-foreground/20 mb-1.5" />
              <div className="text-[10px] text-foreground/40">
                {isCn ? "二维码生成中" : "Generating QR code"}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-foreground/50 text-center">
            {isCn
              ? `请使用${method === "wechat" ? "微信" : "支付宝"}扫码支付`
              : `Scan with ${method === "wechat" ? "WeChat" : "Alipay"} to pay`}
          </div>
        </div>
      </div>
      {/* Note */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg border border-border bg-muted/30">
        <ShieldCheck className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
        <div className="text-[10px] text-foreground/60 leading-relaxed">
          {isCn
            ? "充值后积分立即到账。若支付失败或未到账，请截图支付凭证联系客服。积分仅用于平台内消费，不支持提现。"
            : "Points are credited immediately. If a payment fails or is not reflected, contact support with a screenshot. Points are non-refundable and cannot be withdrawn."}
        </div>
      </div>
    </div>
  );
}
