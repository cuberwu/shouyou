"use client";

import { useInView } from "@/hooks/useInView";

const timeline = [
  {
    year: "2024",
    title: "方案立项",
    desc: "整理主流形码方案与用户反馈，明确首右辅助码设计目标。",
  },
  {
    year: "2025",
    title: "版本迭代",
    desc: "发布普及版与 Plus 版双路线方案，完善教程体系与码表。",
  },
  {
    year: "2026",
    title: "生态建设",
    desc: "上线官网、查形工具与社区支持，推动用户共建。",
  },
];

export default function AboutPage() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: contentRef, isInView: contentInView } = useInView();

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
            关于我们
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            首右辅助码的故事
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            首右辅助码聚焦高效中文输入体验，通过普及版与 Plus 版双路线设计，为不同阶段用户提供匹配方案。
          </p>
        </div>
      </section>

      <section ref={contentRef} className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div
          className={`rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[var(--shadow-sm)] transition-all duration-600 ease-out ${
            contentInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-lg font-semibold text-slate-900">方案历程</h2>
          <div className="mt-6 space-y-4">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 ${
                  contentInView ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={
                  contentInView
                    ? { animationDelay: `${index * 150}ms` }
                    : undefined
                }
              >
                <div
                  className={`inline-flex items-center justify-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white ${
                    contentInView ? "animate-bounce-in" : "opacity-0"
                  }`}
                  style={
                    contentInView
                      ? { animationDelay: `${index * 150 + 100}ms` }
                      : undefined
                  }
                >
                  {item.year}
                </div>
                <div className="mt-1 text-base font-semibold text-slate-900">
                  {item.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div
            className={`rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[var(--shadow-sm)] ${
              contentInView ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={contentInView ? { animationDelay: "200ms" } : undefined}
          >
            <h2 className="text-lg font-semibold text-slate-900">作者信息</h2>
            <p className="mt-3 text-sm text-slate-600">
              由输入法爱好者与效率工具开发者联合打造，持续优化方案与教程内容。
            </p>
          </div>
          <div
            className={`rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[var(--shadow-sm)] ${
              contentInView ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={contentInView ? { animationDelay: "350ms" } : undefined}
          >
            <h2 className="text-lg font-semibold text-slate-900">联系方式</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>官方邮箱：hello@example.com</li>
              <li>QQ群：待创建</li>
              <li>GitHub：github.com</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
