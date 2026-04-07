import type { HomeComparisonSection } from "@/data/homeContent";

import HomeSectionIntro from "./HomeSectionIntro";

type HomeComparisonProps = {
  content: HomeComparisonSection;
};

export default function HomeComparison({ content }: HomeComparisonProps) {
  return (
    <section className="space-y-6">
      <HomeSectionIntro title={content.title} description={content.description} />

      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="site-panel overflow-x-auto p-6">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">输入法方案横向对比</caption>
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4">维度</th>
                <th className="py-3 pr-4">纯拼音</th>
                <th className="py-3 pr-4">其它音形码</th>
                <th className="border-l border-emerald-100 bg-emerald-50/80 py-3 pl-4 pr-4 text-emerald-900">
                  <div className="flex items-center gap-2 text-xs font-semibold normal-case">
                    首右辅助码
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      推荐
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {content.rows.map((row) => (
                <tr key={row.dimension} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-700">{row.dimension}</td>
                  <td className="py-3 pr-4">{row.pinyin}</td>
                  <td className="py-3 pr-4">{row.other}</td>
                  <td className="border-l border-emerald-100 bg-emerald-50/80 py-3 pl-4 pr-4 font-semibold text-emerald-800">
                    {row.shouyou}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="rounded-3xl border border-emerald-100 bg-emerald-50/75 p-6">
          <div className="text-sm font-semibold text-emerald-800">{content.highlight.title}</div>
          <p className="mt-3 text-sm leading-7 text-emerald-700">
            {content.highlight.description}
          </p>
          <ul className="mt-4 space-y-2 text-xs text-emerald-700">
            {content.highlight.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
