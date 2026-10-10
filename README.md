<!-- README.md -->
<p align="center">
    <img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/logo_4_debg.png" alt="SoulCut Logo" width="120" height="120">
</p>

<h1 align="center">SoulCut</h1>

<h4 align="center">
🎬A non-linear video editing system that injects soul into every frame.
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
</p>

<p align="center">
<a href="./README_zh-CN.md">简体中文</a> | <a href="./README.md">English</a>
</p>

## Why SoulCut

Most existing video editing tools are built on architectures from over a decade ago. C++ NLE kernels are performant, but memory safety is maintained through careful coding rather than language guarantees, and every new capability is constrained by legacy baggage. The alternative path is cloud-first — feature-rich, but your assets, your projects, and your creative process all default to passing through someone else's servers. Go offline, and work stops.

SoulCut takes a different path.

The underlying NLE engine is rewritten from scratch in Rust — not patched onto an old architecture, but rebuilt so memory safety is enforced at the language level. That means fewer crashes, more stable long editing sessions, and an architecture that can keep stacking new capabilities, instead of bypassing three legacy issues for every new feature.

SoulCut is also **offline-first**. Assets stay local, projects stay local, editing stays local. Without a network connection, you can still go from import to export. AI is a layer on top of the local engine, not a dependency that binds the entire workflow to the cloud.

What SoulCut wants to validate is simple: **if interaction shifts from "learning how the tool works" to "describing what you want to accomplish," does editing become different?**

So its core is not "AI edits for you." It lets you describe editing intent in natural language, with the LLM processing selected clips and aligning rhythm across all clips. It is also a complete multi-track timeline editor, retaining the ability to fine-tune manually.

## What SoulCut Is

A free, locally-running desktop non-linear audio/video editor, supporting Windows / macOS / Linux.

SoulCut's underlying engine is a **fully self-developed NLE (non-linear editing) engine**. This means that even without any AI features, you can manually complete multi-track arrangement, trimming, transitions, color grading, audio processing, and export — just like in traditional editing software. AI is an interaction layer on top of this engine, not a replacement.

## ✨ Features

- 🎬 **Conversational Editing** — Describe your intent in natural language. The LLM processes selected clips and aligns rhythm across all clips.
- 🖐️ **Full Manual Editing** — Self-developed NLE engine. Complete every editing step manually without relying on AI.
- 🎞️ **Multi-Track Timeline** — Multi-track editing with real-time preview, multi-camera rendering, and precise time alignment.
- 🌀 **Linear Animation** — Three linear animation modes: anchor, time, and keyword. For camera motion, transitions, and asset movement control.
- 🧩 **Multimodal Asset Generation** — Generate video, audio, and images directly into the timeline. No cross-tool import/export.
- 🎨 **Filters · Effects · Camera Motion · Transitions** — 15 filters, 78 visual effects, 15 camera motions, 26 transitions.
- 📤 **One-Click Export** — Multiple resolutions and platform presets for fast delivery.

## 📥 Download

Get the latest version from the [Releases page](https://github.com/0xhappyboy/SoulCut/releases/latest).

| Platform | Download                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Windows  | [SoulCut_windows_x86_64.msi](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_windows_x86_64.msi) <br> [SoulCut_windows_x86_64.exe](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_windows_x86_64.exe)                                                                                                                            |
| macOS    | [SoulCut_macos_x86_64.dmg](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_macos_x86_64.dmg) <br> [SoulCut_macos_aarch64.dmg](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_macos_aarch64.dmg)                                                                                                                                  |
| Linux    | [SoulCut_linux_x86_64.AppImage](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_linux_x86_64.AppImage) <br> [SoulCut_linux_x86_64.deb](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_linux_x86_64.deb) <br> [SoulCut_linux_x86_64.rpm](https://github.com/0xhappyboy/SoulCut/releases/latest/download/SoulCut_linux_x86_64.rpm) |

> 💡 **Note:** Auto-update detection relies on the installer filename. Please download the package that exactly matches your platform. Windows → `.msi`, macOS → `.dmg`, Linux → `.deb`.

## 🖼️ Demo

### LLM media file generation capabilities.

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/llm-media-generation.gif" />

### LLM Control of Timelines

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/llm_alignment_track_blocks.gif" />

### Multi-Track Editing

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/multi-track-editing.gif" />

### Filters & Effects

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/filters-effects.gif" />

### Transitions

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/transitions.gif" />

### Camera Motion

<img src="https://raw.githubusercontent.com/0xhappyboy/SoulCut/main/assets/demo/camera-motion.gif" />

## 🏛️ Ecosystem & Organization

SoulCut works together with the **[SoulCutHQ](https://github.com/SoulCutHQ)** organization, which exists to help users create and share more assets within SoulCut.

**[SoulCut Community Assets](https://github.com/SoulCutHQ)** is the community-driven asset hub of this organization, where open-source contributors create and share creative assets — stickers, audio, SFX, and raw materials — so that users can do more inside the SoulCut editing system.

```text
SoulCutHQ (Organization)
│
├── SoulCut Community Assets   ← the community creates assets here
│   ├── Sticker Library
│   ├── Audio Library
│   ├── SFX Library
└───└── Material Library
```

- **SoulCutHQ** — the organization behind the ecosystem.
- **SoulCut Community Assets** — where the open-source community creates assets for SoulCut.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the **AGPL-3.0 License**. See the [LICENSE](https://github.com/HippoxHQ/hippox-desktop/blob/main/LICENSE) file for details.

---

<p align="center">
<b>Shifting interaction from "learning how tools work" to "describing what you want to accomplish."</b>
</p>

<p align="center">
⭐ If you like SoulCut, give it a star — it means a lot to us!
</p>
