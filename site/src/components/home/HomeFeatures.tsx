import type { HomeFeaturesSection } from "@/data/homeContent";

import HomeSectionIntro from "./HomeSectionIntro";

type HomeFeaturesProps = {
  content: HomeFeaturesSection;
};

export default function HomeFeatures({ content }: HomeFeaturesProps) {
  return (
    <section className="space-y-6">
      <HomeSectionIntro title={content.title} description={content.description} />
      <div className="grid gap-6 md:grid-cols-2">
        {content.items.map((item) => (
          <article key={item.title} className="site-panel p-6">
            <div className="text-base font-semibold text-slate-900">{item.title}</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
            <div className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {item.highlight}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
