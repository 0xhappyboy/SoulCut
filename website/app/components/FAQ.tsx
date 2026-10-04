"use client";
import { useI18n } from "../providers/I18nProvider";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  questionZh: string;
  answer: string;
  answerZh: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is SoulCut?",
    questionZh: "剪灵是什么？",
    answer:
      "SoulCut is a nonlinear video editing software that breathes soul into every frame. Describe your intent in natural language and let AI handle rough cuts, fine cuts, and rhythm alignment — editing becomes a conversation, not a manual grind.",
    answerZh:
      "剪灵是一款非线性视频剪辑软件，为每一帧注入灵魂。你只需用自然语言描述意图，AI 便会完成粗剪、精剪与节奏对齐 —— 剪辑不再是繁琐的手工活，而是一场对话。",
  },
  {
    id: "2",
    question: "Is SoulCut free to use?",
    questionZh: "剪灵可以免费使用吗？",
    answer:
      "Yes, SoulCut is completely free to use. It is a closed-source product, but you can download it and use all its features at no cost. The source code is not publicly available.",
    answerZh:
      "是的，剪灵可以完全免费使用。它是一款闭源产品，但你可以免费下载并使用其全部功能。源代码不对外公开。",
  },
  {
    id: "3",
    question: "What editing features does SoulCut offer?",
    questionZh: "剪灵提供哪些剪辑功能？",
    answer:
      "SoulCut offers a multi-track timeline with real-time preview, 15 filters, 78 visual effects, 15 camera motions, and 26 transitions. It also includes audio processing such as noise reduction, music recommendation, beat-synced editing, and auto volume balancing.",
    answerZh:
      "剪灵提供多轨时间线、实时预览、15 种滤镜、78 种视觉特效、15 种运镜和 26 种转场。同时具备音频处理能力，包括降噪、音乐推荐、卡点剪辑和自动音量平衡。",
  },
  {
    id: "4",
    question: "What is the SoulCut Engine?",
    questionZh: "什么是剪灵引擎？",
    answer:
      "The SoulCut Engine is the intelligent editing core of the software. It supports ReAct / Batch / Chain / PlanAndExecute workflows, allowing the AI to plan and execute complex editing tasks step by step.",
    answerZh:
      "剪灵引擎是软件的智能剪辑核心，支持 ReAct / Batch / Chain / PlanAndExecute 工作流，让 AI 能够逐步规划并执行复杂的剪辑任务。",
  },
  {
    id: "5",
    question: "What operating systems are supported?",
    questionZh: "支持哪些操作系统？",
    answer:
      "SoulCut runs on Windows 10+, macOS 12+, and major Linux distributions (Ubuntu 20.04+, Fedora 38+, Arch Linux).",
    answerZh:
      "剪灵支持 Windows 10+、macOS 12+ 和主流 Linux 发行版（Ubuntu 20.04+、Fedora 38+、Arch Linux）。",
  },
  {
    id: "6",
    question: "How do I install SoulCut?",
    questionZh: "如何安装剪灵？",
    answer:
      "Download the installer for your platform from the Downloads section above, run it, and follow the installation wizard. Note that auto-update detection relies on the installer filename, so please download the package that exactly matches your platform — Windows → .msi, macOS → .dmg, Linux → .deb.",
    answerZh:
      "从上方下载区域下载对应平台的安装包，运行并按照安装向导操作即可。请注意，自动更新检测依赖安装包文件名，因此请下载与你的平台完全匹配的安装包 —— Windows → .msi，macOS → .dmg，Linux → .deb。",
  },
];

export default function FAQ() {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const [openId, setOpenId] = useState<string | null>("1");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full py-5">
      <div className="mx-auto">
        {/* Header - consistent with VideoShowcase */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isCn ? "常见问题" : "FAQ"}
            </h2>
            <p className="text-xs text-foreground/40 mt-0.5">
              {isCn
                ? "关于剪灵的常见问题解答"
                : "Frequently asked questions about SoulCut"}
            </p>
          </div>
          {/* <div className="text-[10px] text-foreground/20 font-mono">
            {faqData.length} {isCn ? "个问题" : "questions"}
          </div> */}
        </div>

        {/* FAQ List */}
        <div className="border border-border/10 rounded-lg overflow-hidden divide-y divide-border/10">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-background/30 transition-colors duration-200 group"
                >
                  <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors">
                    {isCn ? item.questionZh : item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-foreground/20 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <div className="px-4 pb-3 text-[11px] text-foreground/50 leading-relaxed">
                    {isCn ? item.answerZh : item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
