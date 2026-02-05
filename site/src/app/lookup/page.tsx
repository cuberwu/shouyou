const lookupSteps = [
  "输入汉字或词组",
  "获取编码与拆分",
  "查看键位提示",
  "支持批量查询",
];

const demoResult = {
  word: "首",
  code: "shou uf",
  split: "丷 + 自",
  keys: "u + f",
  type: "常用字 / 可简码",
};

export default function LookupPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              查形工具
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              在线编码查询
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              输入汉字即可查看编码、拆分过程与键位提示，支持批量查询与特殊字标注。
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="lookup-page-input">
              输入汉字
            </label>
            <input
              id="lookup-page-input"
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-[var(--shadow-sm)] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="请输入汉字或词组，例如：首右"
            />
            <button
              className="cursor-pointer rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              type="button"
            >
              查询
            </button>
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-800">
            <div className="text-xs font-semibold text-emerald-700">示例结果</div>
            <div className="mt-3 space-y-2 text-xs text-emerald-700">
              <div>字：{demoResult.word}</div>
              <div>编码：{demoResult.code}</div>
              <div>拆分：{demoResult.split}</div>
              <div>键位：{demoResult.keys}</div>
              <div>类型：{demoResult.type}</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)]">
          <h2 className="text-lg font-semibold text-slate-900">功能说明</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {lookupSteps.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
            * 实际码表数据加载后将支持批量查询与特殊字标记
          </div>
        </div>
      </section>
    </main>
  );
}
