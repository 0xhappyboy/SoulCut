/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useI18n } from "../providers/I18nProvider";
import { useState, useEffect } from "react";
import cnMessages from "@/messages/cn.json";
import enMessages from "@/messages/en.json";
const reposData = {
  cn: [
    {
      id: 1,
      name: "0xhappyboy/hippox",
      displayName: "hippox (核心引擎)",
      description: "可靠的AI运行时和技能编排引擎，具有自主决策能力",
      stargazers_count: 2,
      forks_count: 0,
      html_url: "https://github.com/0xhappyboy/hippox",
    },
    {
      id: 2,
      name: "HippoxHQ/hippox-desktop",
      displayName: "hippox-desktop (桌面端)",
      description: "操作系统桌面应用程序，帮助您更好地操作计算机",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/HippoxHQ/hippox-desktop",
    },
    {
      id: 3,
      name: "HippoxHQ/hippox-cli",
      displayName: "hippox-cli (命令行工具)",
      description: "终端应用程序，允许您使用命令行操作hippox",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/HippoxHQ/hippox-cli",
    },
    {
      id: 4,
      name: "HippoxHQ/hippox-terminal",
      displayName: "hippox-terminal (TUI界面)",
      description: "基于TUI的终端交互式对话界面",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/HippoxHQ/hippox-terminal",
    },
  ],
  en: [
    {
      id: 1,
      name: "0xhappyboy/hippox",
      displayName: "hippox (Core Engine)",
      description:
        "Reliable AI runtime and skills orchestration engine with autonomous decision-making",
      stargazers_count: 2,
      forks_count: 0,
      html_url: "https://github.com/0xhappyboy/hippox",
    },
    {
      id: 2,
      name: "HippoxHQ/hippox-desktop",
      displayName: "hippox-desktop (Desktop)",
      description:
        "Operating system desktop application that helps you operate your computer better",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/HippoxHQ/hippox-desktop",
    },
    {
      id: 3,
      name: "HippoxHQ/hippox-cli",
      displayName: "hippox-cli (CLI Tool)",
      description:
        "Terminal application that allows you to operate hippox using the command line",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/HippoxHQ/hippox-cli",
    },
    {
      id: 4,
      name: "HippoxHQ/hippox-terminal",
      displayName: "hippox-terminal (TUI Interface)",
      description:
        "Interactive dialog interface that runs on the terminal, based on TUI",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/HippoxHQ/hippox-terminal",
    },
  ],
};
// cn: { id: 5, name: 'owner/repo', displayName: '中文名称', description: '中文描述', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/owner/repo' },
// en: { id: 5, name: 'owner/repo', displayName: 'English Name', description: 'English description', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/owner/repo' },
interface SatelliteProjectsProps {
  onSelectRepo: (repoData: (typeof reposData.cn)[0]) => void;
  selectedRepoName?: string;
}
export default function SatelliteProjects({
  onSelectRepo,
  selectedRepoName,
}: SatelliteProjectsProps) {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const t = isCn ? cnMessages.HomePage : enMessages.HomePage;
  const repos = isCn ? reposData.cn : reposData.en;
  useEffect(() => {
    if (repos.length > 0 && !selectedRepoName) {
      onSelectRepo(repos[0]);
    }
  }, [locale]);
  const handleRepoClick = (repo: (typeof reposData.cn)[0]) => {
    onSelectRepo(repo);
  };
  const handleGoToGithub = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };
  const scrollbarStyles = `
    .projects-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .projects-scrollbar::-webkit-scrollbar-track {
      background: var(--muted);
      border-radius: 10px;
    }
    .projects-scrollbar::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 10px;
    }
    .projects-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--muted-foreground);
    }
  `;
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-3">
      <style>{scrollbarStyles}</style>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          {t.projectsTitle}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {repos.length} repos
        </span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto projects-scrollbar pr-1">
        {repos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => handleRepoClick(repo)}
            className={`p-2 rounded transition-all cursor-pointer ${
              selectedRepoName === repo.name
                ? "bg-muted border border-border"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    {repo.displayName}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                  {repo.description}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex gap-2 text-[9px] text-muted-foreground">
                    <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                    <span>🔱 {repo.forks_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => handleGoToGithub(e, repo.html_url)}
                className="flex-shrink-0 px-2 py-1 text-[9px] bg-muted border border-border rounded hover:border-muted-foreground transition-colors"
                title={isCn ? "前往 GitHub 仓库" : "Go to GitHub repository"}
              >
                GitHub ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
