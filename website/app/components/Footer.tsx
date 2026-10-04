"use client";
import { useI18n } from "../providers/I18nProvider";
import { Send } from "lucide-react";
import { DiscordIcon } from "../icons/DiscordIcon";
import { MediumIcon } from "../icons/MediumIcon";
import { BlueskyIcon } from "../icons/BlueskyIcon";
import { GitHubIcon } from "../icons/GitHubIcon";
import { XIcon } from "../icons/XIcon";
import { FacebookIcon } from "../icons/FacebookIcon";
import { YouTubeIcon } from "../icons/YouTubeIcon";
import HuggingFaceIcon from "../icons/HuggingfaceIcon";
import { RedditIcon } from "../icons/RedditIcon";

export default function Footer() {
  const { locale } = useI18n();
  const isCn = locale === "cn";

  // Menu sections configuration
  // NOTE: Kept in the codebase but currently commented out in the render below.
  const menuSections = [
    {
      title: isCn ? "产品" : "Product",
      links: [
        { label: isCn ? "视频编辑" : "Video Editor", href: "#" },
        { label: isCn ? "3D 沙盒" : "3D Sandbox", href: "#" },
        { label: isCn ? "代码编辑" : "Code Editor", href: "#" },
        { label: isCn ? "金融分析" : "Finance", href: "#" },
      ],
    },
    {
      title: isCn ? "资源" : "Resources",
      links: [
        {
          label: isCn ? "文档" : "Documentation",
          href: "https://hippoxos-docs.vercel.app/en",
        },
        { label: "GitHub", href: "https://github.com/0xhappyboy/SoulCut" },
        { label: "Hugging Face", href: "https://huggingface.co/HippoxHQ" },
        { label: isCn ? "博客" : "Blog", href: "https://hippox.medium.com/" },
      ],
    },
    {
      title: isCn ? "社区" : "Community",
      links: [
        { label: "Discord", href: "https://discord.gg/R7hrkJRAdE" },
        { label: "X", href: "https://x.com/HippoxAI" },
        {
          label: "Bluesky",
          href: "https://bsky.app/profile/hippoxai.bsky.social",
        },
        { label: "Telegram", href: "https://t.me/hippoxAI" },
        { label: "YouTube", href: "https://www.youtube.com/@HippoxOS" },
        {
          label: "Facebook",
          href: "https://www.facebook.com/groups/5510896799134952",
        },
        { label: "Reddit", href: "https://www.reddit.com/r/Hippox/" },
      ],
    },
    {
      title: isCn ? "关于" : "About",
      links: [
        { label: isCn ? "关于我们" : "About Us", href: "#" },
        {
          label: isCn ? "开源协议" : "License",
          href: "https://github.com/0xhappyboy/SoulCut/blob/main/LICENSE",
        },
        { label: isCn ? "隐私政策" : "Privacy", href: "#" },
        { label: isCn ? "联系方式" : "Contact", href: "#" },
      ],
    },
  ];

  // All social links - kept for reference, currently commented out below.
  const socialLinks = [
    { icon: XIcon, href: "https://x.com/HippoxAI", label: "X" },
    {
      icon: YouTubeIcon,
      href: "https://www.youtube.com/@HippoxOS",
      label: "YouTube",
    },
    {
      icon: HuggingFaceIcon,
      href: "https://huggingface.co/HippoxHQ",
      label: "Hugging Face",
    },
    {
      icon: FacebookIcon,
      href: "https://www.facebook.com/groups/5510896799134952",
      label: "Facebook",
    },
    {
      icon: GitHubIcon,
      href: "https://github.com/0xhappyboy/SoulCut",
      label: "GitHub",
    },
    {
      icon: BlueskyIcon,
      href: "https://bsky.app/profile/hippoxai.bsky.social",
      label: "Bluesky",
    },
    {
      icon: MediumIcon,
      href: "https://hippox.medium.com/",
      label: "Medium",
      size: 16,
    },
    {
      icon: DiscordIcon,
      href: "https://discord.gg/R7hrkJRAdE",
      label: "Discord",
      size: 16,
    },
    { icon: Send, href: "https://t.me/hippoxAI", label: "Telegram" },
    {
      icon: RedditIcon,
      href: "https://www.reddit.com/r/Hippox/",
      label: "Reddit",
    },
  ];

  return (
    <footer className="w-full border-t border-border/40 bg-background/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/*
          Menu sections grid — hidden for now, code preserved for later use.
          Uncomment this block to bring the four-column menu back.
        */}
        {/*
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-foreground/50 hover:text-foreground/80 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        */}

        {/* Bottom section with social icons and copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border/20">
          {/*
            Social icons — hidden for now, code preserved for later use.
            Uncomment this block to bring the social icon row back.
          */}
          {/*
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/40 hover:text-foreground/70 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.size ? (
                    <Icon size={social.size} />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </a>
              );
            })}
          </div>
          */}

          {/* Copyright info — centered, single line, SoulCut related */}
          <div className="w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-foreground/35">
            <span className="font-medium tracking-wide">SoulCut</span>
            <span className="text-foreground/15">·</span>
            <a
              href="/UserAgreement"
              target="_blank"
              className="hover:text-foreground/60 transition-colors"
            >
              {isCn ? "用户协议" : "Terms of Use"}
            </a>
            <span className="text-foreground/15">·</span>
            <a
              href="/PrivacyPolicy"
              target="_blank"
              className="hover:text-foreground/60 transition-colors"
            >
              {isCn ? "隐私协议" : "Privacy Policy"}
            </a>
            <span className="text-foreground/15">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
