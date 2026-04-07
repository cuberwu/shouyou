import Link from "next/link";

import type { HomeVersionsSection } from "@/data/homeContent";

import HomeSectionIntro from "./HomeSectionIntro";

type HomeVersionsProps = {
  content: HomeVersionsSection;
};

export default function HomeVersions({ content }: HomeVersionsProps) {
  return (
    <section id="versions" className="space-y-6">
      <HomeSectionIntro title={content.title} description={content.description} />
      <div className="grid gap-6 md:grid-cols-2">
        {content.items.map((item) => (
          <article key={item.name} className="site-panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">{item.name}</div>
                <div className="text-xs text-slate-500">{item.tag}</div>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: item.accent }}
              >
                {item.badge}
              </span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {item.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full"
                    style={{ background: item.accent }}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                href="/tutorial"
                className="text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:text-emerald-700"
              >
                了解更多 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
