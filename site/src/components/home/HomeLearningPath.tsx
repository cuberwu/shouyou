import type { HomeLearningPathSection } from "@/data/homeContent";

import HomeSectionIntro from "./HomeSectionIntro";

type HomeLearningPathProps = {
  content: HomeLearningPathSection;
};

export default function HomeLearningPath({ content }: HomeLearningPathProps) {
  return (
    <section className="site-panel space-y-6 p-8">
      <HomeSectionIntro title={content.title} description={content.description} />
      <div className="grid gap-4 md:grid-cols-4">
        {content.steps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"
          >
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {index + 1}
            </div>
            <div className="mt-3 text-base font-semibold text-slate-900">{step.title}</div>
            <div className="mt-1 text-sm leading-6 text-slate-600">{step.description}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
