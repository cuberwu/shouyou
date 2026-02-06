const upcomingModules = [
  {
    title: "拆分练习",
    description: "按字词拆分训练，强化拆分方向与编码稳定性。",
    status: "规划中",
  },
  {
    title: "词组练习",
    description: "高频词组专项演练，提升连续输入流畅度。",
    status: "规划中",
  },
];

export default function PracticeComingSoonGrid() {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">其他练习</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          预留扩展
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {upcomingModules.map((module) => (
          <article
            key={module.title}
            className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900">{module.title}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {module.status}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {module.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

