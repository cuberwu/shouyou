# 首右辅助码官网（Next.js 静态站点）

本项目为首右辅助码官网静态站点，支持 GitHub Pages 自动部署。

## 本地开发

```bash
cd site
npm install
npm run dev
```

## 构建导出（GitHub Pages）

```bash
cd site
npm run build
```

构建产物位于 `site/out`，GitHub Actions 会自动部署。

## 目录说明

```
site/
├── src/app/             # 页面
├── src/components/      # 组件
├── public/              # 静态资源
└── next.config.ts       # 静态导出配置
```

## 环境变量

- `NEXT_PUBLIC_BASE_PATH`：GitHub Pages 的仓库路径（例如 `/shouyou`）
- `NEXT_PUBLIC_SITE_URL`：站点完整 URL（例如 `https://username.github.io/shouyou`）
