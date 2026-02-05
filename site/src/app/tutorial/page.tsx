const sections = [
  {
    title: "导读",
    desc: "了解首右辅助码的设计目标与学习建议。",
    items: ["设计理念与优势", "适用人群", "学习时间预估"],
  },
  {
    title: "双拼（音）",
    desc: "掌握声母、韵母键位与零声母规则。",
    items: ["键位图", "零声母规则", "打字演示"],
  },
  {
    title: "双形（形）",
    desc: "理解字根分布与拆分逻辑，建立编码习惯。",
    items: ["字根表", "拆分规则", "构词规则"],
  },
  {
    title: "应用",
    desc: "简码、符号与不同平台配置方法。",
    items: ["简码说明", "符号输入", "Windows / Android"],
  },
  {
    title: "常见问题",
    desc: "汇总高频问题与排查方法。",
    items: ["重码处理", "词库维护", "快捷键"],
  },
];

export default function TutorialPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <section className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)]">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            入门教程
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            系统化学习首右辅助码
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            从双拼入门到字根拆分，再到简码与符号应用，配合练习建议快速建立高效输入节奏。
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)]"
          >
            <div className="text-lg font-semibold text-slate-900">
              {section.title}
            </div>
            <p className="mt-2 text-sm text-slate-600">{section.desc}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
