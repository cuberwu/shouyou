import Link from "next/link";
import RootChart from "../components/RootChart";

const features = [
  {
    title: "低重码率",
    description: "常用字覆盖更好，重码更少，输入更顺畅。",
    highlight: "前 3000 字重码大幅下降",
  },
  {
    title: "舒适手感",
    description: "左右手负担均衡，减少同指连击和跨排。",
    highlight: "手感曲线更稳定",
  },
  {
    title: "易学易记",
    description: "字根规律性强，配合系统教程快速上手。",
    highlight: "7-14 天入门",
  },
  {
    title: "大字集支持",
    description: "覆盖生僻字与扩展字集，兼顾专业需求。",
    highlight: "支持 GBK/扩展字",
  },
];

const steps = [
  { title: "双拼入门", desc: "掌握声母与韵母键位" },
  { title: "字根记忆", desc: "理解字根分布与编码逻辑" },
  { title: "拆分练习", desc: "常用字拆分演练" },
  { title: "实战应用", desc: "搭配查形与跟打训练" },
];

const versions = [
  {
    name: "普及版",
    tag: "入门推荐",
    accent: "var(--color-primary)",
    points: ["基础字根表", "常用词库 5 万+", "标准简码系统", "主流平台支持"],
  },
  {
    name: "Plus 版",
    tag: "进阶推荐",
    accent: "var(--color-plus)",
    points: [
      "完整字根表",
      "扩展词库 10 万+",
      "高级简码系统",
      "生僻字/繁体支持",
      "自定义优化",
    ],
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-12">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
            普及版 + Plus 版双路线
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            首右辅助码
            <span className="block text-[var(--color-primary)]">
              高效中文输入方案
            </span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-600">
            低重码、舒适手感与系统教程集成，支持在线查形与多平台配置，帮助你快速建立高效输入习惯。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/tutorial"
              className="cursor-pointer rounded-full bg-[var(--color-cta)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)]"
            >
              开始学习
            </Link>
            <Link
              href="/download"
              className="cursor-pointer rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:border-emerald-400 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              立即下载
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span>适配 Rime / 小胖 / 多多</span>
            <span>支持 Windows / macOS / Linux / Android</span>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <RootChart />
        </div>
      </section>

      <section id="versions" className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900">普及版 / Plus 版对比</h2>
          <p className="text-sm text-slate-600">
            根据学习阶段选择适合你的版本，随时升级。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {versions.map((version) => (
            <div
              key={version.name}
              className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[var(--shadow-md)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[var(--shadow-lg)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    {version.name}
                  </div>
                  <div className="text-xs text-slate-500">{version.tag}</div>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: version.accent }}
                >
                  {version.name === "Plus 版" ? "推荐" : "基础"}
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {version.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span
                      className="mt-1 h-2 w-2 rounded-full"
                      style={{ background: version.accent }}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href="/tutorial"
                  className="cursor-pointer text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:text-emerald-700"
                >
                  了解更多 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="comparison" className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            横向对比：简单易学但效率不输
          </h2>
          <p className="text-sm text-slate-600">
            结合拼音的高效组词能力与辅助码的精准去重，保持输入节奏不被打断。
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="overflow-x-auto rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[var(--shadow-sm)]">
            <table className="w-full min-w-[520px] text-left text-sm">
              <caption className="sr-only">输入法方案横向对比</caption>
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3 pr-4">维度</th>
                  <th className="py-3 pr-4">纯拼音</th>
                  <th className="py-3 pr-4">其它音形码</th>
                  <th className="py-3">首右辅助码</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-700">学习门槛</td>
                  <td className="py-3 pr-4">会拼音即可</td>
                  <td className="py-3 pr-4">字根多、规则复杂</td>
                  <td className="py-3 font-semibold text-[var(--color-primary)]">
                    少量核心规则，轻量上手
                  </td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-700">选字负担</td>
                  <td className="py-3 pr-4">候选多需翻页</td>
                  <td className="py-3 pr-4">候选少但记忆负担大</td>
                  <td className="py-3 font-semibold text-[var(--color-primary)]">
                    候选少，按需补码即可锁定
                  </td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-700">打字节奏</td>
                  <td className="py-3 pr-4">易被找字打断</td>
                  <td className="py-3 pr-4">较稳定但学习成本高</td>
                  <td className="py-3 font-semibold text-[var(--color-primary)]">
                    节奏稳定，思路不断线
                  </td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-700">综合效率</td>
                  <td className="py-3 pr-4">中</td>
                  <td className="py-3 pr-4">高</td>
                  <td className="py-3 font-semibold text-[var(--color-primary)]">
                    高（不输同类方案）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6">
            <div className="text-sm font-semibold text-emerald-800">
              简单 × 高效
            </div>
            <p className="mt-3 text-sm text-emerald-700">
              首右辅助码保持拼音习惯，只在需要时补一键即可精准选字，减少翻页与视线移动。
            </p>
            <ul className="mt-4 space-y-2 text-xs text-emerald-700">
              <li>• 拼音组词保持输入速度</li>
              <li>• 辅助码去重提升确定性</li>
              <li>• 学习成本可控，循序渐进</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">核心特点</h2>
          <p className="text-sm text-slate-600">
            一套体系覆盖学习、练习与实战，面向高效率输入场景。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)]"
            >
              <div className="text-base font-semibold text-slate-900">
                {feature.title}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {feature.description}
              </div>
              <div className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="path" className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)]">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900">学习路线</h2>
          <p className="text-sm text-slate-600">循序渐进，配合查形工具提升记忆效率。</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"
            >
              <div className="text-xs font-semibold text-emerald-700">
                第 {index + 1} 步
              </div>
              <div className="mt-2 text-base font-semibold text-slate-900">
                {step.title}
              </div>
              <div className="mt-1 text-sm text-slate-600">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">快速查形</h2>
          <p className="text-sm text-slate-600">
            输入汉字即可查看编码、拆分与键位提示。支持批量查询。
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="lookup-input">
              输入汉字
            </label>
            <input
              id="lookup-input"
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-[var(--shadow-sm)] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="输入汉字，例如：首右"
            />
            <button
              className="cursor-pointer rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              type="button"
            >
              查询
            </button>
          </div>
          <div className="text-xs text-slate-500">
            结果将在查形工具页展示完整拆分细节。
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-emerald-800">
          <div className="font-mono text-xs">示例：首 → shou uf</div>
          <div className="mt-3 text-xs text-emerald-700">
            拆分：丷 + 自 → u + f
          </div>
          <div className="mt-4 text-xs text-emerald-700">
            类型：常用字 / 可简码
          </div>
          <div className="mt-6 text-xs text-emerald-600">
            * 示例数据仅用于展示，实际以码表为准
          </div>
        </div>
      </section>
    </main>
  );
}
