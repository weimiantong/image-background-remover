# Image Background Remover - MVP 需求文档

> 版本：v1.1 | 日期：2026-05-17 | 作者：weimiantong

---

## 1. 项目概述

### 1.1 一句话描述
一个在线图片去背景工具网站，用户上传图片后通过 AI API 一键去除背景，下载透明 PNG。

### 1.2 目标用户
- 设计师：快速抠图用于合成
- 电商卖家：商品图去背景
- 社交媒体创作者：制作头像/贴纸
- 普通用户：偶尔需要抠图

### 1.3 核心价值
免费、快速、无需注册、无需安装，打开即用。

---

## 2. 技术架构

```
用户浏览器
    │
    ├── 上传图片 ──→ Next.js API Route（/api/remove）
    │                      │
    │                      └──→ Remove.bg API（去背景）
    │                      │
    ├── 接收结果 ←─────────┘
    │
    └── 预览 & 下载
```

### 2.1 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 框架 | Next.js | 前端 + API Route 一体，无需独立后端 |
| 样式 | Tailwind CSS | 原子化 CSS，快速构建 UI |
| 语言 | TypeScript | 类型安全 |
| AI | Remove.bg API | 成熟的图片去背景服务 |
| 部署 | Vercel | 一键部署，免费额度充足 |
| 存储 | 无 | 图片仅内存流转，不落盘 |

### 2.2 为什么这样选

- **Next.js**：API Route 原生支持后端代理，无需额外部署 Cloudflare Worker；SSR 利于后续 SEO 和落地页优化
- **Tailwind CSS**：与 Next.js 生态深度集成，开发效率高
- **Vercel**：Next.js 官方平台，零配置部署，免费额度覆盖 MVP
- **Remove.bg API**：效果稳定，接入简单，按次计费（免费额度 50 次/月）
- **无存储**：图片在内存中处理完即销毁，保护用户隐私

---

## 3. MVP 功能清单

### 3.1 核心流程（P0 - 必须有）

| # | 功能 | 描述 |
|---|------|------|
| F1 | 上传图片 | 支持拖拽上传 + 点击选择，限制格式 PNG/JPG/WEBP，限制大小 10MB |
| F2 | 前端预览 | 上传后立即显示原图预览 |
| F3 | 一键去背景 | 点击按钮 → 调用 /api/remove → 返回去背景结果 |
| F4 | 结果预览 | 棋盘格背景显示透明区域，支持原图/结果切换对比 |
| F5 | 下载结果 | 一键下载透明 PNG 文件 |

### 3.2 辅助功能（P0）

| # | 功能 | 描述 |
|---|------|------|
| F6 | 处理状态 | 上传中 / 处理中 / 完成 / 失败，有明确的 loading 状态 |
| F7 | 错误提示 | 图片过大、格式不支持、API 失败等友好提示 |
| F8 | 重新上传 | 处理完成后可重新上传新图片 |

### 3.3 后续迭代（P1 - 不在 MVP）

- 手动修整（橡皮擦/恢复笔刷）
- 替换背景（纯色/渐变/自定义）
- 批量处理
- 多语言（中/英）
- 历史记录（本地存储）

---

## 4. 页面设计

### 4.1 页面结构（单页面）

```
┌──────────────────────────────────────────┐
│  🖼️ Image Background Remover            │
│  Free online tool to remove image bg     │
├──────────────────────────────────────────┤
│                                          │
│         ┌──────────────────┐             │
│         │                  │             │
│         │   拖拽上传区域    │             │
│         │   📁 点击或拖拽   │             │
│         │   支持 PNG/JPG    │             │
│         │                  │             │
│         └──────────────────┘             │
│                                          │
│    [上传后] ─────────────────────         │
│    ┌────────┐  ┌────────┐               │
│    │  原图   │  │  结果   │  ← 棋盘格背景 │
│    └────────┘  └────────┘               │
│                                          │
│    [ 🪄 Remove Background ]  ← 主按钮    │
│    [ 📥 Download PNG ]       ← 结果后显示 │
│    [ 🔄 Upload New ]         ← 重新上传   │
│                                          │
├──────────────────────────────────────────┤
│  Powered by Remove.bg · Free & Open Source│
└──────────────────────────────────────────┘
```

### 4.2 UI 要求

- **风格**：简洁现代，白底 + 一个强调色（蓝色系）
- **响应式**：支持桌面和移动端
- **上传区**：虚线边框，拖拽高亮
- **预览区**：棋盘格背景表示透明区域
- **按钮**：主按钮醒目，loading 时显示 spinner

---

## 5. API 设计

### 5.1 Next.js API Route

**POST `/api/remove`**

请求：
```
Content-Type: multipart/form-data
Body: image file (PNG/JPG/WEBP, max 10MB)
```

处理流程：
1. 接收前端上传的图片
2. 转发到 Remove.bg API
3. 返回去背景后的 PNG

响应：
- 成功：`200` + `Content-Type: image/png` + 二进制 PNG 数据
- 失败：`4xx/5xx` + `{ error: string, code: string }`

### 5.2 Remove.bg API 调用

```
POST https://api.remove.bg/v1.0/removebg
Headers:
  X-Api-Key: <API_KEY>        ← 存在 Vercel 环境变量中
Body: (multipart/form-data)
  image_file: <binary>
  size: auto
  output_format: auto
```

---

## 6. 项目结构

```
image-background-remover/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── globals.css         # Tailwind 入口样式
│   │   └── api/
│   │       └── remove/
│   │           └── route.ts    # 去背景 API 路由
│   ├── components/
│   │   ├── DropZone.tsx        # 拖拽上传区域
│   │   ├── ImagePreview.tsx    # 图片预览（棋盘格背景）
│   │   ├── CompareView.tsx     # 原图/结果对比
│   │   └── Header.tsx          # 页头
│   └── hooks/
│       └── useRemoveBg.ts      # 去背景 API 调用 hook
├── public/
│   └── favicon.svg
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. 关键约束

| 约束 | 说明 |
|------|------|
| 图片大小 | ≤ 10MB |
| 图片格式 | PNG / JPG / WEBP |
| 处理时长 | 依赖 Remove.bg，通常 2-5 秒 |
| API 免费额度 | 50 次/月（Remove.bg 免费计划） |
| 无存储 | 图片不落盘，内存处理完即销毁 |
| API Key 安全 | 仅在 API Route 服务端使用，前端不可见 |

---

## 8. 成功指标

| 指标 | 目标 |
|------|------|
| 页面加载 | < 2s |
| 去背景耗时 | < 5s（不含网络） |
| 操作步骤 | ≤ 3 步完成（上传 → 去背景 → 下载） |
| 移动端可用 | 核心流程在手机浏览器正常运行 |

---

## 9. 风险与应对

| 风险 | 应对 |
|------|------|
| Remove.bg 免费额度用完 | 前端显示友好提示，后续可切换付费计划或换 API |
| 大图片处理慢 | 前端压缩到合理尺寸再上传 |
| API Key 泄露 | 严格通过 API Route 服务端代理，不暴露到前端 |

---

## 10. 里程碑

| 阶段 | 内容 | 预计 |
|------|------|------|
| M1 | 项目初始化 + Next.js + Tailwind 基础 UI + 上传功能 | Day 1 |
| M2 | API Route + Remove.bg API 对接 | Day 1 |
| M3 | 预览对比 + 下载功能 | Day 1 |
| M4 | 错误处理 + 移动端适配 + Vercel 部署上线 | Day 2 |
