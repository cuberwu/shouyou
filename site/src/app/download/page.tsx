"use client";

import { useInView } from "@/hooks/useInView";

const downloads = [
  {
    title: "Windows",
    desc: "支持 Windows 10/11",
    actions: ["下载 EXE", "下载 ZIP"],
  },
  {
    title: "macOS",
    desc: "支持 Apple Silicon / Intel",
    actions: ["下载 DMG", "下载 PKG"],
  },
  {
    title: "Linux",
    desc: "支持主流发行版",
    actions: ["下载 DEB", "下载 RPM"],
  },
  {
    title: "Android",
    desc: "移动端输入体验",
    actions: ["下载 APK"],
  },
  {
    title: "iOS",
    desc: "App Store 获取",
    actions: ["前往 App Store"],
  },
  {
    title: "码表文件",
    desc: "Rime / 小胖 / 多多",
    actions: ["下载 YAML", "下载 TXT"],
  },
];

export default function DownloadPage() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: gridRef, isInView: gridInView } = useInView();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <section
        ref={headerRef}
        className={`rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)] transition-all duration-600 ease-out ${
          headerInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            下载中心
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            多平台安装包与码表文件
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            提供 PC、移动端与输入法平台码表文件下载，支持离线教程。
          </p>
        </div>
      </section>

      <section ref={gridRef} className="mt-10 grid gap-6 md:grid-cols-2">
        {downloads.map((item, index) => (
          <div
            key={item.title}
            className={`rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)] ${
              gridInView ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={
              gridInView
                ? { animationDelay: `${index * 80}ms` }
                : undefined
            }
          >
            <div className="text-lg font-semibold text-slate-900">
              {item.title}
            </div>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {item.actions.map((action) => (
                <button
                  key={action}
                  className="cursor-pointer rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 transition-all duration-200 hover:border-emerald-400 hover:text-emerald-800 active:scale-[0.97]"
                  type="button"
                >
                  {action}
                </button>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-500">版本：v1.0.0 · 2026-02-04</div>
          </div>
        ))}
      </section>
    </main>
  );
}
