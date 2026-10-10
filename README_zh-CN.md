<!-- README_zh-CN.md -->
<p align="center">
    <img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/logo_4_debg.png" alt="剪灵 Logo" width="120" height="120">
</p>

<h1 align="center">剪灵</h1>

<h4 align="center">
🎬 一款为每一帧画面注入灵魂的非线性视频编辑系统。
</h4>

<p align="center">
  <a href="https://github.com/0xhappyboy/SoulCut/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-AGPL3.0-d1d1f6.svg?style=flat&labelColor=1C2C2E&color=BEC5C9&logo=googledocs&label=license&logoColor=BEC5C9" alt="License"></a>
  <a href="https://github.com/0xhappyboy/SoulCut/stargazers"><img src="https://img.shields.io/github/stars/0xhappyboy/SoulCut.svg?style=flat&labelColor=1C2C2E&color=FFD700&logo=github&logoColor=white&label=stars" alt="GitHub stars"></a>
  <a href="https://github.com/0xhappyboy/SoulCut/issues"><img src="https://img.shields.io/github/issues/0xhappyboy/SoulCut.svg?style=flat&labelColor=1C2C2E&color=FF6B6B&logo=github&logoColor=white&label=issues" alt="GitHub issues"></a>
  <a href="https://github.com/0xhappyboy/SoulCut/network/members"><img src="https://img.shields.io/github/forks/0xhappyboy/SoulCut.svg?style=flat&labelColor=1C2C2E&color=42A5F5&logo=github&logoColor=white&label=forks" alt="GitHub forks"></a>
  <a href="https://github.com/0xhappyboy/SoulCut/releases"><img src="https://img.shields.io/github/v/release/0xhappyboy/SoulCut.svg?style=flat&labelColor=1C2C2E&color=9C27B0&logo=github&logoColor=white&label=latest%20release" alt="GitHub release"></a>
  <a href="https://github.com/0xhappyboy/SoulCut/releases"><img src="https://img.shields.io/github/downloads/0xhappyboy/SoulCut/total?style=flat&labelColor=1C2C2E&color=00C853&logo=github&logoColor=white&label=downloads" alt="GitHub downloads"></a>
  <a href="https://softpedia.com/get/Multimedia/SoulCut.shtml" target="_blank">
  <img src="https://img.shields.io/badge/Softpedia-Listed-blue.svg?style=flat&labelColor=1C2C2E&color=42A5F5&logo=softpedia&logoColor=white&label=softpedia" alt="Softpedia">
  </a>
  <br/>
  <a href="https://alternativeto.net/software/soulcut/about/?utm_source=badge&utm_medium=referral" target="_blank">
  <img src="https://alternativeto.net/static/badges/badge-compact-color.svg"
       alt="SoulCut | AlternativeTo"
       style="width:200px;height:54px;"
       width="200" height="54"
       style="width: 244px; height: 79px;" />
  </a>
    <a href="https://www.founder.best?ref=founderbest&utm_source=founder.best&utm_medium=referral" target="_blank" rel="noopener noreferrer"><img 
    alt="SoulCut | Funder.best"
       style="width:200px;height:54px;"
       width="200" height="54"
       style="width: 200px; height: 54px;" 
    src="https://www.founder.best/api/badge/featured/soulcut" alt="SoulCut - Featured on Founder.best" width="1195" height="390" loading="lazy" decoding="async" /></a>
</p>

<p align="center">
<a href="./README_zh-CN.md">简体中文</a> | <a href="./README.md">English</a>
</p>

## 为什么做剪灵

现有的视频剪辑工具，大多建立在十几年前的技术架构上。C++ 写成的 NLE 内核，性能确实够用，但代价是内存安全问题长期靠"小心编码"来维持，扩展新能力时处处受制于历史包袱。另一条路是云端优先——功能很全，但你的素材、你的项目、你的创作过程，都默认要经过别人的服务器。断网，就等于停工。

剪灵走的是另一条路。

底层 NLE 引擎用 Rust 从零重写，不是给旧架构打补丁，而是把内存安全问题在语言层面彻底杜绝。这意味着更少的崩溃、更稳的长时间剪辑、以及一套可以持续往上叠新能力的架构，而不是每加一个功能就要先绕开三个历史遗留问题。

同时，剪灵是**离线优先**的。素材在本地，项目在本地，剪辑在本地。不联网，照样从导入到导出走完全程。AI 能力是叠加在本地引擎之上的一层，而不是把整个创作流程绑在云上。

剪灵想验证的事情很简单：**如果把交互从"学习工具怎么用"变成"描述你想完成什么"，剪辑这件事会不会变得不一样。**

所以它的核心不是"AI 自动帮你剪"，而是让你用自然语言描述剪辑意图，由 LLM 对选中片段进行处理，并对所有片段做节奏对齐。同时它也是一个完整的多轨时间线编辑器，保留手动精修的能力。

## 剪灵是什么

一款免费、本地运行的桌面非线性音视频编辑器，支持 Windows / macOS / Linux。

剪灵的底层是一套**完整自研的 NLE（非线性编辑）引擎**。这意味着：即使完全不使用任何 AI 功能，你也可以像在传统剪辑软件里一样，手动完成多轨编排、裁剪、转场、调色、音频处理和导出。AI 是在这套引擎之上的一层交互方式，而不是替代品。

## ✨ 功能亮点

- 🎬 **对话式剪辑** — 用自然语言描述剪辑意图，由 LLM 对选中片段进行处理，并对所有片段做节奏对齐。
- 🖐️ **完整手动编辑** — 底层自研 NLE 引擎，不依赖 AI 也能手动完成全部剪辑流程。
- 🎞️ **多轨时间线** — 多轨道编辑，支持实时预览、多机位渲染与精准时间对齐。
- 🌀 **线性动画** — 支持锚点、时间、关键字三种线性动画，可用于运镜、转场与素材运动控制。
- 🧩 **多模态素材生成** — 视频、音频、图片直接生成并拖入时间线，无需跨工具导入导出。
- 🎨 **滤镜 · 特效 · 运镜 · 转场** — 15 种滤镜、78 种视觉特效、15 种运镜效果、26 种转场特效。
- 📤 **一键导出** — 支持多种分辨率与平台预设，快速交付成片。

## 📥 下载

前往 [Releases 页面](https://github.com/0xhappyboy/SoulCut/releases/latest) 获取最新版本。

| 平台    | 下载                                                                                                                                                                                                                                                                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Windows | [SoulCut_windows_x86_64.msi](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_windows_x86_64.msi) <br> [SoulCut_windows_x86_64.exe](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_windows_x86_64.exe)                                                                                                                            |
| macOS   | [SoulCut_macos_x86_64.dmg](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_macos_x86_64.dmg) <br> [SoulCut_macos_aarch64.dmg](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_macos_aarch64.dmg)                                                                                                                                  |
| Linux   | [SoulCut_linux_x86_64.AppImage](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_linux_x86_64.AppImage) <br> [SoulCut_linux_x86_64.deb](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_linux_x86_64.deb) <br> [SoulCut_linux_x86_64.rpm](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_linux_x86_64.rpm) |

> 💡 **提示：** 自动更新检测由安装包文件名驱动，请务必下载与你的平台完全匹配的安装包。Windows 请下载 `.msi`，macOS 请下载 `.dmg`，Linux 请下载 `.deb`。

## 🖼️ 演示

### AI多媒体文件生成能力.

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/llm-media-generation.gif" />

### LLM 对时间线的控制

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/llm_alignment_track_blocks.gif" />

### 多轨道编辑,多机位渲染

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/multi-track-editing.gif" />

### 滤镜与特效

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/filters-effects.gif" />

### 转场特效

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/transitions.gif" />

### 运镜效果

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/camera-motion.gif" />

## 🏛️ 生态与组织关系

SoulCut 与 **[SoulCutHQ](https://github.com/SoulCutHQ)** 组织协同合作，该组织的存在是为了帮助用户在 SoulCut 中创建和分享更多素材。

**[SoulCut 社区资源库](https://github.com/SoulCutHQ)** 是该组织下由社区驱动的素材中心，开源贡献者在这里创作并分享贴图、音频、音效和素材，让用户可以在 SoulCut 剪辑系统中创作更多内容。

```text
SoulCutHQ（组织）
│
├── SoulCut 社区资源库   ← 社区在这里创作素材
│   ├── 贴图库
│   ├── 音频库
│   ├── 音效库
└───└── 素材库
```

- **SoulCutHQ** — SoulCut生态组织。
- **SoulCut 社区资源库** — 开源社区为 SoulCut 创作素材的地方。

## 🤝 贡献

欢迎参与贡献！你可以提交 Issue 或 Pull Request。

## 📄 许可证

本项目基于 **AGPL-3.0 许可证** 开源，详情请参阅 [LICENSE](https://github.com/HippoxHQ/hippox-desktop/blob/main/LICENSE)。

---

<p align="center">
<b>把交互从"学习工具怎么用"转变为"描述你想完成什么"。</b>
</p>

<p align="center">
⭐ 如果你喜欢剪灵，欢迎点一个 Star，这对我们非常重要！
</p>
